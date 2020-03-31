import mongoose from 'mongoose';
import Joi from '@hapi/joi';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {enumToArray} from '../utils/enumToArray';
import {IDecodedToken} from '../middlewares';
import bcrypt from 'bcryptjs';

export enum Roles {
  ADMIN,
  PROBLEM_SETTER,
  USER,
}

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  verificationToken: string;
  generateEmailVerificationToken(): void;
  generateAuthToken(): string;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: Roles[Roles.USER],
    enum: enumToArray(Roles),
  },
  isVerified: {
    required: true,
    type: Boolean,
    default: false,
  },
  verificationToken: {
    // required: true,
    type: String,
  },
  fromInit: {
    // only for users created on server init
    type: Boolean,
  },
});

userSchema.methods.generateEmailVerificationToken = function (): string {
  this.verificationToken = crypto.randomBytes(16).toString('hex');
  return this.verificationToken;
};

userSchema.methods.generateAuthToken = function (): string {
  const token: IDecodedToken = {
    role: this.role,
    _id: this._id,
  };
  return jwt.sign(token, process.env.JWT_SECRET_KEY || '');
};

userSchema.methods.toJSON = function (): IUser {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.pre('save', async function (this: IUser, next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);

// prettier-ignore
export function validateUser(user: {}): Joi.ValidationResult {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(50).required().email(),
    password: Joi.string().min(6).max(50).required()
  });

  return schema.validate(user);
}
