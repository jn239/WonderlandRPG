const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");

let mainWindow = null;
let botModule = null;
let botRunning = false;

const APP_NAME = "Wonderland RPG";
const BOT_FILE = path.join(__dirname, "..", "src", "bot.js");

function getUserDataDirectory() {
  return app.getPath("userData");
}

function getConfigDirectory() {
  return path.join(getUserDataDirectory(), "config");
}

function getConfigFile() {
  return path.join(getConfigDirectory(), "config.json");
}

function getDataDirectory() {
  return path.join(getUserDataDirectory(), "data");
}

function getLogDirectory() {
  return path.join(getUserDataDirectory(), "logs");
}

function ensureDirectories() {
  fs.mkdirSync(getConfigDirectory(), { recursive: true });
  fs.mkdirSync(getDataDirectory(), { recursive: true });
  fs.mkdirSync(getLogDirectory(), { recursive: true });
}

function log(message) {
  const timestamp = new Date().toLocaleTimeString();
  const line = `[${timestamp}] ${message}`;

  console.log(line);

  try {
    ensureDirectories();

    fs.appendFileSync(
      path.join(getLogDirectory(), "launcher.log"),
      line + "\n",
      "utf8"
    );
  } catch {
    // Ignore logging failures.
  }

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("log", line);
  }
}

function loadConfig() {
  ensureDirectories();

  const configFile = getConfigFile();

  if (!fs.existsSync(configFile)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(configFile, "utf8"));
  } catch (error) {
    log(`❌ Could not read configuration: ${error.message}`);
    return null;
  }
}

function saveConfig(config) {
  ensureDirectories();

  fs.writeFileSync(
    getConfigFile(),
    JSON.stringify(config, null, 2),
    "utf8"
  );
}

