import { readdirSync, statSync } from 'fs';
import { extname, join } from 'path';
const baseDirs = ['e://emby', 'd://emby'];
const searchFileType = ['mp4', 'mkv'];

export const refreshIndex = (params: any) => {
  const files: any[] = [];
  baseDirs.forEach((item) => {
    walkDir(item, files);
  });
  return JSON.stringify(files);
};

export const walkDir = (targetDir: string, totalFiles: string[]) => {
  try {
    const files = readdirSync(targetDir);
    if (!files || files.length == 0) {
      return;
    }
    files.forEach((item) => {
      const itemPath = join(targetDir, item);
      const stats = statSync(itemPath);
      if (stats.isDirectory()) {
        walkDir(itemPath, totalFiles);
      } else {
        const ext = extname(itemPath);
        if (searchFileType.indexOf(ext.substring(1)) >= 0) {
          totalFiles.push(itemPath);
        }
      }
    });
  } catch (err) {
    console.log(err);
    return;
  }
};
