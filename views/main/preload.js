const {contextBridge, ipcRenderer}= require('electron')

contextBridge.exposeInMainWorld('api', {
        openSettingsMenu: ()=> ipcRenderer.send('open-window:settings'),
        getFilePath: (callback)=> ipcRenderer.on('file-path', callback),
        changeDuration: (callback) => ipcRenderer.on('change-duration', callback),
})