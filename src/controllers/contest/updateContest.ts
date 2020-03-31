import {Contest, validateContest, validProblemIDs} from '../../models/contest';
import {Request, Response} from 'express';
import APIResponse from '../../utils/APIResponse';
import noId from '../../utils/noId';

export async function updateWithId(
  req: Request,
  res: Response,
): Promise<Response> {
  const contestId = req.params.id;

  const contest = await Contest.findById(contestId);

  if (!contest) {
    return APIResponse.NotFound(res, noId(Contest, contestId));
  }

  const {error} = validateContest(req.body);
  if (error) {
    return APIResponse.UnprocessableEntity(res, error.message);
  }

  if (!(await validProblemIDs(req.body.problems))) {
    return APIResponse.UnprocessableEntity(res, 'Invalid problem id');
  }
  await contest.set(req.body).save();
  return APIResponse.Ok(res, contest);
}
