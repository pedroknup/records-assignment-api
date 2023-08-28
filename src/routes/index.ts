import express from 'express';
import recordsRoute from './records.route'; // Adjust the import paths based on your project structure

const router = express.Router();

router.use('/records', recordsRoute);

export default router;
