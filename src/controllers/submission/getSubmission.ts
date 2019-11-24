import { Submission } from '../../models/submission';
import { Request, Response } from 'express';
import APIResponse from '../../utils/APIResponse';

export async function getWithId(req: Request, res: Response) {
  const submissionId = req.params.id;

  try {
    const submission = await Submission.findById(submissionId)
      .populate({
        path: 'user problem',
        // select: 'name'
      })
    if (!submission) return APIResponse.NotFound(res, `No submission with id ${submissionId}`)

    return APIResponse.Ok(res, submission);
  }
  catch (err) {
    console.log(err);
    return APIResponse.BadRequest(res, err);
  }

}
