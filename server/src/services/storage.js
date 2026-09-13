import crypto from 'node:crypto';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { fileTypeFromBuffer } from 'file-type';
import Attachment from '../models/Attachment.js';
import Conversation from '../models/Conversation.js';
import Order from '../models/Order.js';
import Job from '../models/Job.js';
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
    if (scope !== 'avatar' && !user.ownedRoles().includes('freelancer')) throw new ApiError(403, 'Freelancer access required');
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
  await storage.put(key, file.buffer, mimeType);
  try {
    return await Attachment.create({
      owner: user._id, key, name: file.originalname.replace(/[^\p{L}\p{N}. _-]/gu, '_').slice(0, 150),
      mimeType, size: file.size, checksum: crypto.createHash('sha256').update(file.buffer).digest('hex'), ...ownership,
    });
  } catch (error) {
    try { await storage.remove(key); }
    catch { console.error({ code: 'ORPHAN_UPLOAD', key }); }
    throw error;
  }
}
export async function verifyAttachments(ids, user, scope, contextId, session) {
  if (!ids?.length) return;
  requireStorage();
  const filter = { _id: { $in: ids }, owner: user._id };
  if (['portfolio', 'avatar', 'service'].includes(scope)) filter.public = true;
  else filter[scope] = contextId;
  const count = await Attachment.countDocuments(filter).session(session ?? null);
  if (count !== new Set(ids).size) throw new ApiError(403, 'One or more attachments do not belong to you or this resource');
}
export async function canDownload(attachment, user) {
  if (attachment.public) return true;
  if (!user) return false;
  if (sameId(attachment.owner, user)) return true;
  if (attachment.conversation) return Boolean(await Conversation.exists({ _id: attachment.conversation, participants: user._id }));
  if (attachment.order) return Boolean(await Order.exists({ _id: attachment.order, $or: [{ client: user._id }, { freelancer: user._id }] }));
  if (attachment.job) return Boolean(await Job.exists({ _id: attachment.job, $or: [{ client: user._id }, { status: 'open' }] }));
  return false;
}
