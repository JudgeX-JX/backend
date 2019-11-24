import mongoose from 'mongoose';
import Joi from 'joi';
import { enumToArray } from '../utils/enumToArray';
import mongoosePaginate from 'mongoose-paginate-v2';

export enum Difficulty {
  EASY,
  MEDIUM,
  HARD
}

export enum ProblemType {
  CODEFORCES,
  LOCAL
}

const problemSchema = new mongoose.Schema({
  // letter,
  // title,
  // color,
  // timeLimit,
  // memoryLimit,
  // input,
  // output,
  // statment
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  ballonColor: {
    type: String,
    // required: true,
  },
  constest: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: 'Contest'
  },
  problemType: {
    type: String,
    enum: enumToArray(ProblemType),
    required: true,
  },
  setter: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: 'User'
  },
  statement: { // problem statement
    type: String,
    required: true
  },
  noteStatment: {
    type: String,
    // required: true
  },
  sampleInputs: {
    type: [String],
    // required: true
  },
  sampleOutputs: {
    type: [String],
    // required: true
  },
  inputStatment: {
    type: String,
  },
  outputStatment: {
    type: String,
  },
  codeforcesContestID: {
    type: String,
  },
  codeforcesProblemLetter: {
    type: String,
  },

  timeLimit: {
    type: Number,
    // required: true,
    min: 1,
    max: 10
  },
  memoryLimit: {
    type: Number,
    // required: true,
    min: 5,
    max: 500
  },
  tags: {
    type: [String]
  },
  difficulty: {
    type: String,
    // required: true,
    enum: enumToArray(Difficulty)
  }
});

problemSchema.plugin(mongoosePaginate);

export const Problem = mongoose.model('Problem', problemSchema);

// prettier-ignore
export function validateProblem(problem: any) {
  // console.log(problem)
  const schema = {
    title: Joi.string().min(1).max(50),
    ballonColor: Joi.string(),
    statement: Joi.string().min(10),
    sampleInputs: Joi.array(),
    sampleOutputs: Joi.array().length(problem.sampleInputs.length),
    timeLimit: Joi.number().min(1).max(10),
    memoryLimit: Joi.number().min(5).max(500),
    tags: Joi.array(),
    difficulty: Joi.string().valid(enumToArray(Difficulty))
  };
  return Joi.validate(problem, schema);
  // return false;
}
