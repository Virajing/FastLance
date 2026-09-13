import { z } from 'zod';
import { ApiError, objectId } from '../utils/api.js';
export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source] ?? {});
  if (!result.success) return next(new ApiError(400, result.error.issues.map(issue =>
    issue.path.join('.') + ': ' + issue.message).join('; '), 'VALIDATION_ERROR'));
  req.validated ??= {}; req.validated[source] = result.data; next();
};
export const validateIds = (req, _res, next) => {
  for (const [key, value] of Object.entries(req.params))
    if ((key === 'id' || key.endsWith('Id')) && !objectId(value))
      return next(new ApiError(400, 'Invalid ' + key, 'INVALID_ID'));
  next();
};
export const id = z.string().regex(/^[a-f\d]{24}$/i, 'Must be a valid ID');
export const money = z.number().int().min(100).max(100000000000);
export const text = (min = 0, max = 5000) => z.string().trim().min(min).max(max);
export const safeUrl = z.union([z.literal(''), z.string().url().refine(value => /^https?:\/\//i.test(value), 'Only HTTP(S) URLs are allowed')]);
export const tags = z.array(text(1, 60)).max(30);
export const attachments = z.array(id).max(10).default([]);
export const profileSchema = z.object({
  name: text(2, 100).optional(), avatar: safeUrl.optional(), bio: text().optional(),
  headline: text(0, 200).optional(), company: text(0, 150).optional(), website: safeUrl.optional(),
  location: text(0, 150).optional(), professionalTitle: text(0, 200).optional(),
  skills: tags.optional(), serviceCategories: tags.optional(), experience: z.number().int().min(0).max(80).optional(),
  availability: z.enum(['available', 'part_time', 'unavailable']).optional(),
  hourlyRateMinor: z.number().int().min(0).max(100000000).optional(),
});
export const onboardingSchema = profileSchema.extend({
  professionalTitle: text(3, 200), bio: text(30), skills: tags.min(1), serviceCategories: tags.min(1),
  hourlyRateMinor: money, availability: z.enum(['available', 'part_time', 'unavailable']),
});
export const listQuery = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  q: text(0, 100).optional(), category: text(0, 80).optional(),
  sort: z.enum(['newest', 'rating', 'price', 'price_desc', 'completed', 'reviews']).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxPrice: z.coerce.number().int().min(0).max(100000000000).optional(),
  availability: z.enum(['available', 'part_time', 'unavailable']).optional(),
  status: text(0, 40).optional(), mine: z.enum(['true', 'false']).optional(),
  before: id.optional(), rating: z.coerce.number().int().min(1).max(5).optional(),
  serviceId: id.optional(), freelancerId: id.optional(),
});
