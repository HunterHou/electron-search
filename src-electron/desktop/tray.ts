import { app, Tray, nativeImage, Menu } from 'electron';
import path from 'path';
import { mainWindow } from './window';
const icon = nativeImage.createFromPath(
  path.resolve(__dirname, 'icons/icon.png')
);

export const createTray = () => {
  return new Tray(icon);
};
export const contextMenu = Menu.buildFromTemplate([
  {
    label: '显示',
    type: 'normal',
    click: () => {
      mainWindow?.show();
    },
  },
  {
    label: '重启',
    type: 'normal',
    click: () => {
      app?.relaunch();
    },
  },
]);
