import { Problem } from '../../models/problem';
import { Request, Response } from 'express';
import _ from 'lodash';
import APIResponse from '../../utils/APIResponse';


export function create(req: Request | any, res: Response) {
  // const { error } = validateProblem(req.body);
  // if (error) return APIResponse.UnprocessableEntity(res, error.message);
  const problem = new Problem(req.body);
  problem.setter = req.user._id;
  problem.save();
  return APIResponse.Created(res, problem);
}
