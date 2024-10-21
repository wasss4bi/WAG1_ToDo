require('./api.js');
const { app, BrowserWindow, Menu } = require('electron');
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    //frame: true,
    webPreferences: {
      /* preload: path.join(__dirname, './preload.js'), */
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      devTools: true,
    },
  });
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  /* win.loadURL(path.join(__dirname, './index.html')); */
  win.maximize();
  /* win.webContents.openDevTools(); */
  /* Menu.setApplicationMenu(null); */
};

// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});