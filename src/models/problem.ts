import mongoose from "mongoose";
import Joi from "joi";
import { enumToArray } from '../utils/enumToArray';

export enum Difficulty {
  EASY,
  MEDIUM,
  HARD
}

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  setter: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  description: {
    type: String,
    required: true
  },
  inputs: {
    type: [String],
    required: true
  },
  outputs: {
    type: [String],
    required: true
  },
  timeLimit: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  memoryLimit: {
    type: Number,
    required: true,
    min: 5,
    max: 500
  },
  tags: {
    type: [String]
  },
  difficulty: {
    type: String,
    required: true,
    enum: [...enumToArray(Difficulty)]
  },

});

export const Problem = mongoose.model("Problem", problemSchema);

export function validateProblem(problem: any) {
  const schema = {
    name: Joi.string().required().min(1).max(50),
    setter: Joi.string().required().min(1),
    description: Joi.string().required().min(10),
    inputs: Joi.array().required(),
    outputs: Joi.array().required().length(problem.inputs.length),
    timeLimit: Joi.number().required().min(1).max(10),
    memoryLimit: Joi.number().required().min(5).max(500),
    tags: Joi.array(),
    difficulty: Joi.string().required().valid([...enumToArray(Difficulty)]),
  };
  return Joi.validate(problem, schema);
}
