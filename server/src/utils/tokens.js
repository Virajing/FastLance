import jwt from 'jsonwebtoken'; import { env } from '../config/env.js';
export const accessToken=u=>jwt.sign({sub:u._id.toString(),role:u.role},env.JWT_ACCESS_SECRET,{expiresIn:env.JWT_ACCESS_EXPIRES_IN});
export const refreshToken=u=>jwt.sign({sub:u._id.toString()},env.JWT_REFRESH_SECRET,{expiresIn:env.JWT_REFRESH_EXPIRES_IN});
export const verifyAccess=t=>jwt.verify(t,env.JWT_ACCESS_SECRET); export const verifyRefresh=t=>jwt.verify(t,env.JWT_REFRESH_SECRET);
export const refreshCookie={httpOnly:true,sameSite:'lax',secure:env.NODE_ENV==='production',path:'/api/v1/auth',maxAge:7*24*60*60*1000};
