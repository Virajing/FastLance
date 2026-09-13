import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { ApiError, sameId } from '../utils/api.js';
import { transaction, emitAfter } from './transaction.js';
import { notify } from './notifications.js';
import { verifyAttachments } from './storage.js';

const limits = new Map();
function limitSending(userId) {
  const now = Date.now();
  for (const [key, value] of limits) if (value.until <= now) limits.delete(key);
  const entry = limits.get(userId) ?? { count: 0, until: now + 60000 };
  if (++entry.count > 40) throw new ApiError(429, 'Message limit reached. Try again in a minute.');
  limits.set(userId, entry);
}
export async function authorizeConversation(id, userId, session) {
  const conversation = await Conversation.findOne({ _id: id, participants: userId }).session(session ?? null);
  if (!conversation) throw new ApiError(403, 'Conversation access denied');
  return conversation;
}
export const messageView = message => ({ ...message.toJSON(), senderId: String(message.sender), conversationId: String(message.conversation) });
export async function conversationView(conversation, userId, io) {
  await conversation.populate('participants', 'name avatar professionalTitle headline lastSeen');
  const other = conversation.participants.find(user => !sameId(user, userId));
  const unreadCount = await Message.countDocuments({ conversation: conversation._id, sender: { $ne: userId }, readBy: { $ne: userId } });
  return { id: conversation.id, lastMessage: conversation.lastMessage, updatedAt: conversation.updatedAt, unreadCount,
    lastSequence: conversation.lastSequence,
    participant: other ? { id: other.id, name: other.name, avatar: other.avatar,
      title: other.professionalTitle || other.headline, online: Boolean(io?.sockets.adapter.rooms.get('user:' + other.id)?.size), lastSeen: other.lastSeen } : null };
}
export async function createConversation(user, participantId, io) {
  if (sameId(user, participantId)) throw new ApiError(400, 'Choose another person to message');
  const other = await User.findById(participantId);
  if (!other || other.accountStatus !== 'active') throw new ApiError(404, 'Account unavailable');
  if (!((user.ownedRoles().includes('client') && other.ownedRoles().includes('freelancer'))
    || (user.ownedRoles().includes('freelancer') && other.ownedRoles().includes('client'))))
    throw new ApiError(403, 'A conversation requires a client and a freelancer');
  const pairKey = [user.id, other.id].sort().join(':');
  let conversation = await Conversation.findOne({ pairKey });
  if (!conversation) {
    // Reuse legacy two-person conversations to preserve existing history.
    conversation = await Conversation.findOne({ participants: { $all: [user._id, other._id], $size: 2 } });
    if (conversation) { conversation.pairKey = pairKey; await conversation.save(); }
    else {
      try { conversation = await Conversation.create({ pairKey, participants: [user._id, other._id] }); }
      catch (error) { if (error.code !== 11000) throw error; conversation = await Conversation.findOne({ pairKey }); }
    }
  }
  io?.to(['user:' + user.id, 'user:' + other.id]).emit('conversation:updated', { conversationId: conversation.id });
  return conversationView(conversation, user.id, io);
}
export async function sendMessage(user, conversationId, data, io) {
  limitSending(user.id);
  const result = await transaction(async context => {
    const conversation = await authorizeConversation(conversationId, user._id, context.session);
    const existing = await Message.findOne({ conversation: conversation._id, sender: user._id, clientId: data.clientId }).session(context.session);
    if (existing) {
      if (existing.text !== data.text || existing.attachments.map(String).join() !== data.attachments.join())
        throw new ApiError(409, 'This message identifier already refers to different content');
      return { message: messageView(existing), duplicate: true };
    }
    await verifyAttachments(data.attachments, user, 'conversation', conversationId, context.session);
    const recipient = conversation.participants.find(id => !sameId(id, user));
    if (!await User.exists({ _id: recipient, accountStatus: 'active' }).session(context.session)) throw new ApiError(403, 'Recipient account is unavailable');
    conversation.lastSequence += 1;
    const [message] = await Message.create([{
      conversation: conversation._id, sender: user._id, text: data.text,
      attachments: data.attachments, clientId: data.clientId, sequence: conversation.lastSequence,
      readBy: [user._id], deliveredTo: [user._id],
    }], { session: context.session });
    conversation.lastMessage = { text: message.text || 'Attachment', sender: user._id, createdAt: message.createdAt };
    await conversation.save({ session: context.session });
    await notify(recipient, 'message', 'New message from ' + user.name, message.text || 'Attachment',
      '/dashboard/messages?conversation=' + conversation.id, context, { conversation: conversation._id });
    const rooms = conversation.participants.map(id => 'user:' + id);
    emitAfter(context, rooms, 'message:new', { conversationId, message: messageView(message) });
    emitAfter(context, rooms, 'conversation:updated', { conversationId });
    return { message: messageView(message), duplicate: false };
  }, io);
  return result;
}
export async function receipt(user, conversationId, sequence, read, io) {
  return transaction(async context => {
    const conversation = await authorizeConversation(conversationId, user._id, context.session);
    if (sequence > conversation.lastSequence) throw new ApiError(400, 'Receipt exceeds conversation history');
    const filter = { conversation: conversation._id, sequence: { $lte: sequence }, sender: { $ne: user._id } };
    const add = read ? { deliveredTo: user._id, readBy: user._id } : { deliveredTo: user._id };
    await Message.updateMany(filter, { $addToSet: add }, { session: context.session });
    if (read && sequence === conversation.lastSequence) {
      await Notification.updateMany({ user: user._id, conversation: conversation._id, read: false }, { read: true }, { session: context.session });
      emitAfter(context, 'user:' + user.id, 'notification:updated', {});
    }
    const payload = { conversationId, userId: user.id, sequence };
    emitAfter(context, conversation.participants.map(id => 'user:' + id), read ? 'message:read' : 'message:delivered', payload);
    emitAfter(context, conversation.participants.map(id => 'user:' + id), 'conversation:updated', { conversationId });
    return payload;
  }, io);
}
