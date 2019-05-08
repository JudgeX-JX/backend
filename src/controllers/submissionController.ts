import { Submission, validateSubmission } from '../models/submission';
import { Request, Response } from 'express';
import axios from 'axios';


// CRUD operations

export function getAll(req: Request, res: Response) {
  const options = {
    page: parseInt(req.query.pageNumber) || 1,
    limit: parseInt(req.query.pageSize) || 10,
    populate: {
      path: "user problem",
      select: "name"
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

export function getWithId(req: Request, res: Response) {
  const submissionId = req.params.id;

  Submission.findById(submissionId).populate({
    path: "user problem",
    select: "name"
  }).then((result) => {
    if (!result)
      return res.status(404).json({ message: "No submission with the specified id: " + submissionId })
    res.send(result);
  }).catch((error) => {
    res.status(404).send(error);
  });
}

export function create(req: Request, res: Response) {

}

export function updateWithId(req: Request, res: Response) {

}

export function deleteWithId(req: Request, res: Response) {

}
