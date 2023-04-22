import fs from 'fs-extra';
import * as path from 'path';


// Remove any null values from the object
export const removeNullValues = (obj: Record<string, unknown>): void => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === null) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      removeNullValues(obj[key] as Record<string, unknown>);
    }
  });
};


export const scanDir = (directoryPath: string, filesList: string[] = []): string[] => {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isFile()) {
      filesList.push(path.relative(process.cwd(), filePath));
    } else if (fileStat.isDirectory() && file !== '.git') {
      console.log('file', file);
      scanDir(filePath, filesList);
    }
  }

  return filesList;
};


interface MarkdownData {
  title: string;
  content: string | null;
}

export const extractTokens = (text: string): MarkdownData => {
  // TODO only return token from an approved list?
  const lines = text.split(/\r?\n/); // split on Windows and Linux line breaks
  const hash: MarkdownData = {} as MarkdownData;

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex >= 0) {
      const key = line.slice(0, colonIndex).trim() as keyof MarkdownData;
      const value = line.slice(colonIndex + 1).trim();
      hash[key] = value;
    }
  }

  return hash;
};


export const getFileContents = (filePath: string): string => fs.readFileSync(filePath, 'utf-8');
