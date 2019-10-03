import {IJudge} from './JudgeFactory';
import {BaseJudge} from './BaseJudge';
import {ISubmission} from '../../models/submission';
import Axios, {AxiosRequestConfig} from 'axios';

export class CodeforcesJudge extends BaseJudge implements IJudge {
  cfSubmitterBaseUrl: string;
  cfSubmitterApiKey: string;

  constructor(submission: ISubmission) {
    super(submission);
    this.cfSubmitterBaseUrl = process.env.CF_SUBMITTER_URL || '';
    this.cfSubmitterApiKey = process.env.CF_SUBMITTER_API_KEY || '';
  }

  async submit(): Promise<void> {
    const cfID = this.problem.judge.cfID?.split('/');
    if (!cfID) {
      throw new Error('Not valid cfID' + cfID);
    }
    const submission = {
      sourceCode: this.submission.sourceCode,
      langId: this.submission.languageID,
      contestId: cfID[0],
      problem: cfID[1],
    };
    const response = await Axios.post(
      `${this.cfSubmitterBaseUrl}/submit`,
      submission,
      this.getConfig(),
    );
    const {
      id: judgeSubmissionID,
      verdict,
      isJudged,
      time,
      memory,
    } = response.data;
    this.submission.set({
      judgeSubmissionID,
      verdict,
      isJudged,
      time: time.split('')[0],
      memory: memory.split('')[0],
    });
    await this.submission.save();
  }

  async getVerdict(judgeSubmissionID: string): Promise<string> {
    const resp = await Axios.get(
      `${this.cfSubmitterBaseUrl}/submission/${this.submission.contest}/${judgeSubmissionID}`,
      this.getConfig(),
    );
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
