const {
    app, BrowserWindow,
    Menu, ipcMain,
    globalShortcut, dialog} = require('electron')
const os = require('os')

const path = require('path')

//hot reloader do not include in production!!!
// try {
//     require('electron-reloader')(module)
// } catch (_) {}

const createWindow = () => {
    let settingsMenu;
    const mainWindow = new BrowserWindow({
        width: 400,
        height: 400,
        minWidth: 400,
        minHeight: 400,
        icon: null,
        title: 'Pomodoro',
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    //when window content html, css, js loaded fully then show
    mainWindow.once('ready-to-show', mainWindow.show)

    function send2Renderer(channel, x){
        mainWindow.webContents.send(channel, x)
    }

    async function openFileDialog() {
        const options = {
            properties: ['openFile'],
            filters: [
                { name: 'Audio', extensions: ['mp3', 'wav', 'ogg', 'aac'] }
            ],
            defaultPath: os.homedir()
        };

        const result = await dialog.showOpenDialog(options);

        if(!result.canceled){
            send2Renderer('file-path', result.filePaths[0])
        }
    }


    Menu.setApplicationMenu(null)

    mainWindow.loadFile('index.html')


    ipcMain.on('open-window:settings', (event)=>{
        settingsWindow = new BrowserWindow({
            width: 200,
            height: 200,
            resizable: false,
            minimizable: false,
            title: '',
            parent: mainWindow,
            modal: true,
            icon: null,
            show: false,
            x: mainWindow.getPosition()[0] + mainWindow.getSize()[0] / 2 - 200 / 2,
            y: mainWindow.getPosition()[1] + mainWindow.getSize()[1] / 2 - 200 / 2,
            webPreferences: {
                preload: path.resolve(__dirname, '../settings/settings.preload.js')
            }
        })
        settingsWindow.loadFile('views/settings/settings.html')
        //when window is ready and html fully loaded then show
        settingsWindow.once('ready-to-show', settingsWindow.show)
    })

    ipcMain.on('openFileDialog', openFileDialog)

    ipcMain.on('changeDuration', (event, v)=>{
        send2Renderer('change-duration', v)
    })




    globalShortcut.register('Escape', ()=>{
    // Open the DevTools.
    settingsWindow.webContents.toggleDevTools()
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})