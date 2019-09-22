import { Contest, validateContest, validProblemIDs } from '../../models/contest';
import { Request, Response } from 'express';
import APIResponse from '../../utils/APIResponse';
import { IAuthenticatedRequest } from '../../middlewares';

export async function create(req: Request, res: Response) {
  const { error } = validateContest(req.body);
  if (error) { return APIResponse.UnprocessableEntity(res, error.message); }

  if (!await validProblemIDs(req.body.problems)) {
    return APIResponse.UnprocessableEntity(res, 'Invalid problem id');
  }

  const contest = new Contest(req.body);
  contest.setter = (req as IAuthenticatedRequest).authenticatedUser._id;
  contest.save();
  res.send(contest);
}
