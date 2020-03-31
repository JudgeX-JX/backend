import {User, Roles} from './models/user';
import {blue, red} from 'colors/safe';

export default async (): Promise<void> => {
  const password = process.env.ADMIN_PASSWORD || 'admin@admin';

  let user = await User.findOne({
    email: 'admin@admin.com',
    fromInit: true,
  });

  if (!user) {
    user = new User({
      name: 'admin',
      email: 'admin@admin.com',
      password,
      role: Roles[Roles.ADMIN],
      fromInit: true,
    });
    await user.save();
  }
  console.log(red('--- Created ADMIN ---'));
  console.log(blue(`${user.email}\n${password}`));
  console.log(red('---------------------'));
};
