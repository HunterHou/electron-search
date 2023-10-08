import { refreshIndex } from './service';
import { readFile } from 'fs';
import { PrismaClient } from '@prisma/client';
import { aw } from 'app/dist/spa/assets/index.889267c0';
const prisma = new PrismaClient();

export const GetIndex = (params: any) => {
  return JSON.stringify(params);
};
export const GetHome = (params: any) => {
  return JSON.stringify(params);
};
export const GetPng = (params: any) => {
  const image =
    'e:\\emby\\emby-rename\\JULIA\\WANZ\\[JULIA][WAAA-274]全身とろけるベロキス性感サロン 唾液ダラダラ飲ませてベチョ濡れオッパイ密着性交 JULIA\\[JULIA][WAAA-274]全身とろけるベロキス性感サロン 唾液ダラダラ飲ませてベチョ濡れオッパイ密着性交 JULIA{{骑兵}}《国民女神,绝美》.jpg';
  // return { json: image };
  const { res } = params;
  readFile(image, (err, data) => {
    // res.setHeader('Content-Type', 'image/jpeg');
    res.end(data);
  });
  // const data = readFileSync(image, 'utf8');
  // res.setHeader('Content-Type', 'image/jpeg');
  // res.end(data);
};

export const GetVideo = (params: any) => {
  const stream =
    'e:\\emby\\emby-rename\\JULIA\\WANZ\\[JULIA][WAAA-274]全身とろけるベロキス性感サロン 唾液ダラダラ飲ませてベチョ濡れオッパイ密着性交 JULIA\\[JULIA][WAAA-274]全身とろけるベロキス性感サロン 唾液ダラダラ飲ませてベチョ濡れオッパイ密着性交 JULIA{{骑兵}}《国民女神,绝美》.mp4';
  const { res } = params;
  readFile(stream, 'r', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('myfile does not exist');
        return;
      }

      throw err;
      res.end(data);
    }
  });
};

export const GetSearch = async (params: any) => {
  const { res } = params;
  const files = await queryDB();
  res.end(files);
};

export const GetRefreshDisk = (params: any) => {
  return refreshIndex(params);
};
function queryDB() {
  throw new Error('Function not implemented.');
}
