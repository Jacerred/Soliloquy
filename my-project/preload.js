const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectVideo: () => ipcRenderer.invoke('select-video'),
    getVideo: (fileName) => ipcRenderer.invoke('get-video', fileName)
});
