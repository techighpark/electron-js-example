const { app, BrowserWindow, ipcMain, nativeTheme, dialog } = require('electron')
const path = require('path')
console.group('index.js')

/*
|--------------------------------------------------------------------------------------------------------------------
| 
|--------------------------------------------------------------------------------------------------------------------
*/
function createWindow() {

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            devTools: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    /*
    |------------------------------------------------------------------
    | 
    |------------------------------------------------------------------
    */
    win.loadFile('index.html')




}


/*
|--------------------------------------------------------------------------------------------------------------------
| 
|--------------------------------------------------------------------------------------------------------------------
*/
app.whenReady().then(() => {

    /*
    |------------------------------------------------------------------
    | ipc function manager
    |------------------------------------------------------------------
    |
    | app.whenReady() || createWindow() 아무데나 넣어도 괜찮음
    | 
    */
    ipcFunction();


    /*
    |------------------------------------------------------------------
    | 
    |------------------------------------------------------------------
    */
    createWindow()

    /*
    |------------------------------------------------------------------
    | 
    |------------------------------------------------------------------
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



/*--------------------------------------------------------------------------------------------------------------------
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

/*--------------------------------------------------------------------------------------------------------------------
| ipcManager
|--------------------------------------------------------------------------------------------------------------------
*/
/**
 * @function ipcManager
 * @returns {Promise<string|undefined>}
 */
function ipcFunction() {
    /*
    |------------------------------------------------------------------
    | Renderer to main (one-way)
    |------------------------------------------------------------------
    | 
    |ipcRenderer.send
    |
    */
    ipcMain.on('set-title', (event, title) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        win.setTitle(title)
    })

    /*
    |------------------------------------------------------------------------------
    | Renderer to main (two-way)
    |------------------------------------------------------------------------------
    |
    | pingpong-test
    |
    */
    ipcMain.handle('ping', () => 'pong')


    /*
    |------------------------------------------------------------------------------
    | Renderer to main (two-way)
    |------------------------------------------------------------------------------
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
    |------------------------------------------------------------------------------
    | Renderer to main (two-way)
    |------------------------------------------------------------------------------
    */
    ipcMain.handle('dark-mode:system', () => {
        nativeTheme.themeSource = 'system'
    })

    /*
    |------------------------------------------------------------------------------
    | Renderer to main (two-way)
    |------------------------------------------------------------------------------
    */
    ipcMain.handle('dialog:openFile', handleFileOpen)
}

console.groupEnd('index.js')