const { contextBridge, ipcRenderer } = require('electron');

const langArg = process.argv.find(a => a.startsWith('--app-lang='));

// レンダラーには必要最小限の窓口だけを渡す
contextBridge.exposeInMainWorld('api', {
  fetchImage: url => ipcRenderer.invoke('fetch-image', url),
  lang: langArg ? langArg.split('=')[1] : null
});
