import { Contest } from '../../models/contest';
import { Request, Response } from 'express';

export async function getWithId(req: Request, res: Response): Promise<Response> {
  const contestId = req.params.id;

  const contest = await Contest.findById(contestId)
    .populate({
      path: 'setter',
      select: 'name'
    }).populate('problems')

  if (!contest) {
    return res
      .status(404)
      .json({ message: 'No contest with the specified id: ' + contestId });
  }
  return res.send(contest);


}
