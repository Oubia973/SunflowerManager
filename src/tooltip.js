import React, { useEffect, useState } from 'react';
import { frmtNb, convtimenbr, ColorValue, Timer } from './fct.js';

const Tooltip = ({ onClose, item, context, value, clickPosition, dataSet }) => {
    const ForTry = dataSet.forTry;
    let activeortry = ForTry ? "tryit" : "isactive";
    let costortry = ForTry ? "costtry" : "cost";
    let harvestortry = ForTry ? "harvesttry" : "harvest";
    let myieldortry = ForTry ? "myieldtry" : "myield";
    let mtimeortry = ForTry ? "mtimetry" : "mtime";
    let timeortry = ForTry ? "timetry" : "time";
    let stockortry = ForTry ? "stocktry" : "stock";
    let xportry = ForTry ? "xptry" : "xp";
    let fishcastmaxortry = ForTry ? "CastMaxtry" : "CastMax";
    let fishcastcostortry = ForTry ? "CastCosttry" : "CastCost";
    let mfoodortry = ForTry ? "mfoodtry" : "mfood";
    let mxportry = ForTry ? "mxptry" : "mxp";
    let mxploveortry = ForTry ? "mxplovetry" : "mxplove";
    let foodquantortry = ForTry ? "foodquanttry" : "foodquant";
    let foodcostortry = ForTry ? "foodcosttry" : "foodcost";
    let foodortry = ForTry ? "foodtry" : "food";
    let nbharvestortry = ForTry ? "nbharvesttry" : "nbharvest";
    let seedortry = ForTry ? "seedtry" : "seed";
    let toolcostortry = ForTry ? "toolcosttry" : "toolcost";
    let sflortry = ForTry ? "sfltry" : "sfl";
    let dailycycleortry = ForTry ? "dailycycletry" : "dailycycle";
    const imgna = "./icon/nft/na.png";
    const imgsfl = <img src="./icon/res/sfltoken.png" style={{ width: "15px", height: "15px" }} />
    const imgcoins = <img src="./icon/res/coins.png" style={{ width: "15px", height: "15px" }} />
    const imgmp = <img src="./icon/ui/exchange.png" style={{ width: "15px", height: "15px" }} />
    const Item = dataSet.it[item];
    let txt = "";
    const [isOpen, setIsOpen] = useState(false);
    const [pos, setPos] = useState({ x: clickPosition.x, y: clickPosition.y });
    const [justOpened, setJustOpened] = useState(true);
    const closeModal = () => {
        setIsOpen(false);
        setTimeout(onClose, 300);
    };
    const handleClickOutside = (event) => {
        if (justOpened) return;
        if (!event.target.closest(".tooltip")) {
            closeModal();
        }
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            setJustOpened(false);
        }, 200);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        setTimeout(() => {
            setPos({ x: "50%", y: "50%" });
            setIsOpen(true);
        }, 50);
    }, []);
    useEffect(() => {
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [justOpened]);

    try {
        if (context === "costp") {
            if (Item.cat === "crop") {
                const cropOrGreenhouse = Item.greenhouse ? "greenhouse" : "crop";
                const oilQuant = Item.greenhouse && Item.oil;
                const imgOil = <img src={dataSet.it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                const oilCost = Item.greenhouse ? (oilQuant * (dataSet.it["Oil"][costortry] / dataSet.coinsRatio)) : 0;
                const costTotal = (Item[seedortry] / dataSet.coinsRatio) + oilCost;
                const prodCost = Item[costortry] / dataSet.coinsRatio;
                const profit = (Item.costp2pt * 0.9) - prodCost;
                const profitMul = (Item.costp2pt * 0.9) / prodCost;
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>Seed cost {frmtNb(Item[seedortry])}{imgcoins} {oilQuant && oilQuant}{oilQuant && imgOil}
                            {'('}{frmtNb(costTotal)}{imgsfl}{')'}</div>
                        <div>{frmtNb(Item[harvestortry] / dataSet.spot[cropOrGreenhouse])} average by node</div>
                        <div>Your production cost {frmtNb(prodCost)}{imgsfl}</div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(Item.costp2pt * 0.9)}{imgsfl}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
            if (Item.cat === "wood") {
                const itemTool = dataSet.tool[Item.tool];
                const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                const toolCost = itemTool[costortry];
                const txtTool = <div>{imgTool} cost {frmtNb(toolCost)}{imgcoins} {'('}{frmtNb(toolCost / dataSet.coinsRatio)}{imgsfl}{')'}</div>;
                const prodCost = Item[costortry] / dataSet.coinsRatio;
                const profit = (Item.costp2pt * 0.9) - value;
                const profitMul = (Item.costp2pt * 0.9) / (Item[costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        {dataSet.nft["Foreman Beaver"][activeortry] === 1 ? txtTool : null}
                        <div>{frmtNb(Item[harvestortry] / dataSet.spot.wood)} average by node</div>
                        <div>Your production cost {frmtNb(prodCost)}{imgsfl}</div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(Item.costp2pt * 0.9)}{imgsfl}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
            if (Item.cat === "mineral" || Item.cat === "gem") {
                const itemTool = dataSet.tool[Item.tool];
                if (itemTool) {
                    const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                    const toolCost = itemTool[costortry];
                    const toolCompo = Object.keys(itemTool).map((itemName, itIndex) => (
                        itemTool[itemName] && dataSet.it[itemName] ? (
                            <>
                                {itemTool[itemName]}
                                <img src={dataSet.it[itemName].img} className="resicon" alt={itemName} />
                            </>
                        ) : null));
                    const prodCost = Item[costortry] / dataSet.coinsRatio;
                    const profit = (Item.costp2pt * 0.9) - value;
                    const profitMul = (Item.costp2pt * 0.9) / (Item[costortry] / dataSet.coinsRatio);
                    const colorProfitMul = ColorValue(profitMul);
                    txt = (
                        <><div><img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                            <div>{imgTool} cost {frmtNb(itemTool[sflortry])}{imgcoins}
                                {toolCompo} {'('}{frmtNb(toolCost / dataSet.coinsRatio)}{imgsfl}{')'}</div>
                            <div>{frmtNb(Item[harvestortry] / dataSet.spot[item.toLowerCase()])} average by node</div>
                            <div>Your production cost {frmtNb(prodCost)}{imgsfl}</div>
                            <div>Marketplace{imgmp}-10% tax {frmtNb(Item.costp2pt * 0.9)}{imgsfl}</div>
                            <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                    );
                }
            }
            if (Item.cat === "animal") {
                const aniName = Item.animal;
                const aniFoodQuant = Item[foodquantortry];
                const aniSpot = aniName !== "Chicken" ? dataSet.spot[aniName.toLowerCase()] : dataSet.spot["egg"];
                const foodCost = (Item[foodcostortry] / dataSet.coinsRatio);
                const imgFood = <img src={dataSet.it[Item[foodortry]].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                const prodCost = Item[costortry] / dataSet.coinsRatio;
                const profit = (Item.costp2pt * 0.9) - (Item[costortry] / dataSet.coinsRatio);
                //const profitPercentage = (profit / (Item.costp2pt * 0.9)) * 100;
                const profitMul = (Item.costp2pt * 0.9) / (Item[costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>{frmtNb(aniFoodQuant)}{imgFood} cost {frmtNb(foodCost)}{imgsfl}</div>
                        <div>for a lvl{dataSet.inputAnimalLvl} animal</div>
                        <div>{frmtNb(Item[harvestortry] / aniSpot)} average by animal</div>
                        <div>Your production cost {frmtNb(prodCost)}{imgsfl}</div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(Item.costp2pt * 0.9)}{imgsfl}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
            if (Item.cat === "fruit") {
                const fruitOrGreenhouse = Item.greenhouse ? "greenhouse" : "fruit";
                const oilQuant = Item.greenhouse && Item.oil;
                const imgOil = <img src={dataSet.it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                const oilCost = Item.greenhouse ? (oilQuant * (dataSet.it["Oil"][costortry] / dataSet.coinsRatio)) : 0;
                const costTotal = (Item[seedortry] / dataSet.coinsRatio) + oilCost;
                const itemTool = dataSet.tool["Axe"];
                const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                const toolCost = Item[toolcostortry];
                const prodCost = Item[costortry] / dataSet.coinsRatio;
                const harvestNb = Item[nbharvestortry];
                const harvestTotal = harvestNb * dataSet.spot[fruitOrGreenhouse];
                const profit = (Item.costp2pt * 0.9) - value;
                const profitPercentage = (profit / (Item.costp2pt * 0.9)) * 100;
                const profitMul = (Item.costp2pt * 0.9) / (Item[costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>Seed cost {frmtNb(Item[seedortry])}{imgcoins} {oilQuant && oilQuant}{oilQuant && imgOil}
                            {'('}{frmtNb(costTotal)}{imgsfl}{')'}</div>
                        <div>{frmtNb(Item[harvestortry] / dataSet.spot[fruitOrGreenhouse])} average by node</div>
                        {!Item.greenhouse ? <div>{harvestNb}harvest average by node</div> : null}
                        {!Item.greenhouse ? <div>{imgTool} cost {toolCost}{imgsfl}</div> : null}
                        <div>Your production cost {frmtNb(prodCost)}{imgsfl}</div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(Item.costp2pt * 0.9)}{imgsfl}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
            if (item === "Honey") {

            }
            if (item === "Flower") {

            }
        }
        if (context === "dailysfl") {
            if (Item.cat === "crop") {
                const cropOrGreenhouse = Item.greenhouse ? "greenhouse" : "crop";
                const seedNb = Item[dailycycleortry] * dataSet.spot[cropOrGreenhouse];
                const oilQuant = Item.greenhouse && Item.oil * seedNb;
                const imgOil = <img src={dataSet.it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                const oilCost = Item.greenhouse ? (oilQuant * (dataSet.it["Oil"][costortry] / dataSet.coinsRatio)) : 0;
                const sflHarvest = (Item.costp2pt * 0.9) * Item[harvestortry];
                const cycleD = Item[dailycycleortry] || 1;
                const sflD = sflHarvest * cycleD;
                const coinSeedD = seedNb * Item[seedortry];
                const sflSeedD = (coinSeedD / dataSet.coinsRatio) + oilCost;
                const profit = sflD - sflSeedD;
                const profitPercentage = (profit / (Item.costp2pt * 0.9)) * 100;
                const profitMul = (Item.costp2pt * 0.9) / (Item[costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>Grow time: {Item[timeortry]} seed stock: {Item[stockortry]}</div>
                        <div>{cycleD}cycle/day with {dataSet.inputFarmTime}h and {dataSet.inputMaxBB}restock</div>
                        <div>Harvest average {frmtNb(Item[harvestortry])} with {dataSet.spot[cropOrGreenhouse]}node</div>
                        <div>Harvest total by day {frmtNb(Item[harvestortry] * cycleD)}</div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(sflD)}{imgsfl}</div>
                        <div>Seed cost {frmtNb(coinSeedD)}{imgcoins} for {seedNb}seed {oilQuant && oilQuant}{oilQuant && imgOil} {'('}{frmtNb(sflSeedD)}{imgsfl}{')'}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
            if (Item.cat === "wood") {
                const itemTool = dataSet.tool[Item.tool];
                const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                const toolCost = Item[costortry];
                const cycleD = Item[dailycycleortry] || 1;
                const seedNb = cycleD * dataSet.spot.wood;
                const sflHarvest = (Item.costp2pt * 0.9) * Item[harvestortry];
                const sflD = sflHarvest * cycleD;
                const coinSeedD = seedNb * toolCost;
                const profit = sflD - (coinSeedD / dataSet.coinsRatio);
                const profitMul = (Item.costp2pt * 0.9) / (Item[costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                const txtTool = <div>{imgTool} cost {frmtNb(coinSeedD)}{imgcoins} for {seedNb}tree {'('}{frmtNb(coinSeedD / dataSet.coinsRatio)}{imgsfl}{')'}</div>;
                txt = (
                    <><div><img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>Grow time: {Item[timeortry]} tool stock: {Item[stockortry]}</div>
                        <div>{cycleD}cycle/day with {dataSet.inputFarmTime}h and {dataSet.inputMaxBB}restock</div>
                        <div>Chop average {frmtNb(Item[harvestortry])} with {dataSet.spot.wood}node</div>
                        <div>Chop total by day {frmtNb(Item[harvestortry] * cycleD)}</div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(sflD)}{imgsfl}</div>
                        <div>{dataSet.nft["Foreman Beaver"][activeortry] ? null : txtTool}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
            if (Item.cat === "mineral" || Item.cat === "gem") {
                const itemTool = dataSet.tool[Item.tool];
                const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                const toolCost = (itemTool[costortry] / dataSet.coinsRatio);
                const cycleD = Item[dailycycleortry] || 1;
                const seedNb = cycleD * dataSet.spot[item.toLowerCase()];
                const toolCompo = Object.keys(itemTool).map((itemName, itIndex) => (
                    itemTool[itemName] && dataSet.it[itemName] ? (
                        <>
                            {itemTool[itemName] * cycleD * dataSet.spot[item.toLowerCase()]}
                            <img src={dataSet.it[itemName].img} className="resicon" alt={itemName} />
                        </>
                    ) : null));
                const sflHarvest = (Item.costp2pt * 0.9) * Item[harvestortry];
                const sflD = sflHarvest * cycleD;
                const coinSeedD = seedNb * itemTool[sflortry];
                const profit = sflD - (toolCost * seedNb);
                const profitPercentage = (profit / (Item.costp2pt * 0.9)) * 100;
                const profitMul = (Item.costp2pt * 0.9) / (Item[costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>Grow time: {Item[timeortry]} tool stock: {Item[stockortry]}</div>
                        <div>{cycleD}cycle/day with {dataSet.inputFarmTime}h and {dataSet.inputMaxBB}restock</div>
                        <div>Mine average {frmtNb(Item[harvestortry])} with {dataSet.spot[item.toLowerCase()]}node</div>
                        <div>Mine total by day {frmtNb(Item[harvestortry] * cycleD)}</div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(sflD)}{imgsfl}</div>
                        <div>{imgTool} cost {frmtNb(coinSeedD)}{imgcoins}{toolCompo} for {seedNb}node {'('}{frmtNb((toolCost * seedNb))}{imgsfl}{')'}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
            if (Item.cat === "animal") {
                const aniName = Item.animal;
                const aniFoodQuant = Item[foodquantortry];
                const aniSpot = aniName !== "Chicken" ? dataSet.spot[aniName.toLowerCase()] : dataSet.spot["egg"];
                const cycleD = Item[dailycycleortry] || 1;
                const seedNb = cycleD * aniSpot;
                const imgFood = <img src={dataSet.it[Item[foodortry]].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                const foodQuant = aniFoodQuant * aniSpot;
                const foodCost = (Item[foodcostortry] / dataSet.coinsRatio) * aniSpot;
                const sflHarvest = (Item.costp2pt * 0.9) * Item[harvestortry];
                const sflD = sflHarvest * cycleD;
                const profit = sflD - foodCost;
                const profitPercentage = (profit / (Item.costp2pt * 0.9)) * 100;
                const profitMul = (Item.costp2pt * 0.9) / (Item[costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>Sleep time {Item[timeortry]}</div>
                        <div>{cycleD}cycle/day with {dataSet.inputFarmTime}h</div>
                        <div>Produce average {frmtNb(Item[harvestortry])}</div>
                        <div>Produce total by day {frmtNb(Item[harvestortry] * cycleD)}</div>
                        <div> with {aniSpot}animals lvl{dataSet.inputAnimalLvl} </div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(sflD)}{imgsfl}</div>
                        <div>Food cost {frmtNb(foodCost)}{imgsfl} for {seedNb}animals {frmtNb(foodQuant)}{imgFood}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
        }
        if (context === "harvest") {
            const itemImg = <img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
            const itemTool = dataSet.tool[Item.tool];
            const imgTool = itemTool && <img src={itemTool?.img ?? imgna} style={{ width: "22px", height: "22px" }} />;
            let itemSpot = dataSet.spot[dataSet.it[item].cat.toLowerCase()];
            let nodeCost = 0;
            let txtCompo = "";
            if (Item?.cat === "crop") {
                const cropOrGreenhouse = Item.greenhouse ? "greenhouse" : "crop";
                itemSpot = dataSet.spot[cropOrGreenhouse];
                const imgOil = <img src={dataSet.it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />;
                const oilQuant = Item.greenhouse ? Item.oil : 0;
                const oilCost = oilQuant * dataSet.it["Oil"][costortry];
                nodeCost = Item[seedortry] + oilCost;
                const txtOilQuantTotal = Item.greenhouse && <span> Oil: {oilQuant * itemSpot}{imgOil}</span>;
                txtCompo = <div> Seeds: {frmtNb(Item[seedortry] * itemSpot)}{imgcoins} {txtOilQuantTotal}
                    {'('}{frmtNb((nodeCost * itemSpot) / dataSet.coinsRatio)}{imgsfl}{')'}</div>;
            }
            if (Item?.cat === "wood") {
                nodeCost = dataSet.nft["Foreman Beaver"][activeortry] ? 0 : itemTool[costortry];
                const txtTool = <div>{frmtNb(nodeCost * itemSpot)}{imgcoins} {'('}{frmtNb(nodeCost / dataSet.coinsRatio)}{imgsfl}{')'}</div>;
                txtCompo = <span>{dataSet.nft["Foreman Beaver"][activeortry] ? "nothing" : txtTool}</span>;
            }
            if (Item?.cat === "mineral" || Item.cat === "gem") {
                itemSpot = dataSet.spot[item.toLowerCase()];
                nodeCost = itemTool[costortry];
                const txtTool = Object.keys(itemTool).map((itemName, itIndex) => (
                    itemTool[itemName] && dataSet.it[itemName] ? (
                        <>
                            {itemTool[itemName] * itemSpot}
                            <img src={dataSet.it[itemName].img} className="resicon" alt={itemName} />
                        </>
                    ) : null));
                txtCompo = <span>{txtTool} {'('}{frmtNb((nodeCost * itemSpot) / dataSet.coinsRatio)}{imgsfl}{')'}</span>;
            }
            if (Item?.cat === "animal") {
                itemSpot = item === "Egg" ? dataSet.spot.egg : dataSet.spot[dataSet.it[item].animal.toLowerCase()];
                nodeCost = dataSet.it[item][foodcostortry];
                const imgFood = dataSet.it[dataSet.it[item][foodortry]].img;
                const txtImgFood = <img src={imgFood ?? imgna} style={{ width: "22px", height: "22px" }} />;
                const quantFood = dataSet.it[item][foodquantortry];
                const animalLvl = <div> for a lvl{dataSet.inputAnimalLvl} animal</div>;
                txtCompo = <div> Food: {frmtNb(quantFood)}{txtImgFood} cost {frmtNb((nodeCost * itemSpot) / dataSet.coinsRatio)}{imgsfl}{animalLvl}</div>;
            }
            if (Item?.cat === "honey") {
                itemSpot = dataSet.spot.beehive;
                nodeCost = dataSet.it["Flower"][costortry];
                txtCompo = <div> Seeds: {frmtNb((nodeCost * itemSpot) / dataSet.coinsRatio)}{imgsfl}</div>;
            }
            //const prodCost = Item[costortry] / dataSet.coinsRatio;
            const harvestCost = nodeCost * itemSpot;
            const harvestCostp2pt = (Item.costp2pt * 0.9) * Item[harvestortry];
            const txtProdCost = txtCompo && (nodeCost !== harvestCost) && <div>Your production cost: {txtCompo}</div>;
            const profit = harvestCostp2pt - (harvestCost / dataSet.coinsRatio);
            const profitMul = harvestCostp2pt / (harvestCost / dataSet.coinsRatio);
            const colorProfitMul = ColorValue(profitMul);
            txt = (
                <><div>{itemImg} {item}</div>
                    <div>Yield by node {frmtNb(Item[myieldortry])}</div>
                    <div>Harvest average {frmtNb(Item[harvestortry])} for {itemSpot} nodes</div>
                    <div>{frmtNb(Item[harvestortry] / itemSpot)} average by node</div>
                    {txtProdCost}
                    <div>Marketplace{imgmp}-10% tax {frmtNb(harvestCostp2pt)}{imgsfl}</div>
                    <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
            );
        }
        if (context === "buildcraft") {
            const buildName = item.name;
            const buildImg = item.img;
            const imgcraft = item.itimg;
            const itemName = typeof item.items === "object" ? item.items[1] : item.items;
            const itemKeys = typeof item.items === "object" ? item.items : item.craft;
            //const itemKeys = item.items ? item.items : item.craft;
            //const itemType = dataSet.fish[item.items] ? "fish" : dataSet.food[item.items] ? "food" : "?";
            //const itemCost = ((dataSet[itemType][itemName][costortry] || 0) / dataSet.coinsRatio);
            //const itemCostp2pt = (dataSet[itemType][itemName].costp2pt * 0.9) || 0;
            /* const craftItems = (
                    <><div>{Object.keys(item.items).map((craftingItem, index) => (
                        <div key={index}>
                            <img src={imgcraft} className="resicon" alt={itemName} /> {item.items[craftingItem].amount > 1 && "x" + item.craft[crafting].amount}
                            {" "} ready in <Timer timestamp={item.craft[crafting].readyAt} />
                        </div>
                    ))}</div></>
            ); */
            txt = (
                <><div><img src={buildImg} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {buildName}</div>
                    <div>{Object.keys(itemKeys).map((crafting, index) => (
                        <div key={index}>
                            <img src={imgcraft} className="resicon" alt={itemName} /> {item.craft[crafting].amount > 1 && "x" + item.craft[crafting].amount}
                            {" "} ready in <Timer timestamp={item.craft[crafting].readyAt} />
                        </div>
                    ))}</div></>
            );
        }
    } catch (error) {
        console.log("tooltip: ", error);
    }

    useEffect(() => {
        if (!txt || !txt.props.children || txt.props.children.length === 0) {
            closeModal();
        }
    }, [txt]);
    if (!txt || !txt.props.children || txt.props.children.length === 0) {
        return null;
    }
    return (
        <div className={`tooltip-wrapper ${isOpen ? "open" : ""}`}>
            <div className="tooltip"
                style={{
                    left: typeof pos.x === "number" ? `${pos.x}px` : pos.x,
                    top: typeof pos.y === "number" ? `${pos.y}px` : pos.y,
                }}>
                {txt}
            </div>
        </div>
    );
};

export default Tooltip;