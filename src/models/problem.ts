import mongoose from 'mongoose';
import Joi from '@hapi/joi';
import { enumToArray } from '../utils/enumToArray';
import mongoosePaginate from 'mongoose-paginate-v2';

export enum JudgeType {
  LOCAL,
  JUDGE0,
  CODEFORCES,
}

type JudgeName = 'LOCAL' | 'JUDGE0' | 'CODEFORCES';
export interface IProblem extends mongoose.Document {
  description: {
    title: string;
    statement: string;
    inputSpecification: string;
    outputSpecification: string;
    samples: [{ in: string, out: string }];
    timeLimit: number;
    memoryLimit: number;
    note: string;
  };
  judge: {
    type: JudgeName;
    tests?: [{ in: string, out: string }],
    cfID?: string;
  }
}

const testCaseSchema = new mongoose.Schema({
  in: String,
  out: String
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
    inputSpecification: { required: true, type: String },
    outputSpecification: { required: true, type: String },
    samples: { required: true, type: [testCaseSchema] },
    timeLimit: { required: true, type: Number },
    memoryLimit: { required: true, type: Number },
    note: { required: true, type: String }
  },
  judge: judgeSchema
});

problemSchema.plugin(mongoosePaginate);

export const Problem = mongoose.model<IProblem>('Problem', problemSchema);

// prettier-ignore
export function validateProblem(problem: any): Joi.ValidationResult {
  const schema = Joi.object({
    description: Joi.object({
      title: Joi.string().required(),
      statement: Joi.string().required(),
      inputSpecification: Joi.string().required(),
      outputSpecification: Joi.string().required(),
      samples: Joi.string().required(),
      timeLimit: Joi.string().required(),
      memoryLimit: Joi.string().required(),
      note: Joi.string().required(),
    }), judge: Joi.object({
      type: Joi.string().allow(...enumToArray(JudgeType)).required(),
      tests: Joi.array().items(Joi.object({
        in: Joi.string().required(),
        out: Joi.string().required()
      })),
      cfID: Joi.string()
    })
  })
  return schema.validate(problem);
}
