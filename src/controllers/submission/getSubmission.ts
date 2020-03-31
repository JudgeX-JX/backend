import {Submission} from '../../models/submission';
import {Request, Response} from 'express';
import APIResponse from '../../utils/APIResponse';

export async function getWithId(
  req: Request,
  res: Response,
): Promise<Response> {
  const submissionId = req.params.id;

  const submission = await Submission.findById(submissionId).populate({
    path: 'user problem',
    select: '-sourceCode',
  });

  return submission
    ? APIResponse.Ok(res, submission)
    : APIResponse.NotFound(res, `no submission with id ${submissionId}`);
}
