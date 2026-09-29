// Wonderland RPG
// Player persistence system

const fs = require("fs");
const path = require("path");

const DEFAULT_DATA_DIR =
  path.join(__dirname, "..", "data");

const DATA_DIR =
  process.env.WONDERLAND_DATA_DIR ||
  DEFAULT_DATA_DIR;

const PLAYERS_FILE =
  path.join(DATA_DIR, "players.json");


// ==========================================
// PLAYER CLASSES
// ==========================================

const CLASSES = {

  warrior: {
    name: "Warrior",
    icon: "⚔️",
    description:
      "A powerful fighter with high health and defense.",
    maxHealth: 125,
    attackBonus: 2,
    defenseBonus: 4,
    criticalChance: 5,
    ability: "Shield Breaker"
  },

  rogue: {
    name: "Rogue",
    icon: "🗡️",
    description:
      "A fast assassin with powerful critical attacks.",
    maxHealth: 90,
    attackBonus: 5,
    defenseBonus: 1,
    criticalChance: 25,
    ability: "Shadow Strike"
  },

  mage: {
    name: "Mage",
    icon: "🔮",
    description:
      "A fragile spellcaster capable of devastating attacks.",
    maxHealth: 80,
    attackBonus: 8,
    defenseBonus: 0,
    criticalChance: 15,
    ability: "Chaos Bolt"
  },

  wanderer: {
    name: "Wanderer",
    icon: "🐇",
    description:
      "A mysterious traveler with balanced abilities.",
    maxHealth: 100,
    attackBonus: 3,
    defenseBonus: 2,
    criticalChance: 10,
    ability: "Wild Strike"
  }

};


// ==========================================
// DATA DIRECTORY
// ==========================================

function ensureDataDirectory() {

  if (!fs.existsSync(DATA_DIR)) {

    fs.mkdirSync(
      DATA_DIR,
      {
        recursive: true
      }
    );

  }

}


// ==========================================
// LOAD PLAYERS
// ==========================================

function loadPlayers() {

  ensureDataDirectory();

  if (!fs.existsSync(PLAYERS_FILE)) {
    return {};
  }

  try {

    const data =
      fs.readFileSync(
        PLAYERS_FILE,
        "utf8"
      );

    if (!data.trim()) {
      return {};
    }

    const players =
      JSON.parse(data);


    for (
      const username of Object.keys(players)
    ) {

      const player =
        players[username];


      if (!player.class) {
        player.class = "wanderer";
      }


      const classData =
        CLASSES[player.class] ||
        CLASSES.wanderer;


      if (
        typeof player.maxHealth !==
        "number"
      ) {

        player.maxHealth =
          classData.maxHealth;

      }


      if (
        typeof player.health !==
        "number"
      ) {

        player.health =
          player.maxHealth;

      }


      if (
        typeof player.abilityCooldownUntil !==
        "number"
      ) {

        player.abilityCooldownUntil =
          0;

      }


      // ------------------------------------
      // EQUIPMENT MIGRATION
      // ------------------------------------

      if (!player.equipment) {

        player.equipment = {

          weapon: null,

          armor: null

        };

      }


      if (
        !Array.isArray(
          player.inventory
        )
      ) {

        player.inventory = [];

      }

    }


    return players;

  } catch (error) {

    console.error(
      "Could not load player data:",
      error.message
    );

    return {};

  }

}


// ==========================================
// SAVE PLAYERS
// ==========================================

function savePlayers(players) {

  ensureDataDirectory();

  try {

    fs.writeFileSync(
      PLAYERS_FILE,
      JSON.stringify(
        players,
        null,
        2
      ),
      "utf8"
    );

    return true;

  } catch (error) {

    console.error(
      "Could not save player data:",
      error.message
    );

    return false;

  }

}


// ==========================================
// GET PLAYER
// ==========================================

function getPlayer(
  players,
  username
) {

  const name =
    username.toLowerCase();


  if (!players[name]) {

    players[name] = {

      username:
        name,

      class:
        "wanderer",

      level:
        1,

      xp:
        0,

      health:
        100,

      maxHealth:
        100,

      gold:
        0,

      inventory:
        [],

      discoveries:
        0,

      abilityCooldownUntil:
        0,

      equipment: {

        weapon:
          null,

        armor:
          null

      },

      joinedAt:
        new Date().toISOString()

    };

  }


  if (!players[name].class) {

    players[name].class =
      "wanderer";

  }


  const classData =
    CLASSES[
      players[name].class
    ] || CLASSES.wanderer;


  if (
    typeof players[name].maxHealth !==
    "number"
  ) {

    players[name].maxHealth =
      classData.maxHealth;

  }


  if (
    typeof players[name].health !==
    "number"
  ) {

    players[name].health =
      players[name].maxHealth;

  }


  if (
    typeof players[name].abilityCooldownUntil !==
    "number"
  ) {

    players[name].abilityCooldownUntil =
      0;

  }


  if (!players[name].equipment) {

    players[name].equipment = {

      weapon: null,

      armor: null

    };

  }


  if (
    !Array.isArray(
      players[name].inventory
    )
  ) {

    players[name].inventory = [];

  }


  return players[name];

}


// ==========================================
// GET CLASS
// ==========================================

function getClass(className) {

  if (!className) {
    return null;
  }

  return (
    CLASSES[
      className.toLowerCase()
    ] || null
  );

}


// ==========================================
// GET ALL CLASSES
// ==========================================

function getAllClasses() {

  return CLASSES;

}


// ==========================================
// CHANGE CLASS
// ==========================================

function setPlayerClass(
  player,
  className
) {

  const normalized =
    className.toLowerCase();


  const classData =
    CLASSES[normalized];


  if (!classData) {

    return {

      success: false,

      message:
        "That class does not exist."

    };

  }


  if (
    player.class !==
    "wanderer"
  ) {

    return {

      success: false,

      message:
        `@${player.username}, you already chose ` +
        `${player.class}. Your class is permanent.`

    };

  }


  player.class =
    normalized;


  player.maxHealth =
    classData.maxHealth;


  player.health =
    classData.maxHealth;


  player.abilityCooldownUntil =
    0;


  return {

    success: true,

    class:
      classData,

    player

  };

}


module.exports = {

  CLASSES,

  loadPlayers,

  savePlayers,

  getPlayer,

  getClass,

  getAllClasses,

  setPlayerClass

};