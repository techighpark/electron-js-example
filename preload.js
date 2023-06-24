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
|------------------------------------------------------------------------------------------------
|
| ipcRenderer.send
|
*/
contextBridge.exposeInMainWorld('exposeSetTitle', {
    setTitle: (title) => ipcRenderer.send('set-title', title)
})

/* 
|------------------------------------------------------------------------------------------------
| Renderer to main (one-way)
|------------------------------------------------------------------------------------------------
|
| ipcRenderer.invoke
|
*/
contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('dialog:openFile')
})

console.groupEnd('preload.js')