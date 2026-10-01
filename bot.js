// Wonderland RPG
// Twitch adapter

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const tmi = require("tmi.js");

const WonderlandGame = require("./game");
const commands = require("./commands");

const DEFAULT_ENV_FILE = path.join(
  __dirname,
  "..",
  ".env"
);

const CONFIG_PATH =
  process.env.WONDERLAND_CONFIG_PATH ||
  path.join(
    process.env.APPDATA ||
      path.join(
        process.env.USERPROFILE || process.cwd(),
        "AppData",
        "Roaming"
      ),
    "Wonderland RPG",
    "config.json"
  );

let client = null;
let game = null;

function readConfig() {

  if (!fs.existsSync(CONFIG_PATH)) {
    return {};
  }

  try {

    const contents =
      fs.readFileSync(
        CONFIG_PATH,
        "utf8"
      );

    return JSON.parse(contents);

  } catch (error) {

    console.error(
      `⚠️ Could not read Wonderland configuration: ${error.message}`
    );

    return {};

  }

}

function saveConfig(config) {

  const configDirectory =
    path.dirname(CONFIG_PATH);

  fs.mkdirSync(
    configDirectory,
    {
      recursive: true
    }
  );

  fs.writeFileSync(
    CONFIG_PATH,
    JSON.stringify(
      config,
      null,
      2
    ),
    "utf8"
  );

}

function readDevelopmentEnv() {

  if (!fs.existsSync(DEFAULT_ENV_FILE)) {
    return {};
  }

  const contents =
    fs.readFileSync(
      DEFAULT_ENV_FILE,
      "utf8"
    );

  const env = {};

  for (
    const line of contents.split(/\r?\n/)
  ) {

    const trimmed =
      line.trim();

    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      !trimmed.includes("=")
    ) {
      continue;
    }

    const index =
      trimmed.indexOf("=");

    const key =
      trimmed
        .slice(0, index)
        .trim();

    const value =
      trimmed
        .slice(index + 1)
        .trim();

    env[key] = value;

  }

  return env;

}

function getConfiguration() {

  const config =
    readConfig();

  const developmentEnv =
    readDevelopmentEnv();

  const username =
    config.username ||
    process.env.TWITCH_USERNAME ||
    developmentEnv.TWITCH_USERNAME;

  const channel =
    config.channel ||
    process.env.TWITCH_CHANNEL ||
    developmentEnv.TWITCH_CHANNEL;

  const clientId =
    config.clientId ||
    process.env.TWITCH_CLIENT_ID ||
    developmentEnv.TWITCH_CLIENT_ID;

  const accessToken =
    config.accessToken ||
    process.env.TWITCH_ACCESS_TOKEN ||
    developmentEnv.TWITCH_ACCESS_TOKEN;

  const refreshToken =
    config.refreshToken ||
    process.env.TWITCH_REFRESH_TOKEN ||
    developmentEnv.TWITCH_REFRESH_TOKEN;

  if (
    !username ||
    !channel ||
    !clientId ||
    !accessToken ||
    !refreshToken
  ) {

    throw new Error(
      "Missing Twitch configuration. Connect a Twitch account through the Wonderland RPG launcher."
    );

  }

  return {

    username,

    channel,

    clientId,

    accessToken,

    refreshToken

  };

}

function saveTokens(
  username,
  channel,
  clientId,
  newAccessToken,
  newRefreshToken
) {

  const currentConfig =
    readConfig();

  currentConfig.username =
    username;

  currentConfig.channel =
    channel;

  currentConfig.clientId =
    clientId;

  currentConfig.accessToken =
    newAccessToken;

  currentConfig.refreshToken =
    newRefreshToken;

  saveConfig(
    currentConfig
  );

}

async function refreshAccessToken(
  configuration
) {

  console.log(
    "🔄 Refreshing Twitch access token..."
  );

  const response =
    await fetch(
      "https://id.twitch.tv/oauth2/token",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },

        body:
          new URLSearchParams({

            client_id:
              configuration.clientId,

            refresh_token:
              configuration.refreshToken,

            grant_type:
              "refresh_token"

          })

      }
    );

  if (!response.ok) {

    let message =
      `Token refresh failed: ${response.status}`;

    try {

      const data =
        await response.json();

      if (data.message) {

        message =
          data.message;

      }

    } catch {

      // Keep HTTP status message.

    }

    throw new Error(
      message
    );

  }

  const data =
    await response.json();

  if (
    !data.access_token ||
    !data.refresh_token
  ) {

    throw new Error(
      "Twitch returned an incomplete refreshed token."
    );

  }

  saveTokens(
    configuration.username,
    configuration.channel,
    configuration.clientId,
    data.access_token,
    data.refresh_token
  );

  configuration.accessToken =
    data.access_token;

  configuration.refreshToken =
    data.refresh_token;

  console.log(
    "✅ Twitch access token refreshed."
  );

}

async function validateToken(
  accessToken
) {

  const response =
    await fetch(
      "https://id.twitch.tv/oauth2/validate",
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`
        }
      }
    );

  if (!response.ok) {
    return false;
  }

  const data =
    await response.json();

  console.log(
    `✅ Twitch token valid for @${data.login}.`
  );

  return true;

}

async function startBot() {

  if (client) {

    console.log(
      "⚠️ Wonderland RPG bot is already running."
    );

    return client;

  }

  const configuration =
    getConfiguration();

  let valid =
    await validateToken(
      configuration.accessToken
    );

  if (!valid) {

    console.log(
      "⚠️ Twitch access token is invalid."
    );

    await refreshAccessToken(
      configuration
    );

    valid =
      await validateToken(
        configuration.accessToken
      );

    if (!valid) {

      throw new Error(
        "Twitch token could not be validated."
      );

    }

  }

  game =
    new WonderlandGame();

  client =
    new tmi.Client({

      options: {
        debug: true
      },

      identity: {

        username:
          configuration.username,

        password:
          `oauth:${configuration.accessToken}`

      },

      channels: [
        configuration.channel
      ]

    });

  client.on(
    "message",
    (
      channelName,
      tags,
      message,
      self
    ) => {

      if (self) {
        return;
      }

      if (
        !message.startsWith("!")
      ) {
        return;
      }

      const response =
        commands.executeCommand(
          game,
          tags.username,
          message,
          tags
        );

      if (!response) {
        return;
      }

      client.say(
        channelName,
        response
      );

    }
  );

  client.on(
    "connected",
    () => {

      console.log(
        "🔌 Connected to Twitch!"
      );

      console.log(
        `📺 Channel: ${configuration.channel}`
      );

    }
  );

  client.on(
    "disconnected",
    reason => {

      console.log(
        `⚠️ Disconnected from Twitch: ${reason}`
      );

    }
  );

  try {

    await client.connect();

  } catch (error) {

    client = null;
    game = null;

    throw error;

  }

  return client;

}

async function stopBot() {

  if (!client) {
    return;
  }

  const currentClient =
    client;

  client = null;
  game = null;

  try {

    await currentClient.disconnect();

  } catch (error) {

    console.error(
      `⚠️ Error disconnecting from Twitch: ${error.message}`
    );

  }

}

module.exports = {

  startBot,

  stopBot

};

if (
  require.main === module
) {

  startBot().catch(
    error => {

      console.error(
        "❌ Wonderland RPG failed to start:"
      );

      console.error(
        error.message
      );

      process.exitCode = 1;

    }
  );

}