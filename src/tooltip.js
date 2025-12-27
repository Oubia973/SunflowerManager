import React, { useEffect, useLayoutEffect, useMemo, useState, useRef } from 'react';
import { frmtNb, convtimenbr, convTime, ColorValue, Timer } from './fct.js';

const Tooltip = ({ onClose, item, context, value, clickPosition, dataSet, dataSetFarm, bdrag = true, forTry }) => {
    const { Animals, spot } = dataSetFarm || {};
    const { it, food, flower, fish, buildng, craft, tool, bounty } = dataSetFarm.itables || {};
    const { nft, nftw, skill, skilllgc, bud, shrine } = dataSetFarm.boostables || {};
    const ForTry = forTry;
    let activeortry = ForTry ? "tryit" : "isactive";
    let costortry = ForTry ? "costtry" : "cost";
    let harvestortry = ForTry ? "harvesttry" : "harvest";
    let myieldortry = ForTry ? "myieldtry" : "myield";
    let timeortry = ForTry ? "timetry" : "time";
    let stockortry = ForTry ? "stocktry" : "stock";
    let spotortry = ForTry ? "spottry" : "spot";
    let foodquantortry = ForTry ? "foodquanttry" : "foodquant";
    let foodcostortry = ForTry ? "foodcosttry" : "foodcost";
    let foodortry = ForTry ? "foodtry" : "food";
    let nbharvestortry = ForTry ? "nbharvesttry" : "nbharvest";
    let seedortry = ForTry ? "seedtry" : "seed";
    let toolcostortry = ForTry ? "toolcosttry" : "toolcost";
    let sflortry = ForTry ? "sfltry" : "sfl";
    let dailycycleortry = ForTry ? "dailycycletry" : "dailycycle";
    let woodavgortry = ForTry ? "woodavgtry" : "woodavg";
    function key(name) {
        if (name === "isactive") { return ForTry ? "tryit" : "isactive"; }
        return ForTry ? name + "try" : name;
    }
    const imgna = "./icon/nft/na.png";
    const imgmix = "./icon/res/mixed_grain_v2.webp";
    const imgomni = "./icon/res/omnifeed.webp";
    const imgsfl = <img src="./icon/res/flowertoken.webp" style={{ width: "15px", height: "15px" }} />
    const imgcoins = <img src="./icon/res/coins.png" style={{ width: "15px", height: "15px" }} />
    const imggem = <img src="./icon/res/gem.webp" style={{ width: "15px", height: "15px" }} />
    const imgusdc = <img src="./usdc.png" style={{ width: "15px", height: "15px" }} />
    const imgmp = <img src="./icon/ui/exchange.png" style={{ width: "15px", height: "15px" }} />
    const imgwinter = <img src="./icon/ui/winter.webp" alt={''} className="resico" title="Winter" />;
    const imgspring = <img src="./icon/ui/spring.webp" alt={''} className="resico" title="Spring" />;
    const imgsummer = <img src="./icon/ui/summer.webp" alt={''} className="resico" title="Summer" />;
    const imgautumn = <img src="./icon/ui/autumn.webp" alt={''} className="resico" title="Autumn" />;
    const Item = it?.[item] || {};
    const tradeTax = (100 - dataSet.options.tradeTax) / 100;
    let txt = "";
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [justOpened, setJustOpened] = useState(true);
    const [pos, setPos] = useState({ x: clickPosition.x - 100, y: clickPosition.y - 100 });
    //const [pos, setPos] = useState({ x: 200, y: 200 });
    const [dragging, setDragging] = useState(false);
    const offset = useRef({ x: 0, y: 0 });
    const margin = 0;
    const tooltipRef = useRef(null);
    const wrapperRef = useRef(null);
    const [tooltipSize, setTooltipSize] = useState({ w: 0, h: 0 });
    const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

    const handleBackdropDown = (e) => {
        if (e.target === wrapperRef.current) startClose();
    };
    const getClientPos = (e) => {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    };
    const readTooltipSize = () => {
        const el = tooltipRef.current;
        if (!el) return { w: 0, h: 0 };
        return { w: el.offsetWidth || 0, h: el.offsetHeight || 0 };
    };
    useLayoutEffect(() => {
        if (!isOpen || isClosing) return;
        const tEl = tooltipRef.current;
        const readContainer = () => {
            setContainerSize({ w: window.innerWidth, h: window.innerHeight });
        };
        const readTooltip = () => {
            setTooltipSize(readTooltipSize());
        };
        readContainer();
        requestAnimationFrame(readTooltip);
        const ro = new ResizeObserver(() => {
            readContainer();
            requestAnimationFrame(readTooltip);
        });
        if (tEl) ro.observe(tEl);
        window.addEventListener("resize", readContainer);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", readContainer);
        };
    }, [isOpen]);
    const clamp = (x, y) => {
        const maxX = Math.max(margin, (containerSize.w || 0) - (tooltipSize.w || 0) - margin);
        const maxY = Math.max(margin, (containerSize.h || 0) - (tooltipSize.h || 0) - margin);
        return {
            x: Math.min(Math.max(x, margin), maxX),
            y: Math.min(Math.max(y, margin), maxY),
        };
    };
    const safeClamp = (x, y) => {
        if (!tooltipSize.w || !tooltipSize.h || !containerSize.w || !containerSize.h) {
            return { x, y };
        }
        return clamp(x, y);
    };
    const handleMouseDown = (e) => {
        const { x, y } = getClientPos(e);
        setDragging(!!bdrag);
        offset.current = { x: x - pos.x, y: y - pos.y };
    };
    const handleMouseMove = (e) => {
        if (!dragging) return;
        const { x, y } = getClientPos(e);
        const nx = x - offset.current.x;
        const ny = y - offset.current.y;
        setPos(clamp(nx, ny));
    };
    const handleMouseUp = () => setDragging(false);
    const { x: sx, y: sy } = useMemo(() => clamp(pos.x, pos.y), [pos, containerSize, tooltipSize]);
    const openTooltip = () => {
        setIsClosing(false);
        setIsOpen(true);
    };
    const startClose = () => {
        setIsClosing(true);
    };
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
            openTooltip();
        }, 50);
    }, []);
    useEffect(() => {
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [justOpened]);
    useEffect(() => {
        if (!isOpen || !justOpened) return;
        const dx = (tooltipSize.w || 0) / 2;
        const dy = (tooltipSize.h || 0) / 2;
        const desiredX = (clickPosition?.x ?? 0) - dx;
        const desiredY = (clickPosition?.y ?? 0) - dy;
        setPos(safeClamp(desiredX, desiredY));
        setJustOpened(false);
    }, [
        isOpen,
        clickPosition?.x,
        clickPosition?.y,
        tooltipSize.w,
        tooltipSize.h,
        containerSize.w,
        containerSize.h,
    ]);
    useEffect(() => {
        const el = tooltipRef.current;
        if (!el) return;
        const onEnd = (e) => {
            if (!isClosing) return;
            if (e.propertyName !== "transform" && e.propertyName !== "opacity") return;
            setIsOpen(false);
            setIsClosing(false);
            onClose?.();
        };
        el.addEventListener("transitionend", onEnd);
        return () => el.removeEventListener("transitionend", onEnd);
    }, [isClosing, onClose]);
    useEffect(() => {
        if (!bdrag) return;
        if (dragging) document.body.classList.add("no-select");
        else document.body.classList.remove("no-select");
        return () => document.body.classList.remove("no-select");
    }, [dragging, bdrag]);

    let ToolTStyle = {
        position: "fixed",
        left: `${sx}px`,
        top: `${sy}px`,
        cursor: bdrag ? (dragging ? "grabbing" : "grab") : "default",
        touchAction: bdrag ? "none" : "auto",
        willChange: "transform,left,top",
    };
    if (!bdrag) {
        ToolTStyle = {
            position: "fixed",
            left: `${sx}px`,
            top: `${sy}px`,
            cursor: "default",
            touchAction: "auto",
            WebkitUserSelect: "text",
            userSelect: "text",
            WebkitTouchCallout: "default",
        };
    }

    try {
        if (it?.[item]) {
            function getNodeImg(item) {
                const retObj = {};
                switch (true) {
                    case (it[item]?.greenhouse):
                        retObj.nodeImg1 = "./icon/res/greenhouse_pot.webp";
                        break;
                    case (it[item]?.cat === "crop"):
                        retObj.nodeImg1 = "./icon/res/soil.png";
                        break;
                    case (item === "Wood"):
                        if (it[item]?.[key("spot2")]) { retObj.nodeImg2 = "./icon/res/summer_basic_ancient_tree.png"; }
                        if (it[item]?.[key("spot3")]) { retObj.nodeImg3 = "./icon/res/summer_basic_sacred_tree.png"; }
                        retObj.nodeImg1 = "./icon/res/harvested_tree.png";
                        break;
                    case (item === "Stone"):
                        if (it[item]?.[key("spot2")]) { retObj.nodeImg2 = "./icon/res/l2_stone_rock.webp"; }
                        if (it[item]?.[key("spot3")]) { retObj.nodeImg3 = "./icon/res/l3_stone_rock.webp"; }
                        retObj.nodeImg1 = "./icon/res/stone_small.png";
                        break;
                    case (item === "Iron"):
                        if (it[item]?.[key("spot2")]) { retObj.nodeImg2 = "./icon/res/l2_iron_rock.webp"; }
                        if (it[item]?.[key("spot3")]) { retObj.nodeImg3 = "./icon/res/l3_iron_rock.webp"; }
                        retObj.nodeImg1 = "./icon/res/iron_small.png";
                        break;
                    case (item === "Gold"):
                        if (it[item]?.[key("spot2")]) { retObj.nodeImg2 = "./icon/res/l2_gold_rock.webp"; }
                        if (it[item]?.[key("spot3")]) { retObj.nodeImg3 = "./icon/res/l3_gold_rock.webp"; }
                        retObj.nodeImg1 = "./icon/res/gold_small.png";
                        break;
                    case (item === "Crimstone"):
                        retObj.nodeImg1 = "./icon/res/crimstone_rock_5.webp";
                        break;
                    case (item === "Sunstone"):
                        retObj.nodeImg1 = "./icon/res/sunstone_rock_1.webp";
                        break;
                    case (item === "Obsidian"):
                        retObj.nodeImg1 = "./icon/res/lava_pit.webp";
                        break;
                    case (item === "Oil"):
                        retObj.nodeImg1 = "./icon/res/oil_reserve_full.webp";
                        break;
                    case (it[item]?.cat === "fruit"):
                        retObj.nodeImg1 = "./icon/res/apple_tree.png";
                        break;
                    case (item === "Honey"):
                        retObj.nodeImg1 = "./icon/res/beehive.webp";
                        break;
                    case (item === "Flower"):
                        retObj.nodeImg1 = "./icon/flower/flower_bed_modal.png";
                        break;
                    case (it[item]?.animal === "Chicken"):
                        retObj.nodeImg1 = "./icon/res/chkn.png";
                        break;
                    case (it[item]?.animal === "Cow"):
                        retObj.nodeImg1 = "./icon/res/cow.webp";
                        break;
                    case (it[item]?.animal === "Sheep"):
                        retObj.nodeImg1 = "./icon/res/sheep.webp";
                        break;
                    default:
                        retObj.nodeImg1 = "./icon/nft/na.png";
                        break;
                }
                return retObj;
            }
            const Spot1 = (it[item][key("spot")] || 0) - ((it[item]?.[key("spot2")] || 0) + (it[item]?.[key("spot3")] || 0));
            const nodeImg = getNodeImg(item);
            const imgNode = <img src={nodeImg.nodeImg1} style={{ width: "20px", height: "20px" }} />
            let imgNode2 = null;
            let imgNode3 = null;
            if (nodeImg?.nodeImg2) { imgNode2 = <img src={nodeImg.nodeImg2} style={{ width: "20px", height: "20px" }} /> }
            if (nodeImg?.nodeImg3) { imgNode3 = <img src={nodeImg.nodeImg3} style={{ width: "20px", height: "20px" }} /> }
            const noNode1 = (nodeImg?.nodeImg2 || nodeImg?.nodeImg3) && (((it[item]?.[key("spot2")] || 0) + (it[item]?.[key("spot3")] || 0)) === it[item][key("spot")]);
            const txtNodeImg2 = it[item]?.[key("spot2")] ? <>{it[item][key("spot2")]}{imgNode2}</> : null;
            const txtNodeImg3 = it[item]?.[key("spot3")] ? <>{it[item][key("spot3")]}{imgNode3}</> : null;
            const txtNodeImg = <>{"with "}{!noNode1 ? Spot1 : null}{!noNode1 && imgNode} {txtNodeImg2} {txtNodeImg3}</>;
            if (context === "costp") {
                const itemImg = <img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
                const itemTool = tool[Item?.tool];
                const imgTool = <img src={itemTool?.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                const imgOil = <img src={it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                const toolCost = itemTool && itemTool[costortry];
                let prodCost = Item[costortry] / dataSet.options.coinsRatio;
                let txtCost = "";
                let isFree = Item[costortry] === 0;
                let prodCost2 = "";
                if (Item.cat === "crop") {
                    const oilQuant = Item.greenhouse && Item.oil;
                    const oilCost = Item.greenhouse ? (oilQuant * (it["Oil"][costortry] / dataSet.options.coinsRatio)) : 0;
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
                        /* const toolCompo = Object.keys(itemTool).map((itemName, itIndex) => (
                            itemTool[itemName] && it[itemName] ? (
                                <>
                                    {itemTool[itemName]}
                                    <img src={it[itemName].img} className="resicon" alt={itemName} />
                                </>
                            ) : null)); */
                        /* const toolCompo = Object.keys(itemTool).map((itemName, itIndex) => {
                            const cleanName = ForTry ? itemName.replace(/try$/, "") : itemName;
                            const hasTryset = itemTool[cleanName] >= 0 && itemTool[cleanName + "try"] >= 0;
                            const hasQuant = ForTry ? (hasTryset ? (itemName.endsWith("try") && itemTool[itemName] > 0) : itemTool[itemName] > 0) : (!itemName.endsWith("try") && itemTool[itemName] > 0);
                            //console.log(itemTool, itemName, hasQuant, itemTool[itemName]);
                            return (
                                hasQuant && it[cleanName] ? (
                                    <React.Fragment key={itIndex}>
                                        {itemTool[itemName]}
                                        <img src={it[cleanName].img} className="resicon" alt={cleanName} />
                                    </React.Fragment>
                                ) : null);
                        }); */
                        const { table, totalCost, totalCostM } = setCompoTable(Item?.tool);
                        const toolCompo = table;
                        /* txtCost = (
                            <><div>{imgTool} cost {frmtNb(itemTool[sflortry])}{imgcoins}
                                {toolCompo} {'('}{frmtNb(toolCost / dataSet.options.coinsRatio)}{imgsfl}{')'}</div></>
                        ); */
                        txtCost = (
                            <><div>{toolCompo}</div></>
                        );
                    } else {
                        if (item === "Obsidian") {
                            let itemToolCompo = "";
                            let toolCost = 0; //Item[costortry];
                            let imgSeason = imgna;
                            let SeasonCurName = dataSetFarm.curSeason;
                            if (SeasonCurName === "winter") { imgSeason = imgwinter; };
                            if (SeasonCurName === "spring") { imgSeason = imgspring; };
                            if (SeasonCurName === "summer") { imgSeason = imgsummer; };
                            if (SeasonCurName === "autumn") { imgSeason = imgautumn; };
                            isFree = false;
                            /* const obsiCompoOrTry = ForTry ? Item.compotry : Item.compo;
                            let toolCompo = [];
                            toolCompo.push(<><span>{imgSeason} :</span> </>);
                            for (let itemName in obsiCompoOrTry) {
                                if (it[itemName]) { itemToolCompo = it[itemName]; }
                                if (fish[itemName]) { itemToolCompo = fish[itemName]; }
                                if (flower[itemName]) { itemToolCompo = flower[itemName]; }
                                if (craft[itemName]) { itemToolCompo = craft[itemName]; }
                                toolCost += itemToolCompo[costortry] * obsiCompoOrTry[itemName];
                                toolCompo.push(<span><img src={itemToolCompo.img} className="resicon" title={itemName} />x{obsiCompoOrTry[itemName]}</span>);
                            } */
                            const { table, totalCost, totalCostM } = setCompoTable("Obsidian");
                            const toolCompo = table;
                            //prodCost = toolCost / dataSet.options.coinsRatio;
                            let txtCompos = [];
                            Object.keys(it[item][key("compos")]).map(SeasonName => {
                                if (SeasonName === dataSetFarm.curSeason) return;
                                if (SeasonName === "winter") { imgSeason = imgwinter; };
                                if (SeasonName === "spring") { imgSeason = imgspring; };
                                if (SeasonName === "summer") { imgSeason = imgsummer; };
                                if (SeasonName === "autumn") { imgSeason = imgautumn; };
                                let lineCompos = [];
                                let toolCostOther = 0;
                                lineCompos.push(<><span>{imgSeason} :</span> </>);
                                for (let itemName in it[item][key("compos")][SeasonName]) {
                                    const compoQuant = it[item][key("compos")][SeasonName][itemName];
                                    if (it[itemName]) { itemToolCompo = it[itemName]; }
                                    if (fish[itemName]) { itemToolCompo = fish[itemName]; }
                                    if (flower[itemName]) { itemToolCompo = flower[itemName]; }
                                    if (craft[itemName]) { itemToolCompo = craft[itemName]; }
                                    toolCostOther += itemToolCompo[costortry] * compoQuant;
                                    lineCompos.push(<span><img src={itemToolCompo.img} className="resicon" title={itemName} />x{compoQuant}</span>);
                                }
                                const txtCompoPrice = <span> {' ('}{frmtNb(toolCostOther / dataSet.options.coinsRatio)}{imgsfl}{')'}</span>;
                                txtCompos.push(<div>{lineCompos}{txtCompoPrice}</div>);
                            });
                            txtCost = (
                                <><div>{toolCompo}</div>
                                    <div>Other seasons : {txtCompos}</div>
                                </>
                            );
                        }
                    }
                }
                if (Item.cat === "animal") {
                    const aniName = Item.animal;
                    const aniFoodQuant = Item[foodquantortry];
                    const aniSpot = Item[spotortry];
                    const foodCost = (Item[foodcostortry] / dataSet.options.coinsRatio);
                    let marketCost = (it?.[Item[foodortry]]?.costp2pt * aniFoodQuant) || 0;
                    const urlImgFood = Item[foodortry] === "Mix" ? "./icon/res/mixed_grain_v2.webp" :
                        Item[foodortry] === "Omnifeed" ? "./icon/res/omnifeed.webp" :
                            it[Item[foodortry]].img ?? imgna;
                    const imgFood = <img src={urlImgFood} style={{ width: "20px", height: "20px" }} />
                    const txtMPrice = <>{imgmp}{frmtNb(marketCost)}{imgsfl}</>;
                    if (Item[foodortry] === "Mix") {
                        const { table, totalCost, totalCostM } = setCompoTable("Mix Food", frmtNb(aniFoodQuant));
                        prodCost2 = <>{"("}Buying crops {imgmp}{frmtNb(totalCostM / Item[key("harvestnode")])}{imgsfl}{")"}</>;
                        txtCost = <><div>for a lvl{dataSet.options.animalLvl[aniName]} {imgNode}</div>
                            <div>{table}</div></>;
                    } else {
                        prodCost2 = <>{"("}Buying crops {imgmp}{frmtNb(marketCost / Item[key("harvestnode")])}{imgsfl}{")"}</>;
                        txtCost = (
                            <><div>for a lvl{dataSet.options.animalLvl[aniName]} {imgNode}</div>
                                <div>{imgFood}x{frmtNb(aniFoodQuant)} cost {frmtNb(foodCost)}{imgsfl} {txtMPrice}</div></>
                        );
                    }
                }
                if (Item.cat === "fruit") {
                    const oilQuant = Item.greenhouse && Item.oil;
                    const oilCost = Item.greenhouse ? (oilQuant * (it["Oil"][costortry] / dataSet.options.coinsRatio)) : 0;
                    const costTotal = (Item[seedortry] / dataSet.options.coinsRatio) + oilCost;
                    const itemTool = tool["Axe"];
                    const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                    const toolCost = Item[toolcostortry];
                    const toolFree = nft["Foreman Beaver"][activeortry] || skill["No Axe No Worries"][activeortry] ? true : false;
                    txtCost = (
                        <><div>Seed cost {frmtNb(Item[seedortry])}{imgcoins} {oilQuant && oilQuant}{oilQuant && imgOil}
                            {'('}{frmtNb(costTotal)}{imgsfl}{')'}</div>
                            {(!Item.greenhouse) ? <div>{Item[nbharvestortry]} harvest average by seed</div> : null}
                            {(!Item.greenhouse && !toolFree) ? <div>{imgTool} cost {toolCost}{imgcoins}
                                {'('}{frmtNb(toolCost / dataSet.options.coinsRatio)}{imgsfl}{')'}</div> : null}</>
                    );
                }
                if (Item?.cat === "flower") {
                    //itemSpot = dataSet.spot.beehive;
                    //nodeCost = it["Flower"][costortry];
                    txtCost = <div>Seed cost {frmtNb(prodCost)}{imgsfl}</div>;
                }
                if (Item?.cat === "honey") {
                    //itemSpot = dataSet.spot.beehive;
                    //nodeCost = it["Flower"][costortry];
                    prodCost = it["Flower"][costortry] / dataSet.options.coinsRatio;
                    txtCost = <div>Seed cost {frmtNb(prodCost)}{imgsfl}</div>;
                }
                const profit = (Item.costp2pt * tradeTax) - prodCost;
                const profitMul = frmtNb((Item.costp2pt * tradeTax) / prodCost);
                const profiPercent = (Math.ceil(profitMul * 100) - 100) || 0;
                const colorProfitMul = ColorValue(profitMul);
                txt = !Item?.buyit ? (
                    <><div>{itemImg} {item} cost</div>
                        <div>{isFree ? null : txtCost}</div>
                        {/* <div>{itemImg}x{frmtNb(Item[harvestortry] / (Item[spotortry] || 1))} average by node</div> */}
                        <div>{itemImg}x{frmtNb(Item[key("harvestnode")])} average per {imgNode}</div>
                        <div>Your production cost {frmtNb(prodCost)}{imgsfl}</div>
                        <div>{prodCost2}</div>
                        <div>Marketplace{imgmp}-{dataSet.options.tradeTax}% tax {frmtNb(Item.costp2pt * tradeTax)}{imgsfl}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>{profiPercent}%</span></div></>
                ) : (
                    <><div>{itemImg} {item}</div>
                        <div>You buy this item for {frmtNb(Item.costp2pt)}{imgsfl}</div></>
                );
            }
            if (context === "harvest") {
                const itemImg = <img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
                const itemTool = tool[Item.tool];
                const imgTool = itemTool && <img src={itemTool?.img ?? imgna} style={{ width: "22px", height: "22px" }} />;
                //let itemSpot = spot[it[item].cat.toLowerCase()];
                let itemSpot = value > 0 ? Item["planted"] : Item[spotortry]; // > Item[stockortry] ? Item[stockortry] : Item[spotortry]; //value > 0 ? Item["planted"] : Item[spotortry];
                let nodeCost = value > 0 ? Item["nodecost"] : Item[key("nodecost")]; //Item[costortry] * (Item[harvestortry] / itemSpot);
                let txtCompo = "";
                let isFree = value > 0 ? Item["toolfree"] : Item[key("toolfree")]; //Item[costortry] === 0;
                //let animalCostp2p = 0;
                if (Item?.cat === "crop") {
                    const cropOrGreenhouse = Item.greenhouse ? "greenhouse" : "crop";
                    //itemSpot = spot[cropOrGreenhouse];
                    const imgOil = <img src={it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />;
                    const oilQuant = Item.greenhouse ? Item.oil : 0;
                    const oilCost = oilQuant * it["Oil"][costortry];
                    //nodeCost = Item[seedortry] + oilCost;
                    const txtOilQuantTotal = Item.greenhouse && <span> {oilQuant * itemSpot}{imgOil}</span>;
                    txtCompo = <div> Seeds: {frmtNb(Item[seedortry] * itemSpot)}{imgcoins} {txtOilQuantTotal}
                        {'('}{frmtNb((nodeCost * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div>;
                }
                if (Item?.cat === "wood") {
                    //nodeCost = itemTool[costortry];
                    //nodeCost = dataSet.nft["Foreman Beaver"][activeortry] ? 0 : itemTool[costortry];
                    const txtTool = <div>{imgTool}x{itemSpot} cost {frmtNb(nodeCost * itemSpot)}{imgcoins} {'('}{frmtNb((nodeCost * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div>;
                    txtCompo = <div>{nft["Foreman Beaver"][activeortry] ? "nothing" : txtTool}</div>;
                }
                if (Item?.cat === "mineral" || Item.cat === "gem" || Item.cat === "oil") {
                    if (itemTool) {
                        //itemSpot = spot[item.toLowerCase()];
                        //nodeCost = itemTool[costortry];
                        const nTools = it[item][key("toolshrvst")];
                        const toolCompo = Object.keys(itemTool).map((itemName, itIndex) => {
                            const cleanName = ForTry ? itemName.replace(/try$/, "") : itemName;
                            const hasTryset = itemTool[cleanName] >= 0 && itemTool[cleanName + "try"] >= 0;
                            const hasQuant = ForTry ? (hasTryset ? (itemName.endsWith("try") && itemTool[itemName] > 0) : itemTool[itemName] > 0) : (!itemName.endsWith("try") && itemTool[itemName] > 0);
                            //console.log(itemTool, itemName, hasQuant, itemTool[itemName]);
                            return (
                                hasQuant && it[cleanName] ? (
                                    <React.Fragment key={itIndex}>
                                        {itemTool[itemName] * nTools}
                                        <img src={it[cleanName].img} className="resicon" alt={cleanName} />
                                    </React.Fragment>
                                ) : null);
                        });
                        /* const txtTool = Object.keys(itemTool).map((itemName, itIndex) => (
                            itemTool[itemName] && it[itemName] ? (
                                <>
                                    {itemTool[itemName] * itemSpot}
                                    <img src={it[itemName].img} className="resicon" alt={itemName} />
                                </>
                            ) : null)); */
                        txtCompo = <div>{imgTool}x{nTools} cost {frmtNb(itemTool[sflortry] * nTools)}{imgcoins} {toolCompo} {'('}{frmtNb((nodeCost * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div>;
                    } else {
                        if (item === "Obsidian") {
                            let itemToolCompo = "";
                            nodeCost = 0; //Item[costortry];
                            isFree = false;
                            const obsiCompoOrTry = ForTry ? Item.compotry : Item.compo;
                            const toolCompo = Object.keys(obsiCompoOrTry).map((itemName, itIndex) => {
                                if (it[itemName]) { itemToolCompo = it[itemName]; }
                                if (fish[itemName]) { itemToolCompo = fish[itemName]; }
                                if (flower[itemName]) { itemToolCompo = flower[itemName]; }
                                if (craft[itemName]) { itemToolCompo = craft[itemName]; }
                                nodeCost += (itemToolCompo?.[key("mergedCost")] || itemToolCompo[costortry]) * obsiCompoOrTry[itemName];
                                return (
                                    <React.Fragment key={itIndex}>
                                        <img src={itemToolCompo.img} className="resicon" alt={itemName} />
                                        x{obsiCompoOrTry[itemName] * itemSpot}
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
                    //nodeCost = Item[foodcostortry];
                    //const imgFood = it[it[item][foodortry]].img;
                    const urlImgFood = Item[foodortry] === "Mix" ? "./icon/res/mixed_grain_v2.webp" :
                        Item[foodortry] === "Omnifeed" ? "./icon/res/omnifeed.webp" :
                            it[Item[foodortry]].img ?? imgna;
                    const txtImgFood = <img src={urlImgFood} style={{ width: "22px", height: "22px" }} />;
                    const quantFood = it[item][foodquantortry] * itemSpot;
                    let txtFoodV = null;
                    let animalCost = 0;
                    if (value > 0) {
                        let quantfoodortry = ForTry ? "quantfoodtry" : "quantfood";
                        let costfoodortry = ForTry ? "costFoodtry" : "costFood";
                        let costfoodp2portry = ForTry ? "costFoodp2ptry" : "costFoodp2p";
                        const animalV = Animals[aniName];
                        const foodTotals = {};
                        Object.keys(animalV).forEach(animalItem => {
                            const foodName = animalV[animalItem][foodortry];
                            const foodQuant = animalV[animalItem][quantfoodortry];
                            const ignoreAnimal = dataSet.options?.ignoreAniLvl && (animalV[animalItem].lvl > dataSet.options.animalLvl[aniName]);
                            if (!ignoreAnimal) {
                                if (!foodTotals[foodName]) foodTotals[foodName] = 0;
                                foodTotals[foodName] += foodQuant;
                                animalCost += (animalV[animalItem][costfoodortry] || 0);
                            } else {
                                //itemSpot -= 1;
                            }
                            //animalCostp2p += animalV[animalItem][costfoodp2portry] || 0;
                        });
                        const foodList = Object.entries(foodTotals).map(([foodName, totalQuant]) => {
                            const foodImg = foodName === "Mix"
                                ? <img src="./icon/res/mixed_grain_v2.webp" style={{ width: "20px", height: "20px" }} />
                                : foodName === "Omnifeed" ? <img src="./icon/res/omnifeed.webp" style={{ width: "20px", height: "20px" }} />
                                    : <img src={it[foodName]?.img ?? imgna} style={{ width: "20px", height: "20px" }} />;
                            return (
                                <span key={foodName} style={{ marginRight: 3 }}>
                                    {foodImg}x{frmtNb(totalQuant)}
                                </span>
                            );
                        });
                        txtFoodV = <span>{foodList}</span>;
                        //nodeCost = animalCost / itemSpot;
                    }
                    const txtFood = value > 0 ? <>{txtFoodV} cost {frmtNb((animalCost) / dataSet.options.coinsRatio)}{imgsfl}</> :
                        <>Food: {txtImgFood}x{frmtNb(quantFood)} cost {frmtNb((nodeCost * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}</>;
                    const animalLvl = value > 0 ? "" : <div> for lvl{dataSet.options.animalLvl[aniName]} animals</div>;
                    txtCompo = <div> {txtFood}{animalLvl}</div>;
                    if (value > 0) { nodeCost = animalCost / itemSpot }
                }
                if (Item.cat === "fruit") {
                    //const fruitOrGreenhouse = Item.greenhouse ? "greenhouse" : "fruit";
                    //itemSpot = Item.imgseason === "FullMoon" ? 1 : dataSet.spot[fruitOrGreenhouse];
                    const imgOil = <img src={it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                    const oilQuant = Item.greenhouse ? Item.oil : 0;
                    const oilCost = oilQuant * it["Oil"][costortry];
                    const itemTool = tool["Axe"];
                    const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                    const toolCost = Item[toolcostortry];
                    const toolFree = nft["Foreman Beaver"][activeortry] || skill["No Axe No Worries"][activeortry] ? true : false;
                    const harvestNb = Item[nbharvestortry];
                    //nodeCost = (Item[seedortry] + oilCost + toolCost) / harvestNb;
                    const prodCost = ((nodeCost * itemSpot)) / dataSet.options.coinsRatio;
                    //const prodCost = Item[key("dailycost")] / dataSet.options.coinsRatio;
                    const txtOilQuantTotal = Item.greenhouse && <span> {oilQuant * itemSpot}{imgOil}</span>;
                    const txt1harvest = <span> {!Item.greenhouse ? <div>For first harvest :</div> : null}</span>;
                    const txtSeed = <div> - Seeds: {frmtNb(Item[seedortry] * itemSpot)}{imgcoins} {txtOilQuantTotal}
                        {'('}{frmtNb(((Item[seedortry] + oilCost) * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div>;
                    const txtTool = <span> {!Item.greenhouse ? <div>- {imgTool} cost {toolCost * itemSpot}{imgcoins}
                        {' ('}{frmtNb((toolCost * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div> : null}</span>;
                    const txtNbHarvest = <span> {!Item.greenhouse ? <div>For {harvestNb} harvests = {frmtNb(prodCost)}{imgsfl}</div> : null}</span>;
                    txtCompo = <div>{txt1harvest}{txtSeed}{toolFree ? null : txtTool}{txtNbHarvest}</div>;
                }
                if (Item?.cat === "flower") {
                    //itemSpot = dataSet.spot.beehive;
                    //nodeCost = it["Flower"][costortry];
                    const prodCost = (nodeCost * itemSpot) / dataSet.options.coinsRatio;
                    txtCompo = <div> Seeds: {frmtNb(prodCost)}{imgsfl}</div>;
                }
                if (Item?.cat === "honey") {
                    //itemSpot = dataSet.spot.beehive;
                    //nodeCost = it["Flower"][costortry];
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
                const profiPercent = (Math.ceil(profitMul * 100) - 100) || 0;
                const colorProfitMul = ColorValue(profitMul);
                const txtHarvest = value > 0 ? (<>
                    <div>Harvest {itemImg}x{parseFloat(value).toFixed(2)} for {itemSpot}{imgNode}</div>
                </>) : (<>
                    <div>Yield by node {frmtNb(Item[key("harvestnode")])}</div>
                    <div>Harvest average {itemImg}x{frmtNb(Item[harvestortry])} {txtNodeImg}</div>
                </>);
                txt = !Item?.buyit ? (
                    <><div>{itemImg} {item} {value > 0 ? "growing" : "harvest average"}</div>
                        {txtHarvest}
                        {txtProdCost}
                        <div>Marketplace{imgmp}-{dataSet.options.tradeTax}% tax {frmtNb(harvestCostp2pt)}{imgsfl}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>{profiPercent}%</span></div></>
                ) : (
                    <><div>{itemImg} {item}</div>
                        <div>You buy this item for {frmtNb(Item.costp2pt)}{imgsfl}</div></>
                );
            }
            if (context === "dailysfl") {
                const itemImg = <img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
                const itemTool = tool[Item.tool];
                const imgTool = itemTool && <img src={itemTool?.img ?? imgna} style={{ width: "22px", height: "22px" }} />;
                const imgOil = <img src={it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                //let itemSpot = spot[it[item].cat.toLowerCase()];
                let itemSpot = Item[spotortry]; // > Item[stockortry] ? Item[stockortry] : Item[spotortry];
                const cycleD = Item[dailycycleortry] || 1;
                let dailySpot = cycleD * itemSpot;
                let dailySfl = Item[key("dailymarket")]; //((Item.costp2pt * tradeTax) * Item[harvestdmaxortry]); // * cycleD;
                let dailyCoinsCost = Item[key("dailycost")]; //Item[costortry] * Item[harvestdmaxortry]; // * cycleD;
                let dailySflCost = dailyCoinsCost / dataSet.options.coinsRatio;
                let txtCompo = "";
                let txtWoodAvg = "";
                let txtStock = <span>stock: {Item[stockortry]}</span>;
                let isFree = Item[costortry] === 0;
                if (Item.cat === "crop") {
                    dailySpot = cycleD * itemSpot;
                    const oilQuant = Item.greenhouse && (Item.oil * dailySpot);
                    const oilCost = Item.greenhouse ? (oilQuant * (it["Oil"][costortry])) : 0;
                    dailyCoinsCost = (dailySpot * Item[seedortry]) + oilCost;
                    dailySflCost = (dailyCoinsCost / dataSet.options.coinsRatio);
                    txtCompo = <div>Seeds x{dailySpot}: {frmtNb(Item[seedortry] * dailySpot)}{imgcoins}{oilQuant && " + "}{oilQuant && imgOil}{oilQuant && "x"}{oilQuant && oilQuant}
                        {oilQuant && ": "}{oilQuant && frmtNb(oilCost)}{oilQuant && imgcoins}{' ('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
                    txtStock = <span>seed stock: {Item[stockortry]}</span>;
                }
                if (Item.cat === "wood") {
                    //dailyCoinsCost = dailySpot * (nft["Foreman Beaver"][activeortry] ? 0 : itemTool[costortry]);
                    //dailySflCost = (dailyCoinsCost / dataSet.options.coinsRatio);
                    txtCompo = nft["Foreman Beaver"][activeortry] ? null :
                        <div>{imgTool}x{dailySpot} cost {frmtNb(dailyCoinsCost)}{imgcoins} {'('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
                    txtStock = nft["Foreman Beaver"][activeortry] ? null : <span>tool stock: {Item[stockortry]}</span>;
                }
                if (Item.cat === "mineral" || Item.cat === "gem" || Item.cat === "oil") {
                    if (itemTool) {
                        const isToolCost = Item[costortry] !== 0;
                        const nTools = it[item][key("toolshrvst")] * cycleD;
                        //dailyCoinsCost = (isToolCost ? dailySpot * itemTool[costortry] : 0);
                        //dailySflCost = (isToolCost ? (dailyCoinsCost / dataSet.options.coinsRatio) : 0);
                        const toolCompo = Object.keys(itemTool).map((itemName, itIndex) => {
                            const cleanName = ForTry ? itemName.replace(/try$/, "") : itemName;
                            const hasTryset = itemTool[cleanName] >= 0 && itemTool[cleanName + "try"] >= 0;
                            const hasQuant = ForTry ? (hasTryset ? (itemName.endsWith("try") && itemTool[itemName] > 0) : itemTool[itemName] > 0) : (!itemName.endsWith("try") && itemTool[itemName] > 0);
                            //console.log(itemTool, itemName, hasQuant, itemTool[itemName]);
                            return (
                                hasQuant && it[cleanName] ? (
                                    <React.Fragment key={itIndex}>
                                        {itemTool[itemName] * nTools}
                                        <img src={it[cleanName].img} className="resicon" alt={cleanName} />
                                    </React.Fragment>
                                ) : null);
                        });
                        txtCompo = isToolCost && <div>{imgTool}x{nTools} cost {frmtNb(itemTool[sflortry] * nTools)}{imgcoins}{toolCompo} {'('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
                        txtStock = isToolCost && <span>tool stock: {Item[stockortry]}</span>;
                    }
                    else {
                        if (item === "Obsidian") {
                            let itemToolCompo = "";
                            let toolCost = 0; //Item[costortry];
                            isFree = false;
                            const obsiCompoOrTry = ForTry ? Item.compotry : Item.compo;
                            const toolCompo = Object.keys(obsiCompoOrTry).map((itemName, itIndex) => {
                                if (it[itemName]) { itemToolCompo = it[itemName]; }
                                if (fish[itemName]) { itemToolCompo = fish[itemName]; }
                                if (flower[itemName]) { itemToolCompo = flower[itemName]; }
                                if (craft[itemName]) { itemToolCompo = craft[itemName]; }
                                toolCost += itemToolCompo[costortry] * obsiCompoOrTry[itemName];
                                return (
                                    <React.Fragment key={itIndex}>
                                        <img src={itemToolCompo.img} className="resicon" alt={itemName} />
                                        x{obsiCompoOrTry[itemName] * dailySpot}
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
                        Item[foodortry] === "Omnifeed" ? "./icon/res/omnifeed.webp" :
                            it[Item[foodortry]].img ?? imgna;
                    const imgFood = <img src={urlImgFood} style={{ width: "20px", height: "20px" }} />
                    const aniFoodQuant = Item[foodquantortry];
                    const foodQuant = aniFoodQuant * dailySpot;
                    const foodCost = Item[foodcostortry];
                    dailyCoinsCost = dailySpot * Item[foodcostortry];
                    dailySflCost = (dailyCoinsCost / dataSet.options.coinsRatio);
                    const txtCompos = <div>{imgFood}x{frmtNb(foodQuant)} cost {frmtNb(dailyCoinsCost)}{imgcoins} {'('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
                    const txtAnimals = <div>{txtNodeImg} lvl{dataSet.options.animalLvl[aniName]} </div>;
                    txtCompo = <div>{txtCompos}{txtAnimals}</div>;
                }
                if (Item.cat === "fruit") {
                    /* dailySpot = cycleD * itemSpot;
                    const oilQuant = Item.greenhouse && (Item.oil * dailySpot);
                    const oilCost = Item.greenhouse ? (oilQuant * (it["Oil"][costortry])) : 0;
                    dailyCoinsCost = (dailySpot * Item[seedortry]) + oilCost;
                    dailySflCost = (dailyCoinsCost / dataSet.options.coinsRatio);
                    txtCompo = <div>Seed cost {frmtNb(dailyCoinsCost)}{imgcoins} for {dailySpot}seed {oilQuant && oilQuant}{oilQuant && imgOil}
                        {'('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
                    txtStock = <span>seed stock: {Item[stockortry]}</span>; */
                    dailySpot = cycleD * itemSpot;
                    const oilQuant = Item.greenhouse ? Item.oil * dailySpot : 0;
                    const oilCost = oilQuant * it["Oil"][costortry];
                    const itemTool = tool["Axe"];
                    const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                    const toolCost = Item[toolcostortry];
                    const harvestNb = Item[nbharvestortry];
                    const toolFree = nft["Foreman Beaver"][activeortry] || skill["No Axe No Worries"][activeortry] ? true : false;
                    //const woodHrvst = (itemSpot * (1 - skill["No Axe No Worries"][activeortry] + skill["Fruity Woody"][activeortry]));
                    const woodAvg = Item[woodavgortry]; //((cycleD / harvestNb) * woodHrvst);
                    const woodImg = <img src={it["Wood"].img ?? imgna} style={{ width: "20px", height: "20px" }} />;
                    //const dailyReplant = itemSpot * Math.ceil(cycleD / harvestNb);
                    //dailySfl += woodAvg > 0 ? ((it["Wood"].costp2pt * tradeTax) * woodAvg) : 0;
                    //nodeCost = (Item[seedortry] + oilCost + toolCost) / harvestNb;
                    //const prodCost = (nodeCost * dailySpot) / dataSet.options.coinsRatio;
                    /* if (!Item.greenhouse) {
                        dailyCoinsCost = Item[key("costdmax")]; //(Item[seedortry] + oilCost + toolCost) * dailyReplant;
                        dailySflCost = (dailyCoinsCost / dataSet.options.coinsRatio);
                        dailySfl = Item[key("dailymarket")]; //((Item.costp2pt * tradeTax) * Item[harvestdmaxortry]) + Item[key("dailywoodsfl")];
                    } */
                    const txtProdCost = <div>Your poduction cost for {harvestNb} harvests:</div>;
                    //const txt1harvest = <span> {!Item.greenhouse ? <div>Daily average :</div> : null}</span>;
                    //const txtNbHarvest = <span> {!Item.greenhouse ? <div>For {harvestNb} harvests = {frmtNb(dailySflCost)}{imgsfl}</div> : null}</span>;
                    const txtSeed = <div> - Seeds x{itemSpot}: {frmtNb(Item[seedortry] * itemSpot)}{imgcoins}
                        {'('}{frmtNb(((Item[seedortry]) * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div>;
                    const txtTool = <span> {!Item.greenhouse ? <div>- {imgTool}x{itemSpot} cost {toolCost * itemSpot}{imgcoins}
                        {' ('}{frmtNb((toolCost * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div> : null}</span>;
                    const txtDailyAvg = !Item.greenhouse && <div>Daily average: {frmtNb(dailyCoinsCost)}{imgcoins} {'('}{frmtNb(dailySflCost)}{imgsfl}{') ('}{frmtNb(cycleD / harvestNb)}x 6 harvests{')'}</div>;
                    txtWoodAvg = woodAvg > 0 && !Item.greenhouse ? <span> {woodImg}x{frmtNb(woodAvg)}</span> : null;
                    if (Item.greenhouse) {
                        txtCompo = <div>Seeds x{dailySpot}: {frmtNb(Item[seedortry] * dailySpot)}{imgcoins}{oilQuant && " + "}{oilQuant && imgOil}x{oilQuant && oilQuant}
                            {oilQuant && ": "}{frmtNb(oilCost)}{imgcoins}{' ('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
                    } else {
                        txtCompo = <div>{txtProdCost}{txtSeed}{toolFree ? null : txtTool}{txtDailyAvg}</div>;
                    }
                }
                if (Item?.cat === "flower") {
                    //itemSpot = dataSet.spot.beehive;
                    //nodeCost = it["Flower"][costortry];
                    txtCompo = <div>Seeds x{dailySpot}: {frmtNb(dailyCoinsCost)}{imgcoins}{' ('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
                }
                if (Item?.cat === "honey") {
                    //itemSpot = dataSet.spot.beehive;
                    //nodeCost = it["Flower"][costortry];
                    txtCompo = <div>Seeds x{dailySpot}: {frmtNb(dailyCoinsCost)}{imgcoins}{' ('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
                }
                const txtProdCost = !isFree && <div>{txtCompo}</div>;
                const profit = Item[key("dailysfl")]; //dailySfl - dailySflCost;
                const profitMul = Item[key("profitmul")] === "Infinity" ? Infinity : Item[key("profitmul")]; // dailySfl / dailySflCost;
                const profiPercent = (Math.ceil(profitMul * 100) - 100) || 0;
                const colorProfitMul = ColorValue(profitMul);
                const hrvstDSfl = frmtNb(Item[harvestortry] * cycleD * (Item.costp2pt * tradeTax));
                const txtHrvstDSfl = Item.cat === "fruit" && !Item.greenhouse ? <span> {"("}{hrvstDSfl}{imgsfl}{")"}</span> : null;
                const txtHrvstWoodDSfl = Item.cat === "fruit" && Item[key("dailywoodsfl")] > 0 ? <span> {"("}{frmtNb(Item[key("dailywoodsfl")])}{imgsfl}{")"}</span> : null;
                const itemDailyHarvestTime = convTime(convtimenbr(Item[timeortry]) * cycleD);
                const txtToolsBurn = dataSet.options.toolsBurn && Item[key("dburn")] ? <div>{itemImg}x{frmtNb(Item[key("harvestdmax")])} after burn {itemImg}x{frmtNb(Item[key("dburn")])} by tools </div> : null;
                const restockCost = itemTool ? (isFree ? 0 : 10) : (Item.animal ? 0 : 15);
                const hasRestock = Item[key("stock")];
                const dailyRestockGems = hasRestock && restockCost * Item[key("dailyrestock")];
                const txtAccountRestock = !dataSet.options?.restockCostDaily ? " (not counted)" : null;
                const txtRestockSfl = dataSet.options?.showRestockCost && dailyRestockGems > 0 ?
                    <div>Restock: {dailyRestockGems}{imggem}{"("}{frmtNb(Item[key("dailyrestocksfl")])}{imgsfl}{")"}{txtAccountRestock}</div> : null;
                txt = !Item?.buyit ? (
                    <><div>{itemImg} {item} daily</div>
                        <div>Grow time: {Item[timeortry]} {txtStock}</div>
                        <div>{cycleD} harvest/day with {dataSet.options.inputFarmTime}h and {Item[key("dailyrestock")]}restock</div>
                        <div>Time to harvest by day: {itemDailyHarvestTime}</div>
                        <div>Harvest average {itemImg}x{frmtNb(Item[harvestortry])} {txtNodeImg}</div>
                        <div>Harvest total by day {itemImg}x{frmtNb(Item[harvestortry] * cycleD)}{txtHrvstDSfl}{txtWoodAvg}{txtHrvstWoodDSfl}</div>
                        {txtToolsBurn}
                        {txtProdCost}
                        {txtRestockSfl}
                        <div>Marketplace{imgmp}-{dataSet.options.tradeTax}% tax {frmtNb(dailySfl)}{imgsfl}</div>
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>{profiPercent}%</span></div></>
                ) : (
                    <><div>{itemImg} {item}</div>
                        <div>You buy this item for {frmtNb(Item.costp2pt)}{imgsfl}</div></>
                );
            }
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
                                <img src={dataSetFarm.itables[itemType][itemName].img} className="resicon" alt={itemName} />
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
            const booststable = { ...skilllgc, ...skill, ...buildng, ...nft, ...nftw, ...bud, ...shrine };
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
                            if (it[boost?.boostit] && item !== boost?.boostit) { isBoostValid = false; }
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
                txtItem = (<>
                    <div>{imtemimg}{item} yield : {frmtNb(Item[myieldortry])}</div>
                    <div>{frmtNb(Item[key("harvestnode")])} average by node</div>
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
                const nftItem = nft[item] ? nft[item] : null;
                const imtemimg = <img src={nftItem?.img ?? imgna} alt={item} style={{ width: "22px", height: "22px" }} />;
                txt = (
                    <><div>{imtemimg}{item} supply</div>
                        <div>In farms inventory {nftItem.inv || nftItem.supply || 0}</div>
                        <div>Listed {nftItem.listed || 0}</div>
                        <div>Not counted : </div>
                        <div>Inactive {"("}30 days{")"} {nftItem.inactive || 0}</div>
                        <div>Banned {nftItem.banned || 0}</div>
                        <div>On chain {nftItem.onchain || 0}</div></>
                );
            }
            if (value === "nftw") {
                const nftItem = nftw[item] ? nftw[item] : null;
                const imtemimg = <img src={nftItem?.img ?? imgna} alt={item} style={{ width: "22px", height: "22px" }} />;
                txt = (
                    <><div>{imtemimg}{item} supply</div>
                        <div>In farms inventory {nftItem.inv || nftItem.supply || 0}</div>
                        <div>Listed {nftItem.listed || 0}</div>
                        <div>Not counted : </div>
                        <div>Inactive {"("}30 days{")"} {nftItem.inactive || 0}</div>
                        <div>Banned {nftItem.banned || 0}</div>
                        <div>On chain {nftItem.onchain || 0}</div></>
                );
            }
        }
        if (context === "trades") {
            const trades = dataSetFarm.ftrades;
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
                                if (nft[itemName]) {
                                    marketPrice = nft[itemName].pricemsfl * quantity;
                                    itemImg = <img src={nft[itemName].img} className="resicon" />;
                                }
                                if (nftw[itemName]) {
                                    marketPrice = nftw[itemName].pricemsfl * quantity;
                                    itemImg = <img src={nftw[itemName].img} className="resicon" />;
                                }
                                if (it[itemName]) {
                                    marketPrice = it[itemName].costp2pt * quantity;
                                    itemImg = <img src={it[itemName].img} className="resicon" />;
                                }
                                if (fish[itemName]) {
                                    itemImg = <img src={fish[itemName].img} className="resicon" />;
                                }
                                if (flower[itemName]) {
                                    itemImg = <img src={flower[itemName].img} className="resicon" />;
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
        if (context === "cookcost") {
            const items = Array.isArray(item) ? item : [item];
            const tables = items
                .filter((cookItem) => !!food?.[cookItem])
                .map((cookItem, idx) => {
                    const { table } = setCompoTable(cookItem, value);
                    return <React.Fragment key={`${cookItem}-${idx}`}>{table}</React.Fragment>;
                });
            txt = <>{tables}</>;
        }
        if (context === "market") {
            const itemImg = <img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
            let prodCost = (Item[costortry] * value.itemQuant) / dataSet.options.coinsRatio;
            if (!value.CostChecked) { prodCost = 0 }
            let isFree = Item[costortry] === 0;
            const profit = ((Item.costp2pt * value.itemQuant) * tradeTax) - prodCost;
            const profitMul = ((Item.costp2pt * value.itemQuant) * tradeTax) / prodCost;
            const profiPercent = (Math.ceil(profitMul * 100) - 100) || 0;
            const colorProfitMul = ColorValue(profitMul);
            const tradeTaxSFL = (Item.costp2pt * value.itemQuant * dataSet.options.tradeTax) / 100;
            let txtCost = <div>Your production cost {frmtNb(prodCost)}{imgsfl}</div>;
            txt = <><div>{itemImg}{value.itemQuant > 1 ? ("x" + parseFloat(value.itemQuant).toFixed(2)) : ""} {item}</div>
                <div>Marketplace{imgmp} {frmtNb(Item.costp2pt * value.itemQuant)}{imgsfl}</div>
                <div>Trade tax {dataSet.options.tradeTax}% {frmtNb(tradeTaxSFL)}{imgsfl}</div>
                <div>{(isFree || !value.CostChecked) ? null : txtCost}</div>
                <div>Profit {frmtNb(profit)}{imgsfl} {value.CostChecked && (<span style={{ color: colorProfitMul }}>{profiPercent}%</span>)}</div>
            </>
        }
        if (context === "craftcompo") {
            const { table, totalCost, totalCostM } = setCompoTable(item);
            txt = table;
            /* let icompoimg = [];
                for (let key in craft[item].compo) {
                const compoQuant = craft[item].compo[key];
                let itemBase = {};
                let icompoToAdd = imgna;
                let icompoValue = 0;
                let icompoValueM = 0;
                if (it[key]) {
                    itemBase = it;
                }
                if (bounty[key]) {
                    itemBase = bounty;
                }
                if (flower[key]) {
                    itemBase = flower;
                }
                if (craft[key]) {
                    itemBase = craft;
                }
                icompoToAdd = itemBase[key].img || imgna;
                icompoValue = itemBase[key][costortry] / dataSet.options.coinsRatio || 0;
                icompoValueM = itemBase[key]["costp2pt"] || 0;
                icompoimg.push(
                    <div key={key}>
                        {compoQuant}x
                        <img src={icompoToAdd} alt="" class="itico" title={key} />
                        Prod : {icompoValue}{imgsfl} Market : {icompoValueM}{imgsfl}
                    </div>
                );
            }
            txt = <><div>{itemImg} {item}</div>
                {icompoimg}
            </> */
        }
        if (context === "ratiodig" || context === "ratiodigp") {
            const itemImg = <img src={bounty[item]?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
            let txtItem = "";
            let txtItemImg = "";
            let txtPattern = "";
            const vToday = context === "ratiodigp" ? value.valueptoday : value.valuetoday;
            const toolsToday = context === "ratiodigp" ? value.toolcostpToday : value.itoolctoday;
            const ratioC = context === "ratiodigp" ? value.ratioCoinsPattern : value.ratioCoins;
            if (value.qtoday === "total") {
                txtItem = <div>Total ratio</div>;
            }
            if (value.qtoday > 0) {
                txtItem = <div>{itemImg}{item} ratio</div>;
                txtItemImg = <span>{itemImg}x{value.qtoday} </span>;
            }
            if (context === "ratiodigp" && value.qtoday === "total") {
                txtPattern = <><div>This is patterns values</div>
                    <div>it's what you can have without dig any Sand, Crab or Bone</div></>;
            }
            if (txtItem !== "") {
                txt = <>{txtItem}{txtPattern}
                    <div>Your tools cost with {dataSet.options.coinsRatio} ratio before dig: {toolsToday}</div>
                    <div>{txtItemImg}digged value today: {vToday}</div>
                    <div>{txtItemImg}ratio: {ratioC}{imgcoins} for 1{imgsfl}</div>
                </>
            }
        }
        if (context === "username") {
            const username = dataSet?.options?.username || "No Name";
            const farmId = dataSet?.options?.farmId || "Unknown";
            txt = <><div>{`User: ${username}`}</div>
                <div>{`farm ID: ${farmId}`}</div></>;
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
        <div ref={wrapperRef}
            className={`tooltip-wrapper ${isOpen ? "open" : ""} ${isClosing ? "closing" : ""}`}
            onMouseDown={handleBackdropDown}
            onTouchStart={handleBackdropDown}
            onMouseMove={bdrag ? handleMouseMove : undefined}
            onTouchMove={bdrag ? handleMouseMove : undefined}
            onMouseUp={bdrag ? handleMouseUp : undefined}
            onTouchEnd={bdrag ? handleMouseUp : undefined}>
            <div ref={tooltipRef}
                className={`tooltip ${!bdrag ? "scrollable" : ""}`}
                onMouseDown={(e) => { e.stopPropagation(); if (bdrag) handleMouseDown(e); }}
                onTouchStart={(e) => { e.stopPropagation(); if (bdrag) handleMouseDown(e); }}
                onDragStart={(e) => e.preventDefault()}
                style={ToolTStyle}
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
    function setCompoTable(item, quant) {
        let itemTable = {};
        let itemImgName = imgna;
        let itemQuant = quant || 1;
        if (craft[item]?.compo) {
            itemTable = craft[item]?.compo;
            itemImgName = craft[item]?.img;
        }
        if (tool?.[item]) {
            itemTable = tool?.[item];
            itemImgName = tool?.[item]?.img;
        }
        if (food[item]?.compo) {
            itemTable = food[item]?.compoit;
            itemImgName = food[item]?.img;
        }
        if (item === "Obsidian") {
            itemTable = ForTry ? Item.compotry : Item.compo;
            itemImgName = it["Obsidian"]?.img;
        }
        if (item === "Mix Food") {
            itemTable = {
                Corn: quant,
                Barley: quant,
                Wheat: quant
            };
            itemQuant = 1;
            itemImgName = imgmix;
        }
        const isTool = tool?.[item];
        const itemImg = <img src={itemImgName} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
        let totalCost = 0;
        let totalCostM = 0;
        const compoList = itemTable;
        const itemName = item;
        const itemQuantTxt = itemQuant > 1 ? (" x" + itemQuant) : "";
        const tableContent = Object.keys(compoList).map((key) => {
            const compoQuant = compoList[key] * itemQuant;
            const cleanName = ForTry ? key.replace(/try$/, "") : key;
            let hasQuant = compoQuant > 0;
            if (isTool && key !== "sfl") {
                const hasTryset = tool[item][cleanName] >= 0 && tool[item][cleanName + "try"] >= 0;
                hasQuant = ForTry ? (hasTryset ? (key.endsWith("try") && compoQuant > 0) : compoQuant > 0) : (!key.endsWith("try") && compoQuant > 0);
            }
            if (!hasQuant) return null;
            /* let itemBase = {};
            if (it[key]) { itemBase = it; }
            if (bounty[key]) { itemBase = bounty; }
            if (flower[key]) { itemBase = flower; }
            if (craft[key]) { itemBase = craft; }
            if (!itemBase?.[key]) { return null; } */
            const itemBase = [it, fish, bounty, flower, craft].find(src => src?.[cleanName]);
            if ((!itemBase && (key !== "sfl"))) return null;
            const icompoToAdd = (key === "sfl") ? "./icon/res/coins.png" : (itemBase[cleanName]?.img || imgna);
            const titleImg = (key === "sfl") ? "Coins" : key;
            const icompoImg = <img src={icompoToAdd} alt={key} className="resicon" title={titleImg} />;
            const compoCost = (key === "sfl") ? (1 / dataSet.options.coinsRatio) : (itemBase[cleanName][costortry] / dataSet.options.coinsRatio);
            const icompoValue = compoQuant * compoCost || 0;
            const icompoValueM = compoQuant * ((key === "sfl") ? (1 / dataSet.options.coinsRatio) : itemBase[cleanName]["costp2pt"]) || 0;
            totalCost += icompoValue;
            totalCostM += icompoValueM;
            return (
                <tr>
                    <td className="tdcenterbrd">{compoQuant}{icompoImg}</td>
                    <td className="tdcenterbrd">{frmtNb(icompoValue)}</td>
                    <td className="tdcenterbrd">{frmtNb(icompoValueM)}</td>
                </tr>
            );
        })
        const tableHeader = (
            <thead>
                <tr>
                    <th className="tdcenterbrd">{itemImg}{itemName}{itemQuantTxt}</th>
                    <td className="tdcenterbrd">Prod cost</td>
                    <td className="tdcenterbrd">{imgmp} cost</td>
                </tr>
                <tr>
                    <td className="tdcenterbrd">TOTAL</td>
                    <td className="tdcenterbrd">{frmtNb(totalCost)}{imgsfl}</td>
                    <td className="tdcenterbrd">{frmtNb(totalCostM)}{imgsfl}</td>
                </tr>
            </thead>
        );
        const table = (
            <>
                <table style={{ borderCollapse: "collapse", width: "100%", color: "white" }}>
                    {tableHeader}
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </>
        );
        return {
            table,
            totalCost,
            totalCostM
        };
    }
};

export default Tooltip;