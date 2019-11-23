import { Contest, validateContest, validateProblems } from '../../models/contest';
import { Request, Response } from 'express';
import _ from 'lodash';

export async function create(req: Request | any, res: Response) {
    const { error } = validateContest(req.body);
    if (error) return res.status(422).json({ message: error.details[0].message });

    if (!validateProblems(req.body.problems))
        return res.status(422).json({ message: 'Invalid problem id' });

    const contest = new Contest(req.body);
    contest.setter = req.user._id;
    contest.save();
    res.send(contest);
}
