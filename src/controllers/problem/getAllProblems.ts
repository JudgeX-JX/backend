import { Request, Response } from 'express';
import { Contest } from '../../models/contest';
import APIResponse from '../../utils/APIResponse';
import { Submission } from '../../models/submission';
import { IAuthenticatedRequest } from '../../middlewares';


export async function getAll(req: Request, res: Response): Promise<Response> {

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
    {
      $lookup: {
        from: 'submissions',
        localField: (req as IAuthenticatedRequest).authenticatedUser._id,
        foreignField: 'user',
        as: 'submissions'
      }
    }
  ]);

  // for (const problem of problems) {
  //   problem.submissions = await Submission.find({
  //     user: (req as IAuthenticatedRequest).authenticatedUser._id,
  //     problem
  //   });
  //   problem.isSolved = await Submission.exists({
  //     user: (req as IAuthenticatedRequest).authenticatedUser._id,
  //     problem,
  //     verdict: "Accepted"
  //   })
  // }

  return APIResponse.Ok(res, problems);

}
