import { IJudge } from './JudgeFactory';
import { IProblem } from '../../../models/problem';
import { BaseJudge } from './BaseJudge';
import { ISubmission } from '../../../models/submission';

export class Judge0Judge extends BaseJudge implements IJudge {
  constructor(s: ISubmission) {
    super(s);
  }

  submit(): string {
    throw new Error('Method not implemented.');
  }
  getVerdict(judgeSubmissionID: string): string {
    throw new Error('Method not implemented.');
  }
}
