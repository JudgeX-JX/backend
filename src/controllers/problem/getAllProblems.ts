import { Problem } from '../../models/problem';
import { Request, Response } from 'express';


export function getAll(req: Request, res: Response) {
    const options = {
        page: parseInt(req.query.pageNumber) || 1,
        limit: parseInt(req.query.pageSize) || 10,
        populate: {
            path: 'setter',
            select: 'name'
        },
        customLabels: {
            docs: 'problems'
        }
    };
    Problem.paginate({}, options, (err, result) => {
        if (err) return res.json({ message: err });
        res.send(result);
    });
}