import { Contest } from '../../models/contest';
import { Request, Response } from 'express';
import _ from 'lodash';

export function getWithId(req: Request, res: Response) {
    const contestId = req.params.id;

    Contest.findById(contestId)
        .populate({
            path: 'setter problems',
            select: 'name'
        })
        .then(result => {
            if (!result)
                return res
                    .status(404)
                    .json({ message: 'No contest with the specified id: ' + contestId });
            res.send(result);
        })
        .catch(error => {
            res.status(404).send(error);
        });
}