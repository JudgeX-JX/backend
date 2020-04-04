import clrs from 'colors';
import * as config from './config';
import * as database from './database';
import * as server from './server';
import adminInit from './adminInit';
import judgedSubmissionConsumer from './lib/submission-consumers/judged';

config.check();
database
  .connect()
  .then(adminInit)
  .then(judgedSubmissionConsumer)
  .then(server.run)
  .then(() => console.info(clrs.green('Enjoy!')))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
