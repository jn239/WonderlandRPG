// Wonderland RPG
// Shared world system

const fs = require("fs");
const path = require("path");

const DEFAULT_DATA_DIR =
  path.join(__dirname, "..", "data");

const DATA_DIR =
  process.env.WONDERLAND_DATA_DIR ||
  DEFAULT_DATA_DIR;

const WORLD_FILE =
  path.join(DATA_DIR, "world.json");

const LOCATIONS = [
  {
    name: "The Rabbit Hole",
    requiredStory: 0
  },
  {
    name: "The Twisted Forest",
    requiredStory: 10
  },
  {
    name: "The Mushroom Garden",
    requiredStory: 20
  },
  {
    name: "The Mad Hatter's Domain",
    requiredStory: 35
  },
  {
    name: "The Queen's Castle",
    requiredStory: 50
  },
  {
    name: "The Jabberwock's Lair",
    requiredStory: 75
  },
  {
    name: "The Heart of Wonderland",
    requiredStory: 100
  }
];

const THREAT_LEVELS = [
  "Unknown",
  "Unsettling",
  "Dangerous",
  "Deadly",
  "Nightmarish"
];

const DEFAULT_WORLD = {
  name: "Wonderland",
  chapter: 1,
  location: "The Rabbit Hole",
  communityXP: 0,
  communityLevel: 1,
  threat: "Unknown",
  storyProgress: 0,
  defeatedEnemies: 0,
  discoveredLocations: [
    "The Rabbit Hole"
  ],
  completedEvents: 0,
  lastEvent: null,
  startedAt: null
};

function ensureDataDirectory() {
  fs.mkdirSync(
    DATA_DIR,
    {
      recursive: true
    }
  );
}

function loadWorld() {
  ensureDataDirectory();

  if (!fs.existsSync(WORLD_FILE)) {
    return {
      ...DEFAULT_WORLD
    };
  }

  try {
    const data =
      fs.readFileSync(
        WORLD_FILE,
        "utf8"
      );

    if (!data.trim()) {
      return {
        ...DEFAULT_WORLD
      };
    }

    return {
      ...DEFAULT_WORLD,
      ...JSON.parse(data)
    };
  } catch (error) {
    console.error(
      "Could not load Wonderland world:",
      error.message
    );

    return {
      ...DEFAULT_WORLD
    };
  }
}

function saveWorld(world) {
  ensureDataDirectory();

  try {
    fs.writeFileSync(
      WORLD_FILE,
      JSON.stringify(
        world,
        null,
        2
      ),
      "utf8"
    );

    return true;
  } catch (error) {
    console.error(
      "Could not save Wonderland world:",
      error.message
    );

    return false;
  }
}

function startWorld(world) {
  if (!world.startedAt) {
    world.startedAt =
      new Date().toISOString();
  }

  return world;
}

function addCommunityXP(
  world,
  amount
) {
  world.communityXP += amount;

  let requiredXP =
    world.communityLevel * 500;

  let leveledUp = false;

  while (
    world.communityXP >=
    requiredXP
  ) {
    world.communityXP -=
      requiredXP;

    world.communityLevel++;

    leveledUp = true;

    requiredXP =
      world.communityLevel * 500;
  }

  return leveledUp;
}

function getUnlockedLocations(
  world
) {
  return LOCATIONS.filter(
    location =>
      world.storyProgress >=
      location.requiredStory
  );
}

function getNextLocation(
  world
) {
  return (
    LOCATIONS.find(
      location =>
        location.requiredStory >
        world.storyProgress
    ) || null
  );
}

function updateLocationFromProgress(
  world
) {
  const unlocked =
    getUnlockedLocations(
      world
    );

  const newest =
    unlocked[
      unlocked.length - 1
    ];

  if (
    newest &&
    newest.name !==
      world.location
  ) {
    const previousLocation =
      world.location;

    world.location =
      newest.name;

    if (
      !world.discoveredLocations.includes(
        newest.name
      )
    ) {
      world.discoveredLocations.push(
        newest.name
      );
    }

    return {
      unlocked: true,
      previousLocation,
      location:
        newest.name
    };
  }

  return {
    unlocked: false,
    location:
      world.location
  };
}

function changeLocation(
  world,
  location
) {
  const destination =
    LOCATIONS.find(
      entry =>
        entry.name.toLowerCase() ===
        location.toLowerCase()
    );

  if (!destination) {
    return {
      success: false,
      message:
        "That place does not exist in Wonderland."
    };
  }

  if (
    world.storyProgress <
    destination.requiredStory
  ) {
    return {
      success: false,
      message:
        `That location is locked. ` +
        `Story progress ${destination.requiredStory} required.`
    };
  }

  world.location =
    destination.name;

  if (
    !world.discoveredLocations.includes(
      destination.name
    )
  ) {
    world.discoveredLocations.push(
      destination.name
    );
  }

  return {
    success: true,
    location:
      destination.name
  };
}

function advanceStory(
  world,
  amount = 1
) {
  const oldProgress =
    world.storyProgress;

  world.storyProgress +=
    amount;

  const locationChange =
    updateLocationFromProgress(
      world
    );

  return {
    oldProgress,
    newProgress:
      world.storyProgress,
    locationChange
  };
}

function completeEvent(
  world,
  eventName
) {
  world.completedEvents++;

  world.lastEvent = {
    name: eventName,
    completedAt:
      new Date().toISOString()
  };

  return world;
}

function increaseThreat(
  world,
  amount = 1
) {
  const currentIndex =
    THREAT_LEVELS.indexOf(
      world.threat
    );

  const nextIndex =
    Math.min(
      currentIndex + amount,
      THREAT_LEVELS.length - 1
    );

  world.threat =
    THREAT_LEVELS[nextIndex];

  return world;
}

function recordEnemyDefeat(
  world
) {
  world.defeatedEnemies++;

  return world;
}

module.exports = {
  DEFAULT_WORLD,
  LOCATIONS,
  THREAT_LEVELS,
  loadWorld,
  saveWorld,
  startWorld,
  addCommunityXP,
  getUnlockedLocations,
  getNextLocation,
  updateLocationFromProgress,
  changeLocation,
  advanceStory,
  completeEvent,
  increaseThreat,
  recordEnemyDefeat
};