import {Contest} from '../../models/contest';
import {Request, Response} from 'express';
import APIResponse from '../../utils/APIResponse';

export async function getAll(req: Request, res: Response): Promise<Response> {
  const options = {
    page: parseInt(req.query.pageNumber, 10) || 1,
    limit: parseInt(req.query.pageSize, 10) || 10,
    populate: {
      path: 'setter problems',
      select: 'name',
    },
    customLabels: {
      docs: 'contests',
    },
  };
  const contests = await Contest.paginate({}, options);
  return APIResponse.Ok(res, contests);
}
