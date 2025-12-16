const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFiles: () => ipcRenderer.invoke('select-files'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),
  convertFile: (options) => ipcRenderer.invoke('convert-file', options),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  // PDF Split functions
  splitPdf: (options) => ipcRenderer.invoke('split-pdf', options),
  getPdfPageCount: (filePath) => ipcRenderer.invoke('get-pdf-page-count', filePath),
  selectPdfFile: () => ipcRenderer.invoke('select-pdf-file'),
});