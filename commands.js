// Wonderland RPG
// Command system
// Twitch-independent

const COMMANDS = {

  enter: {
    description: "Enter Wonderland",
    usage: "!enter"
  },

  class: {
    description: "Choose your RPG class",
    usage:
      "!class warrior | rogue | mage | healer | wanderer"
  },

  classes: {
    description: "View available classes",
    usage: "!classes"
  },

  explore: {
    description: "Explore Wonderland",
    usage: "!explore"
  },

  fight: {
    description: "Fight an enemy",
    usage: "!fight [enemy]"
  },

  ability: {
    description: "Use your class ability",
    usage: "!ability [@player]"
  },

  restartstory: {
    description: "Restart the shared Wonderland story",
    usage: "!restartstory"
  },

  enemies: {
    description:
      "View enemies in the current location",
    usage: "!enemies"
  },

  equipment: {
    description: "View equipped gear",
    usage: "!equipment"
  },

  equip: {
    description: "Equip a weapon or armor",
    usage: "!equip [item]"
  },

  use: {
    description: "Use a consumable item",
    usage: "!use [item]"
  },

  shop: {
    description: "View the Wonderland shop",
    usage: "!shop"
  },

  buy: {
    description: "Buy an item from the shop",
    usage: "!buy [item]"
  },

  recipes: {
    description:
      "View recipes you can currently craft",
    usage: "!recipes"
  },

  craft: {
    description: "Craft an item",
    usage: "!craft [item]"
  },

  status: {
    description: "View your character",
    usage: "!status"
  },

  inventory: {
    description: "View your inventory",
    usage: "!inventory"
  },

  world: {
    description:
      "View the shared Wonderland",
    usage: "!world"
  },

  help: {
    description:
      "Show Wonderland commands",
    usage: "!help"
  }

};


function parseCommand(message) {

  if (
    !message ||
    !message.startsWith("!")
  ) {

    return null;

  }

  const parts =
    message
      .trim()
      .split(/\s+/);

  const command =
    parts[0]
      .substring(1)
      .toLowerCase();

  const args =
    parts.slice(1);

  return {
    command,
    args
  };

}


function formatStatus(player) {

  const classNames = {

    warrior:
      "⚔️ Warrior",

    rogue:
      "🗡️ Rogue",

    mage:
      "🔮 Mage",

    healer:
      "💚 Healer",

    wanderer:
      "🐇 Wanderer"

  };

  const className =
    classNames[player.class] ||
    "🐇 Wanderer";

  return (
    `🧑 ${player.username} | ` +
    `${className} | ` +
    `Level ${player.level} | ` +
    `XP ${player.xp}/${player.level * 100} | ` +
    `❤️ ${player.health}/${player.maxHealth} | ` +
    `💰 ${player.gold} gold`
  );

}


function formatInventory(player) {

  if (
    !player ||
    !player.inventory ||
    !player.inventory.length
  ) {

    return (
      `🎒 @${player?.username || "player"}'s ` +
      `inventory is empty.`
    );

  }

  return (
    `🎒 @${player.username}'s inventory: ` +
    `${player.inventory.join(", ")}`
  );

}


function formatEquipment(player) {

  const weapon =
    player.equipment?.weapon;

  const armor =
    player.equipment?.armor;

  const weaponText =
    weapon
      ? `${weapon.name} (+${weapon.attack} ATK)`
      : "None";

  const armorText =
    armor
      ? `${armor.name} (+${armor.defense} DEF)`
      : "None";

  return (
    `🎒 @${player.username} | ` +
    `⚔️ Weapon: ${weaponText} | ` +
    `🛡️ Armor: ${armorText}`
  );

}


function formatWorld(
  world,
  playerCount
) {

  return (
    `🌑 ${world.name} | ` +
    `Chapter ${world.chapter} | ` +
    `📍 ${world.location} | ` +
    `☠️ Threat: ${world.threat} | ` +
    `🌎 Community Lv.${world.communityLevel} | ` +
    `📖 Story: ${world.storyProgress} | ` +
    `👥 Players: ${playerCount}`
  );

}


function formatClasses() {

  return (
    `⚔️ Warrior: high health/defense | ` +
    `🗡️ Rogue: high damage/crit | ` +
    `🔮 Mage: powerful attacks/low health | ` +
    `💚 Healer: heals and revives players | ` +
    `🐇 Wanderer: balanced`
  );

}


