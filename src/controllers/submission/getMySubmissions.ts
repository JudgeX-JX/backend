import { Submission } from '../../models/submission';
import { Request, Response } from 'express';
import APIResponse from '../../utils/APIResponse';
import { IAuthenticatedRequest } from '../../middlewares';

export async function getMySubmissions(req: Request, res: Response): Promise<Response> {
  const user = (req as IAuthenticatedRequest).authenticatedUser._id;
  const filter = req.query;
  const submissions = await Submission.find({
    user,
    ...filter
  });

  return APIResponse.Ok(res, submissions);
}
