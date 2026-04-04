const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const ROOT = process.cwd();
const LOCALES_DIR = path.join(ROOT, "src", "components", "pageCoachLocales");

const TARGETS = {
  id: { localeName: "Bahasa Indonesia" },
  zh: { localeName: "中文" },
  ko: { localeName: "한국어" },
  ja: { localeName: "日本語" },
  vi: { localeName: "Tiếng Việt" },
};

function usage() {
  console.error("Usage: node scripts/translate-pagecoach-locale.js <id|zh|ko|ja|vi>");
  process.exit(1);
}

const lang = process.argv[2];
if (!lang || !TARGETS[lang]) usage();

async function translateText(text, tl, cache) {
  if (!text || typeof text !== "string") return text;
  const key = `${tl}::${text}`;
  if (cache.has(key)) return cache.get(key);
  const url = "https://translate.googleapis.com/translate_a/single"
    + `?client=gtx&sl=en&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Translate failed (${res.status}) for ${tl}: ${text}`);
  }
  const data = await res.json();
  const translated = (data?.[0] || []).map((part) => part?.[0] || "").join("") || text;
  cache.set(key, translated);
  await new Promise((resolve) => setTimeout(resolve, 35));
  return translated;
}

function shouldKeepRawString(ctx) {
  if (!ctx.length) return false;
  if (ctx[0] === "pageColumnStepOrder") return true;
  const last = ctx[ctx.length - 1];
  return last === "id" || last === "selector" || last === "fromName" || last === "toName";
}

async function translateValue(value, tl, cache, ctx = []) {
  if (typeof value === "string") {
    return shouldKeepRawString(ctx) ? value : translateText(value, tl, cache);
  }

  if (Array.isArray(value)) {
    const out = [];
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      if (ctx[ctx.length - 1] === "names" && typeof item === "string") {
        out.push(item);
      } else {
        out.push(await translateValue(item, tl, cache, ctx));
      }
    }
    return out;
  }

  if (!value || typeof value !== "object") return value;

  const out = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "code") {
      out[key] = tl;
      continue;
    }
    if (key === "localeName") {
      out[key] = TARGETS[tl].localeName;
      continue;
    }
    out[key] = await translateValue(child, tl, cache, ctx.concat(key));
  }
  return out;
}

function serializeLocale(locale) {
  return `const locale = ${JSON.stringify(locale, null, 2)};\n\nexport default locale;\n`;
}

async function main() {
  const enPath = path.join(LOCALES_DIR, "en.js");
  const imported = await import(pathToFileURL(enPath).href + `?t=${Date.now()}`);
  const enLocale = imported.default;
  const cache = new Map();
  const translated = await translateValue(enLocale, lang, cache, []);
  translated.code = lang;
  translated.ui = translated.ui || {};
  translated.ui.localeName = TARGETS[lang].localeName;
  const outPath = path.join(LOCALES_DIR, `${lang}.js`);
  fs.writeFileSync(outPath, serializeLocale(translated), "utf8");
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
