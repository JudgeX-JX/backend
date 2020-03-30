import {User, Roles} from './models/user';
import {blue, red} from 'colors/safe';

export default async (): Promise<void> => {
  let user = await User.findOne({
    fromInit: true,
  });

  const generateRandomPassword = (): string =>
    Math.random()
      .toString(36)
      .slice(-8);

  if (!user) {
    user = new User({
      name: 'admin',
      email: 'admin@admin.com',
      password: generateRandomPassword(),
      role: Roles[Roles.ADMIN],
      fromInit: true,
    });
    await user.save();
  }
  console.log(red('--- Created ADMIN ---'));
  console.log(blue(`${user.email}\n${user.password}`));
  console.log(red('---------------------'));
};
