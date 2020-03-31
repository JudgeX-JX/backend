import {Contest} from '../../models/contest';
import {Request, Response} from 'express';
import APIResponse from '../../utils/APIResponse';
import noId from '../../utils/noId';

export async function getWithId(
  req: Request,
  res: Response,
): Promise<Response> {
  const contestId = req.params.id;

  const contest = await Contest.findById(contestId)
    .populate({
      path: 'setter',
      select: 'name',
    })
    .populate('problems');

  return contest
    ? APIResponse.Ok(res, contest)
    : APIResponse.NotFound(res, noId(Contest, contestId));
}
