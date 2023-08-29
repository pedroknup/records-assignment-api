import { Readable } from 'stream';

export const csvToString = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);

    const chunks: any[] = [];

    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      const fileContent = Buffer.concat(chunks).toString('utf-8');
      resolve(fileContent);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
};
