import { Problem } from '../../models/problem';
import { Request, Response } from 'express';
import { Contest } from '../../models/contest';
import APIResponse from '../../utils/APIResponse';


export async function getAll(req: Request, res: Response) {
  const options = {
    page: parseInt(req.query.pageNumber) || 1,
    limit: parseInt(req.query.pageSize) || 10,
    customLabels: {
      docs: 'problems'
    }
  };
  // const problems = await Contest.aggregate({
  //   startDate: { $lt: new Date() }
  // }).select('problems').populate('problems')

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
  Problem.paginate({}, options, (err, result) => {
    if (err) return res.json({ message: err });
    res.send(result);
  });
}
