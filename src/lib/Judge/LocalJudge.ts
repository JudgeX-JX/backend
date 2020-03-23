
import { IJudge } from './JudgeFactory';
import { BaseJudge } from './BaseJudge';
import { ISubmission } from '../../models/submission';

export class LocalJudge extends BaseJudge implements IJudge {
  constructor(s: ISubmission) {
    super(s);
  }
  submit(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getVerdict(judgeSubmissionID: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

}
