// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let addWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });


  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.on('closed', () => {
    app.quit();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})



const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Ittem',
        click: () => {
          addWindow = new BrowserWindow({
            width: 200,
            height: 200,
            title: 'Add Shopping Item',
            webPreferences: {
              preload: path.join(__dirname, 'preload.js'),
              nodeIntegration: true

            }
          })

          addWindow.loadFile('addWindow.html')

          // Garbage remove
          addWindow.on('close', () => {
            addWindow = null;
          })

          ipcMain.on('item:add', (e, item) => {
            console.log(item);
            mainWindow.webContents.send('item:add', item);
            addWindow.close();

          })

        }
      },
      {
        label: 'Clear Items'
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];
//add empty object to the menu (to remove Electron title)
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {

  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: 'Toggle tools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();

        }
      },
      {
        role: 'reload'
      }
    ]
  })
}

