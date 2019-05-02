import express from 'express';
import { User, validateUser } from '../models/user';
import _ from 'lodash';
import bcrypt from 'bcryptjs';


const router = express.Router();

router.post('/', async (req, res) => {
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

  const user: any = new User(_.pick(req.body, ['name', 'email', 'password', 'role']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.save();

  res
    .header('x-auth-token', user.generateAuthToken())
    .json(_.pick(user, ['name', 'email', 'role']));
});

export default router;
