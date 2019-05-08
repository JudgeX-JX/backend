import config from 'config';
import mongoose from 'mongoose';

export function connectToMongo() {
  const mongoUrl: string = config.get('mongoUrl');

  if (!mongoUrl) {
    process.exit(1);
    console.log('codecoursez_mongoUrl is not defined');
  }

  mongoose
    .connect(mongoUrl, { useNewUrlParser: true })
    .then(() => console.log("connected to " + mongoUrl))
    .catch(err => console.log("Error: ", err));

}
