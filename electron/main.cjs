const { app, BrowserWindow } = require("electron");
const path = require("node:path");

const smokeMode = process.env.DEMOCRACY_GAME_SMOKE_EXIT === "1";

const createWindow = async () => {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    autoHideMenuBar: true,
    title: "Democracy Game",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const developmentUrl = process.env.VITE_DEV_SERVER_URL;
  if (developmentUrl) await window.loadURL(developmentUrl);
  else await window.loadFile(path.join(__dirname, "..", "dist", "index.html"));

  if (smokeMode) {
    const rendererReady = await window.webContents.executeJavaScript(
      "Boolean(document.getElementById('root')?.childElementCount)",
    );
    if (!rendererReady) {
      throw new Error("Electron smoke test loaded the page but the renderer did not mount.");
    }
    process.stdout.write(
      `Electron ${developmentUrl ? "development" : "production"} smoke test passed.\n`,
    );
  }
};

app.whenReady().then(async () => {
  try {
    await createWindow();
    if (smokeMode) {
      app.quit();
      return;
    }
    app.on("activate", async () => {
      if (BrowserWindow.getAllWindows().length === 0) await createWindow();
    });
  } catch (error) {
    console.error(error);
    app.exit(1);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
