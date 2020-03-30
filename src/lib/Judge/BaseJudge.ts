import {IContest} from '../../models/contest';
import {IUser} from '../../models/user';
import {IProblem} from '../../models/problem';
import {ISubmission, Submission} from '../../models/submission';
import {Standing} from '../../models/standing';

export class BaseJudge {
  readonly SUBMISSION_PENALITY = 20;
  protected contest: IContest;
  protected user: IUser;
  protected problem: IProblem;

  constructor(protected submission: ISubmission) {
    ({
      contest: this.contest,
      user: this.user,
      problem: this.problem,
    } = submission);
    if (this.isDuringContest()) {
    }
  }

  static contestStarted(contest: IContest): boolean {
    const start = new Date(contest.startDate);
    return new Date() > start;
  }

  isDuringContest(): boolean {
    const start = new Date(this.contest.startDate);
    const end = new Date();
    end.setMinutes(start.getMinutes() + this.contest.duration);
    // console.log(`Start: ${start}\nDuration: ${contest.duration}\nEnd: ${end}\nNow: ${new Date()}`)
    return new Date() < end && BaseJudge.contestStarted(this.contest);
  }

  createStandingForUser(): {} {
    const standing = new Standing({
      user: this.user,
      contest: this.contest,
      penality: 0,
      problems: this.contest.problems.map((p) => {
        return {
          p,
          isAccepted: false,
          failedSubmissions: 0,
          totalSubmissions: 0,
          isFirstAccepted: false,
        };
      }),
    });
    standing.save();
    return standing;
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
    return (
      new Date().getMinutes() - new Date(this.contest.startDate).getMinutes()
    );
  }

  isStillJudging(): boolean {
    const verdict = this.submission.verdict.trim().toLowerCase();
    const stillJudging =
      verdict.startsWith('running') || verdict.startsWith('in');
    return stillJudging;
  }
}
