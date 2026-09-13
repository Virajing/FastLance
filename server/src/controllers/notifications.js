import Notification from '../models/Notification.js';
import { asyncHandler, ok, pagination, pageMeta } from '../utils/api.js';
export const list = asyncHandler(async (req, res) => {
  const paging = pagination(req.validated.query), filter = { user: req.user._id };
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1, _id: -1 }).skip(paging.skip).limit(paging.limit),
    Notification.countDocuments(filter), Notification.countDocuments({ ...filter, read: false }),
  ]);
  res.json({ success: true, data: { notifications, unreadCount }, pagination: pageMeta(paging, total) });
});
export const read = asyncHandler(async (req, res) => {
  await Notification.updateOne({ _id: req.params.id, user: req.user._id }, { read: true });
  req.io?.to('user:' + req.user.id).emit('notification:updated', {});
  ok(res);
});
export const readAll = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  req.io?.to('user:' + req.user.id).emit('notification:updated', {});
  ok(res);
});
