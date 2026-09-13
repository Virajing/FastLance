import User from '../models/User.js';
import Session from '../models/Session.js';
import { ApiError, asyncHandler, objectId } from '../utils/api.js';
import { verifyAccess } from '../utils/tokens.js';
export async function authenticate(token) {
  let payload;
  try { payload = verifyAccess(token); }
  catch { throw new ApiError(401, 'Session expired. Sign in again.', 'AUTH_EXPIRED'); }
  if (!objectId(payload.sub) || !objectId(payload.sid)) throw new ApiError(401, 'Invalid session');
  const user = await User.findById(payload.sub).select('+tokenVersion');
  if (!user || user.accountStatus !== 'active') throw new ApiError(401, 'Account is unavailable', 'ACCOUNT_UNAVAILABLE');
  if ((user.tokenVersion ?? 0) !== payload.version || !await Session.exists({
    _id: payload.sid, user: user._id, expiresAt: { $gt: new Date() },
  })) throw new ApiError(401, 'Session revoked. Sign in again.', 'AUTH_EXPIRED');
  return { user, payload };
}
export const protect = asyncHandler(async (req, _res, next) => {
  if (!req.headers.authorization?.startsWith('Bearer ')) throw new ApiError(401, 'Authentication required');
  const { user, payload } = await authenticate(req.headers.authorization.slice(7));
  req.user = user; req.sessionId = payload.sid; next();
});
export const allow = (...roles) => (req, _res, next) => {
  const authorized = roles.includes('admin') && req.user.role === 'admin'
    || roles.includes(req.user.currentRole()) && req.user.ownedRoles().includes(req.user.currentRole());
  next(authorized ? undefined : new ApiError(403, 'Switch to an authorized workspace to perform this action.'));
};
