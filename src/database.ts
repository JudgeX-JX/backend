import clrs from 'colors';
import mongoose from 'mongoose';

export async function connect(): Promise<void> {
  const mongoURL = process.env.MONGODB_URL;
  if (!mongoURL) {
    const errMsg = clrs.red(
      `${clrs.yellow('MONGODB_URL')} environment variable was not set`,
    );
    throw new Error(errMsg);
  }

  try {
    await mongoose.connect(mongoURL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.info(
      clrs.green(`Successfully connected to ${clrs.yellow(mongoURL)}`),
    );
  } catch (err) {
    console.error(clrs.red(`Failed to connect to ${clrs.yellow(mongoURL)}`));
    throw err;
  }
}
