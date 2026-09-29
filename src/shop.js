// Wonderland RPG
// Shop system
// Twitch-independent

const SHOP_ITEMS = [
  {
    name: "Rusty Sword",
    type: "weapon",
    rarity: "Common",
    attack: 3,
    price: 50
  },

  {
    name: "Shadow Dagger",
    type: "weapon",
    rarity: "Uncommon",
    attack: 5,
    price: 100
  },

  {
    name: "Hatter's Cane",
    type: "weapon",
    rarity: "Rare",
    attack: 8,
    price: 200
  },

  {
    name: "Old Leather Coat",
    type: "armor",
    rarity: "Common",
    defense: 2,
    price: 50
  },

  {
    name: "Forest Cloak",
    type: "armor",
    rarity: "Uncommon",
    defense: 5,
    price: 100
  },

  {
    name: "Clockwork Coat",
    type: "armor",
    rarity: "Rare",
    defense: 8,
    price: 200
  },

  {
    name: "Small Health Potion",
    type: "consumable",
    rarity: "Common",
    heal: 25,
    price: 40
  },

  {
    name: "Red Potion",
    type: "consumable",
    rarity: "Uncommon",
    heal: 50,
    price: 90
  },

  {
    name: "Wonderland Elixir",
    type: "consumable",
    rarity: "Rare",
    heal: 100,
    price: 175
  }
];

function getShopItems() {
  return SHOP_ITEMS.map(item => ({
    ...item
  }));
}

function getShopItem(name) {
  if (!name) {
    return null;
  }

  const normalized =
    name.toLowerCase();

  const item =
    SHOP_ITEMS.find(
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

function formatShop() {
  const lines =
    SHOP_ITEMS.map(item => {
      let stats = "";

      if (item.attack) {
        stats =
          `⚔️ +${item.attack} ATK`;
      }

      if (item.defense) {
        stats =
          `🛡️ +${item.defense} DEF`;
      }

      if (item.heal) {
        stats =
          `❤️ +${item.heal} HP`;
      }

      return (
        `${item.name} ` +
        `[${item.rarity}] ` +
        `${stats} ` +
        `💰 ${item.price}g`
      );
    });

  return (
    `🏪 Wonderland Shop: ` +
    lines.join(" | ")
  );
}

module.exports = {
  getShopItems,
  getShopItem,
  formatShop
};