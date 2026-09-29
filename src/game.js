// Wonderland RPG
// Core game system

const {
  loadPlayers,
  savePlayers,
  getPlayer,
  getClass,
  setPlayerClass
} = require("./players");

const {
  loadWorld,
  saveWorld,
  startWorld,
  addCommunityXP,
  advanceStory,
  completeEvent,
  increaseThreat,
  recordEnemyDefeat
} = require("./world");

const {
  getRandomEvent
} = require("./events");

const {
  getRandomEnemy,
  getEnemy,
  calculateBattle,
  useAbility
} = require("./combat");

const {
  getItem,
  rollLoot
} = require("./items");

const {
  getShopItem,
  formatShop
} = require("./shop");

const {
  getRecipe,
  hasIngredients,
  removeIngredients,
  formatRecipes
} = require("./crafting");


class WonderlandGame {

  constructor() {

    this.players =
      loadPlayers();

    this.world =
      loadWorld();

    startWorld(
      this.world
    );

    saveWorld(
      this.world
    );

    savePlayers(
      this.players
    );
  }


  // ==========================================
  // ENTER WONDERLAND
  // ==========================================

  enter(username) {

    const player =
      getPlayer(
        this.players,
        username
      );

    savePlayers(
      this.players
    );

    return {
      success: true,
      player,
      message:
        `🐇 @${player.username} ` +
        `has entered Wonderland. ` +
        `📍 ${this.world.location}`
    };
  }


  // ==========================================
  // CHOOSE CLASS
  // ==========================================

  chooseClass(
    username,
    className
  ) {

    const player =
      getPlayer(
        this.players,
        username
      );

    if (!className) {

      return {
        success: false,
        message:
          `@${player.username}, choose a class: ` +
          `warrior, rogue, mage, or wanderer.`
      };
    }

    const result =
      setPlayerClass(
        player,
        className
      );

    if (result.success) {

      savePlayers(
        this.players
      );

      return {
        success: true,
        player,
        message:
          `${result.class.icon} ` +
          `@${player.username} chose ` +
          `${result.class.name}! ` +
          `${result.class.description}`
      };
    }

    return result;
  }


  // ==========================================
  // EXPLORE
  // ==========================================

  explore(username) {

    const player =
      getPlayer(
        this.players,
        username
      );

    const event =
      getRandomEvent(
        this.world.location
      );

    if (!event) {

      return {
        success: false,
        message:
          "Nothing happens."
      };
    }

    player.xp +=
      event.xp || 0;

    player.discoveries +=
      event.item ? 1 : 0;

    if (
      event.item
    ) {

      if (
        !player.inventory.includes(
          event.item
        )
      ) {

        player.inventory.push(
          event.item
        );
      }
    }

    if (
      event.threat
    ) {

      increaseThreat(
        this.world,
        event.threat
      );
    }

    const story =
      advanceStory(
        this.world,
        1
      );

    completeEvent(
      this.world,
      event.name
    );

    addCommunityXP(
      this.world,
      event.xp || 0
    );

    savePlayers(
      this.players
    );

    saveWorld(
      this.world
    );

    let message =
      `🌑 @${player.username} ` +
      `discovers ${event.name}! ` +
      `${event.text} ` +
      `+${event.xp || 0} XP.`;

    if (
      event.item
    ) {

      message +=
        ` 🎁 Found: ${event.item}.`;
    }

    if (
      story.locationChange &&
      story.locationChange.unlocked
    ) {

      message +=
        ` 🗺️ Wonderland has shifted! ` +
        `The community discovered ` +
        `${story.locationChange.location}!`;
    }

    return {
      success: true,
      player,
      event,
      message
    };
  }


  // ==========================================
  // FIGHT
  // ==========================================

