import { Problem } from '../../models/problem';
import { Request, Response } from 'express';

export function getWithId(req: Request, res: Response) {
    const problemId = req.params.id;

    Problem.findById(problemId)
        .then(result => {
            if (!result)
                return res
                    .status(404)
                    .json({ message: 'No problem with the specified id: ' + problemId });
            res.send(result);
        })
        .catch(error => {
            res.status(404).send(error);
        });
}