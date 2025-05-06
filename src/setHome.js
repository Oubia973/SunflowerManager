import React, { useEffect, useState, useRef } from 'react';
import { frmtNb, ColorValue, Timer } from './fct.js';

export function setHome(dataSet, xListeColBounty, handleHomeClic, isOpen) {
    /* if (!dataSet.farmData.inventory) {
        return null;
    } */
    /* const isOpen = [];
    const handleClic = (index) => {
        isOpen[index] ? isOpen[index] = false : isOpen[index] = true
    }; */
    if (dataSet.it) {
        try {
            function key(name) {
                return dataSet.forTry ? name + "try" : name;
            }
            const img = dataSet.bumpkinImg;
            //const bumpkin = dataSet.bumpkin;
            const vipImg = <img src={"./icon/ui/vip.webp"} alt={''} className="nodico" title={"VIP"} />;
            const vipDate = dataSet.dateVip ? new Date(dataSet.dateVip).toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }) : <img src={"./icon/ui/cancel.png"} alt={''} className="nodico" title={"No VIP"} />;
            const dailyChestToday = dataSet?.dailychest?.chest ? isToday(dataSet.dailychest.chest) : false;
            const dailyChest = dailyChestToday ? <img src={"./icon/ui/confirm.png"} alt={''} className="nodico" title={"Done"} />
                : <img src={"./icon/ui/cancel.png"} alt={''} className="nodico" title={"Not done"} />;
            const dailyChestStreak = dataSet.dailychest?.streak ? <span> Streak: {dataSet.dailychest.streak}</span> : null;
            const ordersCount = dataSet.orderstable?.orderscount || 0;
            const ordersDone = dataSet.orderstable?.ordersdone || 0;
            const choresCount = dataSet.orderstable?.chorescount || 0;
            const choresDone = dataSet.orderstable?.choresdone || 0;
            const bountiesCount = dataSet.orderstable?.bountiescount || 0;
            const bountiesDone = dataSet.orderstable?.bountiesdone || 0;
            const leftPanel = (
                <div className="home-left-panel">
                    {/* <img src="./path/to/your/image.png" alt="Farm" className="home-left-panel-image" /> */}
                    <img src={`${img}`} width="100%"></img>
                    <div className="home-left-panel-text">
                        <p>{vipImg} {vipDate}</p>
                        <p>Daily chest: {dailyChest} {dailyChestStreak}</p>
                        <p>Deliveries: {ordersDone}/{ordersCount}</p>
                        <p>Chores: {choresDone}/{choresCount}</p>
                        <p>Bounties: {bountiesDone}/{bountiesCount}</p>
                    </div>
                </div>
            );
            const categories = [
                { name: "Crops", img: <img src={"./icon/res/sunflower.png"} alt="" className="nodico" title="Crops" /> },
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

                let plantedValue = "planted";
                let harvestValue = "tobharvest";

                let plantedHeader = "Node";
                let harvestHeader = "Harvest";

                //let plantedTotal = 0;
                let costTotal = 0;
                let marketTotal = 0;
                let profitTotal = 0;

                let Items = {};
                if (bntName === "Crops") {
                    Items = Object.entries(dataSet.it)
                        .filter(([key, item]) => item.cat === "crop" && item.rdyat > 0 && !item.greenhouse)
                        .map(([key, item]) => ({ ...item, name: key }));
                }
                if (bntName === "Fruits") {
                    Items = Object.entries(dataSet.it)
                        .filter(([key, item]) => item.cat === "fruit" && item.rdyat > 0 && !item.greenhouse)
                        .map(([key, item]) => ({ ...item, name: key }));
                }
                if (bntName === "Greenhouse") {
                    Items = Object.entries(dataSet.it)
                        .filter(([key, item]) => item.greenhouse && item.rdyat > 0)
                        .map(([key, item]) => ({ ...item, name: key }));
                }
                if (bntName === "Wood") {
                    Items = Object.entries(dataSet.it)
                        .filter(([key, item]) => item.cat === "wood" && item.rdyat > 0)
                        .map(([key, item]) => ({ ...item, name: key }));
                }
                if (bntName === "Minerals") {
                    Items = Object.entries(dataSet.it)
                        .filter(([key, item]) => item.cat === "mineral" && item.rdyat > 0)
                        .map(([key, item]) => ({ ...item, name: key }));
                }
                if (bntName === "Henhouse") {
                    Items = Object.entries(dataSet.it)
                        .filter(([key, item]) => item.cat === "animal" && item.animal === "Chicken" && item.rdyat > 0)
                        .map(([key, item]) => ({ ...item, name: key }));
                }
                if (bntName === "Barn") {
                    Items = Object.entries(dataSet.it)
                        .filter(([key, item]) => item.cat === "animal" && item.animal !== "Chicken" && item.rdyat > 0)
                        .map(([key, item]) => ({ ...item, name: key }));
                }
                /* if (bntName === "Cooking") {
                    Items = Object.entries(dataSet.food)
                        .filter(([key, item]) => item.rdyat > 0)
                        .map(([key, item]) => ({ ...item, name: key }));
                    plantedHeader = "Cooking";
                } */

                let tableData = null;

                if (bntName === "Crops" || bntName === "Fruits" || bntName === "Greenhouse" || bntName === "Wood" || bntName === "Minerals"
                    || bntName === "Henhouse" || bntName === "Barn") {
                    Object.keys(Items).map((item, itemIndex) => {
                        //plantedTotal += Number(Items[item][plantedValue]);
                        if (Items[item].name === "Feather") { Items[item][key("nodecost")] = 0 };
                        if (Items[item].name === "Leather") { Items[item][key("nodecost")] = 0 };
                        if (Items[item].name === "Merino Wool") { Items[item][key("nodecost")] = 0 };
                        const nbHarvest = (Items[item][key("nbharvest")]) || 1;
                        costTotal += Number(((Items[item][key("nodecost")] * Items[item][plantedValue]) / nbHarvest) / dataSet.coinsRatio);
                        marketTotal += Number(Items[item]["costp2pt"] * Items[item][harvestValue]) * 0.9;
                    });
                    tableData = <><thead>
                        <tr>
                            {xListeColBounty[1][1] === 1 ? <th className="thcenter">Item</th> : null}
                            {xListeColBounty[2][1] === 1 ? <th className="thcenter">{plantedHeader}</th> : null}
                            {xListeColBounty[3][1] === 1 ? <th className="thcenter">{harvestHeader}</th> : null}
                            {xListeColBounty[4][1] === 1 ? <th className="thcenter">Cost</th> : null}
                            {xListeColBounty[5][1] === 1 ? <th className="thcenter">Market</th> : null}
                            {xListeColBounty[5][1] === 1 ? <th className="thcenter">Profit</th> : null}
                        </tr>
                    </thead>
                        <tbody>
                            {Object.keys(Items).map((item, itemIndex) => {
                                const nbHarvest = (Items[item][key("nbharvest")]) || 1;
                                const harvestCost = ((Items[item][key("nodecost")] * Items[item][plantedValue]) / nbHarvest) / dataSet.coinsRatio;
                                const harvestCostp2pt = (Items[item]["costp2pt"] * Items[item][harvestValue]) * 0.9;
                                const harvestProfit = Number(frmtNb(harvestCostp2pt - harvestCost));
                                return (
                                    <tr key={itemIndex}>
                                        {xListeColBounty[1][1] === 1 && (
                                            <td className="tdcenter">
                                                <img src={Items[item].img} alt={Items[item].name} className="nodico" />
                                            </td>
                                        )}
                                        {xListeColBounty[2][1] === 1 && <td className="tdcenter">{frmtNb(Items[item][plantedValue])}</td>}
                                        {xListeColBounty[3][1] === 1 && <td className="tdcenter">{frmtNb(Items[item][harvestValue])}</td>}
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
                profitTotal = marketTotal - costTotal;

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

