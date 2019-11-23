import express from 'express';
import * as contestController from '../controllers/contest';
import { authenticate } from '../middlewares/authentication';
import { authorize } from '../middlewares/authorization';
import { Roles } from '../models/user';

const router = express.Router();

router.get('/', contestController.getAll);
router.get('/:id', contestController.getWithId);

router.use(authenticate);
router.use(authorize([Roles.ADMIN]));

router.post('/', contestController.create);
router.put('/:id', contestController.updateWithId);
router.delete('/:id', contestController.deleteWithId);

export default router;
