import crypto from 'node:crypto';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { fileTypeFromBuffer } from 'file-type';
import Attachment from '../models/Attachment.js';
import Conversation from '../models/Conversation.js';
import Order from '../models/Order.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Message from '../models/Message.js';
import Delivery from '../models/Delivery.js';
import { env, capabilities } from '../config/env.js';
import { ApiError, sameId } from '../utils/api.js';

export const requireStorage = () => {
  if (!capabilities().storage) throw new ApiError(503, capabilities().storageMessage, 'STORAGE_NOT_CONFIGURED');
};
const client = () => {
  requireStorage();
  return new S3Client({
    region: env.S3_REGION, endpoint: env.S3_ENDPOINT || undefined, forcePathStyle: Boolean(env.S3_ENDPOINT),
    credentials: { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY },
  });
};
export const storage = {
  async put(key, buffer, mimeType) {
    await client().send(new PutObjectCommand({
      Bucket: env.S3_BUCKET, Key: key, Body: buffer, ContentType: mimeType, ServerSideEncryption: 'AES256',
    }));
  },
  async get(key) { return client().send(new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: key })); },
  async remove(key) { await client().send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: key })); },
};
export async function authorizeScope(user, scope, contextId, session) {
  if (['avatar', 'portfolio', 'service'].includes(scope)) {
    if (scope !== 'avatar' && (!user.ownedRoles().includes('freelancer') || user.currentRole() !== 'freelancer')) throw new ApiError(403, 'Freelancer access required');
    return { public: true };
  }
  if (scope === 'conversation') {
    const conversation = await Conversation.findOne({ _id: contextId, participants: user._id }).session(session ?? null);
    if (!conversation) throw new ApiError(403, 'Conversation access denied');
  } else if (scope === 'order') {
    const order = await Order.findById(contextId).session(session ?? null);
    if (!order || ![order.client, order.freelancer].some(id => sameId(id, user))) throw new ApiError(403, 'Order access denied');
  } else if (scope === 'job') {
    const job = await Job.findOne({ _id: contextId, client: user._id }).session(session ?? null);
    if (!job) throw new ApiError(403, 'Job access denied');
  } else throw new ApiError(400, 'Invalid attachment scope');
  return { [scope]: contextId };
}
export async function upload(user, file, scope, contextId) {
  requireStorage();
  if (!file?.buffer?.length || file.size > 10485760) throw new ApiError(400, 'Choose a file between 1 byte and 10 MB');
  const ownership = await authorizeScope(user, scope, contextId);
  const detected = await fileTypeFromBuffer(file.buffer);
  const allowed = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'application/zip'];
  let mimeType = detected?.mime;
  if (!mimeType && file.mimetype === 'text/plain') {
    try {
      new TextDecoder('utf-8', { fatal: true }).decode(file.buffer);
      if (file.buffer.includes(0)) throw new Error('Binary content');
      mimeType = 'text/plain';
    } catch { throw new ApiError(400, 'Text files must contain valid UTF-8 text'); }
  }
  if (!allowed.includes(mimeType) && mimeType !== 'text/plain') throw new ApiError(400, 'Use PNG, JPEG, WebP, PDF, ZIP or plain text files.');
  if (['avatar', 'service'].includes(scope) && !mimeType.startsWith('image/')) throw new ApiError(400, 'Choose an image for this field');
  const key = user.id + '/' + crypto.randomUUID();
  // Persist metadata first so an ambiguous provider failure is still reconcilable.
  const attachment = await Attachment.create({
    owner: user._id, key, scope, name: file.originalname.replace(/[^\p{L}\p{N}. _-]/gu, '_').slice(0, 150),
    mimeType, size: file.size, checksum: crypto.createHash('sha256').update(file.buffer).digest('hex'), ...ownership,
  });
  await storage.put(key, file.buffer, mimeType);
  return attachment;
}
export async function verifyAttachments(ids, user, scope, contextId, session) {
  if (!ids?.length) return;
  requireStorage();
  const filter = { _id: { $in: ids }, owner: user._id, state: { $ne: 'deleting' } };
  if (['portfolio', 'avatar', 'service'].includes(scope)) filter.public = true;
  else filter[scope] = contextId;
  const count = await Attachment.countDocuments(filter).session(session ?? null);
  if (count !== new Set(ids).size) throw new ApiError(403, 'One or more attachments do not belong to you or this resource');
  await Attachment.updateMany(filter, { state: 'attached' }, { session });
}
export async function isReferenced(attachment, publicOnly = false) {
  const url = { $regex: '/attachments/' + attachment.id + '/download$' };
  const userFilter = publicOnly ? { accountStatus: 'active' } : {};
  const [user, service, message, delivery, job, order] = await Promise.all([
    User.exists({ ...userFilter, $or: [{ avatar: url }, { 'portfolio.attachments': attachment._id }, { 'portfolio.image': url }] }),
    Service.exists({ ...(publicOnly ? { status: 'published' } : {}), $or: [{ coverImage: url }, { images: url }] }),
    publicOnly ? false : Message.exists({ attachments: attachment._id }),
    publicOnly ? false : Delivery.exists({ attachments: attachment._id }),
    publicOnly ? false : Job.exists({ attachments: attachment._id }),
    publicOnly ? false : Order.exists({ attachments: attachment._id }),
  ]);
  return Boolean(user || service || message || delivery || job || order);
}
export async function cleanupOrphans({ before = new Date(Date.now() - 86400000), limit = 100 } = {}) {
  requireStorage();
  let removed = 0;
  let inspected = 0;
  const candidates = Attachment.find({ createdAt: { $lt: before } }).sort('createdAt').cursor();
  for await (const candidate of candidates) {
    inspected++;
    if (await isReferenced(candidate)) continue;
    const claimed = await Attachment.findOneAndUpdate({ _id: candidate._id, updatedAt: candidate.updatedAt }, { state: 'deleting' }, { new: true });
    if (!claimed) continue;
    if (await isReferenced(claimed)) { await Attachment.updateOne({ _id: claimed._id }, { state: 'attached' }); continue; }
    await storage.remove(claimed.key);
    await Attachment.deleteOne({ _id: claimed._id, state: 'deleting' });
    removed++;
    if (removed >= limit) break;
  }
  return { inspected, removed };
}
export async function canDownload(attachment, user) {
  if (attachment.state === 'deleting') return false;
  if (user && sameId(attachment.owner, user)) return true;
  if (attachment.public) return isReferenced(attachment, true);
  if (!user) return false;
  if (!await isReferenced(attachment)) return false;
  if (attachment.conversation) return Boolean(await Conversation.exists({ _id: attachment.conversation, participants: user._id }));
  if (attachment.order) return Boolean(await Order.exists({ _id: attachment.order, $or: [{ client: user._id }, { freelancer: user._id }] }));
  if (attachment.job) return Boolean(await Job.exists({ _id: attachment.job, $or: [{ client: user._id }, { status: 'open' }] }));
  return false;
}
