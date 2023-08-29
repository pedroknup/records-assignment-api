import { ModelType } from '../data/models/record.model';
import { xmlToJson } from '../utils/xml-to-json.util';
import { xmlToRecord } from '../utils/xml-json-to-record.util';
import { csvToRecord } from '../utils/csv-to-record.util';

export const processRecordsFile = async (recordsFile: Express.Multer.File, previouslyProcessedRecords?: ModelType[] ) => {
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

  return processRecords(records, previouslyProcessedRecords);
};

export const processRecordsFiles = async (
  files:
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | Express.Multer.File[],
  previouslyProcessedRecords?: ModelType[]
): Promise<ModelType[]> => {
  const uploadedFiles = Array.isArray(files) ? files : Object.values(files);

  let processedRecords: ModelType[] = [];

  for (const fileOrArray of uploadedFiles) {
    const file = Array.isArray(fileOrArray) ? fileOrArray[0] : fileOrArray;

    const _processedRecords = await processRecordsFile(file, [
      ...processedRecords,
      ...(previouslyProcessedRecords || []),
    ]);
    processedRecords.push(..._processedRecords);
  }

  return processedRecords;
};
 
const processRecords = (records: ModelType[], previouslyProcessedRecords?: ModelType[]) => {
  const processedRecords: ModelType[] = [];

  for (const record of records) {
    const { startBalance, mutation, endBalance } = record;
    const calculatedEndBalance = parseFloat(
      (startBalance + mutation).toFixed(2)
    );

    const existingRecord = [...(previouslyProcessedRecords || []), ...processedRecords].find((_record) => {
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