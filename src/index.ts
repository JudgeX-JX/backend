import express from 'express';
import helmet from 'helmet';
import config from 'config';
import mongoose from 'mongoose';
import signin from './routes/signin';
import signup from './routes/signup';
import problems from './routes/problems';
import contests from "./routes/contests";

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

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
  res.status(404).json({ message: 'Are you lost?!' });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('listening on port ' + port);
});


function connectToMongo() {
  const mongoUrl: string = config.get('mongoUrl');

  if (!mongoUrl) {
    process.exit(1);
    console.log('codecoursez_mongoUrl is not defined');
  }

  mongoose
    .connect(mongoUrl)
    .then(() => console.log("connected to " + mongoUrl))
    .catch(err => console.log("Error: ", err));

}
