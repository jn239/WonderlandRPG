// Wonderland RPG
// Combat system
// Twitch-independent

const {
  getClass
} = require("./players");


// ==========================================
// ENEMIES
// ==========================================

const ENEMIES = {

  "Card Soldier": {
    name: "Card Soldier",
    location: "The Rabbit Hole",
    health: 30,
    attack: 8,
    defense: 2,
    xp: 20,
    gold: 5
  },

  "Shadow Rabbit": {
    name: "Shadow Rabbit",
    location: "The Twisted Forest",
    health: 45,
    attack: 12,
    defense: 3,
    xp: 35,
    gold: 10
  },

  "Forest Stalker": {
    name: "Forest Stalker",
    location: "The Twisted Forest",
    health: 55,
    attack: 14,
    defense: 4,
    xp: 45,
    gold: 15
  },

  "Poison Frog": {
    name: "Poison Frog",
    location: "The Mushroom Garden",
    health: 65,
    attack: 16,
    defense: 5,
    xp: 55,
    gold: 18
  },

  "Mushroom Beast": {
    name: "Mushroom Beast",
    location: "The Mushroom Garden",
    health: 75,
    attack: 18,
    defense: 6,
    xp: 65,
    gold: 22
  },

  "Mad Hatter's Guard": {
    name: "Mad Hatter's Guard",
    location: "The Mad Hatter's Domain",
    health: 80,
    attack: 20,
    defense: 7,
    xp: 75,
    gold: 30
  },

  "Clockwork Guard": {
    name: "Clockwork Guard",
    location: "The Mad Hatter's Domain",
    health: 90,
    attack: 22,
    defense: 8,
    xp: 85,
    gold: 35
  },

  "Queen's Executioner": {
    name: "Queen's Executioner",
    location: "The Queen's Castle",
    health: 110,
    attack: 25,
    defense: 9,
    xp: 100,
    gold: 40
  },

  "Royal Card Knight": {
    name: "Royal Card Knight",
    location: "The Queen's Castle",
    health: 125,
    attack: 28,
    defense: 10,
    xp: 115,
    gold: 50
  },

  "Jabberwock": {
    name: "Jabberwock",
    location: "The Jabberwock's Lair",
    health: 180,
    attack: 32,
    defense: 12,
    xp: 175,
    gold: 100
  },

  "Jabberwock Spawn": {
    name: "Jabberwock Spawn",
    location: "The Jabberwock's Lair",
    health: 130,
    attack: 27,
    defense: 9,
    xp: 125,
    gold: 65
  },

  "Cheshire Shade": {
    name: "Cheshire Shade",
    location: "The Heart of Wonderland",
    health: 160,
    attack: 30,
    defense: 11,
    xp: 150,
    gold: 75
  },

  "Heart Guardian": {
    name: "Heart Guardian",
    location: "The Heart of Wonderland",
    health: 220,
    attack: 38,
    defense: 15,
    xp: 225,
    gold: 150
  }

};


// ==========================================
// EQUIPMENT BONUSES
// ==========================================

function getEquipmentBonuses(player) {

  let attack = 0;
  let defense = 0;

  if (
    player.equipment &&
    player.equipment.weapon
  ) {

    attack +=
      player.equipment.weapon.attack || 0;

  }

  if (
    player.equipment &&
    player.equipment.armor
  ) {

    defense +=
      player.equipment.armor.defense || 0;

  }

  return {
    attack,
    defense
  };

}


// ==========================================
// GET ENEMY
// ==========================================

function getEnemy(name) {

  if (!name) {
    return null;
  }

  const normalizedName =
    name.toLowerCase();

  const enemy =
    Object.values(ENEMIES).find(
      entry =>
        entry.name.toLowerCase() ===
        normalizedName
    );

  if (!enemy) {
    return null;
  }

  return {
    ...enemy
  };

}


// ==========================================
// RANDOM ENEMY
// ==========================================

function getRandomEnemy(location = null) {

  let availableEnemies =
    Object.values(ENEMIES);

  if (location) {

    const locationEnemies =
      availableEnemies.filter(
        enemy =>
          enemy.location === location
      );

    if (
      locationEnemies.length > 0
    ) {

      availableEnemies =
        locationEnemies;

    }

  }

  const randomIndex =
    Math.floor(
      Math.random() *
      availableEnemies.length
    );

  return {
    ...availableEnemies[randomIndex]
  };

}


