import {Problem} from '../../models/problem';
import {Request, Response} from 'express';
import APIResponse from '../../utils/APIResponse';

export async function deleteWithId(
  req: Request,
  res: Response,
): Promise<Response> {
  const problemId = req.params.id;
  const problem = await Problem.findById(problemId);
  if (!problem) {
    return APIResponse.NotFound(res, `no problem with id ${problemId}`);
  }
  problem.remove();
  return APIResponse.Ok(res, problem);
}
