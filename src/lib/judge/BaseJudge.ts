import {IContest} from '../../models/contest';
import {IUser} from '../../models/user';
import {IProblem} from '../../models/problem';
import {ISubmission, Submission} from '../../models/submission';
import {Standing, IStanding} from '../../models/standing';
import {PossibleDocumentOrObjectID} from '../../utils/types';

export class BaseJudge {
  readonly WRONG_ANSWER_PENALITY = 20;
  protected contest: IContest;
  protected user: IUser | PossibleDocumentOrObjectID;
  protected problem: IProblem;

  constructor(protected submission: ISubmission) {
    ({
      contest: this.contest,
      user: this.user,
      problem: this.problem,
    } = submission);
    this.init();
  }

  private async init(): Promise<void> {
    // problem: un-finished submissions don't get updated
    // push the submissions to the queue if isStillJudging
    // the queue should update the problem verdict every 5 seconds
    // the queue should remove the finished and judged submissions
    if (this.isDuringContest()) {
      const standing = await this.getUserStanding();
      const problem = standing.problems.find(({problem}) =>
        problem._id.equals(this.problem._id),
      ); // find current submitted problem

      if (!problem) {
        throw new Error('problem id not found ');
      }
      // add submission to the standing
      problem.submissions.push(this.submission);
      await standing.save();
    }
  }

  /**
   * Returns standing if found for user, creates one otherwise
   */
  async getUserStanding(): Promise<IStanding> {
    return (
      (await Standing.findOne({
        user: this.user,
        contest: this.contest,
      })) ||
      (await new Standing({
        user: this.user,
        contest: this.contest,
        problems: this.contest.problems.map((problem) => {
          return {problem};
        }),
      }).save())
    );
  }

  static contestStarted(contest: IContest): boolean {
    const start = new Date(contest.startDate);
    return new Date() > start;
  }

  isDuringContest(): boolean {
    const start = new Date(this.contest.startDate);
    const end = new Date();
    end.setTime(start.getTime() + this.contest.duration * 60 * 1000);
    return new Date() < end && BaseJudge.contestStarted(this.contest);
  }

  async isFirstAccepted(): Promise<boolean> {
    // get first submission in the contest for this problem
    // bring the first accepted submission if any
    const previousAcceptedSubmission = await Submission.exists({
      contest: this.submission.contest,
      problem: this.submission.problem,
      verdict: 'Accepted',
      createdAt: {$lt: this.submission.createdAt},
    });
    return !previousAcceptedSubmission;
  }

  calculateAcceptedPenality(): number {
    return new Date().getTime() - new Date(this.contest.startDate).getTime();
  }
}
