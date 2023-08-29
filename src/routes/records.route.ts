import express from 'express';
import multer from 'multer';
import { processRecordsController } from '../controllers/records.controller';

const router = express.Router();

const storage = multer.memoryStorage();
export const upload = multer({ storage });


router.post(
  '/process-records',
  upload.array('file', 10),
  processRecordsController
);

export default router;
