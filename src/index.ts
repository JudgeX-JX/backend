import clrs from 'colors';
import * as config from './config';
import * as database from './database';
import * as server from './server';
import adminInit from './adminInit';

config.check();
database
  .connect()
  .then(adminInit)
  .then(server.run)
  .then(() => console.info(clrs.green('Enjoy!')))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
