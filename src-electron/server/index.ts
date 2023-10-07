import { IncomingMessage, ServerResponse } from 'http';
import { router } from './router';

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    resovleView(req, res);
  }
);

server.listen(port, hostname, () => {
  console.log(`Server run on http://${hostname}:${port}/`);
});

const resovleView = (req: IncomingMessage, res: ServerResponse) => {
  console.log('req', req.url);
  res.statusCode = 200;

  const { path, params } = resolveParam(req.url);
  if (path && Object.hasOwn(router, path)) {
    const { json, image, stream } = (router as any)[path]({ params, res });
    if (json) {
      res.setHeader('Content-Type', 'text/plain;charset=utf-8');
      res.end(json);
    } else if (image) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.write(image, 'binary');
      res.end();
      // res.end(image);
    } else if (stream) {
      res.setHeader('Content-Type', 'video/mp4;charset=utf-8');
      res.end(stream);
    }
    return;
  }
  res.end('not found');
};

const resolveParam = (url: string | undefined) => {
  if (!url) {
    return {};
  }
  const arr = url.split('?');
  const path = arr[0];
  const params = {} as { [key: string]: string | undefined };
  if (arr[1]) {
    const arr2 = arr[1].split('&');
    if (arr2) {
      for (let i = 0; i < arr2.length; i++) {
        const arr3 = arr2[i].split('=');
        params[arr3[0]] = arr3[1];
      }
    }
  }
  return { path, params };
};
