import { Contest, validateContest, validateProblems } from '../../models/contest';
import { Request, Response } from 'express';
import _ from 'lodash';


export function updateWithId(req: Request | any, res: Response) {
    const contestId = req.params.id;
    const userId = req.user._id;

    Contest.findById(contestId)
        .then(async contest => {
            if (contest.setter.toString() !== userId.toString())
                return res.status(403).json({ message: 'You are not allowed' });

            // if the problems are changed and they are NOT valid
            const areNotValid =
                req.body.problems && !(await validateProblems(req.body.problems));

            if (areNotValid)
                return res.status(422).json({ message: 'Invalid problem id' });

            // fill req.body with the required fields for Joi validation
            req.body = {
                ..._.pick(contest, ['name', 'password', 'startDate', 'duration']),
                problems: [
                    ...contest['problems'].map((problemId: any) => problemId.toString())
                ],
                // problems is array of ObjectIDs (make them strings for Joi validation)
                ...req.body
            };

            const { error } = validateContest(req.body);
            if (error)
                return res.status(422).json({ message: error.details[0].message });

            _.merge(contest, req.body);

            contest.save();
            res.send(contest);
        })
        .catch(err => {
            res.status(404).send(err);
        });
}
