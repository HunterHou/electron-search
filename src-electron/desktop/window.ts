import { BrowserWindow } from 'electron';
import path from 'path';

export let mainWindow: BrowserWindow | undefined;

export function createMainWindow() {
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1400,
    height: 1000,
    // transparent: true,
    titleBarStyle: 'hidden',
    backgroundColor: 'rgba(250,250,250,1)',
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      webSecurity: false,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });
  const url = `${process.env.APP_URL}`;
  mainWindow.loadURL(url);
  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }
  mainWindow.setMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

export // 创建子窗口
function createSonWindow(params: object | undefined) {
  const indow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1600,
    height: 900,
    transparent: true,
    titleBarStyle: 'hidden',
    // titleBarOverlay: true,
    backgroundColor: 'rgba(250,250,250,1)',
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      webSecurity: false,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
    ...params,
  });
  const url = `${process.env.APP_URL}#${params['router'] || ''}`;
  indow.loadURL(url);
  if (process.env.DEBUGGING) {
    indow.webContents.openDevTools();
  } else {
    indow.webContents.on('devtools-opened', () => {
      indow?.webContents.closeDevTools();
    });
  }
  indow.setMenu(null);
  indow.on('show', indow.focus);
  indow.on('closed', () => {
    mainWindow?.focus();
  });
  return indow;
}
