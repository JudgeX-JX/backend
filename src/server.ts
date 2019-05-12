import { Server } from 'http';
import clrs from 'colors';
import express from 'express';
import helmet from 'helmet';
import routes from './routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(routes);

export async function run() {
  return new Promise<Server>((resolve, reject) => {
    const port = process.env.PORT || 5000;
    const server = app.listen(port);

    server.once('listening', () => {
      console.info(
        clrs.green(`🤟 Server is listening at port ${clrs.yellow(port + '')}`)
      );
      resolve(server);
    });

    server.once('error', err => {
      console.error(
        clrs.red(`🤔 Server failed to listen at ${clrs.yellow(port + '')}`)
      );
      reject(err);
    });
  });
}
