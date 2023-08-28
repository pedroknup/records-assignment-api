import { processRecords, readRecords } from "../services/records.service";
import { Request, Response } from 'express';

export const processRecordsController = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ success: false, error: 'CSV file is required' });
    }

    const csvFile: string = req.body;
    const mappedRecords = readRecords(csvFile);
    const records = processRecords(mappedRecords);

    res.status(200).json({ success: true, records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'CSV processing failed' });
  }
}