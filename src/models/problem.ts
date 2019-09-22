import mongoose from 'mongoose';
import Joi from '@hapi/joi';
import { enumToArray } from '../utils/enumToArray';
import mongoosePaginate from 'mongoose-paginate-v2';

export enum JudgeType {
  LOCAL,
  JUDGE0,
  CODEFORCES,
}

export interface IProblem extends mongoose.Document {
  description: {
    title: string;
    statement: string;
    inputConstraints: string;
    outputConstraints: string;
    samples: [{ in: string, out: string }];
    timeLimit: string;
    memoryLimit: string;
    notes: string;
  };
  judge: {
    type: string;
    tests?: [{ in: string, out: string }],
    cfID?: string;
  }
}

const testCaseSchema = new mongoose.Schema({
  input: String,
  output: String
}, { _id: false });

const judgeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: enumToArray(JudgeType),
    required: true,
  },
  tests: testCaseSchema,
  cfID: String,
}, { _id: false })

const problemSchema = new mongoose.Schema({
  description: {
    title: { required: true, type: String },
    statement: { required: true, type: String },
    inputConstraints: { required: true, type: String },
    outputConstraints: { required: true, type: String },
    samples: { required: true, type: [testCaseSchema] },
    timeLimit: { required: true, type: Number },
    memoryLimit: { required: true, type: Number },
    notes: { required: true, type: String }
  },
  judge: judgeSchema
});

problemSchema.plugin(mongoosePaginate);

export const Problem = mongoose.model<IProblem>('Problem', problemSchema);

// prettier-ignore
export function validateProblem(problem: any): Joi.ValidationResult {
  const schema = Joi.object({
  })
  return schema.validate(problem);
}
