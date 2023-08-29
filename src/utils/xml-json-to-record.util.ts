import { ModelType } from "../data/models/record.model";

export const xmlToRecord = (xmlData: any[]): ModelType[] => {
  return xmlData.map((record: any) => {
    const reference = parseInt(record.$.reference);
    const accountNumber = record.accountNumber[0];
    const description = record.description[0];
    const startBalance = parseFloat(record.startBalance[0]);
    const mutation = parseFloat(record.mutation[0]);
    const endBalance = parseFloat(record.endBalance[0]);

    return {
      reference,
      accountNumber,
      description,
      startBalance,
      mutation,
      endBalance,
    };
  });
};