function getClientId() {
  const candidates = [
    path.join(__dirname, "client-config.json"),
    path.join(
      process.resourcesPath || "",
      "app.asar",
      "launcher",
      "client-config.json"
    )
  ];

  for (const file of candidates) {
    try {
      if (!fs.existsSync(file)) {
        continue;
      }

      const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
      const config = JSON.parse(raw);

      if (config && config.clientId) {
        log(`✓ Twitch client configuration found: ${file}`);
        return config.clientId;
      }
    } catch (error) {
      log(`⚠ Could not read client configuration: ${error.message}`);
    }
  }

  return null;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 700,
    minHeight: 550,
    backgroundColor: "#090909",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL(
    "data:text/html;charset=utf-8," +
      encodeURIComponent(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Wonderland RPG</title>
<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #090909;
  color: #eee;
  font-family: Arial, sans-serif;
}

.header {
  background: linear-gradient(135deg, #171717, #260b2d);
  padding: 24px;
  border-bottom: 1px solid #4b1d55;
}

h1 {
  margin: 0 0 8px 0;
  color: #e8a9ff;
  font-size: 30px;
}

.subtitle {
  color: #aaa;
}

.container {
  padding: 22px;
}

.status-card {
  background: #151515;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 18px;
  margin-bottom: 18px;
}

.status {
  font-size: 18px;
  font-weight: bold;
}

.connected {
  color: #65e765;
}

.disconnected {
  color: #ff7373;
}

button {
  background: #6b2d7d;
  border: 1px solid #9c48b3;
  color: white;
  padding: 12px 18px;
  border-radius: 7px;
  cursor: pointer;
  font-size: 15px;
  margin-right: 8px;
  margin-bottom: 8px;
}

button:hover {
  background: #813a96;
}

button:disabled {
  background: #333;
  border-color: #444;
  color: #777;
  cursor: not-allowed;
}

.log {
  background: #050505;
  border: 1px solid #292929;
  border-radius: 8px;
  padding: 14px;
  height: 330px;
  overflow-y: auto;
  font-family: Consolas, monospace;
  font-size: 13px;
  white-space: pre-wrap;
}

.info {
  color: #999;
  font-size: 13px;
  margin-top: 10px;
}
</style>
</head>

<body>
<div class="header">
  <h1>♠ Wonderland RPG</h1>
  <div class="subtitle">A dark shared-world Alice in Wonderland Twitch RPG</div>
</div>

<div class="container">

  <div class="status-card">
    <div id="twitchStatus" class="status disconnected">
      Twitch: Not Connected
    </div>

    <div style="margin-top: 14px;">
      <button id="connectButton">Connect Twitch</button>
      <button id="disconnectButton">Disconnect Twitch</button>
    </div>

    <div class="info">
      Connect your Twitch account before starting the RPG bot.
    </div>
  </div>

  <div class="status-card">
    <div id="botStatus" class="status disconnected">
      RPG Bot: Stopped
    </div>

    <div style="margin-top: 14px;">
      <button id="startButton">Start RPG Bot</button>
      <button id="stopButton">Stop RPG Bot</button>
    </div>

    <div class="info">
      The RPG bot responds to commands in your Twitch chat.
    </div>
  </div>

  <div class="status-card">
    <strong>Launcher Log</strong>

    <div id="log" class="log" style="margin-top: 12px;"></div>
  </div>

</div>

<script>
const { ipcRenderer } = require("electron");

const twitchStatus = document.getElementById("twitchStatus");
const botStatus = document.getElementById("botStatus");
const connectButton = document.getElementById("connectButton");
const disconnectButton = document.getElementById("disconnectButton");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const logBox = document.getElementById("log");

function addLog(message) {
  logBox.textContent += message + "\\n";
  logBox.scrollTop = logBox.scrollHeight;
}

function updateStatus(status) {
  const twitchConnected = status.twitchConnected;
  const botRunning = status.botRunning;

  twitchStatus.textContent = twitchConnected
    ? "Twitch: Connected"
    : "Twitch: Not Connected";

  twitchStatus.className =
    "status " + (twitchConnected ? "connected" : "disconnected");

  botStatus.textContent = botRunning
    ? "RPG Bot: Running"
    : "RPG Bot: Stopped";

  botStatus.className =
    "status " + (botRunning ? "connected" : "disconnected");

  connectButton.disabled = twitchConnected;
  disconnectButton.disabled = !twitchConnected;

  startButton.disabled = !twitchConnected || botRunning;
  stopButton.disabled = !botRunning;
}

connectButton.addEventListener("click", () => {
  ipcRenderer.send("connect-twitch");
});

disconnectButton.addEventListener("click", () => {
  ipcRenderer.send("disconnect-twitch");
});

startButton.addEventListener("click", () => {
  ipcRenderer.send("start-bot");
});

stopButton.addEventListener("click", () => {
  ipcRenderer.send("stop-bot");
});

ipcRenderer.on("log", (event, message) => {
  addLog(message);
});

ipcRenderer.on("status", (event, status) => {
  updateStatus(status);
});

ipcRenderer.invoke("get-status").then(updateStatus);
</script>

</body>
</html>
`)
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function sendStatus() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  const config = loadConfig();

  mainWindow.webContents.send("status", {
    twitchConnected: !!(
      config &&
      config.username &&
      config.accessToken
    ),
    botRunning
  });
}

function httpRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const request = https.request(options, response => {
      let data = "";

      response.on("data", chunk => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          resolve({
            statusCode: response.statusCode,
            data: JSON.parse(data)
          });
        } catch {
          resolve({
            statusCode: response.statusCode,
            data
          });
        }
      });
    });

    request.on("error", reject);

    if (body) {
      request.write(body);
    }

    request.end();
  });
}

async function authorizeTwitch() {
  const clientId = getClientId();

  if (!clientId) {
    log("❌ Twitch client ID was not found.");
    throw new Error("Twitch client ID not found.");
  }

  log("Starting Twitch device authorization...");

  const scope = "chat:read chat:edit";

  const body = new URLSearchParams({
    client_id: clientId,
    scopes: scope
  }).toString();

  const response = await httpRequest(
    {
      hostname: "id.twitch.tv",
      path: "/oauth2/device",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body)
      }
    },
    body
  );

  if (
    response.statusCode !== 200 ||
    !response.data ||
    !response.data.device_code
  ) {
    throw new Error(
      `Twitch device authorization failed: ${JSON.stringify(
        response.data
      )}`
    );
  }

  const deviceCode = response.data.device_code;
  const userCode = response.data.user_code;
  const verificationUri =
    response.data.verification_uri ||
    response.data.verification_uri_complete;

  log(`🔑 Twitch device code: ${userCode}`);
  log(`🌐 Open this page: ${verificationUri}`);

  const pollInterval =
    Math.max(Number(response.data.interval) || 5, 5) * 1000;

  const expiresAt =
    Date.now() + Number(response.data.expires_in || 1800) * 1000;

  while (Date.now() < expiresAt) {
    await new Promise(resolve => setTimeout(resolve, pollInterval));

    const tokenBody = new URLSearchParams({
      client_id: clientId,
      device_code: deviceCode,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code"
    }).toString();

    const tokenResponse = await httpRequest(
      {
        hostname: "id.twitch.tv",
        path: "/oauth2/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(tokenBody)
        }
      },
      tokenBody
    );

    if (
      tokenResponse.statusCode === 200 &&
      tokenResponse.data &&
      tokenResponse.data.access_token
    ) {
      const accessToken = tokenResponse.data.access_token;
      const refreshToken = tokenResponse.data.refresh_token || "";

      const userResponse = await httpRequest({
        hostname: "api.twitch.tv",
        path: "/helix/users",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": clientId
        }
      });

      if (
        userResponse.statusCode !== 200 ||
        !userResponse.data ||
        !userResponse.data.data ||
        !userResponse.data.data[0]
      ) {
        throw new Error("Could not determine the Twitch account.");
      }

      const user = userResponse.data.data[0];

      saveConfig({
        clientId,
        username: user.login,
        displayName: user.display_name,
        accessToken,
        refreshToken
      });

      log(`✅ Twitch connected as @${user.login}.`);
      sendStatus();

      return;
    }

    const errorCode =
      tokenResponse.data &&
      tokenResponse.data.message
        ? tokenResponse.data.message
        : "";

    if (
      errorCode &&
      ![
        "authorization_pending",
        "slow_down"
      ].includes(errorCode)
    ) {
      throw new Error(
        `Twitch authorization failed: ${errorCode}`
      );
    }
  }

  throw new Error("Twitch device authorization timed out.");
}

async function disconnectTwitch() {
  const config = loadConfig();

  if (!config || !config.accessToken) {
    return;
  }

  await stopBot();

  const clientId = config.clientId || getClientId();

  try {
    const token = encodeURIComponent(config.accessToken);

    await httpRequest({
      hostname: "id.twitch.tv",
      path: `/oauth2/revoke?client_id=${encodeURIComponent(
        clientId
      )}&token=${token}`,
      method: "POST"
    });
  } catch {
    // Continue even if Twitch token revocation fails.
  }

  try {
    fs.unlinkSync(getConfigFile());
  } catch {
    // Ignore if config is already gone.
  }

  log("✓ Twitch disconnected.");
  sendStatus();
}

async function startBot() {
  if (botRunning) {
    log("⚠ Wonderland RPG is already running.");
    return;
  }

  const config = loadConfig();

  if (!config || !config.username || !config.accessToken) {
    log("❌ Connect Twitch before starting Wonderland RPG.");
    return;
  }

  ensureDirectories();

  /*
   * IMPORTANT:
   * Set these environment variables BEFORE loading bot.js.
   * players.js and world.js read WONDERLAND_DATA_DIR when they load.
   */
  process.env.WONDERLAND_CONFIG_PATH = getConfigFile();
  process.env.WONDERLAND_DATA_DIR = getDataDirectory();

  log("Starting Wonderland RPG...");
  log(`Bot module: ${BOT_FILE}`);
  log(`Game data directory: ${getDataDirectory()}`);

  try {
    if (!botModule) {
      botModule = require(BOT_FILE);
    }

    if (
      !botModule ||
      typeof botModule.startBot !== "function"
    ) {
      throw new Error(
        "The RPG bot module does not expose startBot()."
      );
    }

    await botModule.startBot();

    botRunning = true;

    log("✓ Wonderland RPG bot is running.");
    sendStatus();
  } catch (error) {
    botRunning = false;

    log(
      `❌ Could not start Wonderland RPG: ${
        error && error.message
          ? error.message
          : error
      }`
    );

    sendStatus();
  }
}

async function stopBot() {
  if (!botRunning && !botModule) {
    return;
  }

  try {
    if (
      botModule &&
      typeof botModule.stopBot === "function"
    ) {
      await botModule.stopBot();
    }
  } catch (error) {
    log(
      `⚠ Error while stopping Wonderland RPG: ${
        error && error.message
          ? error.message
          : error
      }`
    );
  }

  botRunning = false;

  log("✓ Wonderland RPG bot stopped.");
  sendStatus();
}

ipcMain.handle("get-status", () => {
  const config = loadConfig();

  return {
    twitchConnected: !!(
      config &&
      config.username &&
      config.accessToken
    ),
    botRunning
  };
});

ipcMain.on("connect-twitch", async () => {
  try {
    await authorizeTwitch();
  } catch (error) {
    log(
      `❌ Twitch connection failed: ${
        error && error.message
          ? error.message
          : error
      }`
    );
  }
});

ipcMain.on("disconnect-twitch", async () => {
  try {
    await disconnectTwitch();
  } catch (error) {
    log(
      `❌ Twitch disconnect failed: ${
        error && error.message
          ? error.message
          : error
      }`
    );
  }
});

ipcMain.on("start-bot", async () => {
  await startBot();
});

ipcMain.on("stop-bot", async () => {
  await stopBot();
});

app.whenReady().then(() => {
  ensureDirectories();

  log(`${APP_NAME} launcher starting...`);
  log(`User data directory: ${getUserDataDirectory()}`);
  log(`Game data directory: ${getDataDirectory()}`);

  createWindow();
  sendStatus();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("before-quit", async event => {
  if (!botRunning) {
    return;
  }

  event.preventDefault();

  await stopBot();

  app.quit();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});