// Wonderland RPG
// Item and location-based loot system

const ITEMS = [

  // ==========================================
  // THE RABBIT HOLE
  // ==========================================

  {
    name: "Rusty Sword",
    type: "weapon",
    rarity: "Common",
    attack: 3,
    location: "The Rabbit Hole"
  },

  {
    name: "Old Leather Coat",
    type: "armor",
    rarity: "Common",
    defense: 2,
    location: "The Rabbit Hole"
  },

  {
    name: "Small Health Potion",
    type: "consumable",
    rarity: "Common",
    heal: 25,
    location: "The Rabbit Hole"
  },

  {
    name: "Rabbit's Lucky Charm",
    type: "misc",
    rarity: "Common",
    location: "The Rabbit Hole"
  },


  // ==========================================
  // THE TWISTED FOREST
  // ==========================================

  {
    name: "Shadow Dagger",
    type: "weapon",
    rarity: "Uncommon",
    attack: 5,
    location: "The Twisted Forest"
  },

  {
    name: "Forest Cloak",
    type: "armor",
    rarity: "Uncommon",
    defense: 5,
    location: "The Twisted Forest"
  },

  {
    name: "Forest Berry",
    type: "consumable",
    rarity: "Uncommon",
    heal: 30,
    location: "The Twisted Forest"
  },

  {
    name: "Black Rose",
    type: "misc",
    rarity: "Uncommon",
    location: "The Twisted Forest"
  },


  // ==========================================
  // THE MUSHROOM GARDEN
  // ==========================================

  {
    name: "Poison Fang",
    type: "weapon",
    rarity: "Rare",
    attack: 7,
    location: "The Mushroom Garden"
  },

  {
    name: "Mushroom Armor",
    type: "armor",
    rarity: "Rare",
    defense: 7,
    location: "The Mushroom Garden"
  },

  {
    name: "Red Potion",
    type: "consumable",
    rarity: "Rare",
    heal: 50,
    location: "The Mushroom Garden"
  },

  {
    name: "Glowing Mushroom",
    type: "misc",
    rarity: "Rare",
    location: "The Mushroom Garden"
  },


  // ==========================================
  // MAD HATTER'S DOMAIN
  // ==========================================

  {
    name: "Hatter's Cane",
    type: "weapon",
    rarity: "Rare",
    attack: 8,
    location: "The Mad Hatter's Domain"
  },

  {
    name: "Clockwork Coat",
    type: "armor",
    rarity: "Rare",
    defense: 8,
    location: "The Mad Hatter's Domain"
  },

  {
    name: "Mad Tea",
    type: "consumable",
    rarity: "Rare",
    heal: 65,
    location: "The Mad Hatter's Domain"
  },

  {
    name: "Backwards Clock",
    type: "misc",
    rarity: "Rare",
    location: "The Mad Hatter's Domain"
  },


  // ==========================================
  // QUEEN'S CASTLE
  // ==========================================

  {
    name: "Royal Blade",
    type: "weapon",
    rarity: "Epic",
    attack: 11,
    location: "The Queen's Castle"
  },

  {
    name: "Queen's Guard Armor",
    type: "armor",
    rarity: "Epic",
    defense: 11,
    location: "The Queen's Castle"
  },

  {
    name: "Queen's Potion",
    type: "consumable",
    rarity: "Epic",
    heal: 80,
    location: "The Queen's Castle"
  },

  {
    name: "Queen's Card",
    type: "misc",
    rarity: "Epic",
    location: "The Queen's Castle"
  },


  // ==========================================
  // JABBERWOCK'S LAIR
  // ==========================================

  {
    name: "Dragonfang",
    type: "weapon",
    rarity: "Epic",
    attack: 15,
    location: "The Jabberwock's Lair"
  },

  {
    name: "Jabberwock Scale Armor",
    type: "armor",
    rarity: "Epic",
    defense: 15,
    location: "The Jabberwock's Lair"
  },

  {
    name: "Dragon Heart",
    type: "consumable",
    rarity: "Epic",
    heal: 100,
    location: "The Jabberwock's Lair"
  },

  {
    name: "Jabberwock Scale",
    type: "misc",
    rarity: "Epic",
    location: "The Jabberwock's Lair"
  },


  // ==========================================
  // HEART OF WONDERLAND
  // ==========================================

  {
    name: "Cheshire Blade",
    type: "weapon",
    rarity: "Legendary",
    attack: 20,
    location: "The Heart of Wonderland"
  },

  {
    name: "Heart Guardian Armor",
    type: "armor",
    rarity: "Legendary",
    defense: 20,
    location: "The Heart of Wonderland"
  },

  {
    name: "Wonderland Elixir",
    type: "consumable",
    rarity: "Legendary",
    heal: 125,
    location: "The Heart of Wonderland"
  },

  {
    name: "Cheshire Smile",
    type: "misc",
    rarity: "Legendary",
    location: "The Heart of Wonderland"
  }

];


// ==========================================
// GET ITEM
// ==========================================

function getItem(name) {

  if (!name) {
    return null;
  }

  const normalized =
    name.toLowerCase();

  const item =
    ITEMS.find(
      entry =>
        entry.name.toLowerCase() ===
        normalized
    );

  if (!item) {
    return null;
  }

  return {
    ...item
  };
}


// ==========================================
// GET ITEMS BY LOCATION
// ==========================================

function getItemsByLocation(location) {

  if (!location) {
    return [];
  }

  return ITEMS
    .filter(
      item =>
        item.location === location
    )
    .map(
      item => ({
        ...item
      })
    );
}


// ==========================================
// ROLL LOCATION LOOT
// ==========================================

function rollLoot(location) {

  const locationItems =
    getItemsByLocation(
      location
    );

  if (!locationItems.length) {
    return null;
  }

  // 35% chance for an enemy
  // to drop an item.
  if (
    Math.random() > 0.35
  ) {
    return null;
  }

  const index =
    Math.floor(
      Math.random() *
      locationItems.length
    );

  return {
    ...locationItems[index]
  };
}


// ==========================================
// GET ALL ITEMS
// ==========================================

function getAllItems() {

  return ITEMS.map(
    item => ({
      ...item
    })
  );
}


module.exports = {

  getItem,

  getItemsByLocation,

  rollLoot,

  getAllItems

};