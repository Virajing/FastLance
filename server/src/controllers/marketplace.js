import crypto from 'node:crypto';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Favorite from '../models/Favorite.js';
import { ApiError, asyncHandler, ok, page, pagination, pageMeta, escapeRegex, sameId } from '../utils/api.js';
import { verifyAttachments } from '../services/storage.js';

export const freelancerFilter = { accountStatus: 'active', $or: [{ roles: 'freelancer' }, { roles: { $exists: false }, role: 'freelancer' }] };
export const publicUser = user => ({
  id: user.id, name: user.name, avatar: user.avatar, title: user.professionalTitle || user.headline,
  bio: user.bio, location: user.location, skills: user.skills, serviceCategories: user.serviceCategories,
  hourlyRateMinor: user.hourlyRateMinor, availability: user.availability,
  verified: user.verificationStatus === 'verified', rating: user.averageRating, reviewsCount: user.reviewCount,
  portfolio: user.portfolio, createdAt: user.createdAt,
});
export const serviceView = service => {
  const value = service.toJSON(), owner = service.freelancer;
  const packages = Object.values(value.packages || {}).filter(pack => Number.isSafeInteger(pack?.priceMinor));
  return { ...value, freelancer: undefined, freelancerId: owner.id,
    freelancerName: owner.name, freelancerAvatar: owner.avatar,
    freelancerVerified: owner.verificationStatus === 'verified',
    startingPriceMinor: packages.length ? Math.min(...packages.map(pack => pack.priceMinor)) : null,
    deliveryDays: packages.length ? Math.min(...packages.map(pack => pack.deliveryDays)) : null };
};
export async function ensureCategory(slug) {
  if (!await Category.exists({ slug })) throw new ApiError(400, 'Select an existing category');
}
const publicServices = { status: 'published', 'packages.basic.priceMinor': { $gte: 100 } };
export const categories = asyncHandler(async (_req, res) => ok(res, { categories: await Category.find().sort('name') }));
export const freelancers = asyncHandler(async (req, res) => {
  const query = req.validated.query, paging = pagination(query), filter = { $and: [freelancerFilter] };
  if (query.q) filter.$and.push({ $or: ['name', 'professionalTitle', 'skills', 'bio'].map(key => ({ [key]: { $regex: escapeRegex(query.q), $options: 'i' } })) });
  if (query.category) filter.serviceCategories = query.category;
  if (query.minRating) filter.averageRating = { $gte: query.minRating };
  if (query.availability) filter.availability = query.availability;
  if (query.maxPrice !== undefined) filter.hourlyRateMinor = { $lte: query.maxPrice };
  const sort = { price: { hourlyRateMinor: 1 }, price_desc: { hourlyRateMinor: -1 }, completed: { completedProjects: -1 }, reviews: { reviewCount: -1 }, newest: { createdAt: -1 } }[query.sort] || { averageRating: -1 };
  const [rows, total] = await Promise.all([
    User.find(filter).sort({ ...sort, _id: -1 }).skip(paging.skip).limit(paging.limit), User.countDocuments(filter),
  ]);
  page(res, rows.map(publicUser), pageMeta(paging, total));
});
export const freelancer = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, ...freelancerFilter });
  if (!user) throw new ApiError(404, 'Freelancer not found');
  const completedProjects = await Order.countDocuments({ freelancer: user._id, status: 'completed', totalAmountMinor: { $exists: true }, paymentStatus: 'paid' });
  ok(res, { freelancer: { ...publicUser(user), completedProjects } });
});
export const services = asyncHandler(async (req, res) => {
  const query = req.validated.query, paging = pagination(query);
  const filter = req.user && query.mine === 'true' ? { freelancer: req.user._id } : { ...publicServices };
  if (!filter.freelancer) filter.freelancer = { $in: await User.find(freelancerFilter).distinct('_id') };
  if (query.freelancerId) filter.freelancer = query.freelancerId;
  if (query.category) filter.category = query.category;
  if (query.minRating) filter.rating = { $gte: query.minRating };
  if (query.maxPrice !== undefined) filter['packages.basic.priceMinor'] = { $gte: 100, $lte: query.maxPrice };
  if (query.q) filter.$or = ['title', 'description', 'tags'].map(key => ({ [key]: { $regex: escapeRegex(query.q), $options: 'i' } }));
  const sort = { rating: { rating: -1 }, price: { 'packages.basic.priceMinor': 1 }, price_desc: { 'packages.basic.priceMinor': -1 } }[query.sort] || { createdAt: -1 };
  const [rows, total] = await Promise.all([
    Service.find(filter).populate('freelancer', 'name avatar verificationStatus').sort({ ...sort, _id: -1 }).skip(paging.skip).limit(paging.limit),
    Service.countDocuments(filter),
  ]);
  page(res, rows.filter(row => row.freelancer).map(serviceView), pageMeta(paging, total));
});
export const service = asyncHandler(async (req, res) => {
  const row = await Service.findOne({ _id: req.params.id, ...publicServices }).populate('freelancer');
  if (!row || row.freelancer?.accountStatus !== 'active') throw new ApiError(404, 'Service not found');
  ok(res, { service: serviceView(row) });
});
export const createService = asyncHandler(async (req, res) => {
  const data = req.validated.body;
  await ensureCategory(data.category);
  if (data.status === 'published' && !data.packages?.basic) throw new ApiError(400, 'Add a basic package before publishing');
  const row = await Service.create({ ...data, freelancer: req.user._id, slug: crypto.randomUUID() });
  ok(res, { service: serviceView(await row.populate('freelancer', 'name avatar verificationStatus')) }, 'Service created', 201);
});
export const updateService = asyncHandler(async (req, res) => {
  const row = await Service.findById(req.params.id);
  if (!row) throw new ApiError(404, 'Service not found');
  if (!sameId(row.freelancer, req.user)) throw new ApiError(403, 'Not the service owner');
  const data = req.validated.body;
  if (data.category) await ensureCategory(data.category);
  Object.assign(row, data);
  if (row.status === 'published' && !Number.isSafeInteger(row.packages?.basic?.priceMinor))
    throw new ApiError(400, 'Add an integer-paise basic package before publishing');
  await row.save();
  ok(res, { service: serviceView(await row.populate('freelancer', 'name avatar verificationStatus')) });
});
export const deleteService = asyncHandler(async (req, res) => {
  const result = await Service.findOneAndDelete({ _id: req.params.id, freelancer: req.user._id });
  if (!result) throw new ApiError(404, 'Service not found or not owned by you');
  ok(res);
});
export const portfolio = asyncHandler(async (req, res) => {
  if (req.method === 'POST') {
    if (req.user.portfolio.length >= 50) throw new ApiError(400, 'Portfolio is limited to 50 items');
    await verifyAttachments(req.validated.body.attachments, req.user, 'portfolio');
    req.user.portfolio.push(req.validated.body);
  } else {
    const item = req.user.portfolio.id(req.params.itemId);
    if (!item) throw new ApiError(404, 'Portfolio item not found');
    if (req.method === 'DELETE') item.deleteOne();
    else {
      await verifyAttachments(req.validated.body.attachments, req.user, 'portfolio');
      Object.assign(item, req.validated.body);
    }
  }
  await req.user.save();
  ok(res, { portfolio: req.user.portfolio });
});
export const reviews = asyncHandler(async (req, res) => {
  const query = req.validated.query, paging = pagination(query), filter = { verified: true };
  if (query.serviceId) filter.service = query.serviceId;
  if (query.freelancerId) filter.freelancer = query.freelancerId;
  if (query.rating) filter.rating = query.rating;
  const [rows, total] = await Promise.all([
    Review.find(filter).populate('client', 'name avatar').sort({ createdAt: -1, _id: -1 }).skip(paging.skip).limit(paging.limit),
    Review.countDocuments(filter),
  ]);
  page(res, rows.map(row => ({ ...row.toJSON(), clientName: row.client?.name, clientAvatar: row.client?.avatar })), pageMeta(paging, total));
});
export const favorites = asyncHandler(async (req, res) => {
  const paging = pagination(req.validated.query);
  const [rows, total] = await Promise.all([
    Favorite.find({ user: req.user._id }).sort('-createdAt').skip(paging.skip).limit(paging.limit),
    Favorite.countDocuments({ user: req.user._id }),
  ]);
  const data = [];
  for (const row of rows) {
    const target = row.kind === 'service'
      ? await Service.findOne({ _id: row.target, ...publicServices }).populate('freelancer', 'name avatar verificationStatus')
      : await User.findOne({ _id: row.target, ...freelancerFilter });
    data.push({ ...row.toJSON(), item: target ? (row.kind === 'service' ? serviceView(target) : publicUser(target)) : null });
  }
  page(res, data, pageMeta(paging, total));
});
export const saveFavorite = asyncHandler(async (req, res) => {
  const { kind, target } = req.validated.body;
  const exists = kind === 'service' ? await Service.exists({ _id: target, ...publicServices }) : await User.exists({ _id: target, ...freelancerFilter });
  if (!exists) throw new ApiError(404, 'Item is no longer available');
  const favorite = await Favorite.findOneAndUpdate({ user: req.user._id, kind, target }, { $setOnInsert: { user: req.user._id, kind, target } }, { upsert: true, new: true });
  ok(res, { favorite });
});
export const removeFavorite = asyncHandler(async (req, res) => {
  await Favorite.deleteOne({ _id: req.params.id, user: req.user._id });
  ok(res);
});
