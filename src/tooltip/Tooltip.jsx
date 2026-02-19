import React, { useEffect, useLayoutEffect, useMemo, useState, useRef } from 'react';
import { frmtNb, convtimenbr, convTime, ColorValue, Timer } from '../fct.js';
import TradesTooltip from './TradesTooltip.jsx';
import TryNftTooltip from './TryNftTooltip.jsx';
import CompoTablesTooltip from './CompoTablesTooltip.jsx';
import createSetCompoTable from './compoTable.js';

const Tooltip = ({ onClose, item, context, value, clickPosition, dataSet, dataSetFarm, bdrag = true, forTry }) => {
    const { Animals } = dataSetFarm || {};
    const { it, food, pfood, flower, fish, buildng, craft, tool, bounty, petit, compost, crustacean, mutant } = dataSetFarm.itables || {};
    const { nft, nftw, skill, skilllgc, bud, shrine } = dataSetFarm.boostables || {};
    const { coinsRatio } = dataSet.options;
    const ForTry = forTry;
    let activeortry = ForTry ? "tryit" : "isactive";
    let costortry = ForTry ? "costtry" : "cost";
    let costp2ptortry = ForTry ? "costp2pttry" : "costp2pt";
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
    const imgexchng = './icon/ui/exchange.png';
    const imgExchng = <img src={imgexchng} alt={''} title="Marketplace" style={{ width: '25px', height: '25px' }} />;
    const imgwinter = <img src="./icon/ui/winter.webp" alt={''} className="resico" title="Winter" />;
    const imgspring = <img src="./icon/ui/spring.webp" alt={''} className="resico" title="Spring" />;
    const imgsummer = <img src="./icon/ui/summer.webp" alt={''} className="resico" title="Summer" />;
    const imgautumn = <img src="./icon/ui/autumn.webp" alt={''} className="resico" title="Autumn" />;
    const Item =
        it?.[item] ||
        food?.[item] ||
        pfood?.[item] ||
        fish?.[item] ||
        flower?.[item] ||
        bounty?.[item] ||
        crustacean?.[item] ||
        craft?.[item] ||
        tool?.[item] ||
        compost?.[item] ||
        petit?.[item] ||
        {};
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
    const [compoExpanded, setCompoExpanded] = useState({});
    const [compoClosing, setCompoClosing] = useState({});
    const compoCloseTimersRef = useRef({});

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
    useEffect(() => {
        return () => {
            Object.values(compoCloseTimersRef.current).forEach((id) => clearTimeout(id));
            compoCloseTimersRef.current = {};
        };
    }, []);

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

    const setCompoTable = createSetCompoTable({
        ForTry,
        keyFn: key,
        dataSet,
        currentItem: Item,
        tables: { it, fish, bounty, flower, craft, petit, crustacean, tool, pfood, food },
        shrine,
        sflortry,
        assets: { imgna, imgmix, imgmp, imgsfl },
        compoState: {
            compoExpanded,
            setCompoExpanded,
            compoClosing,
            setCompoClosing,
            compoCloseTimersRef,
        },
    });

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
                const itemQuant = value;
                if (Item.cat === "crop") {
                    const oilQuant = Item.greenhouse && Item[key("oil")];
                    const oilCost = Item.greenhouse ? Math.ceil(oilQuant * it["Oil"][costortry]) : 0;
                    const costTotal = (Item[seedortry] / dataSet.options.coinsRatio) + (oilCost / dataSet.options.coinsRatio);
                    txtCost = (
                        <><div>Seed cost {frmtNb(Item[seedortry])}{imgcoins}
                            {oilQuant ? <span> + {oilQuant}{imgOil} {oilCost}{imgcoins}</span> : null}
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
                        const { table, totalCost, totalCostM } = setCompoTable("Mix Food", Number(aniFoodQuant || 0));
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
                    const oilQuant = Item.greenhouse && Item[key("oil")];
                    const oilCost = Item.greenhouse ? Math.ceil(oilQuant * it["Oil"][costortry]) : 0;
                    const costTotal = (Item[seedortry] / dataSet.options.coinsRatio) + (oilCost / dataSet.options.coinsRatio);
                    const itemTool = tool["Axe"];
                    const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                    const toolCost = Item[toolcostortry];
                    const toolFree = nft["Foreman Beaver"][activeortry] || skill["No Axe No Worries"][activeortry] ? true : false;
                    txtCost = (
                        <><div>Seed cost {frmtNb(Item[seedortry])}{imgcoins}
                            {oilQuant ? <span> + {oilQuant}{imgOil} {oilCost}{imgcoins}</span> : null}
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
                        <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfitMul }}>{profiPercent}%</span></div>
                    </>
                ) : (
                    <><div>{itemImg} {item}</div>
                        <div>You buy this item for {frmtNb(Item.costp2pt)}{imgsfl}</div></>
                );
            }
            if (context === "harvest") {
                const itemImg = <img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
                const itemTool = tool[Item.tool];
                const imgTool = itemTool && <img src={itemTool?.img ?? imgna} style={{ width: "22px", height: "22px" }} />;
                const nTools = Item[key("toolshrvst")];
                //let itemSpot = spot[it[item].cat.toLowerCase()];
                const itemSpot = value > 0 ? Item["planted"] : Item[key("spot")]; // > Item[stockortry] ? Item[stockortry] : Item[spotortry]; //value > 0 ? Item["planted"] : Item[spotortry];
                let nodeCost = value > 0 ? Item["nodecost"] : Item[key("nodecost")]; //Item[costortry] * (Item[harvestortry] / itemSpot);
                //const harvestCost = Item["harvestcost"];
                let txtCompo = "";
                let isFree = value > 0 ? Item["toolfree"] : Item[key("toolfree")]; //Item[costortry] === 0;
                //let animalCostp2p = 0;
                if (Item?.cat === "crop") {
                    //const cropOrGreenhouse = Item.greenhouse ? "greenhouse" : "crop";
                    //itemSpot = spot[cropOrGreenhouse];
                    const imgOil = <img src={it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />;
                    const oilQuant = Item.greenhouse ? Item[key("oil")] : 0;
                    const oilCost = Math.ceil(oilQuant * it["Oil"][costortry]);
                    //nodeCost = Item[seedortry] + oilCost;
                    //const txtOilQuantTotal = Item.greenhouse && <span> {oilQuant * itemSpot}{imgOil}</span>;
                    txtCompo = <div> Seeds: {frmtNb(Item[seedortry] * itemSpot)}{imgcoins}
                        {oilQuant ? <span> + {oilQuant * itemSpot}{imgOil} {oilCost * itemSpot}{imgcoins}</span> : null}
                        {'('}{frmtNb((Item[seedortry] * itemSpot) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div>;
                }
                if (Item?.cat === "wood") {
                    //nodeCost = itemTool[costortry] * nTools;
                    //nodeCost = dataSet.nft["Foreman Beaver"][activeortry] ? 0 : itemTool[costortry];
                    const txtTool = <div>{imgTool}x{nTools} cost {frmtNb(nodeCost * nTools)}{imgcoins} {'('}{frmtNb((nodeCost * nTools) / dataSet.options.coinsRatio)}{imgsfl}{')'}</div>;
                    txtCompo = <div>{nft["Foreman Beaver"][activeortry] ? "nothing" : txtTool}</div>;
                }
                if (Item?.cat === "mineral" || Item.cat === "gem" || Item.cat === "oil") {
                    if (itemTool) {
                        //itemSpot = spot[item.toLowerCase()];
                        //nodeCost = itemTool[costortry];
                        //const nTools = it[item][key("toolshrvst")];
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
                    const oilQuant = Item.greenhouse ? Item[key("oil")] : 0;
                    const oilCost = Math.ceil(oilQuant * it["Oil"][costortry]);
                    const itemTool = tool["Axe"];
                    const imgTool = <img src={itemTool.img ?? imgna} style={{ width: "22px", height: "22px" }} />
                    const toolCost = Item[toolcostortry];
                    const toolFree = nft["Foreman Beaver"][activeortry] || skill["No Axe No Worries"][activeortry] ? true : false;
                    const harvestNb = Item[nbharvestortry];
                    //nodeCost = (Item[seedortry] + oilCost + toolCost) / harvestNb;
                    const prodCost = ((nodeCost * itemSpot)) / dataSet.options.coinsRatio;
                    //const prodCost = Item[key("dailycost")] / dataSet.options.coinsRatio;
                    //const txtOilQuantTotal = Item.greenhouse && <span> {oilQuant * itemSpot}{imgOil}</span>;
                    const txt1harvest = <span> {!Item.greenhouse ? <div>For first harvest :</div> : null}</span>;
                    const txtSeed = <div> - Seeds: {frmtNb(Item[seedortry] * itemSpot)}{imgcoins}
                        {oilQuant ? <span> + {oilQuant * itemSpot}{imgOil} {oilCost * itemSpot}{imgcoins}</span> : null}
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
                let prodCostFinal = !isFree ? (nodeCost * (nTools || itemSpot)) / dataSet.options.coinsRatio : 0;
                const harvestCostp2pt = (Item.costp2pt * tradeTax) * (value > 0 ? value : Item[harvestortry]);
                //const harvestCostp2pt = (value > 0 && Item?.cat === "animal") ? animalCostp2p : (Item.costp2pt * tradeTax) * (value > 0 ? value : Item[harvestortry]);
                const txtProdCost = !isFree && <div>Your production cost: {txtCompo}</div>;
                const profit = harvestCostp2pt - prodCostFinal;
                const profitMul = harvestCostp2pt / prodCostFinal;
                const profiPercent = (Math.ceil(profitMul * 100) - 100) || 0;
                const colorProfitMul = ColorValue(profitMul);
                const txtHarvest = value > 0 ? (<>
                    <div>Harvest {itemImg}x{parseFloat(value).toFixed(2)} with {itemSpot}{imgNode}</div>
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
                const decimals = dataSet?.options?.averageDailyCycles ? 2 : 0;
                const cycleD = frmtNb(Item[dailycycleortry], decimals) || 1;
                let dailySpot = frmtNb(cycleD * itemSpot, decimals);
                const nTools = frmtNb(Item[key("toolshrvst")] * cycleD, decimals);
                let dailySfl = Item[key("dailymarket")]; //((Item.costp2pt * tradeTax) * Item[harvestdmaxortry]); // * cycleD;
                let dailyCoinsCost = Item[key("dailycost")]; //Item[costortry] * Item[harvestdmaxortry]; // * cycleD;
                let dailySflCost = dailyCoinsCost / dataSet.options.coinsRatio;
                let txtCompo = "";
                let txtWoodAvg = "";
                let txtStock = <span>stock: {Item[stockortry]}</span>;
                let isFree = Item[costortry] === 0;
                if (Item.cat === "crop") {
                    dailySpot = frmtNb(cycleD * itemSpot, decimals);
                    const oilQuant = Item.greenhouse && (Item[key("oil")] * dailySpot);
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
                        <div>{imgTool}x{nTools} cost {frmtNb(dailyCoinsCost)}{imgcoins} {'('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
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
                                        x{frmtNb(obsiCompoOrTry[itemName] * dailySpot, decimals)}
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
                    const oilQuant = Item.greenhouse && (Item[key("oil")] * dailySpot);
                    const oilCost = Item.greenhouse ? (oilQuant * (it["Oil"][costortry])) : 0;
                    dailyCoinsCost = (dailySpot * Item[seedortry]) + oilCost;
                    dailySflCost = (dailyCoinsCost / dataSet.options.coinsRatio);
                    txtCompo = <div>Seed cost {frmtNb(dailyCoinsCost)}{imgcoins} for {dailySpot}seed {oilQuant && oilQuant}{oilQuant && imgOil}
                        {'('}{frmtNb(dailySflCost)}{imgsfl}{')'}</div>;
                    txtStock = <span>seed stock: {Item[stockortry]}</span>; */
                    dailySpot = cycleD * itemSpot;
                    const oilQuant = Item.greenhouse ? Item[key("oil")] * dailySpot : 0;
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
            if (context === "cmdailysfl") {
                const itemImg = <img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
                const imgOil = <img src={it["Oil"].img ?? imgna} style={{ width: "20px", height: "20px" }} />
                const v = (value && typeof value === "object") ? value : {};
                const cycles = Number(v.cycles || 0);
                const cyclesRaw = Number(v.cyclesRaw || 0);
                const seedStock = Number(v.seedStock || 0);
                const seedBatch = Number(v.seedsPerBatch || 0);
                const seedsPerDay = Number(v.seedsPerDay || (seedBatch * cycles));
                const harvestBatch = Number(v.harvestPerBatch || 0);
                const harvestDay = Number(v.harvestPerDay || 0);
                const seedCostBatch = Number(v.seedCostPerBatch || 0);
                const seedCostDay = Number(v.seedCostPerDay || 0);
                const oilDay = Number(v.oilPerDay || 0);
                const oilCostDay = Number(v.oilCostPerDay || 0);
                const dailyRestock = Number(v.dailyRestock || 0);
                const dailyRestockGems = Number(v.dailyRestockGems || 0);
                const dailyRestockSfl = Number(v.dailyRestockSfl || 0);
                const costDay = Number(v.costPerDay || 0);
                const marketDay = Number(v.marketPerDay || 0);
                const profitDay = Number(v.profitPerDay || 0);
                const profitMul = costDay > 0 ? (marketDay / costDay) : Infinity;
                const profiPercent = (Math.ceil(profitMul * 100) - 100) || 0;
                const colorProfitMul = ColorValue(profitMul);
                txt = (
                    <>
                        <div>{itemImg} {item} daily</div>
                        <div>Grow time: {v.growTime || "00:00:00"} (1 pack of {seedStock * 2.5} seeds)</div>
                        <div>Seed stock: {frmtNb(seedStock)}</div>
                        <div>Harvest/day: {frmtNb(cycles)} full packs</div>
                        <div>Harvest average {itemImg}x{frmtNb(harvestBatch)} (1 pack)</div>
                        <div>Harvest total by day {itemImg}x{frmtNb(harvestDay)} (24h machine)</div>
                        <div>Seeds x{frmtNb(seedBatch)} x {frmtNb(cycles)} = {frmtNb(seedsPerDay)} ({frmtNb(seedCostDay)}{imgsfl}, 1 pack: {frmtNb(seedCostBatch)}{imgsfl})</div>
                        <div>Oil/day: {imgOil}x{frmtNb(oilDay)} ({frmtNb(oilCostDay)}{imgsfl})</div>
                        <div>Restock: {imggem}x15 x{frmtNb(dailyRestock)} = {frmtNb(dailyRestockGems)}{imggem} ({frmtNb(dailyRestockSfl)}{imgsfl})</div>
                        <div>Production cost/day: {frmtNb(costDay)}{imgsfl}</div>
                        <div>Marketplace{imgmp}-{dataSet.options.tradeTax}% tax {frmtNb(marketDay)}{imgsfl}</div>
                        <div>Profit {frmtNb(profitDay)}{imgsfl} <span style={{ color: colorProfitMul }}>{isFinite(profitMul) ? `${profiPercent}%` : "Infinity"}</span></div>
                    </>
                );
            }
            if (context === "cmgainh") {
                const itemImg = <img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
                const v = (value && typeof value === "object") ? value : {};
                const growTime = v.growTime || "00:00:00";
                const costPerPack = Number(v.costPerPack || 0);
                const marketPerPack = Number(v.marketPerPack || 0);
                const profitPerPack = Number(v.profitPerPack || 0);
                const gainPerHour = Number(v.gainPerHour || 0);
                const colorGainH = ColorValue(gainPerHour, 0, 10);
                txt = (
                    <>
                        <div>{itemImg} {item} gain/h</div>
                        <div>Grow time: {growTime}</div>
                        <div>Cost/pack: {frmtNb(costPerPack)}{imgsfl}</div>
                        <div>Marketplace/pack {imgmp}: {frmtNb(marketPerPack)}{imgsfl}</div>
                        <div>Profit/pack: {frmtNb(profitPerPack)}{imgsfl}</div>
                        <div>Gain/h: <span style={{ color: colorGainH }}>{frmtNb(gainPerHour)}{imgsfl}</span></div>
                    </>
                );
            }
        }
        if (context === "costitem") {
            const itemBase = [it, fish, bounty, flower, craft, petit, crustacean, food, pfood].find(src => src?.[item]);
            const icost = (itemBase[item][key("cost")] / dataSet.options.coinsRatio) * value;
            const itemimg = itemBase[item]?.img || imgna;
            const itemImg = <img src={itemimg} style={{ width: "20px", height: "20px" }} />;
            const txtQuant = value === 1 ? '' : "x" + value;
            let txtCost = "";
            if (itemBase[item]?.compoit) {
                const { table, totalCost, totalCostM } = setCompoTable(item, value);
                txtCost = (<div>{table}</div>);
            } else {
                txtCost = <>cost: {frmtNb(icost)}{imgsfl}</>;
            }
            txt = <><div>{itemImg}{item} {txtQuant}</div>
                <div>{txtCost}</div></>;
        }
        if (context === "animalcostu") {
            const productName = value?.product || item;
            const itemimg = it?.[productName]?.img || imgna;
            const itemImg = <img src={itemimg} style={{ width: "20px", height: "20px" }} />;
            const displayedCost = value?.displayedCost ?? "";
            const yieldPerCycle = value?.yieldPerCycle;
            const foodQty = value?.foodQty;
            const foodName = value?.foodName;
            const animalName = value?.animal || "";
            const currentLvl = value?.currentLvl;
            const buyCropsCostU = value?.buyCropsCostU;
            const marketCostU = value?.marketCostU;
            const tradeTax = value?.tradeTax ?? dataSet.options.tradeTax;
            const marketAfterTax = marketCostU || 0;
            const profit = marketAfterTax - (displayedCost || 0);
            const profitMul = marketAfterTax / (displayedCost || 0);
            const profiPercent = (Math.ceil(profitMul * 100) - 100) || 0;
            const colorProfit = ColorValue(profitMul);
            const foodIconSrc = foodName === "Mix"
                ? imgmix
                : foodName === "Omnifeed"
                    ? imgomni
                    : (it?.[foodName]?.img || imgna);
            const foodIcon = <img src={foodIconSrc} style={{ width: "16px", height: "16px" }} />;
            const isMixFood = foodName === "Mix" || foodName === "Mix Food";
            const mixFoodCompo = isMixFood ? setCompoTable("Mix Food", Number(foodQty || 0)) : null;
            const mixFoodTable = mixFoodCompo?.table || null;
            const animalIconSrc = animalName === "Chicken"
                ? "./icon/res/chkn.png"
                : animalName === "Cow"
                    ? "./icon/res/cow.webp"
                    : animalName === "Sheep"
                        ? "./icon/res/sheep.webp"
                        : imgna;
            const animalIcon = <img src={animalIconSrc} style={{ width: "16px", height: "16px" }} />;
            txt = (
                <>
                    <div>{itemImg} {productName} cost</div>
                    {(currentLvl !== undefined && currentLvl !== null) ? <div>for a lvl{currentLvl} {animalIcon}</div> : null}
                    {(foodQty !== undefined && foodQty !== null) ? (
                        isMixFood
                            ? <div>{mixFoodTable}</div>
                            : <div>{frmtNb(foodQty)} {foodIcon}</div>
                    ) : null}
                    {(yieldPerCycle !== undefined && yieldPerCycle !== null) ? <div>{itemImg}x{frmtNb(yieldPerCycle)} per {animalIcon}</div> : null}
                    {(displayedCost !== undefined && displayedCost !== null) ? <div>Your production cost {frmtNb(displayedCost)}{imgsfl}</div> : null}
                    {(buyCropsCostU !== undefined && buyCropsCostU !== null) ? <div>(Buying crops {imgmp}{frmtNb(buyCropsCostU)}{imgsfl})</div> : null}
                    {(marketCostU !== undefined && marketCostU !== null) ? <div>Marketplace-{tradeTax}% tax {frmtNb(marketAfterTax)}{imgsfl}</div> : null}
                    <div>Profit {frmtNb(profit)}{imgsfl} <span style={{ color: colorProfit }}>{profiPercent}%</span></div>
                </>
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
                        //const itemType = itemsObject ? "compost" : "food";
                        const itemName = itemsObject ? crafting : itemKeys[crafting].name;
                        let itemBase = "";
                        if (food[itemName]) { itemBase = "food"; }
                        if (pfood[itemName]) { itemBase = "pfood"; }
                        if (compost[itemName]) { itemBase = "compost"; }
                        const itemAmount = itemsObject ? item.items[crafting] : item.craft[crafting].amount;
                        const itemRdyAt = itemsObject ? item.readyAt : item.craft[crafting].readyAt;
                        return (
                            <div key={index}>
                                <img src={dataSetFarm.itables[itemBase][itemName].img} className="resicon" alt={itemName} />
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
            txt = <TryNftTooltip
                item={item}
                value={value}
                Item={Item}
                ForTry={ForTry}
                imgna={imgna}
                myieldortry={myieldortry}
                keyFn={key}
                dataSetFarm={dataSetFarm}
                it={it}
                buildng={buildng}
                boostables={{ nft, nftw, skill, skilllgc, bud, shrine }}
            />;
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
            let baseTable = (value === "nft") ? nft : nftw;
            const nftItem = baseTable[item] ? baseTable[item] : null;
            const imtemimg = <img src={nftItem?.img ?? imgna} alt={item} style={{ width: "22px", height: "22px" }} />;
            txt = (
                <><div>{imtemimg}<b>{item}</b> supply</div>
                    <div>{nftItem.inv || nftItem.supply || 0} in farms inventory</div>
                    <div>{nftItem.listed || 0} listed</div>
                    <div> - </div>
                    <div>Not counted from farms inventory : </div>
                    <div>{nftItem.inactive || 0} inactive {"("}30 days{")"}</div>
                    <div>{nftItem.banned || 0} banned</div>
                    <div> - </div>
                    <div>{nftItem.onchain || 0} on chain total</div></>
            );
        }
        if (context === "trades") {
            txt = <TradesTooltip trades={dataSetFarm.ftrades} itables={{ it, fish, flower, petit }} boostables={{ nft, nftw }} />;
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
            txt = <CompoTablesTooltip
                items={item}
                value={value}
                filterFn={(cookItem) => !!food?.[cookItem] || !!pfood?.[cookItem]}
                setCompoTable={setCompoTable}
            />;
        }
        if (context === "shrinecost") {
            txt = <CompoTablesTooltip
                items={item}
                value={value}
                filterFn={(cookItem) => !!shrine?.[cookItem]}
                setCompoTable={setCompoTable}
            />;
        }
        if (context === "crustaceancost") {
            txt = <CompoTablesTooltip items={item} value={value} setCompoTable={setCompoTable} />;
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
        if (context === "fetchcost") {
            const v = (value && typeof value === "object") ? value : {};
            const itemImg = <img src={Item?.img ?? imgna} alt={item ?? "?"} style={{ width: "20px", height: "20px" }} />;
            const imgEnergy = <img src="./icon/ui/lightning.png" alt="" className="itico" title="Energy" />;
            const modeMap = {
                pets: "Pets Daily",
                petst: "Pets Total",
                stock: "Stock",
                custom: "Custom",
            };
            const modeLabel = modeMap[v?.quantMode] || "Custom";
            const quantity = Number(v?.quantity || 0);
            const energyUnit = Number(v?.energyUnit || 0);
            const energyTotal = Number(v?.energyTotal || 0);
            const unitCost = Number(v?.unitCost || 0);
            const totalCost = Number(v?.totalCost || 0);
            const unitMarket = Number(v?.unitMarket || 0);
            const totalMarket = Number(v?.totalMarket || 0);
            const producers = Array.isArray(v?.producers) ? v.producers : [];
            const selectedProducers = producers.filter((p) => !!p?.contributesNow);
            const producersToDisplay = selectedProducers.length
                ? selectedProducers
                : (() => {
                    if (!producers.length) return [];
                    const ranked = producers.map((p) => {
                        const reqCost = Number(p?.reqCost || 0);
                        const reqEnergy = Number(p?.reqEnergyTotal || 0);
                        const petYield = Number(p?.yieldBase || 1);
                        const qty = (energyUnit > 0) ? ((reqEnergy / energyUnit) * petYield) : 0;
                        const costPerUnit = qty > 0 ? (reqCost / qty) : Number.POSITIVE_INFINITY;
                        return { p, costPerUnit };
                    });
                    ranked.sort((a, b) => a.costPerUnit - b.costPerUnit);
                    return ranked.length ? [ranked[0].p] : [];
                })();
            const producerRows = producersToDisplay
                .map((p) => {
                    const reqDetails = Array.isArray(p?.reqDetails) ? p.reqDetails : [];
                    const reqLine = reqDetails.map((r, idx) => (
                        <span key={`${p.petName}-${r.name}-${idx}`} style={{ display: "inline-flex", alignItems: "center", marginRight: 6 }}>
                            <img src={r.img || imgna} alt="" className="itico" title={r.name || ""} />
                        </span>
                    ));
                    const petReqCost = Number(p?.reqCost || 0);
                    const petReqEnergyTotal = Number(p?.reqEnergyTotal || 0);
                    const petLabel = p?.isNft ? (p?.cat || p?.petName || "") : (p?.petName || "");
                    const petYieldBase = Number(p?.yieldBase || 1);
                    const petQtyFromReqEnergy = (energyUnit > 0) ? ((petReqEnergyTotal / energyUnit) * petYieldBase) : 0;
                    const petCostPerUnit = petQtyFromReqEnergy > 0 ? (petReqCost / petQtyFromReqEnergy) : 0;
                    return (
                        <div key={p.petName} style={{ marginTop: 6 }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                <img src={p.img || imgna} alt={p.petName || ""} style={{ width: "18px", height: "18px" }} />
                                <span>{petLabel}</span>
                            </div>
                            <div>{frmtNb(energyUnit)}{imgEnergy} for {petYieldBase}{itemImg}</div>
                            <div>{reqLine.length ? reqLine : "N/A"} {reqLine.length ? <>{frmtNb(petReqCost)}{imgsfl}</> : null}
                            </div>
                            <div>{frmtNb(petQtyFromReqEnergy)}{itemImg} with {frmtNb(petReqEnergyTotal)}{imgEnergy}</div>
                            <div>{petQtyFromReqEnergy > 0 ? <>{frmtNb(petReqCost)}{imgsfl} / {frmtNb(petQtyFromReqEnergy)}{itemImg} = {frmtNb(petCostPerUnit)}{imgsfl}</> : "N/A"}</div>
                        </div>
                    );
                });
            const hasAnyProducer = producers.length > 0;
            txt = !hasAnyProducer ? (
                <>
                    <div>{itemImg} {item} fetch cost</div>
                    <div>Marketplace{imgmp}: {frmtNb(unitMarket)}{imgsfl} x {frmtNb(quantity)} = {frmtNb(totalMarket)}{imgsfl}</div>
                </>
            ) : (
                <>
                    <div>{itemImg} {item} fetch cost</div>
                    {producerRows.length ? <div style={{ marginTop: 6 }}>Producers & requests:</div> : null}
                    {producerRows}
                    <div style={{ marginTop: 6 }}>Prod cost: {frmtNb(unitCost)}{imgsfl} x {frmtNb(quantity)} = {frmtNb(totalCost)}{imgsfl}</div>
                    <div>Marketplace{imgmp}: {frmtNb(unitMarket)}{imgsfl} x {frmtNb(quantity)} = {frmtNb(totalMarket)}{imgsfl}</div>
                </>
            );
        }
        if (context === "deliverycost") {
            const itemsMap = (value && typeof value === "object" && value.items && typeof value.items === "object") ? value.items : {};
            const marketMode = value?.market || "trader";
            const getItemImg = (name) => {
                if (!name) return null;
                const low = String(name).toLowerCase();
                if (low === "coins") { return "./icon/res/coins.png"; }
                return (it?.[name]?.img ?? food?.[name]?.img ?? pfood?.[name]?.img ?? fish?.[name]?.img ?? bounty?.[name]?.img ?? crustacean?.[name]?.img ?? craft?.[name]?.img ?? petit?.[name]?.img ?? flower?.[name]?.img ?? tool?.[name]?.img ?? compost?.[name]?.img ?? mutant?.[name]?.img ?? imgna);
            };
            const getItemBase = (name) => (
                it?.[name] || food?.[name] || pfood?.[name] || fish?.[name] || bounty?.[name] || crustacean?.[name] || craft?.[name] || petit?.[name] || flower?.[name] || tool?.[name] || compost?.[name] || mutant?.[name] || null
            );
            const getMarketUnit = (base) => {
                if (!base) return 0;
                const prodUnit = Number(base?.[key("cost")] ?? base?.cost ?? 0) / coinsRatio;
                const trader = Number(base?.[key("costp2pt")] ?? base?.costp2pt ?? 0);
                const nifty = Number(base?.[key("costp2pn")] ?? base?.costp2pn ?? 0);
                const opensea = Number(base?.[key("costp2po")] ?? base?.costp2po ?? 0);
                const shop = Number(base?.costshop || 0) / coinsRatio;
                let market = 0;
                if (marketMode === "shop") { market = shop; }
                if (marketMode === "trader") { market = trader; }
                if (marketMode === "nifty") { market = nifty; }
                if (marketMode === "opensea") { market = opensea; }
                return market > 0 ? market : prodUnit;
            };
            let totCost = 0;
            let totMarket = 0;
            const rows = Object.entries(itemsMap).map(([name, rawQty]) => {
                const qty = Number(rawQty || 0);
                const low = String(name).toLowerCase();
                const displayName = low === "coins" ? "Coins" : name;
                const img = getItemImg(name);
                const base = getItemBase(name);
                const unitCost = low === "coins" ? (1 / coinsRatio) : (Number(base?.[key("cost")] ?? base?.cost ?? 0) / coinsRatio);
                const unitMarket = low === "coins" ? (1 / coinsRatio) : getMarketUnit(base);
                const lineCost = unitCost * qty;
                const lineMarket = unitMarket * qty;
                totCost += lineCost;
                totMarket += lineMarket;
                return (
                    <tr key={name}>
                        <td style={{ padding: "2px 8px 2px 0" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                <img src={img} alt="" title={name} style={{ width: 18, height: 18 }} />
                                <span>{displayName}</span>
                            </span>
                        </td>
                        <td style={{ textAlign: "center", paddingRight: 8 }}>{frmtNb(qty)}</td>
                        <td style={{ textAlign: "center", paddingRight: 8 }}>{frmtNb(lineCost)}</td>
                        <td style={{ textAlign: "center" }}>{frmtNb(lineMarket)}</td>
                    </tr>
                );
            });
            txt = (
                <table style={{ borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", paddingRight: 8 }}>Item</th>
                            <th style={{ textAlign: "center", paddingRight: 8 }}>Qty</th>
                            <th style={{ textAlign: "center", paddingRight: 8 }}>Cost</th>
                            <th style={{ textAlign: "center" }}>{imgExchng}</th>
                        </tr>
                        <tr>
                            <th style={{ textAlign: "left", paddingRight: 8 }}></th>
                            <th style={{ textAlign: "center", paddingRight: 8 }}></th>
                            <td style={{ textAlign: "center", paddingRight: 8 }}>{frmtNb(totCost)}</td>
                            <td style={{ textAlign: "center" }}>{frmtNb(totMarket)}</td>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            );
        }
        if (context === "deliveryratio") {
            const v = (value && typeof value === "object") ? value : {};
            const fromName = v?.from || item || "";
            const isCoinsReward = !!v?.isCoinsReward;
            const rewardCoins = Number(v?.rewardCoins || 0);
            const rewardSfl = Number(v?.rewardSfl || 0);
            const cost = Number(v?.cost || 0);
            const market = Number(v?.market || 0);
            const ratio = Number(v?.ratio || 0);
            const ratioMarket = market > 0 ? (rewardCoins / market) : 0;
            const isTotal = v?.type === "total";
            txt = (
                <>
                    <div><b>{isTotal ? "Deliveries Ratio (Total)" : `Delivery Ratio (${fromName})`}</b></div>
                    <div>Coins to SFL conversion: {frmtNb(rewardCoins)}{imgcoins} = {frmtNb(rewardSfl)}{imgsfl}</div>
                    <div>{frmtNb(rewardCoins)}{imgcoins} / {frmtNb(cost)}{imgsfl} = <b>{cost > 0 ? frmtNb(ratio) : "0"}</b> {imgcoins} for 1{imgsfl}</div>
                    <div>{frmtNb(rewardCoins)}{imgcoins} / {frmtNb(market)}{imgExchng} = <b>{market > 0 ? frmtNb(ratioMarket) : "0"}</b> {imgcoins} for 1{imgsfl}</div>
                    {!isCoinsReward ? <div>Note: ratio applies to deliveries with Coins reward.</div> : null}
                </>
            );
        }
        if (context === "username") {
            const username = dataSet?.options?.username || "No Name";
            const farmId = dataSet?.options?.farmId || "Unknown";
            txt = <><div>{`User: ${username}`}</div>
                <div>{`farm ID: ${farmId}`}</div></>;
        }
        if (context === "totChoreComp") {
            const getItemImg = (name) => {
                if (!name) return null;
                return (it?.[name]?.img ?? food?.[name]?.img ?? fish?.[name]?.img ?? imgna);
            };
            let totCost = 0;
            let totMarket = 0;
            const bodyTable = Object.entries(item ?? {}).map(([name, qty]) => {
                const img = getItemImg(name);
                let baseTable = {};
                if (it[name]) { baseTable = it; }
                if (food[name]) { baseTable = food; }
                if (fish[name]) { baseTable = fish; }
                const inStock = baseTable[name]?.instock ?? 0;
                const needed = Math.ceil(qty - inStock);
                const icost = Number(frmtNb(((baseTable[name]?.cost ?? 0) / coinsRatio) * needed));
                const imarket = Number(frmtNb((baseTable[name]?.costp2pt ?? 0) * needed));
                totCost += icost > 0 ? icost : 0;
                totMarket += imarket > 0 ? imarket : 0;
                return (
                    <tr key={name}>
                        <td style={{ padding: "2px 8px 2px 0" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                {img && (<img src={img} alt="" title={name} style={{ width: 18, height: 18 }} />)}
                                <span>{name}</span>
                            </span>
                        </td>
                        <td style={{ textAlign: "center", paddingRight: 8 }}>{qty}</td>
                        <td style={{ textAlign: "center" }}>{inStock ? Math.ceil(inStock) : ""}</td>
                        <td style={{ textAlign: "center" }}>{needed > 0 ? needed : ""}</td>
                        <td style={{ textAlign: "center" }}>{icost > 0 ? icost : ""}</td>
                        <td style={{ textAlign: "center" }}>{imarket > 0 ? imarket : ""}</td>
                    </tr>
                );
            })
            const choreTotCompTable = (
                <table style={{ borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", paddingRight: 8 }}>Item</th>
                            <th style={{ textAlign: "center", paddingRight: 8 }}>Qty</th>
                            <th style={{ textAlign: "center" }}>Stock</th>
                            <th style={{ textAlign: "center" }}>Needed</th>
                            <th style={{ textAlign: "center" }}>Cost</th>
                            <th style={{ textAlign: "center" }}>{imgExchng}</th>
                        </tr>
                        <tr>
                            <th style={{ textAlign: "left", paddingRight: 8 }}></th>
                            <th style={{ textAlign: "center", paddingRight: 8 }}></th>
                            <th style={{ textAlign: "center" }}></th>
                            <th style={{ textAlign: "center", paddingRight: 8 }}></th>
                            <td style={{ textAlign: "center", paddingRight: 8 }}>{frmtNb(totCost)}</td>
                            <td style={{ textAlign: "center" }}>{frmtNb(totMarket)}</td>
                        </tr>
                    </thead>
                    <tbody>
                        {bodyTable}
                    </tbody>
                </table>
            );
            txt = <>{choreTotCompTable}</>;
        }
        if (context === "askIA") {
            if (value) {
                function formatIAAnswerJSX(answer) {
                    if (!answer) return null;
                    const parts = answer
                        .replace(/\\n/g, "\n")
                        .split(/(<[^>]+>)/g); // garde les <Item>
                    return parts.map((part, index) => {
                        const match = part.match(/^<(.+)>$/);
                        if (match) {
                            const itemName = match[1];
                            const item = it[itemName];
                            const img = item?.img || item?.icon || null;
                            return (
                                <span key={index} style={{ whiteSpace: "nowrap" }}>
                                    {img && (<img src={img} alt={itemName} title={itemName}
                                        style={{ width: 16, height: 16, verticalAlign: "middle", marginRight: 4 }} />)}{itemName} </span>
                            );
                        }
                        return <span key={index}>{part}</span>;
                    });
                }
                function formatIAAnswerHTML(answer) {
                    return answer
                        .replace(/\\n/g, "\n")
                        .replace(/\*\*(.*?)\*\*/g, "🔹 $1")
                        .trim();
                }
                const textIA = formatIAAnswerJSX(value);
                //const username = dataSet?.options?.username || "No Name";
                //const farmId = dataSet?.options?.farmId || "Unknown";
                txt = <><pre style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>{textIA}</pre></>;
            }
        }
        if (context === "dailyBurn") {
            const burned = "Burn: " + frmtNb(value[0]);
            const nCycles = "Daily cycles: " + frmtNb(value[1]);
            const hrvst = "Harvest: " + frmtNb(value[2]);
            const totHarvst = "Total harvested: " + frmtNb(value[1] * value[2]);
            txt = <>
                <div>{nCycles}</div>
                <div>{hrvst}</div>
                <div>{totHarvst}</div>
                <div>{value[0] > 0 ? burned : ""}</div>
            </>;
        }
    } catch (error) {
        console.log("tooltip: ", error);
    }

    const isEmptyTxt = txt === "" || txt === null || txt === undefined;
    useEffect(() => {
        if (isEmptyTxt) {
            closeModal();
        }
    }, [isEmptyTxt]);
    if (isEmptyTxt) {
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
                className={`tooltip ${!bdrag ? "scrollable" : ""} ${context === "trades" ? "tooltip-trades-mode" : ""}`}
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
};

export default Tooltip;
