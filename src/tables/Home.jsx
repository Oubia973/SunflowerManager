import { useState } from "react";
import { useAppCtx } from "../context/AppCtx";
import { frmtNb, ColorValue } from '../fct.js';

export default function HomeTable() {
    const [isBumpkinCooldown, setIsBumpkinCooldown] = useState(false);
    const {
        data: { dataSet, dataSetFarm },
        ui: {
            selectedInv,
            xListeColBounty,
            TryChecked,
            isOpen,
            selectedHomeBlocks,
            selectedHomeItems
        },
        actions: {
            handleHomeClic,
            setUIField,
        },
        config: { API_URL },
    } = useAppCtx();
    if (selectedInv !== "home") return;
    if (!dataSetFarm?.itables) return null;
    const { Animals, orderstable, Pets } = dataSetFarm;
    const { it } = dataSetFarm.itables;
    async function getBumpkin(dataSet) {
        const response = await fetch(API_URL + "/getbumpkin", {
            method: 'GET',
            headers: {
                frmid: dataSet.farmId,
                username: dataSet.options.username,
                tknuri: dataSet.bumpkin.tkuri,
            }
        });
        if (response.ok) {
            const data = await response.json();
            let imageData = data.responseImage;
            dataSet.bumpkinImg = imageData;
        }
    }
    if (it) {
        try {
            dataSet.forTry = TryChecked;
            function key(name) {
                if (name === "isactive") return dataSet.forTry ? "tryit" : "isactive";
                return dataSet.forTry ? name + "try" : name;
            }
            const img = dataSet?.bumpkinImg || "./logo512.png";
            //const bumpkin = dataSet.bumpkin;
            const imgna = <img src="./icon/nft/na.png" alt={''} className="seasonico" title="N/A" />;
            const vipImg = <img src={"./icon/ui/vip.webp"} alt={''} className="itico" title={"VIP"} />;
            const imgDone = <img src={"./icon/ui/confirm.png"} alt={''} className="itico" title={"Done"} />;
            const imgCancel = <img src={"./icon/ui/cancel.png"} alt={''} className="itico" title={"Not done"} />;
            const imgDoneSmall = <img src={"./icon/ui/confirm.png"} alt={''} className="seasonico" title={"Done"} />;
            const imgCancelSmall = <img src={"./icon/ui/cancel.png"} alt={''} className="seasonico" title={"Not done"} />;
            const imgTkt = <img src={dataSet.imgtkt || "./icon/nft/na.png"} alt={''} className="seasonico" title={dataSet.tktName || "Season tiquets"} />;
            const imgCoinsSmall = <img src={"./icon/res/coins.png"} alt={''} className="seasonico" title={"Coins"} />;
            const imgSflSmall = <img src={"./icon/res/flowertoken.webp"} alt={''} className="seasonico" title={"Flower"} />;
            const imgFishSmall = <img src={"./icon/fish/anchovy.png"} alt={''} className="itico" title={"Fish casts"} />;
            const imgPetSmall = <img src={"./icon/pet/dog.webp"} alt={''} className="itico" title={"Pets"} />;
            const imgDishSmall = <img src={"./icon/food/sunflower_crunch.png"} alt={''} className="itico" title={"Pet requests"} />;
            const vipDate = dataSet.dateVip ? new Date(dataSet.dateVip).toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }) : imgCancel;
            const dailyChestToday = dataSet?.dailychest?.chest ? isToday(dataSet.dailychest.chest) : false;
            const dailyChest = dailyChestToday ? imgDone : imgCancel;
            const dailyChestStreak = dataSet.dailychest?.streak ? <span> Streak: {dataSet.dailychest.streak}</span> : null;
            const ordersCount = orderstable?.orderscount || 0;
            const ordersTktCount = orderstable?.orderstktcount || 0;
            const ordersSflCount = orderstable?.orderssflcount || 0;
            const ordersCoinsCount = orderstable?.orderscoinscount || 0;
            const ordersDone = orderstable?.ordersdone || 0;
            const ordersTktDone = orderstable?.orderstktdone || 0;
            const ordersSflDone = orderstable?.orderssfldone || 0;
            const ordersCoinsDone = orderstable?.orderscoinsdone || 0;
            const txtDeliveriesDone = <span>
                {imgTkt}{ordersTktDone}/{ordersTktCount}
                {imgCoinsSmall}{ordersCoinsDone}/{ordersCoinsCount}
                {imgSflSmall}{ordersSflDone}/{ordersSflCount}
            </span>;
            const choresCount = orderstable?.chorescount || 0;
            const choresDone = orderstable?.choresdone || 0;
            const bountiesCount = orderstable?.bountiescount || 0;
            const bountiesTktCount = orderstable?.bountiestktcount || 0;
            const bountiesSflCount = orderstable?.bountiessflcount || 0;
            const bountiesCoinsCount = orderstable?.bountiescoinscount || 0;
            const bountiesDone = orderstable?.bountiesdone || 0;
            const bountiesTktDone = orderstable?.bountiestktdone || 0;
            const bountiesSflDone = orderstable?.bountiessfldone || 0;
            const bountiesCoinsDone = orderstable?.bountiescoinsdone || 0;
            const txtBountiesDone = <span>
                {imgTkt}{bountiesTktDone}/{bountiesTktCount}
                {imgCoinsSmall}{bountiesCoinsDone}/{bountiesCoinsCount}
            </span>;
            const tradeTax = (100 - dataSet.options.tradeTax) / 100;
            const digging = dataSetFarm?.frmData?.digging;
            const dailyDigToday = digging ? isToday(digging.collectedAt) : false;
            const dailyDig = dailyDigToday ? imgDone : imgCancel;
            const dailyDigStreak = digging?.count ? <span> Streak: {digging.count}</span> : null;
            const imgwinter = <img src="./icon/ui/winter.webp" alt={''} className="seasonico" title="Winter" />;
            const imgspring = <img src="./icon/ui/spring.webp" alt={''} className="seasonico" title="Spring" />;
            const imgsummer = <img src="./icon/ui/summer.webp" alt={''} className="seasonico" title="Summer" />;
            const imgautumn = <img src="./icon/ui/autumn.webp" alt={''} className="seasonico" title="Autumn" />;
            const curSeason = dataSetFarm?.currentSeason || "spring";

            const protectWinter = dataSetFarm?.frmData?.protectWinter ? imgDoneSmall : imgCancelSmall;
            const protectSpring = dataSetFarm?.frmData?.protectSpring ? imgDoneSmall : imgCancelSmall;
            const protectSummer = dataSetFarm?.frmData?.protectSummer ? imgDoneSmall : imgCancelSmall;
            const protectAutumn = dataSetFarm?.frmData?.protectAutumn ? imgDoneSmall : imgCancelSmall;
            const fishingDetails = dataSetFarm?.Fish || {};
            const fishCasts = fishingDetails?.casts ?? 0;
            const fishCastMax = TryChecked
                ? (fishingDetails?.fishcastmaxtry ?? fishingDetails?.fishcastmax ?? 0)
                : (fishingDetails?.fishcastmax ?? 0);
            const fishCastsStatus = (fishCastMax > 0 && fishCasts >= fishCastMax) ? imgDone : imgCancel;
            const reqToArray = (reqObj) => {
                if (Array.isArray(reqObj)) return reqObj.filter(Boolean);
                if (reqObj && typeof reqObj === "object") return Object.values(reqObj).filter(Boolean);
                return [];
            };
            const countFedRequests = (requested, fed) => {
                if (!requested.length) return 0;
                const fedCount = {};
                fed.forEach((name) => { fedCount[name] = (fedCount[name] || 0) + 1; });
                let matched = 0;
                requested.forEach((name) => {
                    if (fedCount[name] > 0) {
                        matched += 1;
                        fedCount[name] -= 1;
                    }
                });
                return matched;
            };
            const petsWithRequests = Object.values(Pets || {}).filter((pet) => reqToArray(pet?.req).length > 0);
            const allPetsRequestsValidated = petsWithRequests.length > 0
                && petsWithRequests.every((pet) => pet?.reqallfed === true);
            const petRequestsStatus = allPetsRequestsValidated ? imgDone : imgCancel;
            const petRequestsTotal = petsWithRequests.reduce((sum, pet) => sum + reqToArray(pet?.req).length, 0);
            const petRequestsFed = petsWithRequests.reduce((sum, pet) => (
                sum + countFedRequests(reqToArray(pet?.req), reqToArray(pet?.reqfed))
            ), 0);

            let profitTotalHarvests = 0;
            let marketTotalHarvests = 0;
            let costTotalHarvests = 0;
            const leftPanel = (
                <div className="home-left-panel">
                    {/* <img src="./path/to/your/image.png" alt="Farm" className="home-left-panel-image" /> */}
                    <div className="home-left-panel-image-wrap">
                        <img src={`${img}`} width="100%" alt="Bumpkin"></img>
                        <button
                            type="button"
                            className="button small-btn bumpkin-refresh-btn"
                            title={isBumpkinCooldown ? "Loading" : "Refresh bumpkin"}
                            disabled={isBumpkinCooldown}
                            onClick={async () => {
                                if (isBumpkinCooldown) return;
                                setIsBumpkinCooldown(true);
                                await getBumpkin(dataSet);
                                setTimeout(() => setIsBumpkinCooldown(false), 10000);
                            }}
                        >
                            <img src="./icon/ui/refresh.png" alt="" />
                        </button>
                    </div>
                    <div className="home-left-panel-text">
                        <p><div>{vipImg} {vipDate}</div></p>
                        <p><div>Daily chest: {dailyChest} {dailyChestStreak}</div></p>
                        <p style={{ fontSize: '13px' }}>
                            <div>Deliveries: {ordersDone}/{ordersCount}</div>
                            <div style={{ fontSize: '13px', gap: "4px" }}>{txtDeliveriesDone}</div>
                            <div>Chores: {choresDone}/{choresCount}</div>
                            <div>Bounties: {bountiesDone}/{bountiesCount}</div>
                            <div>{txtBountiesDone}</div></p>
                        <p><div>Daily dig: {dailyDig} {dailyDigStreak}</div></p>
                        <p><div>Protections</div><div>{imgwinter}{protectWinter} {imgspring}{protectSpring} {imgsummer}{protectSummer} {imgautumn}{protectAutumn}</div></p>
                        <p><div>{imgFishSmall} {fishCasts}/{fishCastMax} {fishCastsStatus}</div></p>
                        <p><div>{imgPetSmall} {petRequestsFed}/{petRequestsTotal}{imgDishSmall} {petRequestsStatus}</div></p>
                    </div>
                </div>
            );
            const corpsCatName = "Crops " + (dataSet.forTry ? "average" : "growing");
            const categories = [
                { name: corpsCatName, img: <img src={"./icon/res/sunflower.png"} alt="" className="nodico" title="Crops" /> },
                { name: "Fruits", img: <img src={"./icon/res/apple.png"} alt="" className="nodico" title="Fruits" /> },
                { name: "Greenhouse", img: <img src={"./icon/res/rice.png"} alt="" className="nodico" title="Greenhouse" /> },
                { name: "Wood", img: <img src={"./icon/res/wood.png"} alt="" className="nodico" title="Wood" /> },
                { name: "Minerals", img: <img src={"./icon/res/gold.png"} alt="" className="nodico" title="Minerals" /> },
                { name: "Henhouse", img: <img src={"./icon/res/chkn.png"} alt="" className="nodico" title="Henhouse" /> },
                { name: "Barn", img: <img src={"./icon/res/cow.webp"} alt="" className="nodico" title="Barn" /> },
                { name: "Cooking", img: <img src={"./icon/food/chef_hat.png"} alt="" className="nodico" title="Cooking" /> },
                { name: "Fish", img: <img src={"./icon/fish/anchovy.png"} alt="" className="nodico" title="Fish" /> },
                { name: "Dig", img: <img src={"./icon/tools/sand_shovel.png"} alt="" className="nodico" title="Dig" /> },
            ];
            const collapsibleBlocks = categories.map((category, index) => {
                const bntName = category.name;
                const icocat = category.img;
                const isSelected = selectedHomeBlocks?.[index] ?? true;
                const hasItemSelection = (bntName === "Minerals" || bntName === "Henhouse" || bntName === "Barn");
                const isAnimalCategory = (bntName === "Henhouse" || bntName === "Barn");
                const getItemSelectionKey = (itemObj) => {
                    if (!itemObj) return "";
                    if (bntName === "Minerals") return `minerals:${itemObj.name || ""}`;
                    if (isAnimalCategory) return `${bntName.toLowerCase()}:${itemObj.animal || itemObj.name || ""}`;
                    return "";
                };
                const isItemActive = (itemObj) => {
                    if (!hasItemSelection) return true;
                    const selectionKey = getItemSelectionKey(itemObj);
                    if (!selectionKey) return true;
                    return selectedHomeItems?.[selectionKey] ?? true;
                };
                const isPrimaryAnimalProd = (itemObj) => Number(itemObj?.matcat) === 1;
                const shouldRenderItemCheckbox = (itemObj) => {
                    if (bntName === "Minerals") return true;
                    if (isAnimalCategory) return isPrimaryAnimalProd(itemObj);
                    return false;
                };
                const toggleItemSelection = (itemObj) => {
                    const selectionKey = getItemSelectionKey(itemObj);
                    if (!selectionKey) return;
                    setUIField("selectedHomeItems", (prevState) => ({
                        ...(prevState || {}),
                        [selectionKey]: !(prevState?.[selectionKey] ?? true),
                    }));
                };
                const handleItemToggleClick = (event, itemObj) => {
                    event.stopPropagation();
                    toggleItemSelection(itemObj);
                };

                let plantedValue = "planted";

                let plantedHeader = "Node";
                let harvestHeader = "Harvest";
                const getHarvestPerNodeValue = (itemObj) => {
                    if (!dataSet.forTry) return 0;
                    const direct = itemObj?.harvestnodehome ?? itemObj?.harvestnodetry;
                    if (direct !== undefined && direct !== null) return direct;
                    const total = itemObj?.harvesthome ?? itemObj?.harvesttry ?? 0;
                    const spot = itemObj?.spot ?? 0;
                    return spot > 0 ? (total / spot) : 0;
                };
                const getHarvestUnits = (itemObj, plantedCount = 0) => {
                    if (!dataSet.forTry) return plantedCount || 0;
                    const spot = Number(itemObj?.spot || 0);
                    const spot2 = Number(itemObj?.spot2 || 0);
                    const spot3 = Number(itemObj?.spot3 || 0);
                    const spot1 = spot - spot2 - spot3;
                    const weightedTools = spot1 + (spot2 * 4) + (spot3 * 16);
                    if (spot > 0 && weightedTools > 0) {
                        return weightedTools * ((plantedCount || 0) / spot);
                    }
                    return plantedCount || 0;
                };
                const getHarvestValue = (itemObj, plantedCount = 0) => (
                    dataSet.forTry
                        ? (getHarvestPerNodeValue(itemObj) * getHarvestUnits(itemObj, plantedCount))
                        : (itemObj?.tobharvest ?? 0)
                );
                const getNodeCostValue = (itemObj) => (
                    dataSet.forTry
                        ? (itemObj?.nodecosthome ?? itemObj?.nodecosttry ?? itemObj?.nodecost ?? 0)
                        : (itemObj?.nodecost ?? 0)
                );
                const getNbHarvestValue = (itemObj) => (
                    dataSet.forTry
                        ? (itemObj?.nbharvesthome ?? itemObj?.nbharvesttry ?? itemObj?.nbharvest ?? 1)
                        : (itemObj?.nbharvest ?? 1)
                );

                //let plantedTotal = 0;
                let costTotal = 0;
                let marketTotal = 0;
                let profitTotal = 0;
                let plantedFinal = [];

                let Items = {};
                if (bntName === corpsCatName) {
                    Items = Object.entries(it)
                        .filter(([key, item]) => item.cat === "crop" && item.rdyat > 0 && !item.greenhouse)
                        .map(([key, item]) => ({ ...item, name: key }));
                }
                if (bntName === "Fruits") {
                    Items = Object.entries(it)
                        .filter(([key, item]) => item.cat === "fruit" && item.rdyat > 0 && !item.greenhouse)
                        .map(([key, item]) => ({ ...item, name: key }));
                }
                if (bntName === "Greenhouse") {
                    Items = Object.entries(it)
                        .filter(([key, item]) => item.greenhouse && item.rdyat > 0)
                        .map(([key, item]) => ({ ...item, name: key }));
                }
                if (bntName === "Wood") {
                    Items = Object.entries(it)
                        .filter(([key, item]) => item.cat === "wood" && item.rdyat > 0)
                        .map(([key, item]) => ({ ...item, name: key }));
                }
                if (bntName === "Minerals") {
                    Items = Object.entries(it)
                        .filter(([key, item]) => (item.cat === "mineral" || key === "Crimstone") && item.rdyat > 0)
                        .map(([key, item]) => ({ ...item, name: key }));
                }
                if (bntName === "Henhouse") {
                    Items = Object.entries(it)
                        .filter(([key, item]) => item.scat === "henhouse" && item.rdyat >= 0)
                        .map(([key, item]) => ({ ...item, name: key }));
                }
                if (bntName === "Barn") {
                    Items = Object.entries(it)
                        .filter(([key, item]) => item.scat === "barn" && item.rdyat >= 0)
                        .map(([key, item]) => ({ ...item, name: key }));
                }
                /* if (bntName === "Cooking") {
                    Items = Object.entries(dataSet.food)
                        .filter(([key, item]) => item.rdyat > 0)
                        .map(([key, item]) => ({ ...item, name: key }));
                    plantedHeader = "Cooking";
                } */

                let tableData = null;

                if (bntName === corpsCatName || bntName === "Fruits" || bntName === "Greenhouse" || bntName === "Wood" || bntName === "Minerals"
                    || bntName === "Henhouse" || bntName === "Barn") {

                    if (bntName === "Henhouse" || bntName === "Barn") {
                        Object.keys(Items).map((item, itemIndex) => {
                            plantedFinal[Items[item].name] = Items[item][plantedValue];
                            const itemActive = isItemActive(Items[item]);
                            if (!itemActive) return null;
                            const aniName = Items[item]?.animal;
                            if (!Animals[aniName]) return null;
                            //plantedTotal += Number(Items[item][plantedValue]);
                            let animalCost = 0;
                            let animalProdQuant = 0;
                            let ignoredAnimals = 0;
                            Object.keys(Animals[aniName]).map(animalItem => {
                                const ignoreAnimal = !dataSet.forTry && dataSet.options?.ignoreAniLvl && (Animals[aniName][animalItem].lvl > dataSet.options.animalLvl[aniName]);
                                animalCost += (Animals[aniName][animalItem][key("costFood")] || 0) * !ignoreAnimal;
                                const tryTxt = dataSet.forTry ? "try" : "";
                                const prodName = Items[item]?.matcat === 1 ? "yield1" : "yield2";
                                animalProdQuant += (Animals[aniName][animalItem]?.[key(prodName + tryTxt)] || 0) * !ignoreAnimal;
                                ignoredAnimals += ignoreAnimal;
                                //console.log(Items[item].animal + ": " + animalCost);
                            });
                            let harvestFinal = getHarvestValue(Items[item], plantedFinal[Items[item].name]); //animalProdQuant;
                            //plantedFinal[Items[item].name] -= (ignoredAnimals);
                            if (Items[item].name === "Feather") { animalCost = 0 };
                            if (Items[item].name === "Leather") { animalCost = 0 };
                            if (Items[item].name === "Merino Wool") { animalCost = 0 };
                            costTotal += Number((animalCost) / dataSet.options.coinsRatio);
                            if (plantedFinal[Items[item].name] <= 0) { costTotal = 0; }
                            marketTotal += Number(Items[item]["costp2pt"] * harvestFinal);
                            //marketTotal += Number(Items[item]["costp2pt"] * Items[item][harvestValue]);
                        });
                    } else {
                        Object.keys(Items).map((item, itemIndex) => {
                            plantedFinal[Items[item].name] = Items[item][plantedValue];
                            const itemActive = isItemActive(Items[item]);
                            if (!itemActive) return null;
                            const nbHarvest = getNbHarvestValue(Items[item]) || 1;
                            costTotal += Number(((getNodeCostValue(Items[item]) * Items[item][plantedValue]) / nbHarvest) / dataSet.options.coinsRatio);
                            marketTotal += Number(Items[item]["costp2pt"] * getHarvestValue(Items[item], plantedFinal[Items[item].name]));
                        });
                    }

                    tableData = <><thead>
                        <tr>
                            {xListeColBounty[1][1] === 1 ? <th className="collapsible-content-th">Item</th> : null}
                            {xListeColBounty[2][1] === 1 ? <th className="collapsible-content-th">{plantedHeader}</th> : null}
                            {xListeColBounty[3][1] === 1 ? <th className="collapsible-content-th">{harvestHeader}</th> : null}
                            {xListeColBounty[4][1] === 1 ? <th className="collapsible-content-th">Cost</th> : null}
                            {xListeColBounty[5][1] === 1 ? <th className="collapsible-content-th">Market</th> : null}
                            {xListeColBounty[5][1] === 1 ? <th className="collapsible-content-th">Profit</th> : null}
                        </tr>
                    </thead>
                        <tbody>
                            {Object.keys(Items).map((item, itemIndex) => {
                                let nbHarvest = 0;
                                let harvestCost = 0;
                                let harvestCostp2pt = 0;
                                let harvestProfit = 0;
                                let harvestFinal = getHarvestValue(Items[item], plantedFinal[Items[item].name]);
                                const rowActive = isItemActive(Items[item]);
                                if (Items[item].scat === "henhouse" || Items[item].scat === "barn") {
                                    const aniName = Items[item]?.animal;
                                    if (!Animals[aniName]) return null;
                                    let animalCost = 0;
                                    let animalProdQuant = 0;
                                    Object.keys(Animals[Items[item]?.animal]).map(animalItem => {
                                        const ignoreAnimal = (!dataSet.forTry && dataSet.options?.ignoreAniLvl) && (Animals[aniName][animalItem].lvl > dataSet.options.animalLvl[aniName]);
                                        animalCost += (Animals[aniName][animalItem][key("costFood")] || 0) * !ignoreAnimal;
                                        const tryTxt = dataSet.forTry ? "try" : "";
                                        const prodName = Items[item]?.matcat === 1 ? "yield1" : "yield2";
                                        animalProdQuant += (Animals[aniName][animalItem]?.[key(prodName + tryTxt)] || 0) * !ignoreAnimal;
                                        if (Items[item].name === "Feather") { animalCost = 0 };
                                        if (Items[item].name === "Leather") { animalCost = 0 };
                                        if (Items[item].name === "Merino Wool") { animalCost = 0 };
                                        //console.log(Items[item].animal + ": " + dataSet.animals[Items[item]?.animal][animalItem].food + ": " + animalCost);
                                    });
                                    //harvestFinal = Items[item][harvestValue]; //animalProdQuant;
                                    if (plantedFinal[Items[item].name] <= 0) { animalCost = 0 }
                                    harvestCost = (animalCost) / dataSet.options.coinsRatio;
                                    harvestCostp2pt = (Items[item]["costp2pt"] * harvestFinal);
                                } else {
                                    nbHarvest = getNbHarvestValue(Items[item]) || 1;
                                    harvestCost = ((getNodeCostValue(Items[item]) * plantedFinal[Items[item].name]) / nbHarvest) / dataSet.options.coinsRatio;
                                    harvestCostp2pt = (Items[item]["costp2pt"] * harvestFinal);
                                }
                                if (!rowActive) {
                                    harvestFinal = 0;
                                    harvestCost = 0;
                                    harvestCostp2pt = 0;
                                }
                                harvestProfit = Number(frmtNb((harvestCostp2pt * tradeTax) - harvestCost));
                                return (
                                    <tr key={itemIndex} style={{ opacity: rowActive ? 1 : 0.5 }}>
                                        {xListeColBounty[1][1] === 1 && (
                                            <td className="tdcenter">
                                                {shouldRenderItemCheckbox(Items[item]) ? (
                                                    <span
                                                        className="home-item-toggle"
                                                        title="Tap to count / uncount this item"
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={(event) => handleItemToggleClick(event, Items[item])}
                                                        onKeyDown={(event) => {
                                                            if (event.key === "Enter" || event.key === " ") {
                                                                event.preventDefault();
                                                                handleItemToggleClick(event, Items[item]);
                                                            }
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="home-item-checkbox"
                                                            checked={!!rowActive}
                                                            onClick={(event) => event.stopPropagation()}
                                                            onChange={() => toggleItemSelection(Items[item])}
                                                            title="Count this item"
                                                        />
                                                        <img src={Items[item].img} alt={Items[item].name} className="nodico" />
                                                    </span>
                                                ) : (
                                                    <img src={Items[item].img} alt={Items[item].name} className="nodico" />
                                                )}
                                            </td>
                                        )}
                                        {xListeColBounty[2][1] === 1 && <td className="tdcenter">{frmtNb(plantedFinal[Items[item].name])}</td>}
                                        {xListeColBounty[3][1] === 1 && <td className="tdcenter">{frmtNb(harvestFinal)}</td>}
                                        {xListeColBounty[4][1] === 1 && <td className="tdcenter">{frmtNb(harvestCost)}</td>}
                                        {xListeColBounty[5][1] === 1 && <td className="tdcenter">{frmtNb(harvestCostp2pt)}</td>}
                                        {xListeColBounty[5][1] === 1 && <td className="tdcenter" style={{ color: ColorValue(harvestProfit, 0, 10) }}>{frmtNb(harvestProfit)}</td>}
                                    </tr>
                                );
                            })}
                        </tbody></>;
                }
                /* if (bntName === "Cooking") {
                    Object.keys(Items).map((item, itemIndex) => {
                        plantedTotal += Number(Items[item][plantedValue]);
                        costTotal += Number(Items[item].cost);
                        marketTotal += Number(Items[item].costp2pt);
                        profitTotal += Number((Items[item].costp2pt * 0.9) - Items[item].cost);
                    });
                } */

                //const [isOpen, setIsOpen] = useState(false);
                if (!isOpen[index]) { isOpen[index] = false };
                if (isSelected) {
                    marketTotalHarvests += marketTotal;
                    costTotalHarvests += costTotal;
                }
                profitTotal = (marketTotal * tradeTax) - costTotal;
                return (
                    <div key={index} className="collapsible-block">
                        {/* <div className="collapsible-header" onClick={() => setIsOpen(!isOpen)}> //onClick={() => setIsOpen(!isOpen)}> */}
                        <div className="collapsible-header" onClick={() => handleHomeClic(index)}>
                            <span className="collapsible-header-left">
                                <input
                                    type="checkbox"
                                    className="collapsible-header-checkbox"
                                    checked={!!isSelected}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => {
                                        setUIField("selectedHomeBlocks", (prevState) => ({
                                            ...(prevState || {}),
                                            [index]: !(prevState?.[index] ?? true),
                                        }));
                                    }}
                                />
                                {icocat} {bntName}
                            </span>
                            <span style={{ textAlign: 'right' }}>
                                Cost: {frmtNb(costTotal)} - Profit: <span style={{ color: ColorValue(frmtNb(profitTotal), 0, 10) }}>{frmtNb(profitTotal)}</span>
                            </span>
                        </div>
                        {isOpen[index] && (
                            <div className="collapsible-content">
                                <table className="table" style={{ width: '100%' }}>
                                    {tableData}
                                </table>
                            </div>
                        )}
                    </div>
                );
            });
            profitTotalHarvests = (marketTotalHarvests * tradeTax) - costTotalHarvests;
            const curHrvst = TryChecked ? "average" : "current"
            const txtProfit = <span style={{ color: ColorValue(frmtNb(profitTotalHarvests), 0, 10) }}>{frmtNb(profitTotalHarvests)}</span>;
            const txtYourHrvst = <>Your {curHrvst} harvests total :</>
            const txtCostHrvst = <>Cost: {frmtNb(costTotalHarvests)} - Profit: {txtProfit}</>
            //const homeLine = "";
            return (
                <div className="home-container">
                    {leftPanel}
                    <div className="home-collapsible-wrap">
                    <div className="home-collapsible-header home-harvest-row">
                        <span className="home-harvest-block home-harvest-block-primary">{txtYourHrvst}</span>
                        <span className="home-harvest-block home-harvest-block-secondary">{txtCostHrvst}</span>
                    </div>
                        <div className="collapsible-container">{collapsibleBlocks}</div>
                    </div>
                </div>
            );
        } catch (error) {
            console.error("Error in setHome function:", error);
            return null;
        }
    }

    function isToday(date) {
        const today = new Date();
        const givenDate = new Date(date);

        return (
            today.getUTCDate() === givenDate.getUTCDate() &&
            today.getUTCMonth() === givenDate.getUTCMonth() &&
            today.getUTCFullYear() === givenDate.getUTCFullYear()
        );
    }
}

