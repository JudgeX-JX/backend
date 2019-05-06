import mongoose from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import config from 'config';
import { enumToArray } from '../utils/enumToArray';

export enum Roles {
  ADMIN,
  PROBLEM_SETTER,
  USER
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: Roles[Roles.USER],
    enum: [...enumToArray(Roles)]
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role: this.role }, config.get('jwtPrivateKey'));
  return token;
}

export const User = mongoose.model("User", userSchema);

export function validateUser(user: any) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(50).required().email(),
    password: Joi.string().min(6).max(50).required(),
  };

  return Joi.validate(user, schema);
}
