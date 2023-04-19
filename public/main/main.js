const { app, BrowserWindow, BrowserView, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL("http://localhost:3000");
  win.removeMenu();
  win.webContents.openDevTools();

  const view = new BrowserView();
  win.setBrowserView(view);
  view.setBounds({ x: 900, y: 100, width: 400, height: 600 });

  ipcMain.on("view-go-to", (event, url) => {
    view.webContents.loadURL(url);

    event.returnValue = "success";
  });

  view.webContents.on("input-event", (event, inputEvent) => {
    if (inputEvent.type === "mouseUp") {
      view.webContents
        .executeJavaScript("window.getSelection().toString()")
        .then((selectedText) => {
          if (selectedText) {
            win.webContents.send("set-selected-text", {
              url: view.webContents.getURL(),
              title: view.webContents.getTitle(),
              text: selectedText,
            });
          }
        });
    }
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
