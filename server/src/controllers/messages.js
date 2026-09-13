import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { asyncHandler, ok, page, pagination, pageMeta, ApiError } from '../utils/api.js';
import { authorizeConversation, conversationView, createConversation, messageView, sendMessage, receipt } from '../services/messaging.js';
export const list = asyncHandler(async (req, res) => {
  const paging = pagination(req.validated.query);
  const [conversations, total] = await Promise.all([
    Conversation.find({ participants: req.user._id }).sort({ updatedAt: -1, _id: -1 }).skip(paging.skip).limit(paging.limit),
    Conversation.countDocuments({ participants: req.user._id }),
  ]);
  page(res, await Promise.all(conversations.map(row => conversationView(row, req.user.id, req.io))), pageMeta(paging, total));
});
export const create = asyncHandler(async (req, res) => ok(res, { conversation: await createConversation(req.user, req.validated.body.participantId, req.io) }, 'Conversation ready', 201));
export const detail = asyncHandler(async (req, res) => {
  const conversation = await authorizeConversation(req.params.id, req.user._id);
  ok(res, { conversation: await conversationView(conversation, req.user.id, req.io) });
});
export const history = asyncHandler(async (req, res) => {
  const conversation = await authorizeConversation(req.params.id, req.user._id);
  const paging = pagination(req.validated.query), filter = { conversation: conversation._id };
  if (req.validated.query.before) {
    const cursor = await Message.findOne({ _id: req.validated.query.before, conversation: conversation._id });
    if (!cursor) throw new ApiError(400, 'Message cursor is not in this conversation');
    filter.sequence = { $lt: cursor.sequence };
  }
  const [rows, total] = await Promise.all([
    Message.find(filter).sort({ sequence: -1, _id: -1 }).skip(paging.skip).limit(paging.limit),
    Message.countDocuments(filter),
  ]);
  page(res, rows.reverse().map(messageView), { ...pageMeta(paging, total), hasMore: total > paging.skip + rows.length, nextCursor: rows[0]?.id ?? null });
});
export const send = asyncHandler(async (req, res) => ok(res, await sendMessage(req.user, req.params.id, req.validated.body, req.io), 'Message saved', 201));
export const read = asyncHandler(async (req, res) => ok(res, await receipt(req.user, req.params.id, req.validated.body.sequence, true, req.io)));
export const delivered = asyncHandler(async (req, res) => ok(res, await receipt(req.user, req.params.id, req.validated.body.sequence, false, req.io)));
