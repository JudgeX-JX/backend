import {ISubmitterResponse} from '../judge/JudgeFactory';
import SubmissionsQ from './SubmissionsQ';

export default function whichQ({isJudged}: ISubmitterResponse): string {
  return isJudged ? SubmissionsQ.judgedQ : SubmissionsQ.pendingQ;
}
