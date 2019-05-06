import { Response, NextFunction } from 'express';
import { Roles } from '../models/user';

export function authorize(roles: Roles[]) {
  return async function (req: any, res: Response, next: NextFunction) {
    const allowedRoles = roles.map(k => Roles[k]);
    if (allowedRoles.includes(req.user.role)) next();
    else return res.status(403).json({ message: `Only allowed for ${allowedRoles}!` });
  }
}

