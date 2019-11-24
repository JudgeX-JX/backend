import { Contest, validateContest, validateProblems } from '../../models/contest';
import { Request, Response } from 'express';
import _ from 'lodash';
import APIResponse from '../../utils/APIResponse';

export async function create(req: Request | any, res: Response) {
  const { error } = validateContest(req.body);
  if (error)
    return APIResponse.UnprocessableEntity(res, error.message);

  if (!await validateProblems(req.body.problems))
    return APIResponse.UnprocessableEntity(res, 'Invalid problem id');

  const contest = new Contest(req.body);
  contest.setter = req.user._id;
  contest.save();
  res.send(contest);
}
