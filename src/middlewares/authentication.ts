import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import config from 'config';

export async function authenticate(
  req: any,
  res: Response,
  next: NextFunction
) {
  const token = req.header('x-auth-token');

  if (!token)
    return res
      .status(401)
      .json({ message: 'Access denied! No token provided.' });

  try {
    req.user = await jwt.verify(token, config.get('jwtPrivateKey'));
    next();
  } catch (error) {
    return res.status(400).send(error.message);
  }
}
