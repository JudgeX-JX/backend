import { User, validateUser } from "../models/user";
import { Request, Response } from 'express';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import nodemailer from 'nodemailer';
import config from 'config';
import colors from 'colors/safe';


export async function signin(req: Request, res: Response) {
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

export async function signup(req: Request, res: Response) {
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

  user.generateEmailVerificationToken();

  sendVerificationEmail(user.verificationToken, user.email, req.headers.host)
    .catch((err) => {
      console.log(colors.bgRed(`Email was NOT sent to ${user.email}!, ${err}`))
    });


  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.save();

  res
    .header('x-auth-token', user.generateAuthToken())
    .json(_.pick(user, ['name', 'email', 'role']));
}


function sendVerificationEmail(verificationToken: string, recieverEmail: string, host: string | undefined) {
  const sender: { email: string, password: string } = {
    email: config.get('mail.mail'),
    password: config.get('mail.password')
  };

  if (!sender.email || !sender.password) {
    console.log(colors.yellow("Undefined Email | password"))
  }

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: sender.email,
      pass: sender.password
    }
  });

  const verfificationLink = 'http:\/\/' + host + '\/verify\/' + verificationToken + '';

  return transporter.sendMail({
    from: `"CodeCoursez" <${sender.email}>`, // sender address
    to: recieverEmail,
    subject: "Verify Your Email", // Subject
    html: "Please use the following link to verify your Email: <a href='" + verfificationLink + "'>here</a>.",
  });


}

function validateSignin(user: any) {
  const schema = {
    email: Joi.string().email().required().min(3).max(50),
    password: Joi.string().required().min(6).max(50)
  };
  return Joi.validate(user, schema);
}

