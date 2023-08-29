import { ModelType } from '../data/models/record.model';
import { xmlToJson } from '../utils/xml-to-json.util';
import { xmlToRecord } from '../utils/xml-json-to-record.util';
import { csvToRecord } from '../utils/csv-to-record.util';

export const processRecordsFile = async (recordsFile: Express.Multer.File) => {
  const fileExtension = recordsFile.originalname.split('.').pop();

  let records: ModelType[] = [];
  switch (fileExtension) {
    case 'csv':
      records = await csvToRecord(recordsFile);
      break;
    case 'xml':
      const xmlFileJson = await xmlToJson(recordsFile);
      records = xmlToRecord(xmlFileJson.records.record);
      break;
    default:
      throw new Error('File extension not supported');
  }

  return processRecords(records);
};

const processRecords = (records: ModelType[]) => {
  const processedRecords: ModelType[] = [];

  for (const record of records) {
    const { startBalance, mutation, endBalance } = record;
    const calculatedEndBalance = parseFloat(
      (startBalance + mutation).toFixed(2)
    );

    const existingRecord = processedRecords.find((_record) => {
      return _record.accountNumber === record.accountNumber;
    });

    let validationNotes: string | undefined;

    let isValid = true;

    if (existingRecord) {
      isValid = false;
      validationNotes = 'Duplicate record';
    } else if (calculatedEndBalance !== endBalance) {
      isValid = false;
      validationNotes = 'End balance does not match calculated end balance';
    }

    processedRecords.push({
      ...record,
      isValid,
      validationNotes,
    });
  }

  return processedRecords;
};