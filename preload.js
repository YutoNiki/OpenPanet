const { contextBridge, ipcRenderer } = require('electron');

// レンダラーには必要最小限の窓口だけを渡す
contextBridge.exposeInMainWorld('api', {
  fetchImage: url => ipcRenderer.invoke('fetch-image', url)
});
