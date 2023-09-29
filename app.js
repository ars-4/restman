const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        height: 600,
        width: 1000,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, 'src', 'restman.png'),
        title: 'Restman',
    });

    win.removeMenu();
    win.setTitle('Restman');
    win.loadFile(path.join(__dirname, 'src', 'index.html'));
    ipcMain.on('openDevTools', () => {
        win.webContents.openDevTools({mode:'bottom'});
    })
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});