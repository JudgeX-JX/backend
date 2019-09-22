import { Contest } from '../../models/contest';
import { Request, Response } from 'express';

export function getAll(req: Request, res: Response) {
  const options = {
    page: parseInt(req.query.pageNumber, 10) || 1,
    limit: parseInt(req.query.pageSize, 10) || 10,
    populate: {
      path: 'setter problems',
      select: 'name'
    },
    customLabels: {
      docs: 'contests'
    }
  };
  Contest.paginate({}, options, (err, result) => {
    if (err) return res.json({ message: err });
    res.send(result);
  });
}
