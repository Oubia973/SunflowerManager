import { useAppCtx } from "../context/AppCtx";
import { frmtNb, ColorValue } from '../fct.js';

export default function HomeTable() {
    const {
        data: { dataSet, dataSetFarm },
        ui: {
            selectedInv,
            xListeColBounty,
            TryChecked,
            isOpen
        },
        actions: {
            handleHomeClic,
        },
    } = useAppCtx();
    if (!dataSetFarm?.itables) return null;
    const { Animals, orderstable } = dataSetFarm;
    const { it } = dataSetFarm.itables;
    if (selectedInv !== "home") return;
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
            const leftPanel = (
                <div className="home-left-panel">
                    {/* <img src="./path/to/your/image.png" alt="Farm" className="home-left-panel-image" /> */}
                    <img src={`${img}`} width="100%"></img>
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

                let plantedValue = dataSet.forTry ? "spottry" : "planted";
                let harvestValue = dataSet.forTry ? "harvesttry" : "tobharvest";

                let plantedHeader = "Node";
                let harvestHeader = "Harvest";

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
                            let harvestFinal = Items[item][harvestValue]; //animalProdQuant;
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
                            const nbHarvest = (Items[item][key("nbharvest")]) || 1;
                            costTotal += Number(((Items[item][key("nodecost")] * Items[item][plantedValue]) / nbHarvest) / dataSet.options.coinsRatio);
                            marketTotal += Number(Items[item]["costp2pt"] * Items[item][harvestValue]);
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
                                let harvestFinal = Items[item][harvestValue];
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
                                    nbHarvest = (Items[item][key("nbharvest")]) || 1;
                                    harvestCost = ((Items[item][key("nodecost")] * plantedFinal[Items[item].name]) / nbHarvest) / dataSet.options.coinsRatio;
                                    harvestCostp2pt = (Items[item]["costp2pt"] * harvestFinal);
                                }
                                harvestProfit = Number(frmtNb((harvestCostp2pt * tradeTax) - harvestCost));
                                return (
                                    <tr key={itemIndex}>
                                        {xListeColBounty[1][1] === 1 && (
                                            <td className="tdcenter">
                                                <img src={Items[item].img} alt={Items[item].name} className="nodico" />
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
                profitTotal = (marketTotal * tradeTax) - costTotal;

                //const [isOpen, setIsOpen] = useState(false);
                if (!isOpen[index]) { isOpen[index] = false };

                return (
                    <div key={index} className="collapsible-block">
                        {/* <div className="collapsible-header" onClick={() => setIsOpen(!isOpen)}> //onClick={() => setIsOpen(!isOpen)}> */}
                        <div className="collapsible-header" onClick={() => handleHomeClic(index)}>
                            <span style={{ textAlign: 'left' }}>{icocat} {bntName}</span>
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

            return (
                <div className="home-container">
                    {leftPanel}
                    <div className="collapsible-container">{collapsibleBlocks}</div>
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

