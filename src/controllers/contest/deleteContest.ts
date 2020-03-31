import {Contest} from '../../models/contest';
import {Request, Response} from 'express';
import APIResponse from '../../utils/APIResponse';
import noId from '../../utils/noId';

export async function deleteWithId(
  req: Request,
  res: Response,
): Promise<Response> {
  const contestId = req.params.id;

  const contest = await Contest.findById(contestId).populate({
    path: 'setter problems',
    select: 'name',
  });
  if (!contest) {
    return APIResponse.Ok(res, noId(Contest, contestId));
  }
  contest.remove();
  return APIResponse.Ok(res, contest);
}
