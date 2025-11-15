const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFiles: () => ipcRenderer.invoke('select-files'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),
  convertFile: (options) => ipcRenderer.invoke('convert-file', options),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  openExternal: (url) => shell.openExternal(url),
});