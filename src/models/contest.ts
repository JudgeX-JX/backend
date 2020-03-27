import mongoose, { PaginateModel } from 'mongoose';
import Joi from '@hapi/joi';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Problem } from './problem';

export interface IContest extends mongoose.Document {
  name: string;
  setter: string;
  problems: [string];
  registeredUsers: [string];
  startDate: Date;
  duration: number;
  password?: string;
}

const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  setter: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  problems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    }
  ],
  registeredUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  startDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true // number of minutes the contest will last
  },
  password: {
    type: String,
    // no password by default (the contest is general i.e: available for all the users)
  }
});

contestSchema.plugin(mongoosePaginate);

export const Contest = mongoose.model('Contest', contestSchema) as PaginateModel<IContest>;

export async function validProblemIDs(problems: string[]): Promise<boolean> {
  try {
    return await Problem.exists({
      // TODO WARNING remove never when $all problem is fixed
      _id: { $all: problems as never }
    });
  } catch (err) {
    console.log(err);
    return false;
  }
}

// prettier-ignore
export function validateContest(contest: {}): Joi.ValidationResult {
  const schema = Joi.object({
    name: Joi.string().required().min(1).max(50),
    problems: Joi.array().required().min(1).items(Joi.string()),
    startDate: Joi.date().required().min(Date.now()),
    duration: Joi.number().required().min(1),
    password: Joi.string().min(1).allow(null)
  })
  return schema.validate(contest);
}
