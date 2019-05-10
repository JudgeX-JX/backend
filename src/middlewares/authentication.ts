import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

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
    req.user = await jwt.verify(token, process.env.JWT_SECRET_KEY || '');
    next();
  } catch (error) {
    return res.status(400).send(error.message);
  }
}
