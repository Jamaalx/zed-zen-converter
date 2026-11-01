const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFiles: () => ipcRenderer.invoke('select-files'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),
  // File.path was removed in Electron 32; dropped files need webUtils
  getPathForFile: (file) => webUtils.getPathForFile(file),
  convertFile: (options) => ipcRenderer.invoke('convert-file', options),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  // validated in the main process (https:/mailto: only)
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  // PDF Split functions
  splitPdf: (options) => ipcRenderer.invoke('split-pdf', options),
  getPdfPageCount: (filePath) => ipcRenderer.invoke('get-pdf-page-count', filePath),
  selectPdfFile: () => ipcRenderer.invoke('select-pdf-file'),
});
