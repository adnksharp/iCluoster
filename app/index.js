// Modules to control application life and create native browser window
const { app, Menu } = require('electron')

app.whenReady().then(() => {
	const win = require('./scripts/window')
	mainWindow = win.createBrowserWindow(app)

	mainWindow.loadFile('./web/index.html')
	mainWindow.maximize()

	const menu = require('./scripts/menu')
	const template = menu.createTemplate(app.name)
	const builtMenu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(builtMenu)

	mainWindow.on('closed', () => {
		mainWindow = null
	})
})



