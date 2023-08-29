import { Request, Response } from 'express';
import { processRecordsFile, processRecordsFiles } from '../services/records.service';
import { validateFileExtensions } from '../utils/validate-file-extensions.util';

export const processRecordsController = async (req: Request, res: Response) => {
  try {
    const files = req.files;
    if (!files || !files.length) {
      return res
        .status(400)
        .json({ success: false, error: 'file is required' });
    }

    const supportedFileExtensions = ['csv', 'xml'];
    try {
      validateFileExtensions(files, supportedFileExtensions);
    } catch {
      return res.status(400).json({
        success: false,
        error: `Supported file extensions are ${supportedFileExtensions.join(
          ', '
        )}`,
      });
    }
  
    const records = await processRecordsFiles(files);
    res.status(200).json({ success: true, records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'CSV processing failed' });
  }
};