  fight(
    username,
    enemyName = null
  ) {

    const player =
      getPlayer(
        this.players,
        username
      );

    if (
      player.health <= 0
    ) {

      player.health =
        player.maxHealth;

      savePlayers(
        this.players
      );

      return {
        success: false,
        message:
          `❤️ @${player.username} ` +
          `has recovered and returned ` +
          `to ${player.maxHealth} HP.`
      };
    }

    let enemy;

    if (
      enemyName
    ) {

      enemy =
        getEnemy(
          enemyName
        );

    } else {

      enemy =
        getRandomEnemy(
          this.world.location
        );
    }

    if (!enemy) {

      return {
        success: false,
        message:
          `👹 No enemy named ` +
          `"${enemyName}" was found.`
      };
    }

    const result =
      calculateBattle(
        player,
        enemy
      );

    let message =
      `⚔️ @${player.username} ` +
      `battles ${enemy.name}! `;

    if (
      result.playerWon
    ) {

      const xp =
        enemy.xp;

      const gold =
        enemy.gold;

      player.xp +=
        xp;

      player.gold +=
        gold;

      recordEnemyDefeat(
        this.world
      );

      addCommunityXP(
        this.world,
        xp
      );

      const story =
        advanceStory(
          this.world,
          1
        );

      message +=
        `🏆 @${player.username} ` +
        `defeated ${enemy.name}! ` +
        `+${xp} XP, +${gold} gold.`;

      while (
        player.xp >=
        player.level * 100
      ) {

        player.xp -=
          player.level * 100;

        player.level++;

        player.maxHealth +=
          10;

        player.health =
          player.maxHealth;

        message +=
          ` 🎉 Level ${player.level}!`;
      }


      // --------------------------------------
      // LOCATION-BASED LOOT
      // --------------------------------------

      const loot =
        rollLoot(
          this.world.location
        );

      if (
        loot
      ) {

        player.inventory.push(
          loot.name
        );

        message +=
          ` 🎁 Loot: ` +
          `${loot.name} ` +
          `[${loot.rarity}]`;
      }


      // --------------------------------------
      // LOCATION UNLOCK
      // --------------------------------------

      if (
        story.locationChange &&
        story.locationChange.unlocked
      ) {

        message +=
          ` 🗺️ Wonderland has shifted! ` +
          `The community discovered ` +
          `${story.locationChange.location}!`;
      }

    } else {

      if (
        result.playerDefeated
      ) {

        message +=
          `💀 @${player.username} ` +
          `was defeated by ` +
          `${enemy.name}! ` +
          `They will recover on their next fight.`;

      } else {

        message +=
          `😨 @${player.username} ` +
          `was unable to defeat ` +
          `${enemy.name}.`;
      }
    }

    savePlayers(
      this.players
    );

    saveWorld(
      this.world
    );

    return {
      success: true,
      player,
      enemy,
      result,
      message
    };
  }


  // ==========================================
  // CLASS ABILITY
  // ==========================================

  ability(username) {

    const player =
      getPlayer(
        this.players,
        username
      );

    const now =
      Date.now();

    if (
      player.abilityCooldownUntil &&
      player.abilityCooldownUntil > now
    ) {

      const remaining =
        Math.ceil(
          (
            player.abilityCooldownUntil -
            now
          ) / 1000
        );

      return {
        success: false,
        message:
          `⏳ @${player.username}, ` +
          `your ability is on cooldown ` +
          `for ${remaining}s.`
      };
    }

    const enemy =
      getRandomEnemy(
        this.world.location
      );

    if (!enemy) {

      return {
        success: false,
        message:
          "There are no enemies here."
      };
    }

    const result =
      useAbility(
        player,
        enemy
      );

    player.abilityCooldownUntil =
      now + 60000;

    let message =
      `${getClass(player.class)?.icon || "🐇"} ` +
      `@${player.username} uses their ` +
      `class ability against ` +
      `${enemy.name}! ` +
      `💥 ${result.damage} damage.`;

    if (
      result.critical
    ) {

      message +=
        ` 💢 CRITICAL!`;
    }

    if (
      result.effect
    ) {

      message +=
        ` ${result.effect}.`;
    }

    if (
      result.defeated
    ) {

      player.xp +=
        enemy.xp;

      player.gold +=
        enemy.gold;

      recordEnemyDefeat(
        this.world
      );

      addCommunityXP(
        this.world,
        enemy.xp
      );

      message +=
        ` 🏆 ${enemy.name} defeated! ` +
        `+${enemy.xp} XP, ` +
        `+${enemy.gold} gold.`;

      const loot =
        rollLoot(
          this.world.location
        );

      if (
        loot
      ) {

        player.inventory.push(
          loot.name
        );

        message +=
          ` 🎁 Loot: ` +
          `${loot.name} ` +
          `[${loot.rarity}]`;
      }

    } else {

      message +=
        ` ❤️ ${enemy.health} HP remains.`;
    }

    savePlayers(
      this.players
    );

    saveWorld(
      this.world
    );

    return {
      success: true,
      player,
      enemy,
      result,
      message
    };
  }


