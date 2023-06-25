const { contextBridge, ipcRenderer } = require('electron')

/* 
|------------------------------------------------------------------------------------------------
| preload
|------------------------------------------------------------------------------------------------
|
| Preload scripts contain code that executes in a renderer process before its web content begins loading. 
| These scripts run within the renderer context, but are granted more privileges by having access to Node.js APIs.
| 
|
*/
console.group('preload.js')

/* 
|------------------------------------------------------------------------------------------------
| 
|------------------------------------------------------------------------------------------------
*/
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})

/* 
|------------------------------------------------------------------------------------------------
| Theme mode
|------------------------------------------------------------------------------------------------
*/
contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => ipcRenderer.invoke('dark-mode:system')
})

/* 
|------------------------------------------------------------------------------------------------
| 
|------------------------------------------------------------------------------------------------
*/
contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    // pingpong-test
    ping: () => ipcRenderer.invoke('ping')
    // we can also expose variables, not just functions
})

/* 
|------------------------------------------------------------------------------------------------
| Renderer to main (one-way)
| ipcRenderer.send(preload) - ipcMain.on(app)
|------------------------------------------------------------------------------------------------
*/
contextBridge.exposeInMainWorld('exposeSetTitle', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
})


/* 
|------------------------------------------------------------------------------------------------
| Renderer to main(two - way) 
| ipcRenderer.invoke(preload)  - ipcMain.handle(app)
|------------------------------------------------------------------------------------------------
*/
contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
})


/* 
|------------------------------------------------------------------------------------------------
| 
|------------------------------------------------------------------------------------------------
| [1]
| ipcRenderer.on >> listen to channel 'update-counter' 
| [3]
| execute callback
*/
contextBridge.exposeInMainWorld('electronAPISDev', {
    handleCounter: (callback) => ipcRenderer.on('update-counter', callback)
})



// MessagePorts are created in pairs. A connected pair of message ports is
// called a channel.
const channel = new MessageChannel()
console.log(channel)
// The only difference between port1 and port2 is in how you use them. Messages
// sent to port1 will be received by port2 and vice-versa.
const port1 = channel.port1
const port2 = channel.port2

// It's OK to send a message on the channel before the other end has registered
// a listener. Messages will be queued until a listener is registered.
port2.postMessage({ answer: 42 })

// Here we send the other end of the channel, port1, to the main process. It's
// also possible to send MessagePorts to other frames, or to Web Workers, etc.
ipcRenderer.postMessage('main', null, [port1])

console.groupEnd('preload.js')


