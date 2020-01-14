import { Submission } from '../../models/submission';
import { Request, Response } from 'express';
import APIResponse from '../../utils/APIResponse';

// CRUD operations

export async function getAll(req: Request, res: Response) {
  const options = {
    page: parseInt(req.query.pageNumber) || 1,
    limit: parseInt(req.query.pageSize) || 10,
    populate: {
      path: 'user problem',
    },
    select: '-sourceCode',
    customLabels: {
      docs: 'submissions'
    }
  };
  const submissions = await Submission.paginate({}, options);

  return APIResponse.Ok(res, submissions);
}
