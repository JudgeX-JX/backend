import { Contest, validateContest, validProblemIDs } from '../../models/contest';
import { Request, Response } from 'express';
import _ from 'lodash';
import APIResponse from '../../utils/APIResponse';


export async function updateWithId(req: Request, res: Response): Promise<Response> {
  const contestId = req.params.id;

  const contest = await Contest.findById(contestId);

  if (!contest) {
    return APIResponse.NotFound(res, 'No contest with id ' + contestId)
  }

  // if the problems are changed and they are NOT valid
  const areNotValid =
    req.body.problems && !(await validProblemIDs(req.body.problems));

  if (areNotValid) { return APIResponse.UnprocessableEntity(res, 'Invalid problem id'); }

  // fill req.body with the required fields for Joi validation
  req.body = {
    ..._.pick(contest, ['name', 'password', 'startDate', 'duration']),
    problems: [
      ...contest.problems.map((problemId: any) => problemId.toString())
    ],
    // problems is array of ObjectIDs (make them strings for Joi validation)
    ...req.body
  };

  const { error } = validateContest(req.body);
  if (error) { return APIResponse.UnprocessableEntity(res, error.details[0].message); }

  _.merge(contest, req.body);

  contest.save();
  return APIResponse.Ok(res, contest);

}
