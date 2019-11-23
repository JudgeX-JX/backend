import { Problem } from '../../models/problem';
import { Request, Response } from 'express';

export function deleteWithId(req: Request | any, res: Response) {
    const problemId = req.params.id;
    const userId = req.user._id;

    Problem.findById(problemId)
        .then(problem => {
            if (problem.setter.toString() !== userId.toString())
                return res.status(403).json({ message: 'You are not allowed' });

            problem.delete();
            res.send(problem);
        })
        .catch(err => {
            console.log(err);
            return res.status(404).json({
                message: 'No problem with the specified id: ' + problemId
            });
        })

}
