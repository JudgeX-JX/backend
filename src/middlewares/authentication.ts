import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import APIResponse from '../utils/APIResponse';

export async function authenticate(
  req: any,
  res: Response,
  next: NextFunction
) {
  const token = req.token;

  if (!token)
    return APIResponse.Unauthorized(res, 'Access denied! No token provided.');

  try {
    req.user = await jwt.verify(token, process.env.JWT_SECRET_KEY || '');
    next();
  } catch (error) {
    return res.status(400).send(error.message);
  }
}
