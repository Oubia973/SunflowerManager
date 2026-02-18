import React from "react";
import { frmtNb } from "../fct.js";

const TryNftTooltip = ({
    item,
    value,
    Item,
    ForTry,
    imgna,
    myieldortry,
    keyFn,
    dataSetFarm,
    it,
    buildng,
    boostables,
}) => {
    const { nft, nftw, skill, skilllgc, bud, shrine } = boostables || {};
    const booststable = { ...skilllgc, ...skill, ...buildng, ...nft, ...nftw, ...bud, ...shrine };
    const imtemimg = <img src={Item?.img ?? imgna} alt={item} style={{ width: "22px", height: "22px" }} />;
    const isCookItem = !!dataSetFarm?.itables?.food?.[item] || !!dataSetFarm?.itables?.pfood?.[item] || !!Item?.bld;
    const ingredientKeysNorm = Object.keys(Item?.compoit ?? {}).map((k) => String(k).toLowerCase());

    const filterBoosts = (itemName, boosttype, tryset) => {
        return Object.keys(booststable).filter((nftitem) => {
            const boost = booststable[nftitem];
            const activeOrTryit = tryset ? "tryit" : "isactive";
            const boostactive = tryset ? boost.tryit : boost.isactive;
            const boostitList = Array.isArray(boost.boostit) ? boost.boostit : [boost.boostit];
            const boostitNorm = boostitList.filter(Boolean).map((v) => String(v).toLowerCase());
            const itemNameNorm = String(itemName || "").toLowerCase();
            const itemCatNorm = String(Item?.cat || "").toLowerCase();
            const itemScatNorm = String(Item?.scat || "").toLowerCase();
            const itemBldNorm = String(Item?.bld || "").toLowerCase();
            const hasBoostType = Array.isArray(boost.boosttype)
                ? boost.boosttype.includes(boosttype)
                : boost.boosttype === boosttype;
            const hasImplicitXpType = boosttype === "xp" && (
                boostitNorm.some((v) => v.includes("xp")) ||
                String(boost?.boost || "").toLowerCase().includes("xp")
            );
            const matchesBoostType = hasBoostType || hasImplicitXpType;
            const matchesBaseBoostit = boostitNorm.some((boostItemNorm) =>
                boostItemNorm === itemCatNorm ||
                boostItemNorm === itemNameNorm ||
                boostItemNorm === itemScatNorm ||
                boostItemNorm === itemBldNorm
            );
            const matchesCookAlias = isCookItem && boostitNorm.some((boostItemNorm) =>
                boostItemNorm === "cook" || boostItemNorm === "cooking" || boostItemNorm === "food"
            );
            const matchesXpAlias = boosttype === "xp" && (
                boostitNorm.some((boostItemNorm) => boostItemNorm === "xp" || boostItemNorm === `${itemCatNorm} xp`) ||
                (itemCatNorm === "fish" && boostitNorm.some((boostItemNorm) => boostItemNorm === "fish xp"))
            );
            const matchesIngredientXp = boosttype === "xp" && boostitNorm.some((boostItemNorm) => {
                const baseToken = boostItemNorm.endsWith(" xp")
                    ? boostItemNorm.slice(0, -3).trim()
                    : boostItemNorm;
                if (!baseToken || baseToken === "xp") { return false; }
                return ingredientKeysNorm.some((ing) => ing.includes(baseToken));
            });
            const matchesBoostit = matchesBaseBoostit || matchesCookAlias || matchesXpAlias || matchesIngredientXp;
            const isGreenhouseBoost = (boostactive && hasBoostType && boost?.cat === "Greenhouse") || (boostactive && hasBoostType && boost.boostit === "greenhouse");
            let isBoostValid = boostactive && matchesBoostType && matchesBoostit;

            if (Item.cat === "crop") {
                if (boosttype === "time" && (booststable["Scarecrow"][activeOrTryit] || booststable["Kuebiko"][activeOrTryit]) && nftitem === "Nancy") { isBoostValid = true; }
                if (boosttype === "yield" && booststable["Kuebiko"][activeOrTryit] && nftitem === "Scarecrow") { isBoostValid = true; }
            }
            if (Item.cat === "wood") {
                if (boosttype === "yield" && (booststable["Apprentice Beaver"][activeOrTryit] || booststable["Foreman Beaver"][activeOrTryit]) && nftitem === "Woody the Beaver") { isBoostValid = true; }
                if (boosttype === "time" && booststable["Foreman Beaver"][activeOrTryit] && nftitem === "Apprentice Beaver") { isBoostValid = true; }
            }
            if (Item.greenhouse && isGreenhouseBoost) { isBoostValid = true; }
            if (isBoostValid) {
                if (boosttype === "xp") {
                    const boostText = String(boost?.boost || "");
                    const isCakeXpBoost = /\bcake\b/i.test(boostText);
                    const itemCatNorm = String(Item?.cat || "").toLowerCase();
                    if (isCakeXpBoost && itemCatNorm !== "cake") {
                        isBoostValid = false;
                    }
                }
                if (Item.greenhouse) {
                    if (it[boost?.boostit] && itemName !== boost?.boostit) { isBoostValid = false; }
                    if (!isGreenhouseBoost) {
                        if (boosttype === "time") {
                            if (boost?.boostit === "crop") { isBoostValid = false; }
                            if (boost?.boostit === "fruit") { isBoostValid = false; }
                        } else {
                            if (boost?.boostit === "fruit") { isBoostValid = false; }
                        }
                    }
                    if (nftitem === "Frozen Heart") { isBoostValid = false; }
                    if (nftitem === "Autumn's Embrace") { isBoostValid = false; }
                    if (nftitem === "Blossom Ward") { isBoostValid = false; }
                    if (nftitem === "Solflare Aegis") { isBoostValid = false; }
                    if (nftitem === "Sir Goldensnout") { isBoostValid = false; }
                }
                if (booststable["Cabbage Boy"][activeOrTryit] && nftitem === "Karkinos") { isBoostValid = false; }
                if (boost?.boostit === "fruit" && nftitem === "Fruit Picker Apron" && itemName !== "Apple" && itemName !== "Orange" && itemName !== "Blueberry" && itemName !== "Banana") { isBoostValid = false; }
                if (nftitem === "No Axe No Worries" && Item.greenhouse) { isBoostValid = false; }
                if (nftitem === "Feller's Discount" && Item.greenhouse) { isBoostValid = false; }
                if (!tryset) {
                    if (nftitem === "Frozen Heart" && dataSetFarm.curSeason !== "winter") { isBoostValid = false; }
                    if (nftitem === "Autumn's Embrace" && dataSetFarm.curSeason !== "autumn") { isBoostValid = false; }
                    if (nftitem === "Blossom Ward" && dataSetFarm.curSeason !== "spring") { isBoostValid = false; }
                    if (nftitem === "Solflare Aegis" && dataSetFarm.curSeason !== "summer") { isBoostValid = false; }
                }
                if (Item.scat === "barn" && nftitem === "Double Bale" && !booststable["Bale Economy"][activeOrTryit]) { isBoostValid = false; }
            }
            return isBoostValid;
        });
    };

    let filteredBoosts = [];
    let extraBoosts = [];
    let txtItem = "";
    if (value === "timechg") {
        filteredBoosts = filterBoosts(item, "time", ForTry);
        txtItem = <div>Boosts for {imtemimg}{item} time:</div>;
    }
    if (value === "yieldchg") {
        filteredBoosts = filterBoosts(item, "yield", ForTry);
        txtItem = <div>Boosts for {imtemimg}{item} yield:</div>;
    }
    if (value === "costchg") {
        filteredBoosts = filterBoosts(item, "cost", ForTry);
        txtItem = <div>Boosts for {imtemimg}{item} cost:</div>;
    }
    if (value === "yield") {
        filteredBoosts = [...filterBoosts(item, "yield", ForTry), ...filterBoosts(item, "time", ForTry), ...filterBoosts(item, "cost", ForTry)];
        txtItem = (
            <>
                <div>{imtemimg}{item} yield : {frmtNb(Item[myieldortry])}</div>
                <div>{frmtNb(Item[keyFn("harvestnode")])} average by node</div>
                <div>Boosts :</div>
            </>
        );
    }
    if (value === "xp") {
        const xpKey = ForTry ? "xptry" : "xp";
        filteredBoosts = [...new Set(filterBoosts(item, "xp", ForTry))];
        const vipActive = Boolean(dataSetFarm?.frmData?.vip ?? dataSetFarm?.vip);
        const faction = dataSetFarm?.frmData?.faction || dataSetFarm?.faction || {};
        const factionStreak = Number(faction?.streak || 0);
        const factionActiveStreak = Number(faction?.activeStreak ?? factionStreak);
        const factionEligible = Boolean(faction?.isEligible);
        const factionMul = factionActiveStreak >= 8 ? 1.5 : factionActiveStreak >= 6 ? 1.3 : factionActiveStreak >= 4 ? 1.2 : factionActiveStreak >= 2 ? 1.1 : 1;
        const nextFactionMul = factionStreak >= 8 ? 1.5 : factionStreak >= 6 ? 1.3 : factionStreak >= 4 ? 1.2 : factionStreak >= 2 ? 1.1 : 1;
        const factionBonusPct = factionEligible ? Math.round((factionMul - 1) * 100) : 0;
        const nextFactionBonusPct = Math.round((nextFactionMul - 1) * 100);
        const bonusPending = factionStreak > factionActiveStreak;
        if (vipActive) {
            extraBoosts.push({
                name: "VIP",
                img: "./icon/ui/vip.webp",
                boost: "+10% xp",
            });
        }
        if (factionBonusPct > 0) {
            extraBoosts.push({
                name: "Faction bonus",
                img: "./icon/ui/factions.webp",
                boost: `+${factionBonusPct}% xp (active streak ${factionActiveStreak})`,
            });
        }
        if (bonusPending) {
            extraBoosts.push({
                name: "Faction streak",
                img: "./icon/ui/factions.webp",
                boost: `Streak ${factionStreak} reached, +${nextFactionBonusPct}% active next week`,
            });
        }
        txtItem = (
            <>
                <div>{imtemimg}{item} xp : {frmtNb(Item?.[xpKey] ?? Item?.xp ?? 0)}</div>
                <div>Boosts :</div>
            </>
        );
    }

    return (
        <div>
            {txtItem}
            {(filteredBoosts.length > 0 || extraBoosts.length > 0) ? (
                <>
                {filteredBoosts.map((nftitem, index) => (
                    <div key={index}>
                        <img src={booststable[nftitem].img ?? imgna} alt={nftitem} style={{ width: "22px", height: "22px" }} />
                        {nftitem} : {booststable[nftitem].boost}
                    </div>
                ))}
                {extraBoosts.map((boost, index) => (
                    <div key={`extra-${index}`}>
                        <img src={boost.img ?? imgna} alt={boost.name} style={{ width: "22px", height: "22px" }} />
                        {boost.name} : {boost.boost}
                    </div>
                ))}
                </>
            ) : (
                <div>No boosts for this item.</div>
            )}
        </div>
    );
};

export default TryNftTooltip;

