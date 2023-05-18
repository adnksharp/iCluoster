const path = require('path')
const { BrowserWindow } = require('electron')

exports.createBrowserWindow = () => {
	return new BrowserWindow({
		minWidth: 1120,
		minHeight: 600,
		backgroundColor: '#ffffff',
		webPreferences: {
			nativeWindowOpen: true,
			devTools: false,
			nodeIntegration: true,
			contextIsolation: true,
			webviewTag: true,
			preload: path.join(__dirname, 'preload.js'),
			icon: path.join(__dirname, 'assets', 'icon.png')
		}
	})
}
