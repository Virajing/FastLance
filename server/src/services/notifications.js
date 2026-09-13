import Notification from '../models/Notification.js';
import { emitAfter } from './transaction.js';
export async function notify(user, type, title, message, link = '/dashboard', context = {}, extra = {}) {
  const [notification] = await Notification.create([{
    user, type, title, message, link, ...extra,
  }], { session: context.session });
  emitAfter(context, 'user:' + user, 'notification:new', notification.toJSON());
  emitAfter(context, 'user:' + user, 'dashboard:updated', {});
  return notification;
}
