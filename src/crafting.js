// Wonderland RPG
// Crafting system
// Twitch-independent

const RECIPES = [
  // EARLY GAME
  {
    name: "Hunter's Blade",
    type: "weapon",
    rarity: "Uncommon",
    attack: 6,
    ingredients: ["Rusty Sword", "Rabbit's Lucky Charm"]
  },
  {
    name: "Thorned Cloak",
    type: "armor",
    rarity: "Uncommon",
    defense: 6,
    ingredients: ["Old Leather Coat", "Black Rose"]
  },
  {
    name: "Forest Tonic",
    type: "consumable",
    rarity: "Uncommon",
    heal: 45,
    ingredients: ["Forest Berry", "Small Health Potion"]
  },

  // MUSHROOM GARDEN
  {
    name: "Poison Fang Dagger",
    type: "weapon",
    rarity: "Rare",
    attack: 10,
    ingredients: ["Poison Fang", "Black Rose"]
  },
  {
    name: "Spore Armor",
    type: "armor",
    rarity: "Rare",
    defense: 10,
    ingredients: ["Mushroom Armor", "Glowing Mushroom"]
  },
  {
    name: "Toxic Elixir",
    type: "consumable",
    rarity: "Rare",
    heal: 75,
    ingredients: ["Glowing Mushroom", "Red Potion"]
  },

  // MAD HATTER
  {
    name: "Mad Hatter's Staff",
    type: "weapon",
    rarity: "Epic",
    attack: 13,
    ingredients: ["Hatter's Cane", "Backwards Clock"]
  },
  {
    name: "Clockwork Armor",
    type: "armor",
    rarity: "Epic",
    defense: 13,
    ingredients: ["Clockwork Coat", "Backwards Clock"]
  },
  {
    name: "Mad Tea Elixir",
    type: "consumable",
    rarity: "Epic",
    heal: 90,
    ingredients: ["Mad Tea", "Backwards Clock"]
  },

  // QUEEN
  {
    name: "Royal Executioner Blade",
    type: "weapon",
    rarity: "Epic",
    attack: 16,
    ingredients: ["Royal Blade", "Queen's Card"]
  },
  {
    name: "Royal Guard Plate",
    type: "armor",
    rarity: "Epic",
    defense: 16,
    ingredients: ["Queen's Guard Armor", "Queen's Card"]
  },
  {
    name: "Queen's Blood Elixir",
    type: "consumable",
    rarity: "Epic",
    heal: 110,
    ingredients: ["Queen's Potion", "Queen's Card"]
  },

  // JABBERWOCK
  {
    name: "Jabberwock Slayer",
    type: "weapon",
    rarity: "Legendary",
    attack: 22,
    ingredients: ["Dragonfang", "Jabberwock Scale"]
  },
  {
    name: "Jabberwock Plate",
    type: "armor",
    rarity: "Legendary",
    defense: 22,
    ingredients: ["Jabberwock Scale Armor", "Jabberwock Scale"]
  },
  {
    name: "Dragon Heart Elixir",
    type: "consumable",
    rarity: "Legendary",
    heal: 125,
    ingredients: ["Dragon Heart", "Jabberwock Scale"]
  },

  // ENDGAME
  {
    name: "Cheshire's Edge",
    type: "weapon",
    rarity: "Mythic",
    attack: 30,
    ingredients: ["Cheshire Blade", "Cheshire Smile"]
  },
  {
    name: "Heart of Wonderland Armor",
    type: "armor",
    rarity: "Mythic",
    defense: 30,
    ingredients: ["Heart Guardian Armor", "Cheshire Smile"]
  },
  {
    name: "Wonderland's Blessing",
    type: "consumable",
    rarity: "Mythic",
    heal: 150,
    ingredients: ["Wonderland Elixir", "Cheshire Smile"]
  }
];

function getAllRecipes() {
  return RECIPES.map(recipe => ({
    ...recipe,
    ingredients: [...recipe.ingredients]
  }));
}

function getRecipe(name) {
  if (!name) {
    return null;
  }

  const normalized =
    name.toLowerCase();

  const recipe =
    RECIPES.find(
      entry =>
        entry.name.toLowerCase() ===
        normalized
    );

  if (!recipe) {
    return null;
  }

  return {
    ...recipe,
    ingredients: [...recipe.ingredients]
  };
}

function hasIngredients(
  inventory,
  ingredients
) {
  const available =
    [...inventory];

  for (
    const ingredient of ingredients
  ) {
    const index =
      available.findIndex(
        item =>
          item.toLowerCase() ===
          ingredient.toLowerCase()
      );

    if (index === -1) {
      return false;
    }

    available.splice(
      index,
      1
    );
  }

  return true;
}

function removeIngredients(
  inventory,
  ingredients
) {
  for (
    const ingredient of ingredients
  ) {
    const index =
      inventory.findIndex(
        item =>
          item.toLowerCase() ===
          ingredient.toLowerCase()
      );

    if (index !== -1) {
      inventory.splice(
        index,
        1
      );
    }
  }

  return inventory;
}

function getCraftableRecipes(
  inventory
) {
  return RECIPES
    .filter(recipe =>
      hasIngredients(
        inventory,
        recipe.ingredients
      )
    )
    .map(recipe => ({
      ...recipe,
      ingredients: [
        ...recipe.ingredients
      ]
    }));
}

function formatRecipes(player) {
  const craftable =
    getCraftableRecipes(
      player.inventory || []
    );

  if (
    craftable.length === 0
  ) {
    return (
      `🛠️ @${player.username} ` +
      `has no craftable recipes right now.`
    );
  }

  return (
    `🛠️ @${player.username} can craft: ` +
    craftable
      .map(recipe => recipe.name)
      .join(", ")
  );
}

module.exports = {
  getAllRecipes,
  getRecipe,
  hasIngredients,
  removeIngredients,
  getCraftableRecipes,
  formatRecipes
};