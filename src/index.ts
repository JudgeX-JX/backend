import express from 'express';
import helmet from 'helmet';
import signin from './routes/signin';
import signup from './routes/signup';
import problems from './routes/problems';
import contests from './routes/contests';
import submissions from './routes/submissions';
import { connectToMongo } from './utils/connectToMongo';

connectToMongo();

const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());

// Routes
app.use('/signin', signin);
app.use('/signup', signup);
app.use('/problems', problems);
app.use('/contests', contests);
app.use('/submissions', submissions);

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
  res.status(404).json({ message: 'Are you lost?!' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('listening on port ' + port);
});


