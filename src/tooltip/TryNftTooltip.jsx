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

    const filterBoosts = (itemName, boosttype, tryset) => {
        return Object.keys(booststable).filter((nftitem) => {
            const boost = booststable[nftitem];
            const activeOrTryit = tryset ? "tryit" : "isactive";
            const boostactive = tryset ? boost.tryit : boost.isactive;
            const hasBoostType = Array.isArray(boost.boosttype)
                ? boost.boosttype.includes(boosttype)
                : boost.boosttype === boosttype;
            const matchesBoostit = Array.isArray(boost.boostit)
                ? boost.boostit.some((boostItem) => boostItem === Item.cat || boostItem === itemName || boostItem === Item.scat)
                : boost.boostit === Item.cat || boost.boostit === itemName || boost.boostit === Item.scat;
            const isGreenhouseBoost = (boostactive && hasBoostType && boost?.cat === "Greenhouse") || (boostactive && hasBoostType && boost.boostit === "greenhouse");
            let isBoostValid = boostactive && hasBoostType && matchesBoostit;

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

    return (
        <div>
            {txtItem}
            {filteredBoosts.length > 0 ? (
                filteredBoosts.map((nftitem, index) => (
                    <div key={index}>
                        <img src={booststable[nftitem].img ?? imgna} alt={nftitem} style={{ width: "22px", height: "22px" }} />
                        {nftitem} : {booststable[nftitem].boost}
                    </div>
                ))
            ) : (
                <div>No boosts for this item.</div>
            )}
        </div>
    );
};

export default TryNftTooltip;
