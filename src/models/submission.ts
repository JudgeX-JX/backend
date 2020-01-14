import mongoose from 'mongoose';
import Joi from 'joi';
import mongoosePaginate from 'mongoose-paginate-v2';
import { enumToArray } from '../utils/enumToArray';

export enum Verdict {
  PENDING,
  ACCEPTED = 3,
  WRONG_ANSWER,
  TIME_LIMIT_EXCEEDED,
  COMPILATION_ERROR,
  RUNTIME_ERROR,
  MEMORY_LIMIT_EXCEEDED,
  JUDGE_ERROR = 13
}

export enum SubmissionStatus {
  DONE,
  JUDGING
}


const submissionSchema = new mongoose.Schema({
  contest: {
    type: mongoose.Types.ObjectId,
    ref: 'Contest',
    required: true
  },
  problem: {
    type: mongoose.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  isDuringContest: {
    type: Boolean,
    default: false
  },
  submissionStatus: {
    type: String,
    required: true,
    default: SubmissionStatus[SubmissionStatus.JUDGING],
    enum: enumToArray(SubmissionStatus),
  },
  scrapperSubmissionID: {
    type: Number
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sourceCode: {
    type: String,
    required: true
  },
  verdict: {
    type: String,
    default: Verdict[Verdict.PENDING],
    // enum: enumToArray(Verdict)
  },
  time: {
    type: String,
    default: null
  },
  languageID: {
    type: Number,
    required: true,
  },
  memory: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

submissionSchema.plugin(mongoosePaginate);

export const Submission = mongoose.model('Submission', submissionSchema);

// prettier-ignore
export function validateSubmission(submission: any) {
  const schema = {
    problem: Joi.string().required().min(1),
    contest: Joi.string().min(1),
    languageID: Joi.number().required().min(1),
    sourceCode: Joi.string().required().min(1)
  };
  return Joi.validate(submission, schema);
}