  // ==========================================
  // EQUIPMENT
  // ==========================================

  equipment(username) {

    const player =
      getPlayer(
        this.players,
        username
      );

    if (
      !player.equipment
    ) {

      player.equipment = {
        weapon: null,
        armor: null
      };
    }

    savePlayers(
      this.players
    );

    return {
      success: true,
      player
    };
  }


  // ==========================================
  // EQUIP ITEM
  // ==========================================

  equip(
    username,
    itemName
  ) {

    const player =
      getPlayer(
        this.players,
        username
      );

    if (!itemName) {

      return {
        success: false,
        message:
          `@${player.username}, ` +
          `specify an item to equip.`
      };
    }

    const item =
      getItem(
        itemName
      );

    if (!item) {

      return {
        success: false,
        message:
          `I don't recognize ` +
          `"${itemName}".`
      };
    }

    if (
      item.type !== "weapon" &&
      item.type !== "armor"
    ) {

      return {
        success: false,
        message:
          `${item.name} cannot be equipped.`
      };
    }

    const inventoryIndex =
      player.inventory.findIndex(
        entry =>
          entry.toLowerCase() ===
          item.name.toLowerCase()
      );

    if (
      inventoryIndex === -1
    ) {

      return {
        success: false,
        message:
          `@${player.username}, ` +
          `you don't have ${item.name}.`
      };
    }

    if (
      !player.equipment
    ) {

      player.equipment = {
        weapon: null,
        armor: null
      };
    }

    const slot =
      item.type === "weapon"
        ? "weapon"
        : "armor";

    const oldItem =
      player.equipment[slot];

    player.inventory.splice(
      inventoryIndex,
      1
    );

    if (
      oldItem
    ) {

      player.inventory.push(
        oldItem.name
      );
    }

    player.equipment[slot] =
      item;

    savePlayers(
      this.players
    );

    const stat =
      item.type === "weapon"
        ? `⚔️ +${item.attack} attack`
        : `🛡️ +${item.defense} defense`;

    return {
      success: true,
      player,
      message:
        `🎒 @${player.username} ` +
        `equipped ${item.name}! ` +
        `${stat}`
    };
  }


  // ==========================================
  // USE ITEM
  // ==========================================

  useItem(
    username,
    itemName
  ) {

    const player =
      getPlayer(
        this.players,
        username
      );

    if (!itemName) {

      return {
        success: false,
        message:
          `@${player.username}, ` +
          `specify an item to use.`
      };
    }

    const item =
      getItem(
        itemName
      );

    if (!item) {

      return {
        success: false,
        message:
          `I don't recognize ` +
          `"${itemName}".`
      };
    }

    if (
      item.type !==
      "consumable"
    ) {

      return {
        success: false,
        message:
          `${item.name} is not consumable.`
      };
    }

    const inventoryIndex =
      player.inventory.findIndex(
        entry =>
          entry.toLowerCase() ===
          item.name.toLowerCase()
      );

    if (
      inventoryIndex === -1
    ) {

      return {
        success: false,
        message:
          `@${player.username}, ` +
          `you don't have ${item.name}.`
      };
    }

    if (
      player.health >=
      player.maxHealth
    ) {

      return {
        success: false,
        message:
          `❤️ @${player.username} ` +
          `is already at full health.`
      };
    }

    const oldHealth =
      player.health;

    player.health =
      Math.min(
        player.maxHealth,
        player.health +
          item.heal
      );

    const healed =
      player.health -
      oldHealth;

    player.inventory.splice(
      inventoryIndex,
      1
    );

    savePlayers(
      this.players
    );

    return {
      success: true,
      player,
      message:
        `❤️ @${player.username} ` +
        `used ${item.name} and restored ` +
        `+${healed} HP! ` +
        `(${player.health}/${player.maxHealth})`
    };
  }


