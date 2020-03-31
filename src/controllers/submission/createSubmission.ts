import {Submission, validateSubmission} from '../../models/submission';
import {Request, Response} from 'express';
import APIResponse from '../../utils/APIResponse';
import {IAuthenticatedRequest} from '../../middlewares';
import {BaseJudge} from '../../lib/Judge/BaseJudge';
import {JudgeFactory} from '../../lib/Judge/JudgeFactory';
import noId from '../../utils/noId';
import {Problem} from '../../models/problem';
import {Contest} from '../../models/contest';

export async function create(req: Request, res: Response): Promise<Response> {
  req.body.problem = req.params.problemID;
  req.body.contest = req.params.contestID;
  req.body.user = (req as IAuthenticatedRequest).authenticatedUser._id;

  const {error} = validateSubmission(req.body);
  if (error) {
    return APIResponse.UnprocessableEntity(res, error.message);
  }

  const submission = await new Submission(req.body)
    .populate({
      path: 'problem',
      select: 'judge',
    })
    .populate({
      path: 'contest',
      select: 'startDate duration',
    })
    .execPopulate();

  if (!submission.problem) {
    return APIResponse.UnprocessableEntity(
      res,
      noId(Problem, req.params.problemID),
    );
  }
  if (!submission.contest) {
    return APIResponse.UnprocessableEntity(
      res,
      noId(Contest, req.params.contestID),
    );
  }
  // can submit?
  if (!BaseJudge.contestStarted(submission.contest)) {
    return APIResponse.Forbidden(
      res,
      'You cannot submit to this contest! contest has not started yet!',
    );
  }

  const judge = new JudgeFactory(submission.problem).createJudge(submission);

  submission.judgeSubmissionID = await judge.submit();
  await submission.save();

  return APIResponse.Created(res, 'Submitted Successfully!');
}
