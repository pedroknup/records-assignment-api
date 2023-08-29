import { parseStringPromise } from 'xml2js';

export const xmlToJson = async (xmlFile: Express.Multer.File): Promise<any | null> => {
  try {
    const buffer = xmlFile.buffer;

    const xmlObject = await parseStringPromise(buffer.toString('utf-8'));

    return xmlObject;
  } catch (error) {
    console.error('Error converting XML to JSON:', error);
    return null;
  }
};
