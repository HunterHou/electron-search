import {
  GetIndex,
  GetPng,
  GetHome,
  GetSearch,
  GetVideo,
  GetRefreshDisk,
} from './controller';

export const router = {
  '/index': GetIndex,
  '/refreshIndex': GetRefreshDisk,
  '/search': GetSearch,
  '/png': GetPng,
  '/GetVideo': GetVideo,
  '/': GetHome,
};
