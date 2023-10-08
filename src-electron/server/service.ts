import { readdirSync, statSync } from 'fs';
import { extname, join } from 'path';
const baseDirs = ['f://emby', 'a://emby'];
const searchFileType = ['mp4', 'mkv'];

import { insertDb } from '../database/db';
import { FileModel } from 'src/components/model/File';

export const refreshIndex = (params?: any) => {
  params;
  const files: string[] = [];
  baseDirs.forEach((item) => {
    walkDir(item, files);
  });
  const data = files.map((item) => {
    return { Id: item } as FileModel;
  });
  console.log('refreshIndex', files.length);
  insertDb(data);
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
      let isDir = false;
      try {
        const stats = statSync(itemPath);
        isDir = stats.isDirectory();
      } catch (err) {
        console.log(err);
        return;
      }
      if (isDir) {
        walkDir(itemPath, totalFiles);
      } else {
        const ext = extname(itemPath);
        if (searchFileType.indexOf(ext.substring(1)) >= 0) {
          totalFiles.push(itemPath);
        }
      }
    });
  } catch (err) {
    // console.log(err);
    return;
  }
};
