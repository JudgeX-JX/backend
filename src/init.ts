import {User, Roles} from './models/user';
import bcrypt from 'bcryptjs';

export default async (): Promise<void> => {
  // In a separate variable because findOne doesn't need password
  const password = process.env.ADMIN_PASSWORD || '';

  const admin = {
    name: 'admin',
    email: process.env.ADMIN_EMAIL || '',
    role: Roles[Roles.ADMIN],
    fromInit: true,
  };

  const user = await User.findOne(admin);

  if (user) {
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error("Found existing Admin but did't match password!");
    }
  } else {
    await new User({...admin, password}).save();
  }
};
