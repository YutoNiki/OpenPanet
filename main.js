const { app, BrowserWindow, ipcMain, net, Menu } = require('electron');
const path = require('path');

// ペン入力の遅延を減らす
app.commandLine.appendSwitch('enable-features', 'CanvasOopRasterization');

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#faf9f8',
    icon: path.join(__dirname, 'icon.ico'),
    title: 'ホワイトボード',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });

  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'whiteboard.html'));

  // 外部リンクはアプリ内で開かず既定のブラウザに渡す
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}

// ブラウザからドラッグされた画像URLをメインプロセス側で取得する。
// レンダラーから直接 fetch すると CORS で canvas が汚染され、PNG保存できなくなるため。
ipcMain.handle('fetch-image', async (_e, url) => {
  try {
    if (!/^https?:\/\//i.test(url)) return null;
    const res = await net.fetch(url);
    if (!res.ok) return null;
    const type = res.headers.get('content-type') || 'image/png';
    if (!type.startsWith('image/')) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 32 * 1024 * 1024) return null;
    return `data:${type};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
