import {Problem} from '../../models/problem';
import {Request, Response} from 'express';
import APIResponse from '../../utils/APIResponse';
import noId from '../../utils/noId';

export async function getWithId(
  req: Request,
  res: Response,
): Promise<Response> {
  const problemId = req.params.id;

  const problem = await Problem.findById(problemId);

  return problem
    ? APIResponse.Ok(res, problem)
    : APIResponse.NotFound(res, noId(Problem, problemId));
}
