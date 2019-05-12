import exp from 'express';
import signin from './signin.route';
import signup from './signup.route';
import problems from './problems.route';
import contests from './contests.route';
import submissions from './submissions.route';
import verify from './verify.route';

const router = exp.Router();
router.use('/signin', signin);
router.use('/signup', signup);
router.use('/problems', problems);
router.use('/contests', contests);
router.use('/submissions', submissions);
router.use('/verify', verify);

// 404
router.all('*', function(req, res) {
  res.status(404).json({ message: '🤔 Are you lost ?!' });
});

export default router;
