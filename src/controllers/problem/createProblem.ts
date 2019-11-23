import { Problem, validateProblem } from '../../models/problem';
import { Request, Response } from 'express';
import _ from 'lodash';


export function create(req: Request | any, res: Response) {
    const { error } = validateProblem(req.body);
    if (error) return res.status(422).json({ message: error.details[0].message });

    const problem = new Problem(req.body);
    problem.setter = req.user._id;
    problem.save();
    res.send(problem);
}