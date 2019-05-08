import { Contest, validateContest, validateProblems } from '../models/contest';
import { Request, Response } from 'express';
import _ from 'lodash';

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

  Contest.findById(contestId).populate({
    path: "setter problems",
    select: "name"
  }).then((result) => {
    if (!result)
      return res.status(404).json({ message: "No contest with the specified id: " + contestId })
    res.send(result);
  }).catch((error) => {
    res.status(404).send(error);
  });
}


export async function create(req: Request | any, res: Response) {
  const { error } = validateContest(req.body);
  if (error) return res.status(422).json({ message: error.details[0].message });

  if (!validateProblems(req.body.problems))
    return res.status(422).json({ message: "Invalid problem id" })

  const contest = new Contest(req.body);
  contest.setter = req.user._id;
  contest.save();
  res.send(contest);

}

export function updateWithId(req: Request | any, res: Response) {
  const contestId = req.params.id;
  const userId = req.user._id;

  Contest.findById(contestId).then(async (contest) => {

    if (contest.setter.toString() !== userId.toString())
      return res.status(403).json({ message: "You are not allowed" });

    // if the problems are changed and they are NOT valid
    const areNotValid = req.body.problems && !await validateProblems(req.body.problems);

    if (areNotValid)
      return res.status(422).json({ message: "Invalid problem id" })

    // fill req.body with the required fields for Joi validation
    req.body = {
      ..._.pick(contest, ["name", "password", "startDate", "duration"]),
      problems: [...contest["problems"].map((problemId: any) => problemId.toString())],
      // problems is array of ObjectIDs (make them strings for Joi validation)
      ...req.body
    };

    const { error } = validateContest(req.body);
    if (error) return res.status(422).json({ message: error.details[0].message });

    _.merge(contest, req.body);

    contest.save();
    res.send(contest);


  }).catch((err) => {
    res.status(404).send(err);
  })

}

export function deleteWithId(req: Request | any, res: Response) {
  const contestId = req.params.id;
  const userId = req.user._id;

  Contest.findById(contestId).populate({
    path: "setter problems",
    select: "name"
  }).then((contest) => {

    if (contest.setter._id.toString() !== userId.toString())
      return res.status(403).json({ message: "You are not allowed" })

    contest.delete();
    res.send(contest);
  }).catch((error) => {
    res.status(404).json({ message: "No contest with the specified id: " + contestId });
  });
}
