import express from 'express';
import * as problemController from '../controllers/problemController';
import { authenticate } from '../middlewares/authentication';
import { authorize } from '../middlewares/authorization';
import { Roles } from '../models/user';

const router = express.Router();

router.get('/', problemController.getAll);
router.get('/:id', problemController.getWithId);

router.use(authenticate);
router.use(authorize([Roles.PROBLEM_SETTER, Roles.ADMIN]));

router.post('/', problemController.create);
router.put('/:id', problemController.updateWithId);
router.delete('/:id', problemController.deleteWithId);

export default router;
