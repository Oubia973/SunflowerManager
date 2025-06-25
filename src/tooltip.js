import React, { useEffect, useState } from 'react';
import { frmtNb, convtimenbr, ColorValue, Timer } from './fct.js';

const Tooltip = ({ onClose, item, context, value, clickPosition, dataSet }) => {
    const ForTry = (value === "trynft") || dataSet.forTry;
    let activeortry = ForTry ? "tryit" : "isactive";
    let costortry = ForTry ? "costtry" : "cost";
    let harvestortry = ForTry ? "harvesttry" : "harvest";
    let myieldortry = ForTry ? "myieldtry" : "myield";
    let mtimeortry = ForTry ? "mtimetry" : "mtime";
    let timeortry = ForTry ? "timetry" : "time";
    let stockortry = ForTry ? "stocktry" : "stock";
    let spotortry = ForTry ? "spottry" : "spot";
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
    const imgsfl = <img src="./icon/res/flowertoken.webp" style={{ width: "15px", height: "15px" }} />
    const imgcoins = <img src="./icon/res/coins.png" style={{ width: "15px", height: "15px" }} />
    const imgusdc = <img src="./usdc.png" style={{ width: "15px", height: "15px" }} />
    const imgmp = <img src="./icon/ui/exchange.png" style={{ width: "15px", height: "15px" }} />
    const Item = dataSet.it[item];
    const tradeTax = (100 - dataSet.options.tradeTax) / 100;
    let txt = "";
    const [isOpen, setIsOpen] = useState(false);
    //const [pos, setPos] = useState({ x: clickPosition.x, y: clickPosition.y });
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
            //setPos({ x: "50%", y: "50%" });
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
            const itemImg = <img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
            const itemTool = dataSet.tool[Item?.tool];
            const imgTool = <img src={itemTool?.img ?? imgna} style={{ width: "22px", height: "22px" }} />
            const imgOil = <img src={dataSet.it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />
            const toolCost = itemTool && itemTool[costortry];
            let prodCost = Item[costortry] / dataSet.options.coinsRatio;
            let txtCost = "";
            let isFree = Item[costortry] === 0;
            if (Item.cat === "crop") {
                const oilQuant = Item.greenhouse && Item.oil;
                const oilCost = Item.greenhouse ? (oilQuant * (dataSet.it["Oil"][costortry] / dataSet.options.coinsRatio)) : 0;
                const costTotal = (Item[seedortry] / dataSet.options.coinsRatio) + oilCost;
                txtCost = (
                    <><div>Seed cost {frmtNb(Item[seedortry])}{imgcoins} {oilQuant && oilQuant}{oilQuant && imgOil}
                        {'('}{frmtNb(costTotal)}{imgsfl}{')'}</div></>
                );
            }
            if (Item.cat === "wood") {
                const txtTool = <div>{imgTool} cost {frmtNb(itemTool[sflortry])}{imgcoins} {'('}{frmtNb(toolCost / dataSet.options.coinsRatio)}{imgsfl}{')'}</div>;
                txtCost = (
                    <>{txtTool}</>
                );
            }
            if (Item.cat === "mineral" || Item.cat === "gem" || Item.cat === "oil") {
                if (itemTool) {
                    const toolCompo = Object.keys(itemTool).map((itemName, itIndex) => (
                        itemTool[itemName] && dataSet.it[itemName] ? (
                            <>
                                {itemTool[itemName]}
                                <img src={dataSet.it[itemName].img} className="resicon" alt={itemName} />
                            </>
                        ) : null));
                    txtCost = (
                        <><div>{imgTool} cost {frmtNb(itemTool[sflortry])}{imgcoins}
                            {toolCompo} {'('}{frmtNb(toolCost / dataSet.options.coinsRatio)}{imgsfl}{')'}</div></>
                    );
                } else {
                    if (item === "Obsidian") {
                        let itemToolCompo = "";
                        let toolCost = 0; //Item[costortry];
                        isFree = false;
                        const toolCompo = Object.keys(Item.compo).map((itemName, itIndex) => {
                            if (dataSet.it[itemName]) { itemToolCompo = dataSet.it[itemName]; }
                            if (dataSet.fish[itemName]) { itemToolCompo = dataSet.fish[itemName]; }
                            if (dataSet.flower[itemName]) { itemToolCompo = dataSet.flower[itemName]; }
                            if (dataSet.craft[itemName]) { itemToolCompo = dataSet.craft[itemName]; }
                            toolCost += itemToolCompo[costortry] * Item.compo[itemName];
                            return (
                                <React.Fragment key={itIndex}>
                                    <img src={itemToolCompo.img} className="resicon" alt={itemName} />
                                    x{Item.compo[itemName]}
                                </React.Fragment>
                            );
                        });
                        //prodCost = toolCost / dataSet.options.coinsRatio;
                        txtCost = (
                            <><div>{toolCompo} {'('}{frmtNb(prodCost)}{imgsfl}{')'}</div></>
                        );
                    }
                }
            }
            if (Item.cat === "animal") {
                const aniName = Item.animal;
                const aniFoodQuant = Item[foodquantortry];
                const aniSpot = Item[spotortry];
                const foodCost = (Item[foodcostortry] / dataSet.options.coinsRatio);
                const urlImgFood = Item[foodortry] === "Mix" ? "./icon/res/mixed_grain_v2.webp" :
                    dataSet.it[Item[foodortry]].img ?? imgna;
                const imgFood = <img src={urlImgFood} style={{ width: "20px", height: "20px" }} />
                txtCost = (
                    <><div>{imgFood}x{frmtNb(aniFoodQuant)} cost {frmtNb(foodCost)}{imgsfl}</div>
                        <div>for a lvl{dataSet.options.animalLvl[aniName]} animal</div></>
                );
            }
            if (Item.cat === "fruit") {
                const oilQuant = Item.greenhouse && Item.oil;
                const oilCost = Item.greenhouse ? (oilQuant * (dataSet.it["Oil"][costortry] / dataSet.options.coinsRatio)) : 0;
                const costTotal = (Item[seedortry] / dataSet.options.coinsRatio) + oilCost;
                const itemTool = dataSet.tool["Axe"];
                const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                const toolCost = Item[toolcostortry];
                txtCost = (
                    <><div>Seed cost {frmtNb(Item[seedortry])}{imgcoins} {oilQuant && oilQuant}{oilQuant && imgOil}
                        {'('}{frmtNb(costTotal)}{imgsfl}{')'}</div>
                        {(!Item.greenhouse) ? <div>{Item[nbharvestortry]} harvest average by seed</div> : null}
                        {(!Item.greenhouse && !dataSet.nft["Foreman Beaver"][activeortry]) ? <div>{imgTool} cost {toolCost}{imgcoins}
                            {'('}{frmtNb(toolCost / dataSet.options.coinsRatio)}{imgsfl}{')'}</div> : null}</>
                );
            }
            const profit = (Item.costp2pt * tradeTax) - prodCost;
            const profitMul = (Item.costp2pt * tradeTax) / prodCost;
            const colorProfitMul = ColorValue(profitMul);
            txt = !Item?.buyit ? (
                <><div>{itemImg} {item} cost</div>
                    <div>{isFree ? null : txtCost}</div>
                    <div>{itemImg}x{frmtNb(Item[harvestortry] / Item[spotortry])} average by node</div>
                    <div>Your production cost {frmtNb(prodCost)}{imgsfl}</div>
                    <div>Marketplace{imgmp}-{dataSet.options.tradeTax}% tax {frmtNb(Item.costp2pt * tradeTax)}{imgsfl}</div>
                    <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
            ) : (
                <><div>{itemImg} {item}</div>
                    <div>You buy this item for {frmtNb(Item.costp2pt)}{imgsfl}</div></>
            );
        }
        if (context === "harvest") {
            const itemImg = <img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
            const itemTool = dataSet.tool[Item.tool];
            const imgTool = itemTool && <img src={itemTool?.img ?? imgna} style={{ width: "22px", height: "22px" }} />;
            //let itemSpot = dataSet.spot[dataSet.it[item].cat.toLowerCase()];
            let itemSpot = value > 0 ? Item["planted"] : Item[spotortry];
            let nodeCost = Item[costortry] * (Item[harvestortry] / itemSpot);
            let txtCompo = "";
            let isFree = Item[costortry] === 0;
            //let animalCostp2p = 0;
            if (Item?.cat === "crop") {
                const cropOrGreenhouse = Item.greenhouse ? "greenhouse" : "crop";
                //itemSpot = dataSet.spot[cropOrGreenhouse];
                const imgOil = <img src={dataSet.it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />;
                const oilQuant = Item.greenhouse ? Item.oil : 0;
                const oilCost = oilQuant * dataSet.it["Oil"][costortry];
                nodeCost = Item[seedortry] + oilCost;
                const txtOilQuantTotal = Item.greenhouse && <span> Oil: {oilQuant * itemSpot}{imgOil}</span>;
                txtCompo = <div> Seeds: {frmtNb(Item[seedortry] * itemSpot)}{imgcoins} {txtOilQuantTotal}
                    {'('}{frmtNb((nodeCost * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div>;
            }
            if (Item?.cat === "wood") {
                nodeCost = itemTool[costortry];
                //nodeCost = dataSet.nft["Foreman Beaver"][activeortry] ? 0 : itemTool[costortry];
                const txtTool = <div>{imgTool}x{itemSpot} cost {frmtNb(nodeCost * itemSpot)}{imgcoins} {'('}{frmtNb((nodeCost * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div>;
                txtCompo = <div>{dataSet.nft["Foreman Beaver"][activeortry] ? "nothing" : txtTool}</div>;
            }
            if (Item?.cat === "mineral" || Item.cat === "gem" || Item.cat === "oil") {
                if (itemTool) {
                    itemSpot = dataSet.spot[item.toLowerCase()];
                    nodeCost = itemTool[costortry];
                    const txtTool = Object.keys(itemTool).map((itemName, itIndex) => (
                        itemTool[itemName] && dataSet.it[itemName] ? (
                            <>
                                {itemTool[itemName] * itemSpot}
                                <img src={dataSet.it[itemName].img} className="resicon" alt={itemName} />
                            </>
                        ) : null));
                    txtCompo = <div>{imgTool}x{itemSpot} cost {frmtNb(itemTool[sflortry] * itemSpot)}{imgcoins} {txtTool} {'('}{frmtNb((nodeCost * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div>;
                } else {
                    if (item === "Obsidian") {
                        let itemToolCompo = "";
                        nodeCost = 0; //Item[costortry];
                        isFree = false;
                        const toolCompo = Object.keys(Item.compo).map((itemName, itIndex) => {
                            if (dataSet.it[itemName]) { itemToolCompo = dataSet.it[itemName]; }
                            if (dataSet.fish[itemName]) { itemToolCompo = dataSet.fish[itemName]; }
                            if (dataSet.flower[itemName]) { itemToolCompo = dataSet.flower[itemName]; }
                            if (dataSet.craft[itemName]) { itemToolCompo = dataSet.craft[itemName]; }
                            nodeCost += itemToolCompo[costortry] * Item.compo[itemName];
                            return (
                                <React.Fragment key={itIndex}>
                                    <img src={itemToolCompo.img} className="resicon" alt={itemName} />
                                    x{Item.compo[itemName] * itemSpot}
                                </React.Fragment>
                            );
                        });
                        const prodCost = (nodeCost * itemSpot) / dataSet.options.coinsRatio;
                        txtCompo = (
                            <><div>{toolCompo} {'('}{frmtNb(prodCost)}{imgsfl}{')'}</div></>
                        );
                    }
                }
            }
            if (Item?.cat === "animal") {
                const aniName = Item.animal;
                //itemSpot = Item[spotortry]; //aniName !== "Chicken" ? dataSet.spot[aniName.toLowerCase()] : dataSet.spot["egg"];
                nodeCost = Item[foodcostortry];
                //const imgFood = dataSet.it[dataSet.it[item][foodortry]].img;
                const urlImgFood = Item[foodortry] === "Mix" ? "./icon/res/mixed_grain_v2.webp" :
                    dataSet.it[Item[foodortry]].img ?? imgna;
                const txtImgFood = <img src={urlImgFood} style={{ width: "22px", height: "22px" }} />;
                const quantFood = dataSet.it[item][foodquantortry] * itemSpot;
                let txtFoodV = null;
                let animalCost = 0;
                if (value > 0) {
                    let quantfoodortry = ForTry ? "quantfoodtry" : "quantfood";
                    let costfoodortry = ForTry ? "costFoodtry" : "costFood";
                    let costfoodp2portry = ForTry ? "costFoodp2ptry" : "costFoodp2p";
                    const animalV = dataSet.animals[aniName];
                    const foodTotals = {};
                    Object.keys(animalV).forEach(animalItem => {
                        const foodName = animalV[animalItem][foodortry];
                        const foodQuant = animalV[animalItem][quantfoodortry];
                        if (!foodTotals[foodName]) foodTotals[foodName] = 0;
                        foodTotals[foodName] += foodQuant;
                        animalCost += animalV[animalItem][costfoodortry] || 0;
                        //animalCostp2p += animalV[animalItem][costfoodp2portry] || 0;
                    });
                    const foodList = Object.entries(foodTotals).map(([foodName, totalQuant]) => {
                        const foodImg = foodName === "Mix"
                            ? <img src="./icon/res/mixed_grain_v2.webp" style={{ width: "20px", height: "20px" }} />
                            : <img src={dataSet.it[foodName]?.img ?? imgna} style={{ width: "20px", height: "20px" }} />;
                        return (
                            <span key={foodName} style={{ marginRight: 3 }}>
                                {foodImg}x{frmtNb(totalQuant)}
                            </span>
                        );
                    });
                    txtFoodV = <span>{foodList}</span>;
                    nodeCost = animalCost / itemSpot;
                }
                const txtFood = value > 0 ? <>{txtFoodV} cost {frmtNb((animalCost) / dataSet.options.coinsRatio)}{imgsfl}</> :
                    <>Food: {txtImgFood}x{frmtNb(quantFood)} cost {frmtNb((nodeCost * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}</>;
                const animalLvl = value > 0 ? "" : <div> for a lvl{dataSet.options.animalLvl[aniName]} animal</div>;
                txtCompo = <div> {txtFood}{animalLvl}</div>;
            }
            if (Item.cat === "fruit") {
                //const fruitOrGreenhouse = Item.greenhouse ? "greenhouse" : "fruit";
                //itemSpot = Item.imgseason === "FullMoon" ? 1 : dataSet.spot[fruitOrGreenhouse];
                const imgOil = <img src={dataSet.it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                const oilQuant = Item.greenhouse ? Item.oil : 0;
                const oilCost = oilQuant * dataSet.it["Oil"][costortry];
                const itemTool = dataSet.tool["Axe"];
                const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                const toolCost = Item[toolcostortry];
                const harvestNb = Item[nbharvestortry];
                nodeCost = (Item[seedortry] + oilCost + toolCost) / harvestNb;
                const prodCost = (nodeCost * itemSpot) / dataSet.options.coinsRatio;
                const txtOilQuantTotal = Item.greenhouse && <span> Oil: {oilQuant * itemSpot}{imgOil}</span>;
                const txt1harvest = <span> {!Item.greenhouse ? <div>For first harvest :</div> : null}</span>;
                const txtSeed = <div> - Seeds: {frmtNb(Item[seedortry] * itemSpot)}{imgcoins} {txtOilQuantTotal}
                    {'('}{frmtNb(((Item[seedortry] + oilCost) * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div>;
                const txtTool = <span> {!Item.greenhouse ? <div>- {imgTool} cost {toolCost * itemSpot}{imgcoins}
                    {' ('}{frmtNb((toolCost * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div> : null}</span>;
                const txtNbHarvest = <span> {!Item.greenhouse ? <div>For {harvestNb} harvests = {frmtNb(prodCost)}{imgsfl}</div> : null}</span>;
                txtCompo = <div>{txt1harvest}{txtSeed}{dataSet.nft["Foreman Beaver"][activeortry] ? null : txtTool}{txtNbHarvest}</div>;
            }
            if (Item?.cat === "honey") {
                itemSpot = dataSet.spot.beehive;
                nodeCost = dataSet.it["Flower"][costortry];
                const prodCost = (nodeCost * itemSpot) / dataSet.options.coinsRatio;
                txtCompo = <div> Seeds: {frmtNb(prodCost)}{imgsfl}</div>;
            }
            //const prodCost = Item[costortry] / dataSet.options.coinsRatio;
            let prodCostFinal = !isFree ? (nodeCost * itemSpot) / dataSet.options.coinsRatio : 0;
            const harvestCostp2pt = (Item.costp2pt * tradeTax) * (value > 0 ? value : Item[harvestortry]);
            //const harvestCostp2pt = (value > 0 && Item?.cat === "animal") ? animalCostp2p : (Item.costp2pt * tradeTax) * (value > 0 ? value : Item[harvestortry]);
            const txtProdCost = !isFree && <div>Your production cost: {txtCompo}</div>;
            const profit = harvestCostp2pt - prodCostFinal;
            const profitMul = harvestCostp2pt / prodCostFinal;
            const colorProfitMul = ColorValue(profitMul);
            const txtHarvest = value > 0 ? (<>
                <div>Harvest {itemImg}x{parseFloat(value).toFixed(2)} for {itemSpot} nodes</div>
            </>) : (<>
                <div>Yield by node {frmtNb(Item[myieldortry])}</div>
                <div>Harvest average {itemImg}x{frmtNb(Item[harvestortry])} for {itemSpot} nodes</div>
            </>);
            txt = !Item?.buyit ? (
                <><div>{itemImg} {item} {value > 0 ? "growing" : "harvest average"}</div>
                    {txtHarvest}
                    {txtProdCost}
                    <div>Marketplace{imgmp}-{dataSet.options.tradeTax}% tax {frmtNb(harvestCostp2pt)}{imgsfl}</div>
                    <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
            ) : (
                <><div>{itemImg} {item}</div>
                    <div>You buy this item for {frmtNb(Item.costp2pt)}{imgsfl}</div></>
            );
        }
        if (context === "dailysfl") {
            const itemImg = <img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
            const itemTool = dataSet.tool[Item.tool];
            const imgTool = itemTool && <img src={itemTool?.img ?? imgna} style={{ width: "22px", height: "22px" }} />;
            const imgOil = <img src={dataSet.it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />
            //let itemSpot = dataSet.spot[dataSet.it[item].cat.toLowerCase()];
            let itemSpot = Item[spotortry];
            const cycleD = Item[dailycycleortry] || 1;
            let dailySpot = cycleD * itemSpot;
            let dailySfl = ((Item.costp2pt * tradeTax) * Item[harvestortry]) * cycleD;
            let dailyCoinsCost = Item[costortry] * Item[harvestortry] * cycleD;
            let dailySflCost = dailyCoinsCost / dataSet.options.coinsRatio;
            let txtCompo = "";
            let txtStock = <span>stock: {Item[stockortry]}</span>;
            let isFree = Item[costortry] === 0;
            if (Item.cat === "crop") {
                dailySpot = cycleD * itemSpot;
                const oilQuant = Item.greenhouse && (Item.oil * dailySpot);
                const oilCost = Item.greenhouse ? (oilQuant * (dataSet.it["Oil"][costortry])) : 0;
                dailyCoinsCost = (dailySpot * Item[seedortry]) + oilCost;
                dailySflCost = (dailyCoinsCost / dataSet.options.coinsRatio);
                txtCompo = <div>Seed cost {frmtNb(dailyCoinsCost)}{imgcoins} for {dailySpot}seed {oilQuant && oilQuant}{oilQuant && imgOil}
                    {'('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
                txtStock = <span>seed stock: {Item[stockortry]}</span>;
            }
            if (Item.cat === "wood") {
                //dailyCoinsCost = dailySpot * (dataSet.nft["Foreman Beaver"][activeortry] ? 0 : itemTool[costortry]);
                //dailySflCost = (dailyCoinsCost / dataSet.options.coinsRatio);
                txtCompo = dataSet.nft["Foreman Beaver"][activeortry] ? null :
                    <div>{imgTool}x{dailySpot} cost {frmtNb(dailyCoinsCost)}{imgcoins} {'('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
                txtStock = dataSet.nft["Foreman Beaver"][activeortry] ? null : <span>tool stock: {Item[stockortry]}</span>;
            }
            if (Item.cat === "mineral" || Item.cat === "gem" || Item.cat === "oil") {
                if (itemTool) {
                    const isToolCost = Item[costortry] !== 0;
                    dailyCoinsCost = (isToolCost ? dailySpot * itemTool[costortry] : 0);
                    dailySflCost = (isToolCost ? (dailyCoinsCost / dataSet.options.coinsRatio) : 0);
                    const toolCompo = Object.keys(itemTool).map((itemName, itIndex) => (
                        itemTool[itemName] && dataSet.it[itemName] ? (
                            <>
                                {itemTool[itemName] * dailySpot}
                                <img src={dataSet.it[itemName].img} className="resicon" alt={itemName} />
                            </>
                        ) : null));
                    txtCompo = isToolCost && <div>{imgTool}x{dailySpot} cost {frmtNb(itemTool[sflortry] * dailySpot)}{imgcoins}{toolCompo} {'('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
                    txtStock = isToolCost && <span>tool stock: {Item[stockortry]}</span>;
                }
                else {
                    if (item === "Obsidian") {
                        let itemToolCompo = "";
                        let toolCost = 0; //Item[costortry];
                        isFree = false;
                        const toolCompo = Object.keys(Item.compo).map((itemName, itIndex) => {
                            if (dataSet.it[itemName]) { itemToolCompo = dataSet.it[itemName]; }
                            if (dataSet.fish[itemName]) { itemToolCompo = dataSet.fish[itemName]; }
                            if (dataSet.flower[itemName]) { itemToolCompo = dataSet.flower[itemName]; }
                            if (dataSet.craft[itemName]) { itemToolCompo = dataSet.craft[itemName]; }
                            toolCost += itemToolCompo[costortry] * Item.compo[itemName];
                            return (
                                <React.Fragment key={itIndex}>
                                    <img src={itemToolCompo.img} className="resicon" alt={itemName} />
                                    x{Item.compo[itemName] * dailySpot}
                                </React.Fragment>
                            );
                        });
                        dailyCoinsCost = dailySpot * toolCost;
                        dailySflCost = (dailyCoinsCost / dataSet.options.coinsRatio);
                        txtCompo = (
                            <><div>{toolCompo} {'('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div></>
                        );
                    }
                }
            }
            if (Item.cat === "animal") {
                const aniName = Item.animal;
                dailySpot = cycleD * itemSpot;
                const urlImgFood = Item[foodortry] === "Mix" ? "./icon/res/mixed_grain_v2.webp" :
                    dataSet.it[Item[foodortry]].img ?? imgna;
                const imgFood = <img src={urlImgFood} style={{ width: "20px", height: "20px" }} />
                const aniFoodQuant = Item[foodquantortry];
                const foodQuant = aniFoodQuant * dailySpot;
                const foodCost = Item[foodcostortry];
                dailyCoinsCost = dailySpot * Item[foodcostortry];
                dailySflCost = (dailyCoinsCost / dataSet.options.coinsRatio);
                const txtCompos = <div>{imgFood}x{frmtNb(foodQuant)} cost {frmtNb(dailyCoinsCost)}{imgcoins} {'('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
                const txtAnimals = <div> with {itemSpot}animals lvl{dataSet.options.animalLvl[aniName]} </div>;
                txtCompo = <div>{txtCompos}{txtAnimals}</div>;
            }
            if (Item.cat === "fruit") {
                /* dailySpot = cycleD * itemSpot;
                const oilQuant = Item.greenhouse && (Item.oil * dailySpot);
                const oilCost = Item.greenhouse ? (oilQuant * (dataSet.it["Oil"][costortry])) : 0;
                dailyCoinsCost = (dailySpot * Item[seedortry]) + oilCost;
                dailySflCost = (dailyCoinsCost / dataSet.options.coinsRatio);
                txtCompo = <div>Seed cost {frmtNb(dailyCoinsCost)}{imgcoins} for {dailySpot}seed {oilQuant && oilQuant}{oilQuant && imgOil}
                    {'('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
                txtStock = <span>seed stock: {Item[stockortry]}</span>; */
                dailySpot = cycleD * itemSpot;
                const oilQuant = Item.greenhouse ? Item.oil : 0;
                const oilCost = oilQuant * dataSet.it["Oil"][costortry];
                const itemTool = dataSet.tool["Axe"];
                const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                const toolCost = Item[toolcostortry];
                const harvestNb = Item[nbharvestortry];
                //nodeCost = (Item[seedortry] + oilCost + toolCost) / harvestNb;
                //const prodCost = (nodeCost * dailySpot) / dataSet.options.coinsRatio;
                dailyCoinsCost = ((Item[seedortry] + oilCost + toolCost) / harvestNb) * dailySpot;
                dailySflCost = (dailyCoinsCost / dataSet.options.coinsRatio);
                const txtOilQuantTotal = Item.greenhouse && <span> Oil: {oilQuant * dailySpot}{imgOil}</span>;
                const txt1harvest = <span> {!Item.greenhouse ? <div>For first harvest :</div> : null}</span>;
                const txtSeed = <div> - Seeds: {frmtNb(Item[seedortry] * dailySpot)}{imgcoins} {txtOilQuantTotal}
                    {'('}{frmtNb(((Item[seedortry] + oilCost) * dailySpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div>;
                const txtTool = <span> {!Item.greenhouse ? <div>- {imgTool} cost {toolCost * dailySpot}{imgcoins}
                    {' ('}{frmtNb((toolCost * dailySpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div> : null}</span>;
                const txtNbHarvest = <span> {!Item.greenhouse ? <div>For {harvestNb} harvests = {frmtNb(dailySflCost)}{imgsfl}</div> : null}</span>;
                txtCompo = <div>{txt1harvest}{txtSeed}{dataSet.nft["Foreman Beaver"][activeortry] ? null : txtTool}{txtNbHarvest}</div>;
            }
            const txtProdCost = !isFree && <div>{txtCompo}</div>;
            const profit = dailySfl - dailySflCost;
            const profitMul = dailySfl / dailySflCost;
            const colorProfitMul = ColorValue(profitMul);
            txt = !Item?.buyit ? (
                <><div>{itemImg} {item} daily</div>
                    <div>Grow time: {Item[timeortry]} {txtStock}</div>
                    <div>{cycleD}cycle/day with {dataSet.options.inputFarmTime}h and {dataSet.options.inputMaxBB}restock</div>
                    <div>Harvest average {itemImg}x{frmtNb(Item[harvestortry])} with {itemSpot}node</div>
                    <div>Harvest total by day {frmtNb(Item[harvestortry] * cycleD)}</div>
                    {txtProdCost}
                    <div>Marketplace{imgmp}-{dataSet.options.tradeTax}% tax {frmtNb(dailySfl)}{imgsfl}</div>
                    <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span></div></>
            ) : (
                <><div>{itemImg} {item}</div>
                    <div>You buy this item for {frmtNb(Item.costp2pt)}{imgsfl}</div></>
            );
        }
        if (context === "buildcraft") {
            const buildName = item.name;
            const buildImg = item.img;
            const itemsObject = typeof item.items === "object";
            const itemKeys = itemsObject ? item.items : item.craft;
            //const itemCost = ((dataSet[itemType][itemName][costortry] || 0) / dataSet.options.coinsRatio);
            //const itemCostp2pt = (dataSet[itemType][itemName].costp2pt * tradeTax) || 0;
            txt = (
                <><div><img src={buildImg} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} /> {buildName}</div>
                    <div>{Object.keys(itemKeys).map((crafting, index) => {
                        const itemType = itemsObject ? "compost" : "food";
                        const itemName = itemsObject ? crafting : itemKeys[crafting].name;
                        const itemAmount = itemsObject ? item.items[crafting] : item.craft[crafting].amount;
                        const itemRdyAt = itemsObject ? item.readyAt : item.craft[crafting].readyAt;
                        return (
                            <div key={index}>
                                <img src={dataSet[itemType][itemName].img} className="resicon" alt={itemName} />
                                {itemAmount > 1 && "x" + itemAmount} {" "}
                                ready in <Timer timestamp={itemRdyAt} />
                            </div>
                        );
                    })}</div></>
            );
        }
        if (context === "th") {
            if (item === "hoard") {
                txt = (
                    <><div>
                        Hoarding limit is the maximum amount you can make before store on chain
                    </div></>
                );
            }
            if (item === "quantity") {
                txt = (
                    <><div>Farm : how much you have in your farm</div>
                        <div>Daily : how much you can make daily</div>
                        <div>Restock : how much you can make by restock</div>
                        <div>Custom : you can change quantity to see total prices as you want</div>
                    </>
                );
            }
            if (item === "cost") {
                txt = (
                    <><div>Your production cost</div>
                        <div>/Unit : by unit</div>
                        <div>/Quantity : total by quantity</div>
                        <div>Checkbox : subtract production costs from price totals</div>
                    </>
                );
            }
            if (item === "withdraw") {
                txt = (
                    <><div>How much you can withdraw</div>
                    </>
                );
            }
            if (item === "coef") {
                txt = (
                    <><div>Sell price / Prod price</div>
                    </>
                );
            }
            if (item === "diff") {
                txt = (
                    <><div>% difference with Market price</div>
                    </>
                );
            }
            if (item === "yield") {
                txt = (
                    <><div>Amount by node with your boosts</div>
                    </>
                );
            }
            if (item === "harvest") {
                txt = (
                    <><div>Amount average on all nodes with your boosts</div>
                    </>
                );
            }
            if (item === "toharvest") {
                txt = (
                    <><div>Amount on all nodes in your farm</div>
                    </>
                );
            }
        }
        if (context === "trynft") {
            const booststable = { ...dataSet.skilllgc, ...dataSet.skill, ...dataSet.buildng, ...dataSet.nft, ...dataSet.nftw, ...dataSet.bud };
            const imtemimg = <img src={Item?.img ?? imgna} alt={item} style={{ width: "22px", height: "22px" }} />;
            let filteredBoosts = [];
            let txtItem = "";
            const filterBoosts = (item, boosttype, tryset) => {
                return Object.keys(booststable).filter(nftitem => {
                    const boost = booststable[nftitem];
                    const activeOrTryit = tryset ? "tryit" : "isactive";
                    const boostactive = tryset ? boost.tryit : boost.isactive;
                    const hasBoostType = Array.isArray(boost.boosttype)
                        ? boost.boosttype.includes(boosttype)
                        : boost.boosttype === boosttype;
                    const matchesBoostit = Array.isArray(boost.boostit)
                        ? boost.boostit.some(boostItem => boostItem === Item.cat || boostItem === item || boostItem === Item.scat)
                        : boost.boostit === Item.cat || boost.boostit === item || boost.boostit === Item.scat;
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
                            if (dataSet.it[boost?.boostit] && item !== boost?.boostit) { isBoostValid = false; }
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
                        if (boost?.boostit === "fruit" && nftitem === "Fruit Picker Apron" && item !== "Apple" && item !== "Orange" && item !== "Blueberry" && item !== "Banana") { isBoostValid = false; }
                        if (nftitem === "No Axe No Worries" && Item.greenhouse) { isBoostValid = false; }
                        if (nftitem === "Feller's Discount" && Item.greenhouse) { isBoostValid = false; }
                        if (!tryset) {
                            if (nftitem === "Frozen Heart" && dataSet.curSeason !== "winter") { isBoostValid = false; }
                            if (nftitem === "Autumn's Embrace" && dataSet.curSeason !== "autumn") { isBoostValid = false; }
                            if (nftitem === "Blossom Ward" && dataSet.curSeason !== "spring") { isBoostValid = false; }
                            if (nftitem === "Solflare Aegis" && dataSet.curSeason !== "summer") { isBoostValid = false; }
                        }
                        if (Item.scat === "barn" && nftitem === "Double Bale" && !booststable["Bale Economy"][activeOrTryit]) { isBoostValid = false; }
                    }
                    return isBoostValid;
                });
            };
            if (value === "timechg") {
                filteredBoosts = filterBoosts(item, "time", true);
                txtItem = <div>Boosts for {imtemimg}{item} time:</div>;
            }
            if (value === "yieldchg") {
                filteredBoosts = filterBoosts(item, "yield", true);
                txtItem = <div>Boosts for {imtemimg}{item} yield:</div>;
            }
            if (value === "costchg") {
                filteredBoosts = filterBoosts(item, "cost", true);
                txtItem = <div>Boosts for {imtemimg}{item} cost:</div>;
            }
            if (value === "yield") {
                filteredBoosts = [...filterBoosts(item, "yield", ForTry), ...filterBoosts(item, "time", ForTry), ...filterBoosts(item, "cost", ForTry)];
                txtItem = (<>
                    <div>Yield for {imtemimg}{item} : {frmtNb(Item[myieldortry])}</div>
                    <div>{frmtNb(Item[harvestortry] / Item[spotortry])} average by node</div>
                    <div>Boosts :</div>
                </>);
            }
            txt = (
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
        }
        if (context === "trynfthelp") {
            txt = (
                <>
                    <div>The Active items are on your farm.</div>
                    <div>Select NFT/Craft/Skills/Buds you want on Try checkboxes</div>
                    <div>and clic Refresh button to see changes.</div>
                    <div>Then on main page you can switch Activeset/Tryset to see differences</div>
                </>
            );
        }
        if (context === "trynftsupply") {
            if (value === "nft") {
                const nftItem = dataSet.nft[item] ? dataSet.nft[item] : null;
                const imtemimg = <img src={nftItem?.img ?? imgna} alt={item} style={{ width: "22px", height: "22px" }} />;
                txt = (
                    <><div>{imtemimg}{item} supply</div>
                        <div>In farms inventory {nftItem.inv || nftItem.supply || 0}</div>
                        <div>Listed {nftItem.listed || 0}</div>
                        <div>Banned {nftItem.banned || 0}</div>
                        <div>On chain {nftItem.onchain || 0}</div></>
                );
            }
            if (value === "nftw") {
                const nftItem = dataSet.nftw[item] ? dataSet.nftw[item] : null;
                const imtemimg = <img src={nftItem?.img ?? imgna} alt={item} style={{ width: "22px", height: "22px" }} />;
                txt = (
                    <><div>{imtemimg}{item} supply</div>
                        <div>In farms inventory {nftItem.inv || nftItem.supply || 0}</div>
                        <div>Listed {nftItem.listed || 0}</div>
                        <div>Banned {nftItem.banned || 0}</div>
                        <div>On chain {nftItem.onchain || 0}</div></>
                );
            }
        }
        if (context === "trades") {
            const trades = dataSet.ftrades;
            if (trades && Object.keys(trades).length > 0) {
                let totalPrice = 0;
                let totalMarketPrice = 0;
                let totalSoldPrice = 0;
                txt = (
                    <table style={{ borderCollapse: "collapse", width: "100%", color: "white" }}>
                        <thead>
                            <tr>
                                <th className="tdcenterbrd">Item</th>
                                <th className="tdcenterbrd">Quantity</th>
                                <th className="tdcenterbrd">Sold</th>
                                <th className="tdcenterbrd">Price</th>
                                <th className="tdcenterbrd">Floor</th>
                                <th className="tdcenterbrd">Diff</th>
                                <th className="tdcenterbrd">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(trades).map(([key, trade], index) => {
                                const traderow = trades[index];
                                const date = new Date(traderow.createdAt).toLocaleString();
                                let itemName = "";
                                let quantity = 0;
                                const isSold = traderow.fulfilledAt;
                                Object.entries(traderow.items).forEach(([name, qty]) => {
                                    itemName = name;
                                    quantity = qty;
                                });
                                const price = traderow.sfl;
                                let marketPrice = 0;
                                let itemImg = "";
                                if (dataSet.nft[itemName]) {
                                    marketPrice = dataSet.nft[itemName].pricemsfl * quantity;
                                    itemImg = <img src={dataSet.nft[itemName].img} className="resicon" />;
                                }
                                if (dataSet.nftw[itemName]) {
                                    marketPrice = dataSet.nftw[itemName].pricemsfl * quantity;
                                    itemImg = <img src={dataSet.nftw[itemName].img} className="resicon" />;
                                }
                                if (dataSet.it[itemName]) {
                                    marketPrice = dataSet.it[itemName].costp2pt * quantity;
                                    itemImg = <img src={dataSet.it[itemName].img} className="resicon" />;
                                }
                                const marketDiff = marketPrice ? ((price - marketPrice) / marketPrice * 100).toFixed(2) + "%" : "N/A";
                                const marketDiffStyle = marketPrice && ((price - marketPrice) / marketPrice * 100) > 20 ? { color: "red" } : {};
                                totalPrice += price;
                                totalMarketPrice += marketPrice;
                                if (isSold) {
                                    totalSoldPrice += price;
                                }
                                return (
                                    <tr key={index}>
                                        <td className="tdcenterbrd">{itemImg}{itemName}</td>
                                        <td className="tdcenterbrd">{quantity}</td>
                                        <td className="tdcenterbrd">{isSold && <img src="./icon/ui/confirm.png" className="resicon" />}</td>
                                        <td className="tdcenterbrd">{frmtNb(price)}</td>
                                        <td className="tdcenterbrd">{frmtNb(marketPrice)}</td>
                                        <td className="tdcenterbrd" style={marketDiffStyle}>{marketDiff}</td>
                                        <td className="tdcenterbrd">{date}</td>
                                    </tr>
                                );
                            })}
                            <tr>
                                <td className="tdcenterbrd">Total</td>
                                <td className="tdcenterbrd"></td>
                                <td className="tdcenterbrd">{frmtNb(totalSoldPrice)}</td>
                                <td className="tdcenterbrd">{frmtNb(totalPrice)}</td>
                                <td className="tdcenterbrd">{frmtNb(totalMarketPrice)}</td>
                                <td className="tdcenterbrd"></td>
                                <td className="tdcenterbrd"></td>
                            </tr>
                        </tbody>
                    </table>
                );
            } else {
                txt = <div>No trades available.</div>;
            }
        }
        if (context === "balance") {
            txt = (
                <>
                    <div>On Your farm : {dataSet.balanceUSD}{imgusdc}</div>
                    <div>Your withdraw tax : {dataSet.withdrawtax}%</div>
                    <div>You have {dataSet.taxFreeSFL}{imgsfl} tax free</div>
                    <div>You can withdraw {dataSet.sflwithdraw}{imgsfl} : {dataSet.usdwithdraw}{imgusdc}</div>
                </>
            );
        }
        if (context === "market") {
            const itemImg = <img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
            let prodCost = (Item[costortry] * value.itemQuant) / dataSet.options.coinsRatio;
            if (!value.CostChecked) { prodCost = 0 }
            let isFree = Item[costortry] === 0;
            const profit = ((Item.costp2pt * value.itemQuant) * tradeTax) - prodCost;
            const profitMul = ((Item.costp2pt * value.itemQuant) * tradeTax) / prodCost;
            const colorProfitMul = ColorValue(profitMul);
            const tradeTaxSFL = (Item.costp2pt * value.itemQuant * dataSet.options.tradeTax) / 100;
            let txtCost = <div>Your production cost {frmtNb(prodCost)}{imgsfl}</div>;
            txt = <><div>{itemImg}{value.itemQuant > 1 ? ("x" + parseFloat(value.itemQuant).toFixed(2)) : ""} {item}</div>
                <div>Marketplace{imgmp} {frmtNb(Item.costp2pt * value.itemQuant)}{imgsfl}</div>
                <div>Trade tax {dataSet.options.tradeTax}% {frmtNb(tradeTaxSFL)}{imgsfl}</div>
                <div>{(isFree || !value.CostChecked) ? null : txtCost}</div>
                <div>Profit {frmtNb(profit)}{imgsfl} {value.CostChecked && (<span style={{ color: colorProfitMul }}>x{frmtNb(profitMul)}</span>)}</div>
            </>
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
            /* style={{
                left: typeof pos.x === "number" ? `${pos.x}px` : pos.x,
                top: typeof pos.y === "number" ? `${pos.y}px` : pos.y,
            }}> */
            /* style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }}> */
            >
                {txt}
            </div>
        </div>
    );
};

export default Tooltip;