const { app, BrowserWindow, shell } = require('electron');
const windowStateKeeper = require('electron-window-state');

// CRITICAL FOR CAD: Force enable hardware acceleration and WebGL optimizations
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('disable-software-rasterizer');

let mainWindow;

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1280,
    defaultHeight: 800
  });

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    title: "Onshape CAD",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webgl: true // Explicitly enable WebGL for 3D rendering
    }
  });

  mainWindowState.manage(mainWindow);
  mainWindow.setMenuBarVisibility(false);
  
  mainWindow.loadURL('https://cad.onshape.com/signin');

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.name = "Onshape CAD";
app.setAppUserModelId("com.pr1meb.onshape");

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
