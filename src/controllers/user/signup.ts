import { User, validateUser } from '../../models/user';
import { Request, Response } from 'express';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import colors from 'colors/safe';


export async function signup(req: Request, res: Response) {
    const { error } = validateUser(req.body);

    if (error)
        return res.status(422).json({
            message: error.details[0].message
        });

    if (await User.findOne({ email: req.body.email }))
        return res.status(422).json({
            message: 'This email already exists!'
        });

    const user: any = new User(_.pick(req.body, ['name', 'email', 'password']));

    user.generateEmailVerificationToken();

    sendVerificationEmail(
        user.verificationToken,
        user.email,
        req.headers.host
    ).catch(err => {
        console.log(colors.bgRed(`Email was NOT sent to ${user.email}!, ${err}`));
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.save();

    res.json({
        token: user.generateAuthToken(),
        ..._.pick(user, ['name', 'email', 'role'])
    });
}

function sendVerificationEmail(
    verificationToken: string,
    recieverEmail: string,
    host: string | undefined
) {
    const sender: { email: string; password: string } = {
        email: process.env.EMAIL || '',
        password: process.env.EMAIL_PASSWORD || ''
    };

    if (!sender.email || !sender.password) {
        console.log(colors.yellow('Undefined Email | password'));
    }

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: sender.email,
            pass: sender.password
        }
    });

    const verfificationLink =
        'http://' + host + '/verify/' + verificationToken + '';

    return transporter.sendMail({
        from: `"CodeCoursez" <${sender.email}>`, // sender address
        to: recieverEmail,
        subject: 'Verify Your Email', // Subject
        html:
            "Please use the following link to verify your Email: <a href='" +
            verfificationLink +
            "'>here</a>."
    });
}

