import express from 'express';
import * as submissionController from '../controllers/submission';
import { authenticate } from '../middlewares/authentication';
import { authorize } from '../middlewares/authorization';
import { Roles } from '../models/user';

const router = express.Router();

router.get('/', submissionController.getAll);
// router.get('/:id', submissionController.getWithId);

router.use(authenticate);
router.get('/my', submissionController.getMySubmissions);

router.use(authorize([Roles.ADMIN]));
// router.put('/:id', submissionController.updateWithId);
// router.delete('/:id', submissionController.deleteWithId);

export default router;
