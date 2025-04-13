console.log("Electron app starting...");

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// electron.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,    
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startURL);
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

ipcMain.handle('select-video', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        //{ name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'mkv', 'webm'] }
      ]
    });
    
    if (!result.canceled) {
        return result.filePaths[0];
    } else {
      return null;
    }
});

ipcMain.handle('get-video', async (event, filePath) => {
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');

  return {
    data: base64,
    type: 'video/mp4', // detect this dynamically if needed
  };
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});