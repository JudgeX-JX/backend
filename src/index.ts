import clrs from 'colors';
import * as config from './config';
import * as database from './database';
import * as server from './server';

config.check()
database.connect()
  .then(server.run)
  .then(() => console.info(clrs.green('🕹 Enjoy judging!')))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

