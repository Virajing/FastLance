import { Server } from 'socket.io';
import { z } from 'zod';
import { env } from '../config/env.js';
import { authenticate } from '../middleware/auth.js';
import { id, text, attachments } from '../middleware/validate.js';
import { ApiError } from '../utils/api.js';
import { authorizeConversation, sendMessage, receipt } from '../services/messaging.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

export const messageSchema = z.object({
  clientId: z.string().uuid(), text: text(0, 5000).default(''), attachments,
}).refine(value => value.text.length > 0 || value.attachments.length > 0, 'Write a message or attach a file');
const conversationSchema = z.object({ conversationId: id });
const receiptSchema = conversationSchema.extend({ sequence: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER) });
async function presence(io, userId) {
  const online = Boolean(io.sockets.adapter.rooms.get('user:' + userId)?.size);
  const lastSeen = new Date();
  if (!online) await User.updateOne({ _id: userId }, { lastSeen });
  const contacts = await Conversation.find({ participants: userId }).distinct('participants');
  io.to(contacts.map(id => 'user:' + id)).emit('presence:updated', { userId, online, lastSeen: online ? undefined : lastSeen });
}
export function setupSockets(httpServer, app) {
  const io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
    allowRequest: (request, callback) => callback(null, !request.headers.origin || env.CLIENT_URL.includes(request.headers.origin)),
    maxHttpBufferSize: 100000,
  });
  app?.set('io', io);
  io.use(async (socket, next) => {
    try {
      const auth = await authenticate(socket.handshake.auth?.token);
      socket.data.user = auth.user; socket.data.payload = auth.payload;
      next();
    } catch { const error = new Error('Authentication required'); error.data = { code: 'AUTH_EXPIRED' }; next(error); }
  });
  io.on('connection', socket => {
    const userId = socket.data.user.id;
    socket.join('user:' + userId);
    const timeout = setTimeout(() => { socket.emit('auth:expired'); socket.disconnect(true); },
      Math.max(0, socket.data.payload.exp * 1000 - Date.now()));
    const typingTimes = new Map();
    let eventWindow = { until: Date.now() + 60000, count: 0 };
    const on = (event, schema, handler) => socket.on(event, async (raw, acknowledge) => {
      try {
        if (eventWindow.until < Date.now()) eventWindow = { until: Date.now() + 60000, count: 0 };
        if (++eventWindow.count > 240) throw new ApiError(429, 'Too many socket events');
        const parsed = schema.safeParse(raw);
        if (!parsed.success) throw new ApiError(400, 'Invalid event payload');
        const { user } = await authenticate(socket.handshake.auth?.token);
        if (user.id !== userId) throw new ApiError(401, 'Socket identity changed');
        const data = await handler(parsed.data, user);
        if (typeof acknowledge === 'function') acknowledge({ success: true, data });
      } catch (error) {
        const payload = { success: false, error: {
          message: error instanceof ApiError ? error.message : 'Unable to process this event. Retry.',
          status: error.status || 500,
        } };
        if (typeof acknowledge === 'function') acknowledge(payload);
        else socket.emit('socket:error', payload.error);
      }
    });
    on('conversation:join', conversationSchema, async ({ conversationId }, user) => {
      await authorizeConversation(conversationId, user._id);
      socket.join('conversation:' + conversationId); return { conversationId };
    });
    on('conversation:leave', conversationSchema, async ({ conversationId }) => {
      socket.leave('conversation:' + conversationId); return { conversationId };
    });
    on('message:send', conversationSchema.merge(messageSchema.innerType()).refine(value => value.text || value.attachments.length), async (data, user) =>
      sendMessage(user, data.conversationId, data, io));
    on('message:read', receiptSchema, (data, user) => receipt(user, data.conversationId, data.sequence, true, io));
    on('message:delivered', receiptSchema, (data, user) => receipt(user, data.conversationId, data.sequence, false, io));
    on('typing:start', conversationSchema, async ({ conversationId }, user) => {
      await authorizeConversation(conversationId, user._id);
      const now = Date.now();
      if (now - (typingTimes.get(conversationId) || 0) >= 800) {
        typingTimes.set(conversationId, now);
        socket.to('conversation:' + conversationId).emit('typing:updated', { conversationId, userId, typing: true });
      }
      return { conversationId };
    });
    on('typing:stop', conversationSchema, async ({ conversationId }, user) => {
      await authorizeConversation(conversationId, user._id);
      socket.to('conversation:' + conversationId).emit('typing:updated', { conversationId, userId, typing: false });
      return { conversationId };
    });
    presence(io, userId).catch(() => socket.emit('socket:error', { message: 'Presence update failed. Reconnect to retry.' }));
    socket.on('disconnect', () => {
      clearTimeout(timeout);
      for (const conversationId of typingTimes.keys()) io.to('conversation:' + conversationId).emit('typing:updated', { conversationId, userId, typing: false });
      presence(io, userId).catch(() => console.error({ code: 'PRESENCE_UPDATE_FAILED' }));
    });
  });
  return io;
}