function formatEnemies(result) {

  if (
    !result.enemies ||
    !result.enemies.length
  ) {

    return (
      `👹 No known enemies haunt ` +
      `${result.location}.`
    );

  }

  const names =
    result.enemies.map(
      enemy =>
        `${enemy.name} (${enemy.health} HP)`
    );

  return (
    `👹 Enemies in ${result.location}: ` +
    `${names.join(" | ")}`
  );

}


function formatHelp() {

  return (
    `🐇 Wonderland commands: ` +
    `!enter | ` +
    `!class [warrior/rogue/mage/healer/wanderer] | ` +
    `!classes | ` +
    `!explore | ` +
    `!fight [enemy] | ` +
    `!ability [@player] | ` +
    `!restartstory | ` +
    `!enemies | ` +
    `!equipment | ` +
    `!equip [item] | ` +
    `!use [item] | ` +
    `!shop | ` +
    `!buy [item] | ` +
    `!recipes | ` +
    `!craft [item] | ` +
    `!status | ` +
    `!inventory | ` +
    `!world | ` +
    `!help`
  );

}


function executeCommand(
  game,
  username,
  message,
  tags = {}
) {

  const parsed =
    parseCommand(message);

  if (!parsed) {
    return null;
  }

  const {
    command,
    args
  } = parsed;


  switch (command) {

    case "enter": {

      const result =
        game.enter(
          username
        );

      return result.message;

    }


    case "class": {

      const className =
        args.length
          ? args[0]
          : null;

      const result =
        game.chooseClass(
          username,
          className
        );

      return result.message;

    }


    case "classes":

      return formatClasses();


    case "explore": {

      const result =
        game.explore(
          username
        );

      return result.message;

    }


    case "fight": {

      const enemyName =
        args.length
          ? args.join(" ")
          : null;

      const result =
        game.fight(
          username,
          enemyName
        );

      return result.message;

    }


    case "ability": {

      const target =
        args.length
          ? args[0]
          : null;

      const result =
        game.ability(
          username,
          target
        );

      return result.message;

    }


    case "restartstory": {

      const isBroadcaster =
        tags?.badges?.broadcaster === "1";

      if (!isBroadcaster) {

        return (
          `🔒 @${username}, ` +
          `only the broadcaster can restart the story.`
        );

      }

      const result =
        game.restartStory();

      return result.message;

    }


    case "enemies": {

      const result =
        game.enemies();

      return formatEnemies(
        result
      );

    }


    case "equipment": {

      const result =
        game.equipment(
          username
        );

      if (!result.success) {
        return result.message;
      }

      return formatEquipment(
        result.player
      );

    }


    case "equip": {

      const itemName =
        args.join(" ");

      const result =
        game.equip(
          username,
          itemName
        );

      return result.message;

    }


    case "use": {

      const itemName =
        args.join(" ");

      const result =
        game.useItem(
          username,
          itemName
        );

      return result.message;

    }


    case "shop": {

      const result =
        game.shop();

      return result.message;

    }


    case "buy": {

      const itemName =
        args.join(" ");

      const result =
        game.buy(
          username,
          itemName
        );

      return result.message;

    }


    case "recipes": {

      const result =
        game.recipes(
          username
        );

      return result.message;

    }


    case "craft": {

      const itemName =
        args.join(" ");

      const result =
        game.craft(
          username,
          itemName
        );

      return result.message;

    }


    case "status": {

      const result =
        game.status(
          username
        );

      if (!result.success) {
        return result.message;
      }

      return formatStatus(
        result.player
      );

    }


    case "inventory": {

      const result =
        game.inventory(
          username
        );

      if (!result.success) {
        return result.message;
      }

      return formatInventory(
        result.player
      );

    }


    case "world": {

      const result =
        game.worldStatus();

      return formatWorld(
        result.world,
        result.players
      );

    }


    case "help":

      return formatHelp();


    default:

      return null;

  }

}


function getCommands() {
  return COMMANDS;
}


module.exports = {

  parseCommand,

  executeCommand,

  getCommands,

  formatStatus,

  formatInventory,

  formatEquipment,

  formatWorld,

  formatHelp,

  formatClasses,

  formatEnemies

};