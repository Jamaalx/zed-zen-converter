const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFiles: () => ipcRenderer.invoke('select-files'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),
  convertFile: (options) => ipcRenderer.invoke('convert-file', options),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
<<<<<<< HEAD
  openExternal: (url) => shell.openExternal(url),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
=======
  // PDF Split functions
  splitPdf: (options) => ipcRenderer.invoke('split-pdf', options),
  getPdfPageCount: (filePath) => ipcRenderer.invoke('get-pdf-page-count', filePath),
  selectPdfFile: () => ipcRenderer.invoke('select-pdf-file'),
>>>>>>> ef0fca1d6d0376e5ddaf401f2185b06ad2cdc0df
});