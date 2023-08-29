import { ModelType } from "../data/models/record.model";
import { csvToString } from "./csv-to-string.util";

export const csvToRecord = async (csvFile: Express.Multer.File): Promise<ModelType[]> => {
  const csvString = await csvToString(csvFile);
  const records: ModelType[] = [];
  const lines = csvString.trim().split('\n');

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const columns = line.split(',');
    const record: ModelType = {
      reference: parseInt(columns[0]),
      accountNumber: columns[1],
      description: columns[2],
      startBalance: parseFloat(columns[3]),
      mutation: parseFloat(columns[4]),
      endBalance: parseFloat(columns[5]),
    };
    records.push(record);
  }

  return records;
};