// ==========================================
// ENEMIES BY LOCATION
// ==========================================

function getEnemiesByLocation(location) {

  return Object.values(ENEMIES).filter(
    enemy =>
      enemy.location === location
  );

}


// ==========================================
// DAMAGE
// ==========================================

function calculateDamage(
  attack,
  defense
) {

  const baseDamage =
    attack - defense;

  const variation =
    Math.floor(
      Math.random() * 6
    ) - 2;

  return Math.max(
    1,
    baseDamage + variation
  );

}


// ==========================================
// PLAYER ATTACK
// ==========================================

function playerAttack(
  player,
  enemy
) {

  const classData =
    getClass(player.class) ||
    getClass("wanderer");

  const equipment =
    getEquipmentBonuses(player);

  const baseAttack =
    10 +
    player.level * 3 +
    classData.attackBonus +
    equipment.attack;

  let damage =
    calculateDamage(
      baseAttack,
      enemy.defense
    );

  let critical = false;

  const roll =
    Math.random() * 100;

  if (
    roll <
    classData.criticalChance
  ) {

    damage =
      Math.floor(
        damage * 1.75
      );

    critical = true;

  }

  enemy.health -= damage;

  if (
    enemy.health < 0
  ) {

    enemy.health = 0;

  }

  return {
    damage,
    critical,
    defeated:
      enemy.health <= 0
  };

}


// ==========================================
// ENEMY ATTACK
// ==========================================

function enemyAttack(
  player,
  enemy
) {

  const classData =
    getClass(player.class) ||
    getClass("wanderer");

  const equipment =
    getEquipmentBonuses(player);

  const playerDefense =
    Math.floor(
      player.level * 2
    ) +
    classData.defenseBonus +
    equipment.defense;

  const damage =
    calculateDamage(
      enemy.attack,
      playerDefense
    );

  player.health -= damage;

  if (
    player.health < 0
  ) {

    player.health = 0;

  }

  return {
    damage,
    defeated:
      player.health <= 0
  };

}


// ==========================================
// WARRIOR ABILITY
// ==========================================

function warriorAbility(
  player,
  enemy
) {

  const classData =
    getClass("warrior");

  const equipment =
    getEquipmentBonuses(player);

  const attack =
    14 +
    player.level * 4 +
    classData.attackBonus +
    equipment.attack;

  const damage =
    Math.max(
      1,
      attack -
      Math.floor(
        enemy.defense * 0.5
      )
    );

  enemy.health -= damage;

  if (
    enemy.health < 0
  ) {

    enemy.health = 0;

  }

  enemy.defense =
    Math.max(
      0,
      enemy.defense - 3
    );

  return {
    damage,
    critical: false,
    effect:
      "Enemy defense reduced by 3",
    defeated:
      enemy.health <= 0
  };

}


// ==========================================
// ROGUE ABILITY
// ==========================================

function rogueAbility(
  player,
  enemy
) {

  const classData =
    getClass("rogue");

  const equipment =
    getEquipmentBonuses(player);

  const attack =
    12 +
    player.level * 4 +
    classData.attackBonus +
    equipment.attack;

  let damage =
    calculateDamage(
      attack,
      enemy.defense
    );

  let critical = false;

  if (
    Math.random() < 0.75
  ) {

    damage =
      Math.floor(
        damage * 2.5
      );

    critical = true;

  }

  enemy.health -= damage;

  if (
    enemy.health < 0
  ) {

    enemy.health = 0;

  }

  return {
    damage,
    critical,
    effect:
      critical
        ? "Shadow Strike critical hit"
        : "Shadow Strike",
    defeated:
      enemy.health <= 0
  };

}


// ==========================================
// MAGE ABILITY
// ==========================================

