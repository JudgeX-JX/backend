import express from 'express';
import * as standingController from '../controllers/standing';

const router = express.Router();

router.get('/', standingController.getAll);

export default router;
