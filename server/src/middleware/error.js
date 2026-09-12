import { ApiError } from '../utils/api.js';
export const notFound=(req,res,next)=>next(new ApiError(404,`Route not found: ${req.method} ${req.originalUrl}`));
export const errorHandler=(err,req,res,next)=>{const status=err.status|| (err.name==='ValidationError'?400:500); if(process.env.NODE_ENV!=='test') console.error({status,error:err.message,stack:err.stack}); res.status(status).json({success:false,message:status===500&&process.env.NODE_ENV==='production'?'Something went wrong':err.message});};