function mageAbility(
  player,
  enemy
) {

  const classData =
    getClass("mage");

  const equipment =
    getEquipmentBonuses(player);

  const attack =
    16 +
    player.level * 5 +
    classData.attackBonus +
    equipment.attack;

  const effectiveDefense =
    Math.floor(
      enemy.defense * 0.4
    );

  const damage =
    Math.max(
      1,
      attack -
      effectiveDefense
    );

  enemy.health -= damage;

  if (
    enemy.health < 0
  ) {

    enemy.health = 0;

  }

  return {
    damage,
    critical: false,
    effect:
      "Chaos Bolt ignored most enemy defense",
    defeated:
      enemy.health <= 0
  };

}


// ==========================================
// WANDERER ABILITY
// ==========================================

function wandererAbility(
  player,
  enemy
) {

  const equipment =
    getEquipmentBonuses(player);

  const attack =
    13 +
    player.level * 4 +
    equipment.attack;

  let damage =
    calculateDamage(
      attack,
      enemy.defense
    );

  const critical =
    Math.random() < 0.35;

  if (critical) {

    damage =
      Math.floor(
        damage * 2
      );

  }

  enemy.health -= damage;

  if (
    enemy.health < 0
  ) {

    enemy.health = 0;

  }

  return {
    damage,
    critical,
    effect:
      "Wild Strike",
    defeated:
      enemy.health <= 0
  };

}


// ==========================================
// HEALER ABILITY
// ==========================================
// Restores another player's health to their
// maximum. If the target is at 0 HP, this is
// treated as a revival.

function healerAbility(
  player,
  target
) {

  if (!target) {

    return {
      success: false,
      reason: "invalid_target"
    };

  }

  const maxHealth =
    target.maxHealth || 100;

  const wasDefeated =
    target.health <= 0;

  const previousHealth =
    Math.max(
      0,
      target.health || 0
    );

  if (
    previousHealth >= maxHealth
  ) {

    return {
      success: false,
      reason: "already_full",
      previousHealth,
      maxHealth,
      revived: false,
      healed: 0
    };

  }

  target.health =
    maxHealth;

  return {
    success: true,
    previousHealth,
    maxHealth,
    healed:
      maxHealth - previousHealth,
    revived:
      wasDefeated
  };

}


// ==========================================
// USE ABILITY
// ==========================================

function useAbility(
  player,
  enemy
) {

  switch (player.class) {

    case "warrior":

      return warriorAbility(
        player,
        enemy
      );

    case "rogue":

      return rogueAbility(
        player,
        enemy
      );

    case "mage":

      return mageAbility(
        player,
        enemy
      );

    default:

      return wandererAbility(
        player,
        enemy
      );

  }

}


// ==========================================
// COMPLETE BATTLE
// ==========================================

function calculateBattle(
  player,
  enemy
) {

  const battleEnemy = {
    ...enemy
  };

  const rounds = [];

  let playerWon = false;
  let playerDefeated = false;

  while (
    battleEnemy.health > 0 &&
    player.health > 0 &&
    rounds.length < 20
  ) {

    const playerResult =
      playerAttack(
        player,
        battleEnemy
      );

    rounds.push({

      attacker:
        player.username,

      target:
        battleEnemy.name,

      damage:
        playerResult.damage,

      critical:
        playerResult.critical

    });

    if (
      playerResult.defeated
    ) {

      playerWon = true;
      break;

    }

    const enemyResult =
      enemyAttack(
        player,
        battleEnemy
      );

    rounds.push({

      attacker:
        battleEnemy.name,

      target:
        player.username,

      damage:
        enemyResult.damage,

      critical:
        false

    });

    if (
      enemyResult.defeated
    ) {

      playerDefeated = true;
      break;

    }

  }

  return {
    playerWon,
    playerDefeated,
    enemy:
      battleEnemy,
    rounds
  };

}


// ==========================================
// ALL ENEMIES
// ==========================================

function getAllEnemies() {

  return Object.values(ENEMIES);

}


module.exports = {

  getEnemy,

  getRandomEnemy,

  getEnemiesByLocation,

  calculateDamage,

  getEquipmentBonuses,

  playerAttack,

  enemyAttack,

  useAbility,

  warriorAbility,

  rogueAbility,

  mageAbility,

  wandererAbility,

  healerAbility,

  calculateBattle,

  getAllEnemies

};