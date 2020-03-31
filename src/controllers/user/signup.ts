import {User, validateUser} from '../../models/user';
import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import colors from 'colors/safe';
import APIResponse from '../../utils/APIResponse';

export async function signup(req: Request, res: Response): Promise<Response> {
  const {error} = validateUser(req.body);

  if (error) {
    return APIResponse.UnprocessableEntity(res, error.details[0].message);
  }

  if (await User.findOne({email: req.body.email})) {
    return APIResponse.UnprocessableEntity(res, 'This email already exists!');
  }

  const user = new User(req.body);

  if (process.env.EMAIL_VERIFICATION?.toLowerCase() === 'true') {
    user.generateEmailVerificationToken();

    sendVerificationEmail(
      user.verificationToken,
      user.email,
      req.headers.host || '',
    );
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.save();

  return APIResponse.Ok(res, {
    token: user.generateAuthToken(),
    user,
  });
}

async function sendVerificationEmail(
  verificationToken: string,
  recieverEmail: string,
  host: string,
): Promise<void> {
  const sender: {email: string; password: string} = {
    email: process.env.EMAIL || '',
    password: process.env.EMAIL_PASSWORD || '',
  };

  if (!sender.email || !sender.password) {
    console.log(colors.yellow('Undefined Email | password'));
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: sender.email,
      pass: sender.password,
    },
  });

  const verfificationLink =
    'http://' + host + '/verify/' + verificationToken + '';

  await transporter.sendMail({
    from: `"CodeCoursez" <${sender.email}>`, // sender address
    to: recieverEmail,
    subject: 'Verify Your Email', // Subject
    html:
      "Please use the following link to verify your Email: <a href='" +
      verfificationLink +
      "'>here</a>.",
  });
}
