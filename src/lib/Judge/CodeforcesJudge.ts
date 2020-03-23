import { IJudge } from './JudgeFactory';
import { BaseJudge } from './BaseJudge';
import { ISubmission, judgeSubmissionID } from '../../models/submission';
import Axios from 'axios';


export class CodeforcesJudge extends BaseJudge implements IJudge {
  cfSubmitterBaseUrl: string;
  cfApiKey: string;

  constructor(submission: ISubmission) {
    super(submission);
    this.cfSubmitterBaseUrl = process.env.CODEFORCES_SUBMITTER_URL || '';
    this.cfApiKey = process.env.CODEFORCES_SUBMITTER_API_KEY || '';
  }

  async submit(): Promise<judgeSubmissionID> {
    const cfID = this.problem.judge.cfID?.split('/')
    if (!cfID) { throw new Error('Not valid cfID' + cfID); }
    const submission = {
      sourceCode: this.submission.sourceCode,
      langId: this.submission.languageID,
      contestId: cfID[0],
      problem: cfID[1]
    }
    const resp = await Axios.post(`${this.cfSubmitterBaseUrl}/submit`, submission, {
      headers: {
        'x-api-key': this.cfApiKey
      }
    });
    // TODO check if submission is pending or finished << at judge
    return resp.data.id;
  }

  async getVerdict(judgeSubmissionID: string): Promise<string> {
    const resp = await Axios.get(`${this.cfSubmitterBaseUrl}/submission/${this.submission.contest}/${judgeSubmissionID}`, {
      headers: {
        'x-api-key': this.cfApiKey
      }
    });
    return resp.data;
  }
}
