const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const TASKS_PATH = path.join(os.homedir(), 'actionary-tasks.json');

function createWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width: 350,
    height: 500,
    x: width - 370, // 20px margin from right
    y: 20, // 20px from top
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    transparent: true,
    vibrancy: 'ultra-thin', // more glass-like
    backgroundColor: '#00000000', // fully transparent
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('read-tasks', async () => {
  console.log('[Actionary] read-tasks called. Path:', TASKS_PATH);
  try {
    if (fs.existsSync(TASKS_PATH)) {
      const data = fs.readFileSync(TASKS_PATH, 'utf-8');
      console.log('[Actionary] read-tasks loaded:', data);
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    console.error('[Actionary] read-tasks error:', e);
    return [];
  }
});

ipcMain.handle('save-tasks', async (_event, tasks) => {
  console.log('[Actionary] save-tasks called. Path:', TASKS_PATH, 'Tasks:', tasks);
  try {
    fs.writeFileSync(TASKS_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('[Actionary] save-tasks error:', e);
    return false;
  }
}); 
