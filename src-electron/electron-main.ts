import { app } from 'electron';
import os from 'os';
import { createMainWindow, mainWindow } from './desktop/window';
import { contextMenu, createTray } from './desktop/tray';
import './desktop/listener';
import './server';

const platform = process.platform || os.platform();

// shell.openPath(path.resolve(__dirname, 'icons/exec/appQuaser.exe'));
// 启动
app.whenReady().then(() => {
  // 创建主窗口
  createMainWindow();
  const tray = createTray();
  tray.setContextMenu(contextMenu);
});

// 所有窗口都关闭
app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createMainWindow();
  }
});
