import mongoose from 'mongoose';
import {IContest} from './contest';
import {IUser} from './user';
import {IProblem} from './problem';
import {ISubmission} from './submission';

export interface IStanding extends mongoose.Document {
  contest: IContest;
  user: IUser;
  problems: {
    problem: IProblem;
    isAccepted: boolean;
    isFirstAccepted: boolean;
    failedSubmissions: number;
    solvedAt: Date;
    submissions: ISubmission[];
  }[];
  solved: number;
  penality: number;
}

const standingSchema = new mongoose.Schema({
  contest: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Contest',
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  problems: [
    {
      problem: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Problem',
      },
      isAccepted: {
        type: Boolean,
        required: true,
        default: false,
      },
      isFirstAccepted: {
        type: Boolean,
        required: true,
        default: false,
      },
      failedSubmissions: {
        type: Number,
        required: true,
        default: 0,
      },
      submissions: {
        type: [mongoose.Types.ObjectId],
        ref: 'Submission',
        default: [],
      },
      solvedAt: {
        type: Date,
        required: true,
      },
    },
  ],
  solved: {
    type: Number,
    required: true,
    default: 0,
  },
  penality: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const Standing = mongoose.model<IStanding>('Standing', standingSchema);
