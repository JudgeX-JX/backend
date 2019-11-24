import { Request, Response } from 'express';
import { Contest } from '../../models/contest';
import APIResponse from '../../utils/APIResponse';


export async function getAll(req: Request, res: Response) {

  // only return problems that their contest has not started yet
  const problems = await Contest.aggregate([
    {
      $match: {
        startDate: { $lt: new Date() }
      }
    },
    {
      $lookup: {
        from: 'problems',
        localField: 'problems',
        foreignField: '_id',
        as: 'problems',
      },
    },
    {
      $unwind: '$problems',
    },
    {
      $replaceRoot: {
        newRoot: '$problems',
      },
    },
  ]);

  return APIResponse.Ok(res, problems);

}
