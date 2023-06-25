const { app, BrowserWindow, ipcMain, nativeTheme, dialog, Menu } = require('electron')
const path = require('path')
console.group('index.js')

/*
|--------------------------------------------------------------------------------------------------------------------
| 
|--------------------------------------------------------------------------------------------------------------------
*/
function createWindow() {

    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')

        }
    })

    const secondaryWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'secondaryPreload.js')

        }
    })


    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    // [2] 
                    // mainWindow.webContents.send >> send args to channel 'update-counter'
                    click: () => mainWindow.webContents.send('update-counter', 1),
                    label: 'Increment'
                },
                {
                    click: () => mainWindow.webContents.send('update-counter', -1),
                    label: 'Decrement'
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu)


    /* 
    |------------------------------------------------------------------------------
    |
    |------------------------------------------------------------------------------
    */
    mainWindow.loadFile('index.html')
    mainWindow.webContents.openDevTools();
}


/*
|--------------------------------------------------------------------------------------------------------------------
| 
|--------------------------------------------------------------------------------------------------------------------
*/
app.whenReady().then(() => {

    /* 
    |------------------------------------------------------------------------------
    |
    |------------------------------------------------------------------------------
    */
    ipcFunction();

    /* 
    |------------------------------------------------------------------------------
    |
    |------------------------------------------------------------------------------
    */
    createWindow()

    /* 
    |------------------------------------------------------------------------------
    |
    |------------------------------------------------------------------------------
    */
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

})

/*
|--------------------------------------------------------------------------------------------------------------------
|
|--------------------------------------------------------------------------------------------------------------------
*/
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})



/*
|--------------------------------------------------------------------------------------------------------------------
| handleFileOpen
|--------------------------------------------------------------------------------------------------------------------
*/
/**
 * @function handleFileOpen
 * @returns {Promise<string|undefined>}
 */

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (!canceled) {
        return filePaths[0]
    }
}

/*
|--------------------------------------------------------------------------------------------------------------------
| ipcManager
|--------------------------------------------------------------------------------------------------------------------
*/
/**
 * @function ipcManager
 * @returns {Promise<string|undefined>}
 */
function ipcFunction() {

    /* 
    | ------------------------------------------------------------------------------
    | Renderer to main (one-way)
    | ipcRenderer.send(preload) - ipcMain.on(app)
    | ------------------------------------------------------------------------------
    |
    | You usually use this pattern to call a main process API from your web contents. 
    |
    | 1. Listen for events with ipcMain.on
    | 2. Expose ipcRenderer.send via preload
    | 3. Build the renderer process UI
    |
    */
    ipcMain.on('set-title', (event, title) => {
        const webContents = event.sender
        const mainWindow = BrowserWindow.fromWebContents(webContents)

        mainWindow.setTitle(title)
    })

    /* 
    | ------------------------------------------------------------------------------
    | Renderer to main(two - way) 
    | ipcRenderer.invoke(preload)  - ipcMain.handle(app)
    | ------------------------------------------------------------------------------
    |
    | A common application for two-way IPC is calling a main process module 
    | from your renderer process code and ** waiting for a result **. 
    | 
    | 1. Listen for events with ipcMain.handle
    | 2. Expose ipcRenderer.invoke via preload
    | 3. Build the renderer process UI
    |
    */
    ipcMain.handle('ping', () => 'pong')


    /* 
    | ------------------------------------------------------------------------------
    | Renderer to main(two - way) 
    | ipcRenderer.invoke(preload)  - ipcMain.handle(app)
    | ------------------------------------------------------------------------------
    */
    ipcMain.handle('dark-mode:toggle', () => {
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = 'light'
        } else {
            nativeTheme.themeSource = 'dark'
        }
        return nativeTheme.shouldUseDarkColors
    })

    /* 
    | ------------------------------------------------------------------------------
    | Renderer to main(two - way) 
    | ipcRenderer.invoke(preload)  - ipcMain.handle(app)
    | ------------------------------------------------------------------------------
    */
    ipcMain.handle('dark-mode:system', () => {
        nativeTheme.themeSource = 'system'
    })

    /* 
    | ------------------------------------------------------------------------------
    | Renderer to main(two - way) 
    | ipcRenderer.invoke(preload)  - ipcMain.handle(app)
    | ------------------------------------------------------------------------------
    */
    ipcMain.handle('dialog:openFile', handleFileOpen)

    /*
    |-------------------------------------------------------------------------------
    | 
    |-------------------------------------------------------------------------------
    | 
    | [6]
    | 
    */
    ipcMain.on('counter-value', (_event, value) => {
        console.log(value) // will print value to Node console
    })




    /*
    |-------------------------------------------------------------------------------
    | 
    |-------------------------------------------------------------------------------
    | 
    | 
    */
    ipcMain.on('main', (event) => {
        // When we receive a MessagePort in the main process, it becomes a
        // MessagePortMain.
        const port = event.ports[0]

        // MessagePortMain uses the Node.js-style events API, rather than the
        // web-style events API. So .on('message', ...) instead of .onmessage = ...
        port.on('message', (event) => {
            // data is { answer: 42 }
            const data = event.data
            console.log(data)
        })

        // MessagePortMain queues messages until the .start() method has been called.
        port.start()
    })

}

console.groupEnd('index.js')