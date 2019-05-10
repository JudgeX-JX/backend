import mongoose from 'mongoose';
import Joi from 'joi';
import { enumToArray } from '../utils/enumToArray';
import mongoosePaginate from 'mongoose-paginate-v2';

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

const submissionSchema = new mongoose.Schema({
  problem: {
    type: mongoose.Types.ObjectId,
    ref: 'Problem',
    required: true
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
    enum: [...enumToArray(Verdict)]
  },
  time: {
    type: Date,
    default: Date.now
  },
  executionTime: {
    type: Number,
    default: null
  },
  memory: {
    type: Number,
    default: null
  }
});

submissionSchema.plugin(mongoosePaginate);

export const Submission = mongoose.model('Submission', submissionSchema);

// prettier-ignore
export function validateSubmission(submission: any) {
  const schema = {
    problem: Joi.string().required().min(1),
    sourceCode: Joi.string().required().min(1)
  };
  return Joi.validate(submission, schema);
}
