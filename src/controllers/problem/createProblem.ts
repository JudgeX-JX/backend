import { Problem, validateProblem } from '../../models/problem';
import { Request, Response } from 'express';
import APIResponse from '../../utils/APIResponse';
import { CodeforcesProblemScrapper } from '../../lib/problem-scrapper/CodeforcesProblemScrapper';

export async function create(req: Request, res: Response): Promise<Response> {
  const { error } = validateProblem(req.body);
  if (error) {
    return APIResponse.UnprocessableEntity(res, error.message);
  }
  try {
    const problem = new Problem(req.body);
    if (problem.judge.type === 'CODEFORCES' && problem.judge.cfID) {
      const cfScrapper = new CodeforcesProblemScrapper();
      problem.description = await cfScrapper.parseProblem(problem.judge.cfID);
      console.log(problem);
    }
    await problem.save();
    return APIResponse.Created(res, problem);
  } catch (err) {
    console.error(err);
    return APIResponse.UnprocessableEntity(res, err.message);
  }
}
