const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
	print: (arg) => ipcRenderer.send('print', data),
})
