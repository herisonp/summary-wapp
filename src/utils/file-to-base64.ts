import { readFile } from "fs/promises";

export const fileToBase64 = async (filePath: string) => {
  try {
    const fileBuffer = await readFile(filePath);
    return fileBuffer.toString("base64");
  } catch (error) {
    const err = error as Error;
    console.log(err);
    throw new Error(`Erro ao converter o arquivo para Base64: ${err.message}`);
  }
};
