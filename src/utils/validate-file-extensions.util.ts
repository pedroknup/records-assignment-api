export const validateFileExtensions = (
  files:
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | Express.Multer.File[],
  supportedFiles: string[]
) => {
   const uploadedFiles = Array.isArray(files) ? files : Object.values(files);
   const unsupportedFiles = uploadedFiles
     .flatMap((fileArray) => fileArray)
     .map((file) => file.originalname.split('.').pop() || '')
     .filter((fileName) => !supportedFiles.includes(fileName));

   if (unsupportedFiles.length) {
     throw new Error(
       `Unsupported file type(s): ${unsupportedFiles.join(', ')}`
     );
   }
};