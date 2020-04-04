import {IJudge, ISubmitterResponse} from './JudgeFactory';
import {BaseJudge} from './BaseJudge';
import {ISubmission} from '../../models/submission';

export class LocalJudge extends BaseJudge implements IJudge {
  constructor(s: ISubmission) {
    super(s);
  }
  submit(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getVerdict(): Promise<ISubmitterResponse> {
    throw new Error('Method not implemented.');
  }
}
