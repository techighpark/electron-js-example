console.group('renderer.js')

/* 
|------------------------------------------------------------------------------------------------
| Theme mode
|------------------------------------------------------------------------------------------------
 */
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
    const isDarkMode = await window.darkMode.toggle()
    console.log('isDarkMode')
    document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
})

/* 
|------------------------------------------------------------------------------------------------
|
|------------------------------------------------------------------------------------------------
 */
document.getElementById('reset-to-system').addEventListener('click', async () => {
    await window.darkMode.system()
    document.getElementById('theme-source').innerHTML = 'System'
})

/* 
|------------------------------------------------------------------------------------------------
|
|------------------------------------------------------------------------------------------------
 */
const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`

/* 
|------------------------------------------------------------------------------------------------
|
|------------------------------------------------------------------------------------------------
 */
/**
 * @function pingpong-test
 * @returns {Promise<void>}
 */
const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // prints out 'pong'
}

func()



/* 
|------------------------------------------------------------------------------------------------
| ipcRenderer.send
|------------------------------------------------------------------------------------------------
*/
const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', async () => {
    const title = titleInput.value
    window.exposeSetTitle.setTitle(title)
})


/* 
|------------------------------------------------------------------------------------------------
| ipcRenderer.invoke
|------------------------------------------------------------------------------------------------
*/
const btn = document.getElementById('btn-invoke')
const filePathElement = document.getElementById('filePath')
btn.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile()
    filePathElement.innerText = filePath
})


/* 
|------------------------------------------------------------------------------------------------
| 
|------------------------------------------------------------------------------------------------
| [4] 
| execute
| [5]
| event.sender.send >> ipcMain
|
*/
window.electronAPISDev.handleCounter((event, value) => {
    const oldValue = Number(counter.innerText)
    const newValue = oldValue + value
    counter.innerText = newValue
    event.sender.send('counter-value', newValue)
})



console.groupEnd('renderer.js')