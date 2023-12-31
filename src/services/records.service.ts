import { ModelType } from '../data/models/record.model';
import { xmlToJson } from '../utils/xml-to-json.util';
import { xmlToRecord } from '../utils/xml-json-to-record.util';
import { csvToRecord } from '../utils/csv-to-record.util';

const DUPLICATE_RECORD_NOTE = 'Duplicate record';
const WRONG_BALANCE_NOTE = 'End balance does not match calculated end balance';


export const readRecordsFile = async (recordsFile: Express.Multer.File) => {
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

  return records;
};

export const processRecordsFiles = async (
  files:
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | Express.Multer.File[],
): Promise<ModelType[]> => {
  const uploadedFiles = Array.isArray(files) ? files : Object.values(files);

  let records: ModelType[] = [];

  for (const fileOrArray of uploadedFiles) {
    const file = Array.isArray(fileOrArray) ? fileOrArray[0] : fileOrArray;

    const fileRecords = await readRecordsFile(file);
    records.push(...fileRecords);
  }

  return processRecords(records);
};
 
const processRecords = (records: ModelType[]) => {
  const processedRecords: ModelType[] = [];

  for (const record of records) {
    const { startBalance, mutation, endBalance, reference } = record;
    const calculatedEndBalance = parseFloat(
      (startBalance + mutation).toFixed(2)
      );
      
    const duplicateRecordIndex = processedRecords?.findIndex(
      (_record) => _record.reference === reference
    );
    const recordReferenceExists = duplicateRecordIndex !== -1;

    let validationNotes: string | undefined;
    let isValid = true;

    if (recordReferenceExists) {
      isValid = false;
      validationNotes = DUPLICATE_RECORD_NOTE;
      processedRecords[duplicateRecordIndex].validationNotes = DUPLICATE_RECORD_NOTE;
      processedRecords[duplicateRecordIndex].isValid = false;
    } else if (calculatedEndBalance !== endBalance) {
      isValid = false;
      validationNotes = WRONG_BALANCE_NOTE;
    }
    
    processedRecords.push({
      ...record,
      isValid,
      validationNotes,
    });
  }

  return processedRecords;
};