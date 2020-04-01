import {CodeforcesJudge} from './CodeforcesJudge';
import {Judge0Judge} from './Judge0Judge';
import {LocalJudge} from './LocalJudge';
import {IProblem, JudgeType} from '../../models/problem';
import {ISubmission, judgeSubmissionID} from '../../models/submission';
import {BaseJudge} from './BaseJudge';

export interface IJudge extends BaseJudge {
  submit(): Promise<void>;
  getVerdict(judgeSubmissionID: judgeSubmissionID): Promise<string>;
}

export class JudgeFactory {
  constructor(public readonly problem: IProblem) {}

  createJudge(submission: ISubmission): IJudge {
    switch (JudgeType[this.problem.judge.type]) {
      case JudgeType.CODEFORCES:
        return new CodeforcesJudge(submission);
      case JudgeType.JUDGE0:
        return new Judge0Judge(submission);
      case JudgeType.LOCAL:
        return new LocalJudge(submission);
      default:
        throw new Error('unkown judge: ' + this.problem.judge.type);
    }
  }
}
