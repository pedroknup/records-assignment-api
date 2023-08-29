import { Request, Response } from 'express';
import { processRecordsFile } from '../services/records.service';

export const processRecordsController = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, error: 'CSV file is required' });
    }

    const fileExtension = file.originalname.split('.').pop();
    const supportedFileExtensions = ['csv', 'xml'];
    if (!fileExtension || !supportedFileExtensions.includes(fileExtension)) {
      return res.status(400).json({
        success: false,
        error: `File extension ${fileExtension} is not supported`,
      });
    }

    const records = await processRecordsFile(file);
    res.status(200).json({ success: true, records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'CSV processing failed' });
  }
};