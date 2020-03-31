import {Problem} from '../../models/problem';
import {Request, Response} from 'express';
import APIResponse from '../../utils/APIResponse';

export async function getWithId(
  req: Request,
  res: Response,
): Promise<Response> {
  const problemId = req.params.id;

  const problem = await Problem.findById(problemId);

  return problem
    ? APIResponse.Ok(res, problem)
    : APIResponse.NotFound(res, `no problem with id ${problemId}`);
}
