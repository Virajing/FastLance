import { ApiError } from '../utils/api.js';
export const notFound = (_req, _res, next) => next(new ApiError(404, 'API route not found'));
export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);
  let status = error.status || 500, message = error.message;
  if (['CastError', 'ValidationError', 'ZodError'].includes(error.name)) { status = 400; message = 'Invalid request values'; }
  if (error.code === 11000 || error.name === 'VersionError') { status = 409; message = 'This operation was already processed or the record changed. Refresh and try again.'; }
  if (error.code === 11000 && error.keyPattern?.email) message = 'An account with this email already exists. Sign in instead.';
  if (error.type === 'entity.parse.failed') { status = 400; message = 'Invalid JSON'; }
  if (error.code === 'LIMIT_FILE_SIZE') { status = 413; message = 'Files must be 10 MB or smaller.'; }
  if (status >= 500) {
    message = error instanceof ApiError ? error.message : 'The service is temporarily unavailable. Please retry.';
    if (process.env.NODE_ENV !== 'test') console.error({ status, code: error.code || error.name, route: req.route?.path });
  }
  res.status(status).json({ success: false, message, code: typeof error.code === 'string' ? error.code : status === 409 ? 'CONFLICT' : status >= 500 ? 'SERVICE_ERROR' : 'REQUEST_ERROR' });
};
