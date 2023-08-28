import { ModelType } from "../data/models/record.model";

export const processRecords = (records: ModelType[]) => {
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

    if (existingRecord) {
      validationNotes = 'Duplicate record';
    } else if (calculatedEndBalance !== endBalance) {
      validationNotes =
        'End balance does not match calculated end balance';
    }

    processedRecords.push({
      ...record,
      validationNotes,
    });
  }

  return processedRecords;
};

export const readRecords = (csvFile: string): ModelType[] => {
  const records: ModelType[] = [];
  const lines = csvFile.split('\n');

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const columns = line.split(',');
    const record: ModelType = {
      id: parseInt(columns[0]),
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
