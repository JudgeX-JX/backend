import express from 'express';
import * as contestController from '../controllers/contest';
import * as submissionController from '../controllers/submission';
import {authenticate} from '../middlewares/authentication';
import {authorize} from '../middlewares/authorization';

import {Roles} from '../models/user';

const router = express.Router();

router.get('/', contestController.getAll);
router.get('/:id', contestController.getWithId);

router.use(authenticate);

router.post('/:contestID/submit/:problemID', submissionController.create);

router.use(authorize([Roles.ADMIN]));

router.post('/', contestController.create);
router.put('/:id', contestController.updateWithId);
router.delete('/:id', contestController.deleteWithId);

export default router;
