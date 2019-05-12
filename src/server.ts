import { Server } from 'http';
import clrs from 'colors';
import express from 'express';
import helmet from 'helmet';

import signin from './routes/signin';
import signup from './routes/signup';
import problems from './routes/problems';
import contests from './routes/contests';
import submissions from './routes/submissions';
import verify from './routes/verify';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Routes
app.use('/signin', signin);
app.use('/signup', signup);
app.use('/problems', problems);
app.use('/contests', contests);
app.use('/submissions', submissions);
app.use('/verify', verify);

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res) {
  res.status(404).json({ message: 'Are you lost?!' });
});

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
