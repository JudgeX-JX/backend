import { Submission } from '../../models/submission';
import { Request, Response } from 'express';
import APIResponse from '../../utils/APIResponse';

// CRUD operations

export async function getMySubmissions(req: Request, res: Response) {
  const user = (req as any).user._id;
  const filter = req.query;
  const submissions = await Submission.find({
    user,
    ...filter
  });

  return APIResponse.Ok(res, submissions);
}
