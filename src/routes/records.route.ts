import express from 'express';
import { processRecordsController } from '../controllers/records.controller';

const router = express.Router();

router.post('/process-records', processRecordsController);

export default router;