  // ==========================================
  // SHOP
  // ==========================================

  shop() {

    return {
      success: true,
      message:
        formatShop()
    };
  }


  // ==========================================
  // BUY
  // ==========================================

  buy(
    username,
    itemName
  ) {

    const player =
      getPlayer(
        this.players,
        username
      );

    if (!itemName) {

      return {
        success: false,
        message:
          `@${player.username}, ` +
          `specify an item to buy. ` +
          `Use !shop to see what's available.`
      };
    }

    const item =
      getShopItem(
        itemName
      );

    if (!item) {

      return {
        success: false,
        message:
          `"${itemName}" is not sold here. ` +
          `Use !shop to see the current stock.`
      };
    }

    if (
      player.gold <
      item.price
    ) {

      return {
        success: false,
        message:
          `💰 @${player.username}, ` +
          `you need ${item.price} gold ` +
          `but only have ${player.gold}.`
      };
    }

    player.gold -=
      item.price;

    player.inventory.push(
      item.name
    );

    savePlayers(
      this.players
    );

    return {
      success: true,
      player,
      item,
      message:
        `🏪 @${player.username} bought ` +
        `${item.name} [${item.rarity}] ` +
        `for ${item.price} gold! ` +
        `💰 Remaining: ${player.gold} gold.`
    };
  }


  // ==========================================
  // RECIPES
  // ==========================================

  recipes(username) {

    const player =
      getPlayer(
        this.players,
        username
      );

    return {
      success: true,
      player,
      message:
        formatRecipes(player)
    };
  }


  // ==========================================
  // CRAFT
  // ==========================================

  craft(
    username,
    itemName
  ) {

    const player =
      getPlayer(
        this.players,
        username
      );

    if (!itemName) {

      return {
        success: false,
        message:
          `@${player.username}, ` +
          `specify an item to craft. ` +
          `Use !recipes to see the recipes.`
      };
    }

    const recipe =
      getRecipe(
        itemName
      );

    if (!recipe) {

      return {
        success: false,
        message:
          `"${itemName}" is not a valid recipe. ` +
          `Use !recipes to see available recipes.`
      };
    }

    if (
      !hasIngredients(
        player.inventory,
        recipe.ingredients
      )
    ) {

      return {
        success: false,
        message:
          `🛠️ @${player.username}, ` +
          `you don't have the ingredients ` +
          `needed to craft ${recipe.name}. ` +
          `Required: ${recipe.ingredients.join(" + ")}`
      };
    }

    removeIngredients(
      player.inventory,
      recipe.ingredients
    );

    player.inventory.push(
      recipe.name
    );

    savePlayers(
      this.players
    );

    return {
      success: true,
      player,
      recipe,
      message:
        `🛠️ @${player.username} crafted ` +
        `${recipe.name} [${recipe.rarity}]! ` +
        `✨ Ingredients used: ` +
        `${recipe.ingredients.join(" + ")}`
    };
  }


  // ==========================================
  // STATUS
  // ==========================================

  status(username) {

    const player =
      getPlayer(
        this.players,
        username
      );

    savePlayers(
      this.players
    );

    return {
      success: true,
      player
    };
  }


  // ==========================================
  // INVENTORY
  // ==========================================

  inventory(username) {

    const player =
      getPlayer(
        this.players,
        username
      );

    if (
      !player.inventory
    ) {

      player.inventory = [];
    }

    savePlayers(
      this.players
    );

    return {
      success: true,
      player,
      inventory:
        player.inventory
    };
  }


  // ==========================================
  // ENEMIES
  // ==========================================

  enemies() {

    const {
      getEnemiesByLocation
    } = require("./combat");

    return {
      success: true,
      location:
        this.world.location,
      enemies:
        getEnemiesByLocation(
          this.world.location
        )
    };
  }


  // ==========================================
  // WORLD STATUS
  // ==========================================

  worldStatus() {

    return {
      success: true,
      world:
        this.world,
      players:
        Object.keys(
          this.players
        ).length
    };
  }

}


module.exports =
  WonderlandGame;