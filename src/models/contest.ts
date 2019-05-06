import mongoose from "mongoose";
import Joi from "joi";
import mongoosePaginate from 'mongoose-paginate-v2';

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
    ref: "User"
  },
  problems: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "Problem"
  },
  registeredUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "User"
  },
  startDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true // number of minutes the contest will last
  },
  password: {
    type: String,
    default: null // no password by default (the contest is general i.e: available for all the users)
  }
});

contestSchema.plugin(mongoosePaginate);

export const Contest = mongoose.model("Contest", contestSchema);

export function validateContest(contest: any){
  const schma = {
    name: Joi.string().required().min(1).max(50),
    setter: Joi.string().required().min(1),
    problems: Joi.array().required().min(1).items(Joi.string()),
    registeredUsers: Joi.array().required().min(1).items(Joi.string()),
    startDate: Joi.date().required().min(Date.now()),
    duration: Joi.number().required().min(1),
    password: Joi.string().min(1)
  }
}

