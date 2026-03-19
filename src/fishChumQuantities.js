const CHUM_QUANTITIES = {
  Gold: 1,
  Mushroom: 1,
  Honey: 1,
  Iron: 5,
  Stone: 5,
  Egg: 5,
  Sunflower: 50,
  Potato: 20,
  Yam: 20,
  Rhubarb: 20,
  Pumpkin: 20,
  Carrot: 10,
  Cabbage: 10,
  Broccoli: 10,
  Pepper: 10,
  Beetroot: 10,
  Onion: 5,
  Cauliflower: 5,
  Parsnip: 5,
  Eggplant: 5,
  Corn: 5,
  Radish: 5,
  Turnip: 5,
  Wheat: 5,
  Kale: 5,
  Barley: 3,
  Artichoke: 3,
  Blueberry: 3,
  Orange: 3,
  Apple: 3,
  Banana: 3,
  Seaweed: 1,
  Crab: 2,
  Anchovy: 1,
  "Red Snapper": 1,
  Tuna: 1,
  Squid: 1,
  Wood: 5,
  "Red Pansy": 1,
  "Horse Mackerel": 1,
  Sunfish: 1,
  "Zebra Turkeyfish": 1,
  Zucchini: 20,
  Weed: 3,
  Acorn: 3,
};

const CHUM_ALIASES = {
  rubarb: "Rhubarb",
  rhubarb: "Rhubarb",
  raddish: "Radish",
  radish: "Radish",
  tune: "Tuna",
  tuna: "Tuna",
  "horse makerel": "Horse Mackerel",
  "horse mackerel": "Horse Mackerel",
};

function normalizeChumName(name) {
  const raw = String(name || "").trim();
  if (!raw) return "";
  return CHUM_ALIASES[raw.toLowerCase()] || raw;
}

export function getChumQuantity(name) {
  const normalized = normalizeChumName(name);
  return Number(CHUM_QUANTITIES[normalized] || 1);
}

export { normalizeChumName };
