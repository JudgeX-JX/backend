import { Problem, validateProblem } from '../../models/problem';
import { Request, Response } from 'express';
import _ from 'lodash';
import APIResponse from '../../utils/APIResponse';

export async function updateWithId(req: Request, res: Response): Promise<Response> {
  const problemId = req.params.id;

  const problem = await Problem.findById(problemId);

  if (!problem) {
    return APIResponse.NotFound(res, `No problem with id ${problemId}`)
  }
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
  if (error) { return res.status(422).json({ message: error.details[0].message }); }

  _.merge(problem, req.body);

  problem.save();

  return APIResponse.Ok(res, problem);

}
