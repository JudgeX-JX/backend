import { Submission } from '../../models/submission';
import { Request, Response } from 'express';

// CRUD operations

export function getAll(req: Request, res: Response) {
    const options = {
        page: parseInt(req.query.pageNumber) || 1,
        limit: parseInt(req.query.pageSize) || 10,
        populate: {
            path: 'user problem',
            select: 'name'
        },
        customLabels: {
            docs: 'submissions'
        }
    };
    Submission.paginate({}, options, (err, result) => {
        if (err) return res.json({ message: err });
        res.send(result);
    });
}