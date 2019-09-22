import { Response, NextFunction, Request } from 'express';
import { Roles } from '../models/user';
import { IAuthenticatedRequest } from '.';

export function authorize(roles: Roles[]) {
  return (req: Request, res: Response, next: NextFunction): unknown => {
    const allowedRoles = roles.map(k => Roles[k]);
    const { role } = (req as IAuthenticatedRequest).authenticatedUser;
    if (allowedRoles.includes(role)) {
      next();
    }
    else {
      return res
        .status(403)
        .json({ message: `Only allowed for ${allowedRoles}!` });
    }
  };
}
