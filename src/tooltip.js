import React, { useEffect, useState } from 'react';
import { frmtNb, convtimenbr, ColorValue } from './fct.js';

const Tooltip = ({ onClose, item, context, value, clickPosition, dataSet }) => {
    const ForTry = dataSet.forTry;
    let activeortry = ForTry ? "tryit" : "isactive";
    let costortry = ForTry ? "costtry" : "cost";
    let harvestortry = ForTry ? "harvesttry" : "harvest";
    let harvestdmaxortry = ForTry ? "harvestdmaxtry" : "harvestdmax";
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
    let dailyharvestortry = ForTry ? "dailyharvesttry" : "dailyharvest";
    let dailycycleortry = ForTry ? "dailycycletry" : "dailycycle";
    const imgna = "./icon/nft/na.png";
    const imgsfl = <img src="./icon/res/sfltoken.png" style={{ width: "15px", height: "15px" }} />
    const imgcoins = <img src="./icon/res/coins.png" style={{ width: "15px", height: "15px" }} />
    const imgmp = <img src="./icon/ui/exchange.png" style={{ width: "15px", height: "15px" }} />
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
            if (dataSet.it[item].cat === "crop") {
                const cropOrGreenhouse = dataSet.it[item].greenhouse ? "greenhouse" : "crop";
                const oilQuant = dataSet.it[item].greenhouse && dataSet.it[item].oil;
                const imgOil = <img src={dataSet.it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                const oilCost = dataSet.it[item].greenhouse ? (oilQuant * (dataSet.it["Oil"][costortry] / dataSet.coinsRatio)) : 0;
                const costTotal = (dataSet.it[item][seedortry] / dataSet.coinsRatio) + oilCost;
                const profit = (dataSet.it[item].costp2pt * 0.9) - (dataSet.it[item][costortry] / dataSet.coinsRatio);
                const profitPercentage = (profit / (dataSet.it[item].costp2pt * 0.9)) * 100;
                const profitMul = (dataSet.it[item].costp2pt * 0.9) / (dataSet.it[item][costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={dataSet.it[item]?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>Seed cost {frmtNb(dataSet.it[item][seedortry])}{imgcoins} {oilQuant && oilQuant}{oilQuant && imgOil}
                            {'('}{frmtNb(costTotal)}{imgsfl}{')'}</div>
                        <div>{frmtNb(dataSet.it[item][harvestortry] / dataSet.spot[cropOrGreenhouse])} average by node</div>
                        <div>Your production cost {frmtNb(value)}{imgsfl}</div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(dataSet.it[item].costp2pt * 0.9)}{imgsfl}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
            if (dataSet.it[item].cat === "wood") {
                const itemTool = dataSet.tool[dataSet.it[item].tool];
                const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                const toolCost = itemTool[costortry];
                const profit = (dataSet.it[item].costp2pt * 0.9) - value;
                const profitPercentage = (profit / (dataSet.it[item].costp2pt * 0.9)) * 100;
                const profitMul = (dataSet.it[item].costp2pt * 0.9) / (dataSet.it[item][costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={dataSet.it[item]?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>{imgTool} cost {frmtNb(itemTool[sflortry])}{imgcoins} {'('}{frmtNb(toolCost / dataSet.coinsRatio)}{imgsfl}{')'}</div>
                        <div>{frmtNb(dataSet.it[item][harvestortry] / dataSet.spot.wood)} average by node</div>
                        <div>Your production cost {frmtNb(value)}{imgsfl}</div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(dataSet.it[item].costp2pt * 0.9)}{imgsfl}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
            if (dataSet.it[item].cat === "mineral" || dataSet.it[item].cat === "gem") {
                const itemTool = dataSet.tool[dataSet.it[item].tool];
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
                    const profit = (dataSet.it[item].costp2pt * 0.9) - value;
                    const profitPercentage = (profit / (dataSet.it[item].costp2pt * 0.9)) * 100;
                    const profitMul = (dataSet.it[item].costp2pt * 0.9) / (dataSet.it[item][costortry] / dataSet.coinsRatio);
                    const colorProfitMul = ColorValue(profitMul);
                    txt = (
                        <><div><img src={dataSet.it[item]?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                            <div>{imgTool} cost {frmtNb(itemTool[sflortry])}{imgcoins}
                                {toolCompo} {'('}{frmtNb(toolCost / dataSet.coinsRatio)}{imgsfl}{')'}</div>
                            <div>{frmtNb(dataSet.it[item][harvestortry] / dataSet.spot[item.toLowerCase()])} average by node</div>
                            <div>Your production cost {frmtNb(value)}{imgsfl}</div>
                            <div>Marketplace{imgmp}-10% tax {frmtNb(dataSet.it[item].costp2pt * 0.9)}{imgsfl}</div>
                            <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                    );
                }
            }
            if (dataSet.it[item].cat === "animal") {
                const aniName = dataSet.it[item].animal;
                const aniFoodQuant = dataSet.it[item][foodquantortry];
                const aniSpot = aniName !== "Chicken" ? dataSet.spot[aniName.toLowerCase()] : dataSet.spot["egg"];
                const foodCost = (dataSet.it[item][foodcostortry] / dataSet.coinsRatio);
                const imgFood = <img src={dataSet.it[dataSet.it[item][foodortry]].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                const profit = (dataSet.it[item].costp2pt * 0.9) - (dataSet.it[item][costortry] / dataSet.coinsRatio);
                const profitPercentage = (profit / (dataSet.it[item].costp2pt * 0.9)) * 100;
                const profitMul = (dataSet.it[item].costp2pt * 0.9) / (dataSet.it[item][costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={dataSet.it[item]?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>{frmtNb(aniFoodQuant)}{imgFood} cost {frmtNb(foodCost)}{imgsfl}</div>
                        <div>for a lvl{dataSet.inputAnimalLvl} animal</div>
                        <div>{frmtNb(dataSet.it[item][harvestortry] / aniSpot)} average by animal</div>
                        <div>Your production cost {frmtNb(dataSet.it[item][costortry] / dataSet.coinsRatio)}{imgsfl}</div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(dataSet.it[item].costp2pt * 0.9)}{imgsfl}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
            if (dataSet.it[item].cat === "fruit") {
                const fruitOrGreenhouse = dataSet.it[item].greenhouse ? "greenhouse" : "fruit";
                const oilQuant = dataSet.it[item].greenhouse && dataSet.it[item].oil;
                const imgOil = <img src={dataSet.it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                const oilCost = dataSet.it[item].greenhouse ? (oilQuant * (dataSet.it["Oil"][costortry] / dataSet.coinsRatio)) : 0;
                const costTotal = (dataSet.it[item][seedortry] / dataSet.coinsRatio) + oilCost;
                const itemTool = dataSet.tool["Axe"];
                const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                const toolCost = dataSet.it[item][toolcostortry];
                const harvestNb = dataSet.it[item][nbharvestortry];
                const harvestTotal = harvestNb * dataSet.spot[fruitOrGreenhouse];
                const costprod = costTotal / harvestTotal;
                const profit = (dataSet.it[item].costp2pt * 0.9) - value;
                const profitPercentage = (profit / (dataSet.it[item].costp2pt * 0.9)) * 100;
                const profitMul = (dataSet.it[item].costp2pt * 0.9) / (dataSet.it[item][costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={dataSet.it[item]?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>Seed cost {frmtNb(dataSet.it[item][seedortry])}{imgcoins} {oilQuant && oilQuant}{oilQuant && imgOil}
                            {'('}{frmtNb(costTotal)}{imgsfl}{')'}</div>
                        <div>{frmtNb(dataSet.it[item][harvestortry] / dataSet.spot[fruitOrGreenhouse])} average by node</div>
                        {!dataSet.it[item].greenhouse ? <div>{harvestNb}harvest average by node</div> : null}
                        {!dataSet.it[item].greenhouse ? <div>{imgTool} cost {toolCost}{imgsfl}</div> : null}
                        <div>Your production cost {frmtNb(value)}{imgsfl}</div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(dataSet.it[item].costp2pt * 0.9)}{imgsfl}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
            if (item === "Honey") {

            }
            if (item === "Flower") {

            }
        }
        if (context === "dailysfl") {
            if (dataSet.it[item].cat === "crop") {
                const cropOrGreenhouse = dataSet.it[item].greenhouse ? "greenhouse" : "crop";
                const seedNb = dataSet.it[item][dailycycleortry] * dataSet.spot[cropOrGreenhouse];
                const oilQuant = dataSet.it[item].greenhouse && dataSet.it[item].oil * seedNb;
                const imgOil = <img src={dataSet.it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                const oilCost = dataSet.it[item].greenhouse ? (oilQuant * (dataSet.it["Oil"][costortry] / dataSet.coinsRatio)) : 0;
                const sflHarvest = (dataSet.it[item].costp2pt * 0.9) * dataSet.it[item][harvestortry];
                const cycleD = dataSet.it[item][dailycycleortry] || 1;
                const sflD = sflHarvest * cycleD;
                const coinSeedD = seedNb * dataSet.it[item][seedortry];
                const sflSeedD = (coinSeedD / dataSet.coinsRatio) + oilCost;
                const profit = sflD - sflSeedD;
                const profitPercentage = (profit / (dataSet.it[item].costp2pt * 0.9)) * 100;
                const profitMul = (dataSet.it[item].costp2pt * 0.9) / (dataSet.it[item][costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={dataSet.it[item]?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>Grow time: {dataSet.it[item][timeortry]} seed stock: {dataSet.it[item][stockortry]}</div>
                        <div>{cycleD}cycle/day with {dataSet.inputFarmTime}h and {dataSet.inputMaxBB}restock</div>
                        <div>Harvest average {frmtNb(dataSet.it[item][harvestortry])} with {dataSet.spot[cropOrGreenhouse]}node</div>
                        <div>Harvest total by day {frmtNb(dataSet.it[item][harvestortry] * cycleD)}</div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(sflD)}{imgsfl}</div>
                        <div>Seed cost {frmtNb(coinSeedD)}{imgcoins} for {seedNb}seed {oilQuant && oilQuant}{oilQuant && imgOil} {'('}{frmtNb(sflSeedD)}{imgsfl}{')'}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
            if (dataSet.it[item].cat === "wood") {
                const itemTool = dataSet.tool[dataSet.it[item].tool];
                const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                const toolCost = dataSet.it[item].cost;
                const cycleD = dataSet.it[item][dailycycleortry] || 1;
                const seedNb = cycleD * dataSet.spot.wood;
                const sflHarvest = (dataSet.it[item].costp2pt * 0.9) * dataSet.it[item][harvestortry];
                const sflD = sflHarvest * cycleD;
                const coinSeedD = seedNb * toolCost;
                const profit = sflD - (coinSeedD / dataSet.coinsRatio);
                const profitPercentage = (profit / (dataSet.it[item].costp2pt * 0.9)) * 100;
                const profitMul = (dataSet.it[item].costp2pt * 0.9) / (dataSet.it[item][costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={dataSet.it[item]?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>Grow time: {dataSet.it[item][timeortry]} tool stock: {dataSet.it[item][stockortry]}</div>
                        <div>{cycleD}cycle/day with {dataSet.inputFarmTime}h and {dataSet.inputMaxBB}restock</div>
                        <div>Chop average {frmtNb(dataSet.it[item][harvestortry])} with {dataSet.spot.wood}node</div>
                        <div>Chop total by day {frmtNb(dataSet.it[item][harvestortry] * cycleD)}</div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(sflD)}{imgsfl}</div>
                        <div>Tool cost {frmtNb(coinSeedD)}{imgcoins} for {seedNb}tree {'('}{frmtNb(coinSeedD / dataSet.coinsRatio)}{imgsfl}{')'}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
            if (dataSet.it[item].cat === "mineral" || dataSet.it[item].cat === "gem") {
                const itemTool = dataSet.tool[dataSet.it[item].tool];
                const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                const toolCost = (itemTool[costortry] / dataSet.coinsRatio);
                const cycleD = dataSet.it[item][dailycycleortry] || 1;
                const seedNb = cycleD * dataSet.spot[item.toLowerCase()];
                const toolCompo = Object.keys(itemTool).map((itemName, itIndex) => (
                    itemTool[itemName] && dataSet.it[itemName] ? (
                        <>
                            {itemTool[itemName] * cycleD * dataSet.spot[item.toLowerCase()]}
                            <img src={dataSet.it[itemName].img} className="resicon" alt={itemName} />
                        </>
                    ) : null));
                const sflHarvest = (dataSet.it[item].costp2pt * 0.9) * dataSet.it[item][harvestortry];
                const sflD = sflHarvest * cycleD;
                const coinSeedD = seedNb * itemTool[sflortry];
                const profit = sflD - (toolCost * seedNb);
                const profitPercentage = (profit / (dataSet.it[item].costp2pt * 0.9)) * 100;
                const profitMul = (dataSet.it[item].costp2pt * 0.9) / (dataSet.it[item][costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={dataSet.it[item]?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>Grow time: {dataSet.it[item][timeortry]} tool stock: {dataSet.it[item][stockortry]}</div>
                        <div>{cycleD}cycle/day with {dataSet.inputFarmTime}h and {dataSet.inputMaxBB}restock</div>
                        <div>Mine average {frmtNb(dataSet.it[item][harvestortry])} with {dataSet.spot[item.toLowerCase()]}node</div>
                        <div>Mine total by day {frmtNb(dataSet.it[item][harvestortry] * cycleD)}</div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(sflD)}{imgsfl}</div>
                        <div>{imgTool} cost {frmtNb(coinSeedD)}{imgcoins}{toolCompo} for {seedNb}node {'('}{frmtNb((toolCost * seedNb))}{imgsfl}{')'}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
            if (dataSet.it[item].cat === "animal") {
                const aniName = dataSet.it[item].animal;
                const aniFoodQuant = dataSet.it[item][foodquantortry];
                const aniSpot = aniName !== "Chicken" ? dataSet.spot[aniName.toLowerCase()] : dataSet.spot["egg"];
                const cycleD = dataSet.it[item][dailycycleortry] || 1;
                const seedNb = cycleD * aniSpot;
                const imgFood = <img src={dataSet.it[dataSet.it[item][foodortry]].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                const foodQuant = aniFoodQuant * aniSpot;
                const foodCost = (dataSet.it[item][foodcostortry] / dataSet.coinsRatio) * aniSpot;
                const sflHarvest = (dataSet.it[item].costp2pt * 0.9) * dataSet.it[item][harvestortry];
                const sflD = sflHarvest * cycleD;
                const profit = sflD - foodCost;
                const profitPercentage = (profit / (dataSet.it[item].costp2pt * 0.9)) * 100;
                const profitMul = (dataSet.it[item].costp2pt * 0.9) / (dataSet.it[item][costortry] / dataSet.coinsRatio);
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <><div><img src={dataSet.it[item]?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {item}</div>
                        <div>Sleep time {dataSet.it[item][timeortry]}</div>
                        <div>{cycleD}cycle/day with {dataSet.inputFarmTime}h</div>
                        <div>Produce average {frmtNb(dataSet.it[item][harvestortry])}</div>
                        <div>Produce total by day {frmtNb(dataSet.it[item][harvestortry] * cycleD)}</div>
                        <div> with {aniSpot}animals lvl{dataSet.inputAnimalLvl} </div>
                        <div>Marketplace{imgmp}-10% tax {frmtNb(sflD)}{imgsfl}</div>
                        <div>Food cost {frmtNb(foodCost)}{imgsfl} for {seedNb}animals {frmtNb(foodQuant)}{imgFood}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
                );
            }
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
                <div
                    className="tooltip-arrow"
                    style={{
                        left: `${clickPosition.x}px`,
                        top: `${clickPosition.y}px`
                    }}
                ></div>
                {txt}
            </div>
        </div>
    );
};

export default Tooltip;