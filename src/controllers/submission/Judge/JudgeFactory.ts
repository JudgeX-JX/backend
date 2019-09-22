import { IProblem, JudgeType } from '../../../models/problem'
import { CodeforcesJudge } from './CodeforcesJudge';
import { Judge0Judge } from './Judge0Judge';
import { LocalJudge } from './LocalJudge';
import { ISubmission } from '../../../models/submission';

export type judgeSubmissionID = string;

export interface IJudge {
  submit(): judgeSubmissionID;
  getVerdict(judgeSubmissionID: judgeSubmissionID): string;
}


export class JudgeFactory {
  constructor(public readonly problem: IProblem) {
  }

  createJudge(submission: ISubmission): IJudge {
    switch (this.problem.judge.type) {
      case JudgeType[JudgeType.CODEFORCES]:
        return new CodeforcesJudge(submission);
      case JudgeType[JudgeType.JUDGE0]:
        return new Judge0Judge(submission);
      case JudgeType[JudgeType.LOCAL]:
        return new LocalJudge(submission);
      default:
        throw new Error('unkown judge: ' + this.problem.judge.type);
    }
  }
}
