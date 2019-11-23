import { Problem, validateProblem } from '../../models/problem';
import { Request, Response } from 'express';
import _ from 'lodash';

export function updateWithId(req: Request | any, res: Response) {
    const problemId = req.params.id;
    const userId = req.user._id;

    Problem.findById(problemId)
        .then(async problem => {
            if (problem.setter.toString() !== userId.toString())
                return res.status(403).json({ message: 'You are not allowed' });

            req.body = {
                ..._.pick(problem, [
                    'name',
                    'description',
                    'inputs',
                    'outputs',
                    'timeLimit',
                    'memoryLimit',
                    'tags',
                    'difficulty'
                ]),
                ...req.body
            };

            const { error } = validateProblem(req.body);
            if (error)
                return res.status(422).json({ message: error.details[0].message });

            for (let prop in req.body) problem.markModified(prop); // To fix non-changing array of inputs or outputs

            _.merge(problem, req.body);

            problem.save();

            res.send(problem);
        })
        .catch(err => res.status(404).json(err));
}