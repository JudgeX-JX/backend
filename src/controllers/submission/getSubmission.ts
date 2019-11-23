import { Submission } from '../../models/submission';
import { Request, Response } from 'express';
// CRUD operations
export function getWithId(req: Request, res: Response) {
    const submissionId = req.params.id;

    Submission.findById(submissionId)
        .populate({
            path: 'user problem',
            select: 'name'
        })
        .then(result => {
            if (!result)
                return res.status(404).json({
                    message: 'No submission with the specified id: ' + submissionId
                });
            res.send(result);
        })
        .catch(error => {
            res.status(404).send(error);
        });
}