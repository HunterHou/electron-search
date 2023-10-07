import { refreshIndex } from './service';
import { open, readFileSync } from 'fs';

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
  const fd = readFileSync(image, 'utf8');
  const { res } = params;
  res.setHeader('Content-Type', 'image/jpeg');
  // res.write(fd, 'binary');
  res.end(fd);
  // return { image: new Buffer(fd, 'utf8') };
};

export const GetVideo = (params: any) => {
  const stream =
    'e:\\emby\\emby-rename\\JULIA\\WANZ\\[JULIA][WAAA-274]全身とろけるベロキス性感サロン 唾液ダラダラ飲ませてベチョ濡れオッパイ密着性交 JULIA\\[JULIA][WAAA-274]全身とろけるベロキス性感サロン 唾液ダラダラ飲ませてベチョ濡れオッパイ密着性交 JULIA{{骑兵}}《国民女神,绝美》.mp4';
  open(stream, 'r', (err, fd) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('myfile does not exist');
        return;
      }

      throw err;
    }

    return { stream: fd };
  });
};

export const GetSearch = (params: any) => {
  const { res } = params;
  res.end(refreshIndex(params));
  // return refreshIndex(params);
};

export const GetRefreshDisk = (params: any) => {
  return refreshIndex(params);
};
