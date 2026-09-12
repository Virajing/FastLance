export const ok=(res,data={},message='OK',status=200)=>res.status(status).json({success:true,message,data});
export const page=(res,data,pagination)=>res.json({success:true,data,pagination});
export class ApiError extends Error { constructor(status,message){super(message);this.status=status;} }
export const asyncHandler=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
export const objectId=(v)=>/^[a-f\d]{24}$/i.test(v);
