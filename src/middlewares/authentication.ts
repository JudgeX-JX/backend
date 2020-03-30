import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

import APIResponse from '../utils/APIResponse';
import {AuthenticatedUser} from './AuthenticatedUser';

export interface IDecodedToken {
  readonly _id: string;
  readonly role: string;
}

export interface IAuthenticatedRequest extends Request {
  authenticatedUser: AuthenticatedUser;
}
/**
 * returns the authenticated user
 * @param token the token in the request
 */
export function _auth(token: string): AuthenticatedUser {
  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY || '',
  ) as IDecodedToken;
  return new AuthenticatedUser(decodedToken);
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Response | undefined {
  const token = req.token;

  if (!token) {
    return APIResponse.Unauthorized(res, 'Access denied! No token provided.');
  }

  try {
    (req as IAuthenticatedRequest).authenticatedUser = _auth(token);
    next();
  } catch (error) {
    console.error(error);
    return APIResponse.BadRequest(res);
  }
}
