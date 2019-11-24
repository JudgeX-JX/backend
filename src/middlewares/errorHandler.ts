import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }

  console.log(err);
  const status = err.status ? +err.status : 500;
  let message = '';
  if (status >= 500) {
    message = '🤒 Server error';
  } else {
    message = err.message ? err.message : '🤒 Something went wrong';
  }

  return res.status(status).json({ message });
}
