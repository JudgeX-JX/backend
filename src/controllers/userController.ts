import { User, validateUser } from "../models/user";
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import Joi from 'joi';


export async function signin(req: any, res: any) {
  const {
    error
  } = validateSignin(req.body);

  if (error) return res.status(422).json({
    message: error.details[0].message
  });

  const user: any = await User.findOne({
    email: req.body.email
  });

  if (!user) return res.status(401).json({
    message: "Invalid email or password!"
  });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(401).json({
    message: "Invalid email or password!"
  });

  res
    .header('x-auth-token', user.generateAuthToken())
    .json(_.pick(user, ['name', 'email', 'role']));

}

export async function signup(req: any, res: any) {
  const {
    error
  } = validateUser(req.body);

  if (error) return res.status(422).json({
    message: error.details[0].message
  });

  if (await User.findOne({ email: req.body.email }))
    return res.status(422).json({
      message: "This email already exists!"
    });

  const user: any = new User(_.pick(req.body, ['name', 'email', 'password']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.save();

  res
    .header('x-auth-token', user.generateAuthToken())
    .json(_.pick(user, ['name', 'email', 'role']));
}


function validateSignin(user: any) {
  const schema = {
    email: Joi.string().email().required().min(3).max(50),
    password: Joi.string().required().min(6).max(50)
  };
  return Joi.validate(user, schema);
}

