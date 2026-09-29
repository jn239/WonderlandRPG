// Wonderland RPG
// Dark event system
// Twitch-independent

const EVENTS = [

  // ==========================================
  // THE RABBIT HOLE
  // ==========================================

  {
    id: "glowing_eyes",
    location: "The Rabbit Hole",
    type: "encounter",
    name: "Glowing Eyes",
    text:
      "Two pale eyes appear between the trees. " +
      "They do not blink.",
    xp: 10,
    threat: 1
  },

  {
    id: "golden_key",
    location: "The Rabbit Hole",
    type: "treasure",
    name: "The Golden Key",
    text:
      "Something metallic glints beneath the roots " +
      "of an ancient tree.",
    xp: 20,
    item: "Golden Key"
  },

  {
    id: "rabbit_watch",
    location: "The Rabbit Hole",
    type: "discovery",
    name: "The Rabbit's Watch",
    text:
      "A broken pocket watch ticks backward " +
      "inside a velvet pouch.",
    xp: 20,
    item: "Rabbit's Pocket Watch"
  },

  {
    id: "deeper_hole",
    location: "The Rabbit Hole",
    type: "discovery",
    name: "The Deeper Hole",
    text:
      "The ground collapses beneath you. " +
      "Instead of falling, you discover another " +
      "Rabbit Hole beneath the first.",
    xp: 30,
    threat: 1
  },


  // ==========================================
  // THE TWISTED FOREST
  // ==========================================

  {
    id: "whispering_trees",
    location: "The Twisted Forest",
    type: "strange",
    name: "Whispering Trees",
    text:
      "The trees lean toward you. Their branches " +
      "move even though there is no wind.",
    xp: 20,
    threat: 1
  },

  {
    id: "shadow_rabbit",
    location: "The Twisted Forest",
    type: "combat",
    name: "The Shadow Rabbit",
    text:
      "Something enormous moves between the trees. " +
      "Two red eyes suddenly appear.",
    xp: 30,
    threat: 1,
    enemy: "Shadow Rabbit"
  },

  {
    id: "black_rose",
    location: "The Twisted Forest",
    type: "discovery",
    name: "The Black Rose",
    text:
      "You find a black rose growing from a grave " +
      "that has no name.",
    xp: 25,
    item: "Black Rose"
  },

  {
    id: "silent_crowd",
    location: "The Twisted Forest",
    type: "strange",
    name: "The Silent Crowd",
    text:
      "Dozens of figures stand in the fog. " +
      "None have faces. All of them are watching you.",
    xp: 30,
    threat: 2
  },


  // ==========================================
  // MUSHROOM GARDEN
  // ==========================================

  {
    id: "breathing_mushrooms",
    location: "The Mushroom Garden",
    type: "strange",
    name: "Breathing Mushrooms",
    text:
      "The mushrooms around you inhale together. " +
      "Then every one of them exhales.",
    xp: 30,
    threat: 1
  },

  {
    id: "red_potion",
    location: "The Mushroom Garden",
    type: "discovery",
    name: "The Red Potion",
    text:
      "A small bottle rests on a stone pedestal. " +
      "The liquid inside moves as if it is breathing.",
    xp: 25,
    item: "Red Potion"
  },

  {
    id: "poison_frog",
    location: "The Mushroom Garden",
    type: "combat",
    name: "The Poison Frog",
    text:
      "A massive frog leaps from behind a mushroom. " +
      "Its skin glows an unnatural blue.",
    xp: 40,
    threat: 2,
    enemy: "Poison Frog"
  },


  // ==========================================
  // MAD HATTER'S DOMAIN
  // ==========================================

  {
    id: "mad_hatters_table",
    location: "The Mad Hatter's Domain",
    type: "encounter",
    name: "The Mad Hatter's Table",
    text:
      "You discover a table set for thirteen. " +
      "Twelve chairs are empty. The thirteenth chair " +
      "slowly pulls itself out.",
    xp: 35,
    item: "Mad Hatter's Hat",
    threat: 1
  },

  {
    id: "hatters_guard",
    location: "The Mad Hatter's Domain",
    type: "combat",
    name: "The Hatter's Guard",
    text:
      "A figure in a porcelain mask blocks the road.",
    xp: 50,
    threat: 2,
    enemy: "Mad Hatter's Guard"
  },

  {
    id: "backwards_clock",
    location: "The Mad Hatter's Domain",
    type: "discovery",
    name: "The Backwards Clock",
    text:
      "Every clock in the room suddenly begins ticking backward.",
    xp: 35,
    item: "Backwards Clock"
  },


  // ==========================================
  // QUEEN'S CASTLE
  // ==========================================

  {
    id: "queen_card",
    location: "The Queen's Castle",
    type: "discovery",
    name: "The Queen's Card",
    text:
      "A blood-red playing card falls from the sky " +
      "and lands at your feet.",
    xp: 40,
    item: "Queen's Card",
    threat: 1
  },

  {
    id: "queens_executioner",
    location: "The Queen's Castle",
    type: "combat",
    name: "The Queen's Executioner",
    text:
      "A masked executioner raises a massive blade.",
    xp: 75,
    threat: 2,
    enemy: "Queen's Executioner"
  },

  {
    id: "queens_shadow",
    location: "The Queen's Castle",
    type: "danger",
    name: "The Queen's Shadow",
    text:
      "A crown-shaped shadow stretches across the ground. " +
      "A voice demands to know who has entered her kingdom.",
    xp: 50,
    threat: 2
  },


  // ==========================================
  // JABBERWOCK'S LAIR
  // ==========================================

  {
    id: "jabberwock_tracks",
    location: "The Jabberwock's Lair",
    type: "danger",
    name: "The Jabberwock's Tracks",
    text:
      "Massive footprints appear in the mud. " +
      "The trees ahead are broken in half.",
    xp: 50,
    threat: 2,
    enemy: "Jabberwock"
  },

  {
    id: "dragons_breath",
    location: "The Jabberwock's Lair",
    type: "danger",
    name: "Dragon's Breath",
    text:
      "The air suddenly becomes unbearably hot. " +
      "Something enormous is breathing nearby.",
    xp: 60,
    threat: 2
  },


  // ==========================================
  // HEART OF WONDERLAND
  // ==========================================

  {
    id: "cheshire_cat",
    location: "The Heart of Wonderland",
    type: "strange",
    name: "The Cheshire Cat",
    text:
      "A grin appears in the darkness. Then two eyes. " +
      "Then nothing at all. A voice whispers, " +
      "'You're already lost.'",
    xp: 60,
    threat: 2
  },

  {
    id: "cursed_mirror",
    location: "The Heart of Wonderland",
    type: "discovery",
    name: "The Cursed Mirror",
    text:
      "You find a cracked mirror. Your reflection " +
      "smiles before you do.",
    xp: 70,
    item: "Cheshire Smile",
    threat: 2
  },

  {
    id: "wrong_door",
    location: "The Heart of Wonderland",
    type: "strange",
    name: "The Wrong Door",
    text:
      "You open a tiny door and see your own back " +
      "standing on the other side.",
    xp: 75,
    threat: 2
  }

];


function getRandomEvent(location = null) {

  let availableEvents =
    EVENTS;

  if (location) {

    const locationEvents =
      EVENTS.filter(
        event =>
          event.location === location
      );

    if (locationEvents.length > 0) {
      availableEvents =
        locationEvents;
    }

  }

  const index =
    Math.floor(
      Math.random() *
      availableEvents.length
    );

  return availableEvents[index];
}


function getEventById(id) {

  return (
    EVENTS.find(
      event =>
        event.id === id
    ) || null
  );

}


function getEventsByType(type) {

  return EVENTS.filter(
    event =>
      event.type === type
  );

}


function getEventsByLocation(location) {

  return EVENTS.filter(
    event =>
      event.location === location
  );

}


function getAllEvents() {

  return EVENTS;

}


module.exports = {

  getRandomEvent,
  getEventById,
  getEventsByType,
  getEventsByLocation,
  getAllEvents

};