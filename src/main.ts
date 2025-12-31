import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import https from 'https';
import http from 'http';
// import started from "electron-squirrel-startup";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (started) {
//   app.quit();
// }

const createWindow = () => {
  // Create the browser window.
  const isDev = !!MAIN_WINDOW_VITE_DEV_SERVER_URL;
  
  const mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // CORS 문제 해결을 위한 설정
      // 개발 환경에서만 webSecurity 비활성화 (프로덕션에서는 백엔드 CORS 설정 권장)
      webSecurity: !isDev, // 개발 환경에서는 false, 프로덕션에서는 true
      allowRunningInsecureContent: isDev,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC 핸들러: 파일 저장 다이얼로그
ipcMain.handle('show-save-dialog', async (_event, defaultPath: string, fileName: string) => {
  const { filePath } = await dialog.showSaveDialog({
    defaultPath: path.join(defaultPath, fileName),
    filters: [
      { name: 'All Files', extensions: ['*'] },
    ],
  });
  return filePath || null;
});

// IPC 핸들러: 파일 다운로드
ipcMain.handle('download-file', async (_event, url: string, filePath: string) => {
  return new Promise<boolean>((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(true);
      });

      fileStream.on('error', (err) => {
        fs.unlink(filePath).catch(() => {}); // 파일 삭제 시도
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
