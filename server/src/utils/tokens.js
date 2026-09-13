import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export const hashToken = token => crypto.createHmac('sha256', env.JWT_REFRESH_SECRET).update(token).digest('hex');
export const newRefreshToken = () => crypto.randomBytes(48).toString('base64url');
export const accessToken = (user, sessionId) => jwt.sign({
  sub: user.id, sid: String(sessionId), version: user.tokenVersion ?? 0,
}, env.JWT_ACCESS_SECRET, { expiresIn: '15m', algorithm: 'HS256', issuer: 'fastlance', audience: 'fastlance-app' });
export const verifyAccess = token => jwt.verify(token, env.JWT_ACCESS_SECRET, {
  algorithms: ['HS256'], issuer: 'fastlance', audience: 'fastlance-app',
});
export const refreshCookie = {
  httpOnly: true, sameSite: env.COOKIE_SAME_SITE, secure: env.NODE_ENV === 'production',
  path: '/api/v1/auth', maxAge: 7 * 86400000,
};
