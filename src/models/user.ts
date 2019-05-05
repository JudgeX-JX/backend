import mongoose from 'mongoose';
import Joi, { func } from 'joi';
import jwt from 'jsonwebtoken';
import config from 'config';

export enum roles {
  ADMIN = "ADMIN",
  PROBLEM_SETTER = "PROBLEM_SETTER",
  USER = "USER"
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
    type: roles,
    default: roles.USER
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
  return token;
}

export function validateUser(user: any) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(50).required().email(),
    password: Joi.string().min(6).max(50).required(),
  };

  return Joi.validate(user, schema);
}

export const User = mongoose.model("User", userSchema);
