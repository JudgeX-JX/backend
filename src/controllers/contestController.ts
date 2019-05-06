import { Contest, validateContest } from '../models/contest';
import { Request, Response } from 'express';
import { Problem } from '../models/problem';

// CRUD operations

export function getAll(req: Request, res: Response) {
  const options = {
    page: parseInt(req.query.pageNumber) || 1,
    limit: parseInt(req.query.pageSize) || 10,
    populate: {
      path: "setter problems",
      select: "name"
    },
    customLabels: {
      docs: 'contests'
    }
  };
  Contest.paginate({}, options, (err, result) => {
    if (err) return res.json({ message: err });
    res.send(result);
  });
}

export function getWithId(req: Request, res: Response) {
  const contestId = req.params.id;

  Contest.findById(contestId).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.json({ message: error });
  });
}


export async function create(req: any, res: Response) {
  const { error } = validateContest(req.body);
  if (error) return res.status(422).json({ message: error.details[0].message });

  for (const problem of req.body.problems) {
    await Problem.findById(problem).catch((err) => {
      res.status(422).json({ message: "Invalid problem id: " + problem });
    });
  }

  const contest = new Contest(req.body);
  contest.setter = req.user._id;
  contest.save();
  res.send(contest);

}

export function updateWithId(req: Request, res: Response) {

}

export function deleteWithId(req: Request, res: Response) {

}
