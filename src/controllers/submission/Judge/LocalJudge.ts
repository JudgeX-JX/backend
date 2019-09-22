
import { IJudge } from './JudgeFactory';
import { BaseJudge } from './BaseJudge';
import { ISubmission } from '../../../models/submission';

export class LocalJudge extends BaseJudge implements IJudge {
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
