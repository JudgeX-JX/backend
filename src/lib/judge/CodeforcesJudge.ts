import {IJudge, ISubmitterResponse} from './JudgeFactory';
import {BaseJudge} from './BaseJudge';
import {ISubmission} from '../../models/submission';
import Axios, {AxiosRequestConfig} from 'axios';
import SubmissionsQ from '../submission-consumers/SubmissionsQ';

export class CodeforcesJudge extends BaseJudge implements IJudge {
  cfSubmitterBaseUrl: string;
  cfSubmitterApiKey: string;
  cfContestID: string;
  cfProblemID: string;

  constructor(submission: ISubmission) {
    super(submission);
    this.cfSubmitterBaseUrl = process.env.CF_SUBMITTER_URL || '';
    this.cfSubmitterApiKey = process.env.CF_SUBMITTER_API_KEY || '';
    const cfID = this.problem.judge.cfID?.split('/');
    if (!cfID) {
      throw new Error('Not valid cfID' + cfID);
    }
    [this.cfContestID, this.cfProblemID] = cfID;
  }

  async submit(): Promise<void> {
    const submission = {
      sourceCode: this.submission.sourceCode,
      langId: this.submission.languageID,
      contestId: this.cfContestID,
      problem: this.cfProblemID,
    };
    const response = await Axios.post(
      `${this.cfSubmitterBaseUrl}/submit`,
      submission,
      this.getConfig(),
    );
    this.submission.set(response.data);
    SubmissionsQ.send(this.submission);
  }

  async getVerdict(): Promise<ISubmitterResponse> {
    const url = `${this.cfSubmitterBaseUrl}/submission/${this.cfContestID}/${this.submission.judgeSubmissionID}`;
    const resp = await Axios.get(url, this.getConfig());
    return resp.data;
  }

  getConfig(): AxiosRequestConfig {
    return {
      headers: {
        'x-api-key': this.cfSubmitterApiKey,
      },
    };
  }
}
