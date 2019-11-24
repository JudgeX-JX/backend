import { Request, Response } from 'express';
import { Contest } from '../../models/contest';
import APIResponse from '../../utils/APIResponse';
import { Submission } from '../../models/submission';


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

  for (const problem of problems) {
    problem.submissions = await Submission.find({
      user: (req as any).user._id,
      problem
    });
    problem.isSolved = await Submission.exists({
      user: (req as any).user._id,
      problem,
      verdict: "Accepted"
    })
  }

  return APIResponse.Ok(res, problems);

}
