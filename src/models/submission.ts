import mongoose, {PaginateModel} from 'mongoose';
import Joi from '@hapi/joi';
import mongoosePaginate from 'mongoose-paginate-v2';
import {IProblem} from './problem';
import {IUser} from './user';
import {IContest} from './contest';

export enum Verdict {
  PENDING,
  ACCEPTED = 3,
  WRONG_ANSWER,
  TIME_LIMIT_EXCEEDED,
  COMPILATION_ERROR,
  RUNTIME_ERROR,
  MEMORY_LIMIT_EXCEEDED,
  JUDGE_ERROR = 13,
}

export type judgeSubmissionID = string;

export interface ISubmission extends mongoose.Document {
  createdAt: string;
  updatedAt: string;
  contest: IContest;
  problem: IProblem;
  user: IUser;
  isDuringContest: boolean;
  isJudged: boolean;
  judgeSubmissionID: judgeSubmissionID;
  sourceCode: string;
  verdict: string;
  time: number;
  memory: number;
  languageID: number;
}

const submissionSchema = new mongoose.Schema(
  {
    contest: {
      type: mongoose.Types.ObjectId,
      ref: 'Contest',
      required: true,
    },
    problem: {
      type: mongoose.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDuringContest: {
      type: Boolean,
      default: false,
    },
    isJudged: {
      type: Boolean,
      required: true,
      default: false,
    },
    judgeSubmissionID: {
      type: String,
    },
    sourceCode: {
      type: String,
      required: true,
    },
    verdict: {
      type: String,
      default: Verdict[Verdict.PENDING],
      // enum: enumToArray(Verdict)
    },
    time: {
      type: Number,
      default: null,
    },
    languageID: {
      type: Number,
      required: true,
    },
    memory: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

submissionSchema.plugin(mongoosePaginate);

export const Submission = mongoose.model(
  'Submission',
  submissionSchema,
) as PaginateModel<ISubmission>;

// prettier-ignore
export function validateSubmission(submission: {}): Joi.ValidationResult {
  const schema = Joi.object({
    user: Joi.any(),
    problem: Joi.string().required().min(1),
    contest: Joi.string().min(1),
    languageID: Joi.number().required().min(1),
    sourceCode: Joi.string().required().min(1)
  });
  return schema.validate(submission);
}
