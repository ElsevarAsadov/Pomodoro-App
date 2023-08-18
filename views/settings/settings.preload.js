const {contextBridge, ipcRenderer}= require('electron')

contextBridge.exposeInMainWorld('api', {
    changeDuration: (v)=>ipcRenderer.send('changeDuration', v),
    openFileDialog: ()=> ipcRenderer.send('openFileDialog'),
})