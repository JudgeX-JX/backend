import { User} from '../../models/user';
import { Request, Response } from 'express';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import Joi from 'joi';

export async function signin(req: Request, res: Response) {
    const { error } = validateSignin(req.body);

    if (error)
        return res.status(422).json({
            message: error.details[0].message
        });

    const user: any = await User.findOne({
        email: req.body.email
    });

    if (!user)
        return res.status(401).json({
            message: 'Invalid email or password!'
        });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(401).json({
            message: 'Invalid email or password!'
        });

    res.json({
        token: user.generateAuthToken(),
        ..._.pick(user, ['name', 'email', 'role'])
    });
}
// prettier-ignore
function validateSignin(user: any) {
    const schema = {
        email: Joi.string().email().required().min(3).max(50),
        password: Joi.string().required().min(6).max(50)
    };
    return Joi.validate(user, schema);
}
