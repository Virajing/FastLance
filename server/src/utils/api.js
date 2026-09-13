export const ok = (res, data = {}, message = 'OK', status = 200) =>
  res.status(status).json({ success: true, message, data });
export const page = (res, data, pagination) => res.json({ success: true, data, pagination });
export class ApiError extends Error {
  constructor(status, message, code) { super(message); this.status = status; this.code = code; }
}
export const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export const objectId = value => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);
export const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const pagination = query => {
  const page = Number(query.page ?? 1), limit = Number(query.limit ?? 12);
  if (!Number.isInteger(page) || page < 1 || page > 10000 || !Number.isInteger(limit) || limit < 1 || limit > 50)
    throw new ApiError(400, 'Page must be 1–10000 and limit 1–50');
  return { page, limit, skip: (page - 1) * limit };
};
export const pageMeta = ({ page, limit }, total) => ({ page, limit, total, pages: Math.ceil(total / limit) });
export const sameId = (left, right) => String(left?._id ?? left) === String(right?._id ?? right);
