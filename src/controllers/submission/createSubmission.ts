import { Submission, validateSubmission, Verdict } from '../../models/submission';
import { Request, Response } from 'express';
import axios, { AxiosResponse, AxiosPromise } from 'axios';
import { Problem } from '../../models/problem';
import APIResponse from '../../utils/APIResponse';
import { Contest } from '../../models/contest';
import { Standing } from '../../models/standing';
import { IAuthenticatedRequest } from '../../middlewares';
import { IJudge, JudgeFactory } from './Judge/JudgeFactory';
import { BaseJudge } from './Judge/BaseJudge';

export async function create(req: Request, res: Response): Promise<Response> {
  req.body.problem = req.params.problemID;
  const { error } = validateSubmission(req.body);
  if (error) { return APIResponse.UnprocessableEntity(res, error.message) }

  req.body.problem = await Problem.findById(req.body.problem);
  if (!req.body.problem) {
    return APIResponse.UnprocessableEntity(res, `No valid problem with id: ${req.body.problem}`);
  }

  req.body.contest = await Contest.findById(req.params.contestID);
  if (!req.body.contest) {
    return APIResponse.UnprocessableEntity(res, `No contest with id: ${req.params.contestID}`);
  }
  // can submit?
  if (!BaseJudge.contestStarted(req.body.contest)) {
    return APIResponse.Forbidden(res, 'You cannot submit to this contest! contest has not started yet!')
  }

  const submission = new Submission(req.body);
  const judge: IJudge = new JudgeFactory(req.body.problem).createJudge(submission);
  judge.submit();

  return APIResponse.Created(res, 'Submitted Successfully!');
}
