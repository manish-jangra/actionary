// Preload script for Electron
// You can expose APIs here if needed in the future 

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('actionaryAPI', {
  readTasks: () => ipcRenderer.invoke('read-tasks'),
  saveTasks: (tasks) => ipcRenderer.invoke('save-tasks', tasks),
}); 
