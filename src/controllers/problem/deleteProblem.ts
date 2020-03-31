import {Problem} from '../../models/problem';
import {Request, Response} from 'express';
import APIResponse from '../../utils/APIResponse';
import noId from '../../utils/noId';

export async function deleteWithId(
  req: Request,
  res: Response,
): Promise<Response> {
  const problemId = req.params.id;
  const problem = await Problem.findById(problemId);
  if (!problem) {
    return APIResponse.NotFound(res, noId(Problem, problemId));
  }
  problem.remove();
  return APIResponse.Ok(res, problem);
}
