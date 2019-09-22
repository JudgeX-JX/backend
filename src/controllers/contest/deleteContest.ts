import { Contest } from '../../models/contest';
import { Request, Response } from 'express';
import APIResponse from '../../utils/APIResponse';

export async function deleteWithId(req: Request, res: Response): Promise<Response> {
  const contestId = req.params.id;

  const contest = await Contest.findById(contestId)
    .populate({
      path: 'setter problems',
      select: 'name'
    })
  if (!contest) {
    return APIResponse.Ok(res
      , 'No contest with the specified id: ' + contestId);
  }
  contest.remove();
  return APIResponse.Ok(res, contest);
}
