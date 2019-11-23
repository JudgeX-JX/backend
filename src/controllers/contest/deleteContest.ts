import { Contest } from '../../models/contest';
import { Request, Response } from 'express';
import _ from 'lodash';

export function deleteWithId(req: Request | any, res: Response) {
    const contestId = req.params.id;
    const userId = req.user._id;

    Contest.findById(contestId)
        .populate({
            path: 'setter problems',
            select: 'name'
        })
        .then(contest => {
            if (contest.setter._id.toString() !== userId.toString())
                return res.status(403).json({ message: 'You are not allowed' });

            contest.delete();
            res.send(contest);
        })
        .catch(error => {
            console.log(error)
            res
                .status(404)
                .json({ message: 'No contest with the specified id: ' + contestId });
        });
}
