export const BOOST_TYPE_ALIASES = {
  harvest: "yield",
  production: "yield",
  output: "yield",
  speed: "time",
  duration: "time",
  cooldown: "time",
  discount: "cost",
  price: "cost",
  experience: "xp",
};

export const BOOST_ITEM_CATEGORY_ALIASES = {
  crop: "crop",
  crops: "crop",
  fruit: "fruit",
  fruits: "fruit",
  flower: "flower",
  flowers: "flower",
  fish: "fish",
  fishing: "fish",
  cast: "fish",
  wood: "wood",
  tree: "wood",
  trees: "wood",
  stone: "mineral",
  mineral: "mineral",
  minerals: "mineral",
  mining: "mineral",
  animal: "animal",
  animals: "animal",
  barn: "animal",
  building: "building",
  buildings: "building",
  craft: "building",
  greenhouse: "greenhouse",
  cook: "cook",
  cooking: "cook",
  food: "cook",
  bees: "bees",
  compost: "compost",
  bud: "bud",
  buds: "bud",
  shrine: "shrine",
  shrines: "shrine",
  dig: "dig",
  digs: "dig",
  digging: "dig",
  treasure: "dig",
  treasures: "dig",
  bounty: "dig",
  pet: "pet",
  pets: "pet",
};

export function normalizeToken(token, aliasMap = {}) {
  const txt = String(token || "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!txt) return "";
  const singular = txt.endsWith("s") && txt.length > 3 ? txt.slice(0, -1) : txt;
  return aliasMap[singular] || aliasMap[txt] || singular;
}

export function inferTypeTokens(boostText) {
  const txt = String(boostText || "").toLowerCase();
  const inferred = [];
  if (/xp|experience/.test(txt)) inferred.push("xp");
  if (/yield|harvest|production|produce|output/.test(txt)) inferred.push("yield");
  if (/time|faster|speed|cooldown|duration/.test(txt)) inferred.push("time");
  if (/cost|discount|price|cheaper/.test(txt)) inferred.push("cost");
  return inferred;
}

export function inferCategoryTokens(boostText) {
  const txt = String(boostText || "").toLowerCase();
  const inferred = [];
  if (/\b(fish|fishing|fisher|cast|rod|chum|school)\b/.test(txt)) inferred.push("fish");
  if (/\b(dig|digging|treasure|bounty|artifact|excavate|excavation)\b/.test(txt)) inferred.push("dig");
  if (/\b(crop|crops|seed|harvest)\b/.test(txt)) inferred.push("crop");
  if (/\b(fruit|fruits|tree|trees|orchard)\b/.test(txt)) inferred.push("fruit");
  if (/\b(flower|flowers|bloom|blossom)\b/.test(txt)) inferred.push("flower");
  if (/\b(mine|mining|mineral|stone|ore)\b/.test(txt)) inferred.push("mineral");
  if (/\b(animal|animals|barn|egg|milk|wool)\b/.test(txt)) inferred.push("animal");
  if (/\b(cook|cooking|food|meal|kitchen)\b/.test(txt)) inferred.push("cook");
  if (/\b(bee|bees|hive|honey)\b/.test(txt)) inferred.push("bees");
  if (/\b(compost|fertili[sz]er)\b/.test(txt)) inferred.push("compost");
  if (/\b(bud|buds)\b/.test(txt)) inferred.push("bud");
  if (/\b(shrine|shrines)\b/.test(txt)) inferred.push("shrine");
  if (/\b(pet|pets)\b/.test(txt)) inferred.push("pet");
  if (/\b(wood|chop|tree)\b/.test(txt)) inferred.push("wood");
  return inferred;
}

export function buildItemCategoryIndex(itablesIt = {}) {
  const itemCategoryIndex = {};
  Object.entries(itablesIt || {}).forEach(([itemName, itemData]) => {
    const normName = normalizeToken(itemName);
    const cat = normalizeToken(itemData?.cat || itemData?.scat || itemData?.matcat || "");
    if (normName && cat && !itemCategoryIndex[normName]) {
      itemCategoryIndex[normName] = cat;
    }
  });
  return itemCategoryIndex;
}

export function resolveItemCategoryTokens(boostItemTokens, itemCategoryIndex = {}) {
  return Array.from(new Set(
    (boostItemTokens || [])
      .map((token) => normalizeToken(token))
      .map((token) => BOOST_ITEM_CATEGORY_ALIASES[token] || itemCategoryIndex[token] || "")
      .filter(Boolean)
  ));
}
