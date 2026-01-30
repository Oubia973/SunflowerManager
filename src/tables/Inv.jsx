import { useAppCtx } from "../context/AppCtx";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { frmtNb, convtimenbr, convTime, ColorValue, ColorValueP, Timer, PBar, timeToDays } from '../fct.js';
import CounterInput from "../counterinput.js";

var xBurning = [];
xBurning.burn = [];
xBurning.burntry = [];

export default function InvTable() {
    const {
        data: { dataSetFarm, farmData },
        ui: {
            selectedQuantity,
            selectedQuant,
            selectedSeason,
            selectedPChange,
            selectedReady,
            TryChecked,
            CostChecked,
            xHrvst,
            xHrvsttry,
            xListeCol,
        },
        actions: {
            handleUIChange,
            handleSetHrvMax,
            handleTraderClick,
            handleTooltip,
        },
        img: {
            imgSFL,
            imgCoins,
            imgrdy,
            imgexchng,
        }
    } = useAppCtx();
    if (farmData.inventory) {
        const { spot, buildngf } = dataSetFarm.frmData;
        const { it } = dataSetFarm.itables;
        const inventoryEntries = Object.entries(farmData.inventory);
        var pinventoryEntries = "";
        if (farmData.previousInventory) { pinventoryEntries = Object.entries(farmData.previousInventory) }
        const itemOrder = Object.keys(it);
        const burnortry = !TryChecked ? "burn" : "burntry";
        //if (selectedQuantity === "daily") {
        const stoneSpot = !TryChecked ? it["Stone"].farmit * (xHrvst["Stone"] * spot.stone) : it["Stone"].farmit * (xHrvsttry["Stone"] * spot.stone);
        const ironSpot = !TryChecked ? it["Iron"].farmit * (xHrvst["Iron"] * spot.iron) : it["Iron"].farmit * (xHrvsttry["Iron"] * spot.iron);
        const goldSpot = !TryChecked ? it["Gold"].farmit * (xHrvst["Gold"] * spot.gold) : it["Gold"].farmit * (xHrvsttry["Gold"] * spot.gold);
        const crimestoneSpot = !TryChecked ? it["Crimstone"].farmit * (xHrvst["Crimstone"] * spot.crimstone) : it["Crimstone"].farmit * (xHrvsttry["Crimstone"] * spot.crimstone);
        const sunstoneSpot = !TryChecked ? it["Sunstone"].farmit * (xHrvst["Sunstone"] * spot.sunstone) : it["Sunstone"].farmit * (xHrvsttry["Sunstone"] * spot.sunstone);
        const oilSpot = !TryChecked ? it["Oil"].farmit * (xHrvst["Oil"] * spot.oil) : it["Oil"].farmit * (xHrvsttry["Oil"] * spot.oil);
        xBurning[burnortry]["Wood"] = (stoneSpot * 3) + (ironSpot * 3) + (goldSpot * 3) + (crimestoneSpot * 3) + (sunstoneSpot * 3) + (oilSpot * 25);
        xBurning[burnortry]["Stone"] = (ironSpot * 5);
        xBurning[burnortry]["Iron"] = (goldSpot * 5) + (oilSpot * 10);
        xBurning[burnortry]["Gold"] = (crimestoneSpot * 3) + (sunstoneSpot * 3);
        //}
        const sortedInventoryItems = itemOrder.map(item => {
            const quantity = inventoryEntries.find(([entryItem]) => entryItem === item)?.[1] || 0;
            return [item, quantity];
        });
        var totTimeCrp = 0;
        var totTimeRs = 0;
        var totCost = 0;
        var totShop = 0;
        var totTrader = 0;
        var totNifty = 0;
        var totOS = 0;
        let invIndex = 0;
        const inventoryItemsCrop = setInvContent(pinventoryEntries, sortedInventoryItems, totCost, totShop, totTrader, totNifty, totOS, totTimeCrp, totTimeRs, invIndex, "crop");
        totTimeCrp = inventoryItemsCrop.totTimeCrp;
        totCost = inventoryItemsCrop.totCost;
        totShop = inventoryItemsCrop.totShop;
        totTrader = inventoryItemsCrop.totTrader;
        totNifty = inventoryItemsCrop.totNifty;
        totOS = inventoryItemsCrop.totOS;
        invIndex = inventoryItemsCrop.invIndex;
        var tprctcN = 0;
        var tprctcO = 0;
        tprctcN = inventoryItemsCrop.totcTrader > 0 ? parseFloat(((inventoryItemsCrop.totcNifty - inventoryItemsCrop.totcTrader) / inventoryItemsCrop.totcTrader) * 100).toFixed(0) : "";
        tprctcO = inventoryItemsCrop.totcTrader > 0 ? parseFloat(((inventoryItemsCrop.totcOS - inventoryItemsCrop.totcTrader) / inventoryItemsCrop.totcTrader) * 100).toFixed(0) : "";
        const totCrop = selectedQuant !== "unit" ?
            (<>
                {xListeCol[0][1] === 1 ? (<td className="ttcenter" >TOTAL</td>) : ("")}
                <td className="td-icon">   </td>
                <td></td>
                <td style={{ display: 'none' }}>ID</td>
                {xListeCol[1][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[2][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                {xListeCol[3][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[4][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsCrop.totcCost).toFixed(2)}</td>) : ("")}
                {xListeCol[5][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsCrop.totcShop).toFixed(2)}</td>) : ("")}
                {xListeCol[6][1] === 1 ? (<td className="ttcenterbrd"></td>) : ("")}
                {xListeCol[7][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsCrop.totcTrader).toFixed(2)}</td>) : ("")}
                {xListeCol[18][1] === 1 && xListeCol[6][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[8][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcN > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcN}{inventoryItemsCrop.totcTrader > 0 ? "%" : ""}</td>) : ("")}
                {xListeCol[9][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsCrop.totcNifty).toFixed(2)}</td>) : ("")}
                {xListeCol[18][1] === 1 && xListeCol[8][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcO > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcO}{inventoryItemsCrop.totcTrader > 0 ? "%" : ""}</td>) : ("")}
                {xListeCol[10][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsCrop.totcOS).toFixed(2)}</td>) : ("")}
                {xListeCol[18][1] === 1 && xListeCol[9][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[12][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[13][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[14][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[19][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[15][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                {xListeCol[16][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[17][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
            </>) : ("");
        const inventoryItemsRes = setInvContent(pinventoryEntries, sortedInventoryItems, totCost, totShop, totTrader, totNifty, totOS, totTimeCrp, totTimeRs, invIndex, "mineral", "gem", "wood", "oil");
        totTimeRs = inventoryItemsCrop.totTimeRs;
        totCost = inventoryItemsRes.totCost;
        totShop = inventoryItemsRes.totShop;
        totTrader = inventoryItemsRes.totTrader;
        totNifty = inventoryItemsRes.totNifty;
        totOS = inventoryItemsRes.totOS;
        invIndex = inventoryItemsRes.invIndex;
        tprctcN = inventoryItemsRes.totcTrader > 0 ? parseFloat(((inventoryItemsRes.totcNifty - inventoryItemsRes.totcTrader) / inventoryItemsRes.totcTrader) * 100).toFixed(0) : "";
        tprctcO = inventoryItemsRes.totcTrader > 0 ? parseFloat(((inventoryItemsRes.totcOS - inventoryItemsRes.totcTrader) / inventoryItemsRes.totcTrader) * 100).toFixed(0) : "";
        const totRes = selectedQuant !== "unit" ?
            (<>
                {xListeCol[0][1] === 1 ? (<td className="ttcenter" >TOTAL</td>) : ("")}
                <td className="td-icon">   </td>
                <td></td>
                <td style={{ display: 'none' }}>ID</td>
                {xListeCol[1][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[2][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                {xListeCol[3][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[4][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsRes.totcCost).toFixed(2)}</td>) : ("")}
                {xListeCol[5][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsRes.totcShop).toFixed(2)}</td>) : ("")}
                {xListeCol[6][1] === 1 ? (<td className="ttcenterbrd"></td>) : ("")}
                {xListeCol[7][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsRes.totcTrader).toFixed(2)}</td>) : ("")}
                {xListeCol[18][1] === 1 && xListeCol[6][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[8][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcN > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcN}{inventoryItemsRes.totcTrader > 0 ? "%" : ""}</td>) : ("")}
                {xListeCol[9][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsRes.totcNifty).toFixed(2)}</td>) : ("")}
                {xListeCol[18][1] === 1 && xListeCol[8][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcO > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcO}{inventoryItemsRes.totcTrader > 0 ? "%" : ""}</td>) : ("")}
                {xListeCol[10][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsRes.totcOS).toFixed(2)}</td>) : ("")}
                {xListeCol[18][1] === 1 && xListeCol[9][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[12][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[13][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[14][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[19][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[15][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                {xListeCol[16][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[17][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
            </>) : ("");
        const inventoryItemsAnml = setInvContent(pinventoryEntries, sortedInventoryItems, totCost, totShop, totTrader, totNifty, totOS, totTimeCrp, totTimeRs, invIndex, "animal", "honey", "flower");
        //totTimeRs = inventoryItemsAnml.totTimeRs;
        totCost = inventoryItemsAnml.totCost;
        totShop = inventoryItemsAnml.totShop;
        totTrader = inventoryItemsAnml.totTrader;
        totNifty = inventoryItemsAnml.totNifty;
        totOS = inventoryItemsAnml.totOS;
        invIndex = inventoryItemsAnml.invIndex;
        tprctcN = inventoryItemsAnml.totcTrader > 0 ? parseFloat(((inventoryItemsAnml.totcNifty - inventoryItemsAnml.totcTrader) / inventoryItemsAnml.totcTrader) * 100).toFixed(0) : "";
        tprctcO = inventoryItemsAnml.totcTrader > 0 ? parseFloat(((inventoryItemsAnml.totcOS - inventoryItemsAnml.totcTrader) / inventoryItemsAnml.totcTrader) * 100).toFixed(0) : "";
        const totAnml = selectedQuant !== "unit" ?
            (<>
                {xListeCol[0][1] === 1 ? (<td className="ttcenter" >TOTAL</td>) : ("")}
                <td className="td-icon">   </td>
                <td></td>
                <td style={{ display: 'none' }}>ID</td>
                {xListeCol[1][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[2][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                {xListeCol[3][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[4][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsAnml.totcCost).toFixed(2)}</td>) : ("")}
                {xListeCol[5][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsAnml.totcShop).toFixed(2)}</td>) : ("")}
                {xListeCol[6][1] === 1 ? (<td className="ttcenterbrd"></td>) : ("")}
                {xListeCol[7][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsAnml.totcTrader).toFixed(2)}</td>) : ("")}
                {xListeCol[18][1] === 1 && xListeCol[6][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[8][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcN > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcN}{inventoryItemsAnml.totcTrader > 0 ? "%" : ""}</td>) : ("")}
                {xListeCol[9][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsAnml.totcNifty).toFixed(2)}</td>) : ("")}
                {xListeCol[18][1] === 1 && xListeCol[8][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcO > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcO}{inventoryItemsAnml.totcTrader > 0 ? "%" : ""}</td>) : ("")}
                {xListeCol[10][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsAnml.totcOS).toFixed(2)}</td>) : ("")}
                {xListeCol[18][1] === 1 && xListeCol[9][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[12][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[13][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[14][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[19][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[15][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                {xListeCol[16][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[17][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
            </>) : ("");
        const inventoryItemsFruit = setInvContent(pinventoryEntries, sortedInventoryItems, totCost, totShop, totTrader, totNifty, totOS, totTimeCrp, totTimeRs, invIndex, "fruit", "mushroom");
        totCost = inventoryItemsFruit.totCost;
        totShop = inventoryItemsFruit.totShop;
        totTrader = inventoryItemsFruit.totTrader;
        totNifty = inventoryItemsFruit.totNifty;
        totOS = inventoryItemsFruit.totOS;
        invIndex = inventoryItemsFruit.invIndex;
        const tprctN = totTrader > 0 ? parseFloat(((totNifty - totTrader) / totTrader) * 100).toFixed(0) : "";
        const tprctO = totTrader > 0 ? parseFloat(((totOS - totTrader) / totTrader) * 100).toFixed(0) : "";
        tprctcN = inventoryItemsFruit.totcTrader > 0 ? parseFloat(((inventoryItemsFruit.totcNifty - inventoryItemsFruit.totcTrader) / inventoryItemsFruit.totcTrader) * 100).toFixed(0) : "";
        tprctcO = inventoryItemsFruit.totcTrader > 0 ? parseFloat(((inventoryItemsFruit.totcOS - inventoryItemsFruit.totcTrader) / inventoryItemsFruit.totcTrader) * 100).toFixed(0) : "";
        const totFruit = selectedQuant !== "unit" ?
            (<>
                {xListeCol[0][1] === 1 ? (<td className="ttcenter" >TOTAL</td>) : ("")}
                <td className="td-icon">   </td>
                <td></td>
                <td style={{ display: 'none' }}>ID</td>
                {xListeCol[1][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[2][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                {xListeCol[3][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[4][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsFruit.totcCost).toFixed(2)}</td>) : ("")}
                {xListeCol[5][1] === 1 ? (<td className="ttcenter">{parseFloat(inventoryItemsFruit.totcShop).toFixed(2)}</td>) : ("")}
                {xListeCol[6][1] === 1 ? (<td className="ttcenterbrd"></td>) : ("")}
                {xListeCol[7][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsFruit.totcTrader).toFixed(2)}</td>) : ("")}
                {xListeCol[18][1] === 1 && xListeCol[6][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[8][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcN > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcN}{inventoryItemsFruit.totcTrader > 0 ? "%" : ""}</td>) : ("")}
                {xListeCol[9][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsFruit.totcNifty).toFixed(2)}</td>) : ("")}
                {xListeCol[18][1] === 1 && xListeCol[8][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctcO > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctcO}{inventoryItemsFruit.totcTrader > 0 ? "%" : ""}</td>) : ("")}
                {xListeCol[10][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(inventoryItemsFruit.totcOS).toFixed(2)}</td>) : ("")}
                {xListeCol[18][1] === 1 && xListeCol[9][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[12][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[13][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[14][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[19][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[15][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                {xListeCol[16][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                {xListeCol[17][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
            </>) : ("");
        var showBldinv = true;
        var BldItems = "";
        if (showBldinv) {
            const bldOrder = ["Fire Pit", "Kitchen", "Deli", "Bakery", "Smoothie Shack", "Compost Bin", "Turbo Composter", "Premium Composter"];
            const sortedBldItems = bldOrder.map(item => {
                const quantity = inventoryEntries.find(([entryItem]) => entryItem === item)?.[1] || 0;
                return [item, quantity];
            });
            BldItems = sortedBldItems.map(([building], index) => {
                if (buildngf[building]) {
                    if (buildngf[building].readyAt > 0) {
                        const itemBuild = buildngf[building];
                        const ico = buildngf[building].img;
                        const item = buildngf[building].name;
                        const icost = buildngf[building].cost;
                        const buildCraft = buildngf[building].craft;
                        const irdyat = buildngf[building].readyAt;
                        var xnow = new Date().getTime();
                        const ximgrdy = irdyat > 0 && irdyat < xnow ? <img src={imgrdy} alt="" /> : "";
                        const ximgfood = <img src={buildngf[building].itimg} alt="" style={{ width: '15px', height: '15px' }} />
                        const iquant = buildngf[building].quant > 1 && buildngf[building].quant;
                        const pNifty = buildngf[building].costp2pn;
                        const pOS = buildngf[building].costp2po;
                        const pTrad = buildngf[building].costp2pt;
                        return (
                            <tr key={index}>
                                {xListeCol[0][1] === 1 ? (<td></td>) : ("")}
                                <td id="iccolumn"><i><img src={ico} alt={''} className="itico" /></i></td>
                                <td></td>
                                <td style={{ display: 'none' }}></td>
                                {xListeCol[1][1] === 1 ? (<td className="tditem">{item}</td>) : ("")}
                                {selectedQuantity === "daily" ? (<td className="tdcenter"></td>) : ("")}
                                {selectedQuantity === "daily" ? (<td className="tdcenter"></td>) : ("")}
                                {selectedQuantity === "daily" ? (<td className="tdcenter"></td>) : ("")}
                                {xListeCol[2][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                                {xListeCol[3][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(200, 200, 200)` }}></td>) : ("")}
                                {xListeCol[4][1] === 1 ? (<td className="tdcenter">{frmtNb(icost)}</td>) : ("")}
                                {xListeCol[5][1] === 1 ? (<td className="tdcenter"></td>) : ("")}
                                {xListeCol[6][1] === 1 ? (<td className="tdcenterbrd"></td>) : ("")}
                                {xListeCol[7][1] === 1 ? (<td className="tdcenterbrd">{frmtNb(pTrad)}</td>) : ("")}
                                {xListeCol[18][1] === 1 && xListeCol[6][1] === 1 ? (<td className="tdcenter"></td>) : ("")}
                                {xListeCol[8][1] === 1 ? (<td className="tdcenter"></td>) : ("")}
                                {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<td className="tdcenter"></td>) : ("")}
                                {xListeCol[9][1] === 1 ? (<td className="tdcenterbrd">{frmtNb(pNifty)}</td>) : ("")}
                                {xListeCol[18][1] === 1 && xListeCol[8][1] === 1 ? (<td className="tdcenter"></td>) : ("")}
                                {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<td className="tdcenter"></td>) : ("")}
                                {xListeCol[10][1] === 1 ? (<td className="tdcenterbrd">{frmtNb(pOS)}</td>) : ("")}
                                {xListeCol[18][1] === 1 && xListeCol[9][1] === 1 ? (<td className="tdcenter"></td>) : ("")}
                                {xListeCol[12][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(255, 234, 204)` }}></td>) : ("")}
                                {xListeCol[13][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(255, 225, 183)` }}></td>) : ("")}
                                {xListeCol[14][1] === 1 ? (<td className="tdcenter tooltipcell" style={{ color: `rgb(253, 215, 162)` }}
                                    onClick={(e) => handleTooltip(itemBuild, "buildcraft", buildCraft, e)}>
                                    {iquant > 0 ? iquant : ""}{ximgfood}</td>) : ("")}
                                {xListeCol[19][1] === 1 ? (<td id={`timer-${index}`} className="tdcenterbrd">{(irdyat > 0 ? selectedReady === "when" ? (<span>{formatdate(irdyat)}{' '}{ximgrdy}</span>) :
                                    <Timer key={`timer-${index}`} timestamp={irdyat} index={item} /> : "")}</td>) : ("")}
                                {xListeCol[15][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                                {xListeCol[16][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(255, 204, 132)` }}></td>) : ("")}
                                {xListeCol[17][1] === 1 ? (<td className="tdcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                            </tr>
                        );
                    }
                }
            });
        }
        const totTime = convTime(totTimeCrp);
        const tableContent = (
            <>
                <table className="table">
                    <thead>
                        <tr>
                            {xListeCol[0][1] === 1 ? (<th className="thcenter tooltipcell" onClick={(e) => handleTooltip("hoard", "th", "", e)}>Hoard</th>) : ("")}
                            <th className="th-icon">   </th>
                            <th className="thcenter"><div className="selectseasonback"><FormControl variant="standard" id="formselectquant" className="selectseason" size="small">
                                <InputLabel style={{ fontSize: `12px` }}>Season</InputLabel>
                                <Select name={"selectedSeason"} value={selectedSeason} onChange={handleUIChange} onClick={(e) => e.stopPropagation()}>
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="spring"><img src="./icon/ui/spring.webp" alt={''} className="seasonico" title="Spring" style={{ width: '18px', height: '18px' }} /></MenuItem>
                                    <MenuItem value="summer"><img src="./icon/ui/summer.webp" alt={''} className="seasonico" title="Summer" style={{ width: '18px', height: '18px' }} /></MenuItem>
                                    <MenuItem value="autumn"><img src="./icon/ui/autumn.webp" alt={''} className="seasonico" title="Autumn" style={{ width: '18px', height: '18px' }} /></MenuItem>
                                    <MenuItem value="winter"><img src="./icon/ui/winter.webp" alt={''} className="seasonico" title="Winter" style={{ width: '18px', height: '18px' }} /></MenuItem>
                                </Select></FormControl></div></th>
                            <td style={{ display: 'none' }}>ID</td>
                            {xListeCol[1][1] === 1 ? (<th className="thcenter">Item</th>) : ("")}
                            {selectedQuantity === "daily" ? (<th className="thcenter"> </th>) : ("")}
                            {selectedQuantity === "daily" ? (<th className="thcenter"><div>Hrv</div><div>max</div></th>) : ("")}
                            {selectedQuantity === "daily" ? (<th className="thcenter"><div>Hrv</div><div>
                                <img src="/icon/ui/arrow_left.png" alt="Hrv = Hrv max" title="Set Hrv to Hrv Max"
                                    onClick={() => handleSetHrvMax(TryChecked)} style={{ width: '11px', height: '11px' }} /></div>
                            </th>) : ("")}
                            {xListeCol[2][1] === 1 ? (<th className="thcenter tooltipcell" style={{ color: `rgb(160, 160, 160)` }}
                                onClick={(e) => handleTooltip("quantity", "th", "", e)}>
                                <div className="selectquantityback"><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                                    <InputLabel>Quantity</InputLabel>
                                    <Select name="selectedQuantity" value={selectedQuantity} onChange={handleUIChange} onClick={(e) => e.stopPropagation()}>
                                        <MenuItem value="farm">Farm</MenuItem>
                                        <MenuItem value="daily">Daily</MenuItem>
                                        <MenuItem value="blockbuck">Restock</MenuItem>
                                        <MenuItem value="custom">Custom</MenuItem>
                                    </Select></FormControl></div>
                            </th>) : ("")}
                            {xListeCol[3][1] === 1 ? (<th className="thcenter">{selectedQuantity === "daily" ? (<div><div>Time</div><div>{(totTime)}</div></div>) : ("Time")}</th>) : ("")}
                            {xListeCol[4][1] === 1 ? (<th className="thcenter tooltipcell" onClick={(e) => handleTooltip("cost", "th", "", e)}>
                                <div className="selectquantback"><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                                    <InputLabel>Cost</InputLabel>
                                    <Select name="selectedQuant" value={selectedQuant} onChange={handleUIChange} onClick={(e) => e.stopPropagation()}>
                                        <MenuItem value="unit">/ Unit</MenuItem>
                                        <MenuItem value="quant">x Quantity</MenuItem>
                                    </Select></FormControl></div>
                                <div className="checkcost" style={{ visibility: selectedQuant === "quant" ? "visible" : "hidden" }}><input type="checkbox" id="CostColumnCheckbox" checked={CostChecked}
                                    name="CostChecked" onChange={handleUIChange} onClick={(e) => e.stopPropagation()} /></div>
                            </th>) : ("")}
                            {xListeCol[5][1] === 1 ? (<th className="thcenter">Betty</th>) : ("")}
                            {xListeCol[6][1] === 1 ? (<th className="thcenter">Ratio<div>{imgCoins}/{imgSFL}</div></th>) : ("")}
                            {xListeCol[7][1] === 1 ? (<th className="thtrad" onClick={() => handleTraderClick()}><div className="overlay-trad"></div>Market</th>) : ("")}
                            {xListeCol[18][1] === 1 && xListeCol[6][1] === 1 ? (<th className="thcenter tooltipcell" style={{ fontSize: `10px` }}
                                onClick={(e) => handleTooltip("coef", "th", "", e)}>Profit<div>%</div></th>) : ("")}
                            {xListeCol[8][1] === 2 ? (<th className="thcenter tooltipcell" style={{ color: `rgb(160, 160, 160)` }}
                                onClick={(e) => handleTooltip("withdraw", "th", "", e)} >Withdraw</th>) : ("")}
                            {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<th className="thcenter tooltipcell" onClick={(e) => handleTooltip("diff", "th", "", e)}>Diff</th>) : ("")}
                            {xListeCol[9][1] === 1 ? (<th className="thnifty" onClick={() => handleNiftyClick()}><div className="overlay-nifty"></div> </th>) : ("")}
                            {xListeCol[18][1] === 1 && xListeCol[8][1] === 1 ? (<th className="thcenter tooltipcell" onClick={(e) => handleTooltip("coef", "th", "", e)}>Coef</th>) : ("")}
                            {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<th className="thcenter tooltipcell" onClick={(e) => handleTooltip("diff", "th", "", e)}>Diff</th>) : ("")}
                            {xListeCol[10][1] === 1 ? (<th className="thos" onClick={() => handleOSClick()}><div className="overlay-os"></div> </th>) : ("")}
                            {xListeCol[18][1] === 1 && xListeCol[9][1] === 1 ? (<th className="thcenter tooltipcell" onClick={(e) => handleTooltip("coef", "th", "", e)}>Coef</th>) : ("")}
                            <th className="thcenter"><div className="selectseasonback"><FormControl variant="standard" id="formselectquant" className="selectseason" size="small">
                                <InputLabel style={{ fontSize: `12px` }}>Chng%</InputLabel>
                                <Select name={"selectedPChange"} value={selectedPChange} onChange={handleUIChange} onClick={(e) => e.stopPropagation()}>
                                    <MenuItem value="24h">24h</MenuItem>
                                    <MenuItem value="3d">3d</MenuItem>
                                    <MenuItem value="7d">7d</MenuItem>
                                    <MenuItem value="30d">30d</MenuItem>
                                </Select></FormControl></div></th>
                            {xListeCol[12][1] === 1 ? (<th className="thcenter tooltipcell" onClick={(e) => handleTooltip("yield", "th", "", e)}>Yield</th>) : ("")}
                            {xListeCol[13][1] === 1 ? (<th className="thcenter tooltipcell" onClick={(e) => handleTooltip("harvest", "th", "", e)}>Harvest<div style={{ fontSize: "10px" }}>average</div></th>) : ("")}
                            {xListeCol[14][1] === 1 ? (<th className="thcenter tooltipcell" onClick={(e) => handleTooltip("toharvest", "th", "", e)}>ToHarvest<div style={{ fontSize: "10px" }}>growing</div></th>) : ("")}
                            {xListeCol[19][1] === 1 ? (<th className="tdcenterbrd">
                                <div className="selectreadyback"><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                                    <InputLabel>Ready</InputLabel>
                                    <Select name="selectedReady" value={selectedReady} onChange={handleUIChange} onClick={(e) => e.stopPropagation()}>
                                        <MenuItem value="when">When</MenuItem>
                                        <MenuItem value="remain">Remain</MenuItem>
                                    </Select></FormControl></div>
                            </th>) : ("")}
                            {xListeCol[15][1] === 1 ? (<th className="thcenter tooltipcell" style={{ color: `rgb(160, 160, 160)` }}
                                onClick={(e) => handleTooltip("1restock", "th", "", e)}>1restock</th>) : ("")}
                            {/* {xListeCol[16][1] === 1 ? (<th className="thcenter">
                  <div className="selectquantityback"><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                  <InputLabel>Daily {imgSFL}</InputLabel>
                  <Select value={selectedDsfl} onChange={handleChangeDsfl} onClick={(e) => e.stopPropagation()}>
                    <MenuItem value="trader">Market</MenuItem>
                    <MenuItem value="nifty">Niftyswap</MenuItem>
                    <MenuItem value="opensea">OpenSea</MenuItem>
                    <MenuItem value="max">Higher</MenuItem>
                  </Select></FormControl></div>
                  </th>) : ("")} */}
                            {xListeCol[16][1] === 1 ? (<th className="thcenter">
                                <div>Daily {imgSFL}</div>
                                <div><img src={imgexchng} alt={''} title="Marketplace" style={{ width: '20px', height: '20px' }} /></div>
                            </th>) : ("")}
                            {xListeCol[17][1] === 1 ? (<th className="thcenter tooltipcell" style={{ color: `rgb(160, 160, 160)` }}
                                onClick={(e) => handleTooltip("dailymax", "th", "", e)}>DailyMax<div style={{ fontSize: "10px" }}>average</div></th>) : ("")}
                        </tr>
                        {selectedQuant !== "unit" ?
                            <tr style={{ position: "sticky" }}>
                                {xListeCol[0][1] === 1 ? (<td className="ttcenter" >TOTAL</td>) : ("")}
                                <td className="td-icon">   </td>
                                <td></td>
                                <td style={{ display: 'none' }}>ID</td>
                                {xListeCol[1][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                                {selectedQuantity === "daily" ? (<td className="ttcenter"></td>) : ("")}
                                {xListeCol[2][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                                {xListeCol[3][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                                {xListeCol[4][1] === 1 ? (<td className="ttcenter">{parseFloat(totCost).toFixed(2)}</td>) : ("")}
                                {xListeCol[5][1] === 1 ? (<td className="ttcenter">{parseFloat(totShop).toFixed(2)}</td>) : ("")}
                                {xListeCol[6][1] === 1 ? (<td className="ttcenterbrd"></td>) : ("")}
                                {xListeCol[7][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(totTrader).toFixed(2)}</td>) : ("")}
                                {xListeCol[18][1] === 1 && xListeCol[6][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                                {xListeCol[8][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                                {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctN > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctN}{totTrader > 0 ? "%" : ""}</td>) : ("")}
                                {xListeCol[9][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(totNifty).toFixed(2)}</td>) : ("")}
                                {xListeCol[18][1] === 1 && xListeCol[8][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                                {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<td className={tprctO > -20 ? 'tdpdiffgrn' : 'tdpdiff'}>{tprctO}{totTrader > 0 ? "%" : ""}</td>) : ("")}
                                {xListeCol[10][1] === 1 ? (<td className="ttcenterbrd">{parseFloat(totOS).toFixed(2)}</td>) : ("")}
                                {xListeCol[18][1] === 1 && xListeCol[9][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                                {xListeCol[12][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                                {xListeCol[13][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                                {xListeCol[14][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                                {xListeCol[19][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                                {xListeCol[15][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                                {xListeCol[16][1] === 1 ? (<td className="ttcenter"></td>) : ("")}
                                {xListeCol[17][1] === 1 ? (<td className="ttcenter" style={{ color: `rgb(160, 160, 160)` }}></td>) : ("")}
                            </tr> : ("")}
                    </thead>
                    <tbody>
                        {selectedQuant !== "unit" ?
                            (<tr style={{ position: "sticky" }}>{totCrop}</tr>) : ""}
                        {inventoryItemsCrop.inventoryItems}
                        {selectedQuant !== "unit" ?
                            (<tr style={{ position: "sticky" }}>{totRes}</tr>) : ""}
                        {inventoryItemsRes.inventoryItems}
                        {selectedQuant !== "unit" ?
                            (<tr style={{ position: "sticky" }}>{totAnml}</tr>) : ""}
                        {inventoryItemsAnml.inventoryItems}
                        {selectedQuant !== "unit" ?
                            (<tr style={{ position: "sticky" }}>{totFruit}</tr>) : ""}
                        {inventoryItemsFruit.inventoryItems}
                        {BldItems}
                    </tbody>
                </table>
            </>
        );
        invIndex++;
        return (tableContent);
    }
}
function setInvContent(pinventoryEntries, sortedInventoryItems, totCost, totShop, totTrader, totNifty, totOS, totTimeCrp, totTimeRs, invIndex, ItCat1, ItCat2, ItCat3, ItCat4) {
    const {
        data: { dataSet, dataSetFarm, priceData },
        ui: {
            inputValue,
            xHrvst,
            xHrvsttry,
            cstPrices,
            selectedCurr,
            selectedQuant,
            selectedQuantity,
            selectedReady,
            selectedDsfl,
            selectedSeason,
            selectedPChange,
            xListeCol,
            CostChecked,
            TryChecked,
        },
        actions: {
            handleUIChange,
            handleTooltip,
        },
        img: {
            imgwinter,
            imgspring,
            imgsummer,
            imgautumn,
            imgcrop,
            imgwood,
            imgstone,
            imgbeehive,
            imgcow,
            imgsheep,
            imgflowerbed,
            imgchkn,
            imgrdy,
            imgbuyit,
        }
    } = useAppCtx();
    const { spot } = dataSetFarm.frmData;
    const { it } = dataSetFarm.itables;
    const { nft, buildng } = dataSetFarm.boostables;
    const farmTime = dataSet.options.inputFarmTime / 24;
    //const MaxBB = dataSet.options.inputMaxBB;
    const burnortry = !TryChecked ? "burn" : "burntry";
    var totcCost = 0;
    var totcShop = 0;
    var totcTrader = 0;
    var totcNifty = 0;
    var totcOS = 0;
    //let xIndex = 0;
    //const TaxTradSfl = 0.25 / priceData[2];
    const catArray = [ItCat1, ItCat2, ItCat3, ItCat4].filter(Boolean);
    const CorespondantItems = sortedInventoryItems.filter(item => catArray.includes(it[item[0]].cat));
    const tableLen = CorespondantItems.length;
    invIndex += tableLen;
    const imgbee = <img src="./icon/ui/bee.webp" alt={''} className="nodico" title="Bee swarm" style={{ width: '15px', height: '15px' }} />;
    const imglove = <img src="./icon/ui/expression_love.png" alt={''} className="nodico" title="Needs love" style={{ width: '15px', height: '15px' }} />;
    const imgsick = <img src="./icon/ui/happiness_03.png" alt={''} className="nodico" title="Sick" style={{ width: '15px', height: '15px' }} />;
    const imgfullmoon = <img src="./icon/ui/full_moon.png" alt={''} className="seasonico" title="Full Moon" />;
    const imgPPriceChng = <img src="./icon/ui/priceup.png" alt={''} title="UP" style={{ width: '10px', height: '10px' }} />;
    const imgNPriceChng = <img src="./icon/ui/pricedown.png" alt={''} title="DOWN" style={{ width: '10px', height: '10px' }} />;
    let maxCoinRatio = 0;
    let indexCoinRatio = 0;
    let iR = 0;
    for (let itemR in it) {
        const xcoinsRatio = TryChecked ? it[itemR].coinratiotry : it[itemR].coinratio;;
        if (xcoinsRatio > maxCoinRatio) {
            maxCoinRatio = xcoinsRatio;
            indexCoinRatio = iR;
        }
        iR++;
    }
    const inventoryItems = sortedInventoryItems.map(([item, quantity], index) => {
        let xIndex = index;
        const firstind = index === invIndex - tableLen;
        const lastind = index === invIndex - 1;
        const cellStyle = {};
        cellStyle.borderBottom = lastind ? '1px solid rgb(83, 51, 51)' : 'none';
        cellStyle.borderTop = firstind ? '1px solid rgb(83, 51, 51)' : 'none';
        //cellStyle.color = lastind ? `rgb(150, 50, 20)` : '';
        if ((quantity > 0 || it[item].tobharvest > 0) && catArray.includes(it[item].cat)) {
            const cobj = it[item];
            const icat = cobj ? cobj.cat : '';
            const ico = cobj ? cobj.img : '';
            const icoseason = cobj ? (cobj.imgseason || '') : '';
            const xSeasonImg = icoseason.split("*");
            let isOnSeason = false;
            if ((icat !== "crop" && icat !== "fruit") || it[item].greenhouse) { isOnSeason = true; }
            for (let i = 0; i < xSeasonImg.length; i++) {
                if (xSeasonImg[i] === "Winter") {
                    xSeasonImg[i] = imgwinter;
                    if (selectedSeason === "winter") { isOnSeason = true; }
                }
                if (xSeasonImg[i] === "Summer") {
                    xSeasonImg[i] = imgsummer;
                    if (selectedSeason === "summer") { isOnSeason = true; }
                }
                if (xSeasonImg[i] === "Autumn") {
                    xSeasonImg[i] = imgautumn;
                    if (selectedSeason === "autumn") { isOnSeason = true; }
                }
                if (xSeasonImg[i] === "Spring") {
                    xSeasonImg[i] = imgspring;
                    if (selectedSeason === "spring") { isOnSeason = true; }
                }
                if (xSeasonImg[i] === "FullMoon") {
                    xSeasonImg[i] = imgfullmoon;
                    isOnSeason = true;
                }
                if (!icoseason) { isOnSeason = true; }
            }
            if (selectedSeason !== "all" && !isOnSeason) {
                return null;
            }
            const ido = cobj ? cobj.id : 0;
            //const frmido = cobj ? cobj.farmid : 0;
            const ximgtrd = ""; //frmido === Number(curID) ? <img src={imgtrd} alt="" /> : "";
            //const ximgtrdOS = frmOwner === priceDataO[i].makerof ? <img src={imgtrd} alt="" /> : "";
            const maxh = cobj ? cobj.hoard : 0;
            const costpOrB = cobj.cat === "crop" ? cobj.pcost : cobj.cost;
            const costpOrBtry = cobj.cat === "crop" ? cobj.pcosttry : cobj.costtry;
            const priceChange = cobj?.["cost" + selectedPChange] ?? null;
            const imgpriceChange = !priceChange ? "" : (priceChange > 0 ? imgPPriceChng : imgNPriceChng);
            const txtpriceChange = !priceChange ? "" : Math.abs(priceChange);
            //const costpOrB = cobj.pcost;
            //const costpOrBtry = cobj.pcosttry;
            var costp = cobj ? !TryChecked ? (costpOrB / dataSet.options.coinsRatio) : (costpOrBtry / dataSet.options.coinsRatio) : 0;
            var pShop = cobj ? ((!TryChecked ? cobj.shop : cobj.shoptry) / dataSet.options.coinsRatio) : 0;
            var time = cobj ? (!TryChecked ? cobj.time : cobj.timetry) : 0;
            const timmenbr = convtimenbr(time);
            const imyield = cobj ? !TryChecked ? cobj.myield : cobj.myieldtry : 0;
            const iharvest = cobj ? !TryChecked ? cobj.harvest : cobj.harvesttry : 0;
            //const rharvest = cobj.harvest ? cobj.harvest : 0;
            //const rharvesttry = cobj.harvesttry ? cobj.harvesttry : 0;
            const iharvestdmax = cobj.harvestdmax ? cobj.harvestdmax : 0;
            const iharvestdmaxtry = cobj.harvestdmaxtry ? cobj.harvestdmaxtry : 0;
            const dailyprodmx = !TryChecked ? iharvestdmax : iharvestdmaxtry;
            const idailycycle = !TryChecked ? cobj.dailycycle : cobj.dailycycletry;
            //if(!xHrvst[item]) {setUIField(TryChecked ? `xHrvsttry.${[item]}` : `xHrvst.${[item]}`, idailycycle)}
            const irestockmax = cobj.restockmax ? cobj.restockmax : 0;
            const irestockmaxtry = cobj.restockmaxtry ? cobj.restockmaxtry : 0;
            const BBprod = !TryChecked ? irestockmax : irestockmaxtry;
            const i2bharvest = cobj ? cobj.tobharvest : 0;
            //const iplanted = cobj ? cobj.planted : 0;
            const irdyat = cobj ? cobj.rdyat : 0;
            var xnow = new Date().getTime();
            const ximgrdy = irdyat > 0 && irdyat < xnow ? <img src={imgrdy} alt="" /> : "";
            //const itradmax = cobj ? cobj.tradmax : 0;
            const istock = cobj ? cobj.stock : 0;
            const ifrmit = cobj ? cobj.farmit : 0;
            const ibuyit = cobj ? cobj.buyit : 0;
            const previousQuantity = parseFloat(pinventoryEntries.find(([pItem]) => pItem === item)?.[1] || 0);
            const pquant = previousQuantity;
            const itemQuantity = item === "Flower" ? it["Flower"].quant : quantity;
            const difference = itemQuantity - pquant;
            const absDifference = Math.abs(difference);
            const isNegativeDifference = difference < 0;
            const hoardPercentage = Math.floor((absDifference / maxh) * 100);
            const bswarm = item === "Honey" && it["Honey"].swarm;
            const needslove = (item === "Egg" || item === "Milk" || item === "Wool") && it[item].needlove;
            const issick = (item === "Egg" || item === "Milk" || item === "Wool") && it[item].issick;
            let spotNb = 0;
            let istockorhoard = 0;
            let spotImage = "";
            if (icat === "crop") { spotNb = spot.crop; istockorhoard = istock; spotImage = imgcrop; }
            if (item === "Wood") { spotNb = spot.wood; nft["Foreman Beaver"].isactive === 1 ? istockorhoard = maxh : istockorhoard = istock; spotImage = imgwood; }
            if (item === "Stone") { spotNb = spot.stone; istockorhoard = istock; spotImage = imgstone; }
            if (item === "Iron") { spotNb = spot.iron; istockorhoard = istock; spotImage = imgstone; }
            if (item === "Gold") { spotNb = spot.gold; istockorhoard = istock; spotImage = imgstone; }
            if (item === "Crimstone") { spotNb = spot.crimstone; istockorhoard = istock; spotImage = imgstone; }
            if (item === "Sunstone") { spotNb = spot.sunstone; istockorhoard = istock; spotImage = imgstone; }
            if (item === "Egg" || item === "Feather") { spotNb = 1; istockorhoard = Math.ceil(farmTime / timmenbr); spotImage = imgchkn; }
            if (item === "Honey") { spotNb = spot.beehive; istockorhoard = istock; spotImage = imgbeehive; }
            if (item === "Flower") { spotNb = spot.flower; istockorhoard = istock; spotImage = imgflowerbed; }
            if (item === "Milk" || item === "Leather") { spotNb = spot.cow; istockorhoard = istock; spotImage = imgcow; }
            if (item === "Wool" || item === "Merino Wool") { spotNb = spot.sheep; istockorhoard = istock; spotImage = imgsheep; }
            if (icat === "fruit") { spotNb = spot.fruit; istockorhoard = istock * (4 + buildng["Immortal Pear"].isactive); spotImage = imgwood; }
            const hrvststk = (Math.floor(istock / spotNb) > 0 ? Math.floor(istockorhoard / spotNb) : 1);
            //const hrvststkfrt = (Math.floor(istockorhoard / iplanted) > 0 ? Math.floor(istockorhoard / iplanted) : 1);
            //const hrvststkegg = (Math.floor(istockorhoard / spotNb) > 0 ? Math.floor(istockorhoard / spotNb) : 1) / timmenbr;
            const tmstk = hrvststk * timmenbr;
            //const tmstkfrt = hrvststkfrt * timmenbr;
            //const tmstkegg = hrvststkegg * timmenbr;
            //const tmstkx = (icat === "fruit" ? tmstkfrt : item === "Egg" ? tmstkegg : tmstk);
            //const BBd = farmTime / tmstkx;
            //const BBdmx = farmTime / tmstk;
            //const BBprod = (((item === "Wood" && nft["Foreman Beaver"].isactive === 1) || item === "Egg" ? maxh : hrvststk * iharvest));
            //const hrvststkx = (icat === "fruit" ? hrvststkfrt : item === "Egg" ? hrvststkegg : hrvststk);
            /* const hrvstd = (BBd <= MaxBB ? (Math.ceil(hrvststkx * BBd)) : (Math.ceil(hrvststkx * MaxBB))) > 0 ? (BBd <= MaxBB ? (Math.ceil(hrvststkx * BBd)) :
              (Math.ceil(hrvststkx * MaxBB))) : 1; */
            /* const hrvstdmx = (BBdmx <= MaxBB ? (Math.ceil(hrvststk * BBdmx)) : (Math.ceil(hrvststk * MaxBB))) > 0 ? (BBdmx <= MaxBB ? (Math.ceil(hrvststk * BBdmx)) :
              (Math.ceil(hrvststk * MaxBB))) : 1; */
            //const hrvstd = idailycycle;
            //const hrvstdmx = idailycycle;
            //if (!TryChecked) { HrvstMax[item] = idailycycle } else { HrvstMaxtry[item] = idailycycle }
            //if (!TryChecked) { if (!xHrvst[item] || xHrvst[item] > HrvstMax[item]) { xHrvst[item] = HrvstMax[item] } }
            //else { if (!xHrvsttry[item] || xHrvsttry[item] > HrvstMaxtry[item]) { xHrvsttry[item] = HrvstMaxtry[item] } }
            //const bhrvstItem = 0;
            //const dailyprod = bhrvstItem * (item === "Egg" ? iharvestdmax : iharvest);
            //const rhdmax = rharvest / rtimmenbr;
            //const rhdmaxtry = rharvesttry / timmenbrtry;
            //dProd[item] = it[item].farmit ? bhrvstItem * (item === "Egg" ? rhdmax : rharvest) : 0;
            //dProdtry[item] = it[item].farmit ? bhrvstItem * (item === "Egg" ? rhdmaxtry : rharvesttry) : 0;
            //const hrvstdmaxx = (icat === "fruit" ? !TryChecked ? iharvestdmax : iharvestdmaxtry : item === "Egg" ? !TryChecked ? iharvestdmax : iharvestdmaxtry : iharvest);
            //const dailyprodmx = hrvstdmx * hrvstdmaxx;
            //const iburn = xBurning[burnortry][item] ? xBurning[burnortry][item] : 0;
            /* if (!cstPrices?.[xIndex]) {
                const newcstPrices = { ...cstPrices };
                newcstPrices[xIndex] = (it[item]?.tradmax || 0);
                setCstPrices(newcstPrices);
            } */
            if (ifrmit === 1 && icat === "crop") { totTimeCrp += (!TryChecked ? (xHrvst[item] ?? idailycycle) : (xHrvsttry[item] ?? idailycycle)) * timmenbr }
            if (ifrmit === 1 && (icat === "mineral" || icat === "gem" || icat === "wood")) { totTimeRs += tmstk }
            const customPrice = cstPrices?.[item] ?? (it?.[item]?.tradmax ?? 0);
            const quantNHrvst = (TryChecked ? (xHrvsttry[item]) : (xHrvst[item])) * iharvest;
            const iQuant =
                selectedQuantity === "daily"
                    ? (ifrmit === 1 ? quantNHrvst : 0)
                    : selectedQuantity === "blockbuck"
                        ? BBprod
                        : selectedQuantity === "custom"
                            ? customPrice
                            : itemQuantity;
            const hrvstFieldName = TryChecked ? `xHrvsttry.${item}` : `xHrvst.${item}`;
            const hrvstFieldValue = TryChecked ? (xHrvsttry?.[item] ?? idailycycle) : (xHrvst?.[item] ?? idailycycle);
            /* const iQuant = selectedQuantity === "daily" ? (ifrmit === 1 ? dailyprod : 0) - iburn : selectedQuantity === "blockbuck" ?
                BBprod : selectedQuantity === "custom" ? (cstPrices[xIndex]) : itemQuantity; */
            var Ttax = 0; //Math.ceil(iQuant / itradmax) * 0.25;
            const nTTax = (dataSet.options.tradeTax) / 100;
            const NTax = 0.05;
            const OTax = 0.05;
            let convPricep = 0;
            let convPriceshp = 0;
            if (selectedCurr === "SFL") {
                convPricep = costp;
                convPriceshp = pShop;
            }
            if (selectedCurr === "MATIC" || selectedCurr === "POL") {
                convPricep = (costp * priceData[2]) / priceData[1];
                convPriceshp = (pShop * priceData[2]) / priceData[1];
            }
            if (selectedCurr === "USDC") {
                convPricep = costp * priceData[2];
                convPriceshp = pShop * priceData[2];
            }
            if (selectedQuant !== "unit") {
                costp = convPricep * Number(iQuant);
                if (costp < 0) { costp = 0 }
                pShop = convPriceshp * iQuant;
                if (time !== "" && time !== 0) {
                    if (selectedQuantity === "daily") {
                        time = convTime(idailycycle * timmenbr);
                    } else {
                        time = convTime(Math.ceil(iQuant / iharvest) * timmenbr);
                    }
                }
            }
            else {
                costp = convPricep;
                pShop = convPriceshp;
            }
            if (CostChecked === true && xListeCol[4][1] === 1 && selectedQuant !== "unit" && pShop > 0) { pShop = pShop - costp; }
            let pTrad = 0;
            let puTrad = 0;
            let convPrice = 0;
            const priceT = it[item].costp2pt || 0;
            const priceN = it[item].costp2pn || 0;
            const priceO = it[item].costp2po || 0;
            //for (let i = 0; i < priceDataT.length; i++) {
            //if (priceDataT[i].id.toString() === ido) {
            if (selectedCurr === "SFL") {
                //convPrice = priceDataT[i].unit;
                convPrice = priceT;
                Ttax = Ttax / priceData[2];
            }
            if (selectedCurr === "MATIC" || selectedCurr === "POL") {
                convPrice = (priceT * priceData[2]) / priceData[1];
                Ttax = Ttax / priceData[1];
            }
            if (selectedCurr === "USDC") {
                convPrice = priceT * priceData[2];
            }
            puTrad = convPrice;
            if (selectedQuant !== "unit") {
                convPrice *= iQuant;
                convPrice -= (convPrice * nTTax);
                convPrice -= ((CostChecked === true && xListeCol[4][1] === 1) ? costp : 0);
                //convPrice -= Ttax;
            }
            pTrad = convPrice;
            //break;
            //}
            //}
            let pNifty = 0;
            let puNifty = 0;
            if (selectedCurr === "SFL") {
                //convPrice = priceDataN[i].cryptoprice;
                convPrice = priceN;
            }
            if (selectedCurr === "MATIC" || selectedCurr === "POL") {
                convPrice = (priceN * priceData[2]) / priceData[1];
            }
            if (selectedCurr === "USDC") {
                convPrice = priceN * priceData[2];
            }
            puNifty = convPrice;
            if (selectedQuant !== "unit") {
                convPrice *= (iQuant * 0.7);
                convPrice -= (convPrice * NTax);
                convPrice -= ((CostChecked === true && xListeCol[4][1] === 1) ? costp : 0);
            }
            pNifty = convPrice;
            let pOS = 0;
            let puOS = 0;
            if (selectedCurr === "SFL") {
                //convPrice = priceDataO[i].unit / priceData[2];
                convPrice = priceO;
            }
            if (selectedCurr === "MATIC" || selectedCurr === "POL") {
                convPrice = (priceO * priceData[2]) / priceData[1];
            }
            if (selectedCurr === "USDC") {
                convPrice = priceO * priceData[2];
            }
            puOS = convPrice;
            if (selectedQuant !== "unit") {
                convPrice *= (iQuant * 0.7);
                convPrice -= (convPrice * OTax);
                convPrice -= ((CostChecked === true && xListeCol[4][1] === 1) ? costp : 0);
            }
            pOS = convPrice;
            const pTCoef = (puTrad * (1 - nTTax) / convPricep);
            const profiPercent = ((Math.ceil(pTCoef * 100) - 100) || 0);
            const profitTxt = profiPercent === Infinity ? "ꝏ" : profiPercent;
            const coefT = pTCoef !== "Infinity" ? profitTxt : "";
            const pNCoef = ((((puNifty * 0.7) * (1 - NTax))) / convPricep);
            const coefN = pNCoef !== "Infinity" ? parseFloat(pNCoef).toFixed(2) : "";
            const pOCoef = ((((puOS * 0.7) * (1 - OTax))) / convPricep);
            const coefO = pOCoef !== "Infinity" ? parseFloat(pOCoef).toFixed(2) : "";
            const colorT = ColorValue(pTCoef);
            const colorN = ColorValue(coefN);
            const colorO = ColorValue(coefO);
            const colorPChange = ColorValueP(priceChange, 50);
            const prctN = ((pTrad > 0) && (pNifty > 0)) ? parseFloat(((pNifty - pTrad) / pTrad) * 100).toFixed(0) : "";
            const prctO = ((pTrad > 0) && (pOS > 0)) ? parseFloat(((pOS - pTrad) / pTrad) * 100).toFixed(0) : "";
            //const BBsfl = (getMaxValue(puTrad, puNifty, puOS)) * BBprod;
            const puNiftyWthdr = puNifty * 0.7;
            const puOSWthdr = puOS * 0.7;
            const xDsfl = selectedDsfl === "max" ? (getMaxValue(puTrad * (1 - nTTax), puNiftyWthdr * (1 - NTax), puOSWthdr * (1 - OTax))) :
                selectedDsfl === "trader" ? puTrad * (1 - nTTax) : selectedDsfl === "nifty" ? puNiftyWthdr * (1 - NTax) : selectedDsfl === "opensea" ? puOSWthdr * (1 - OTax) : 0;
            //const Dsfl = (xDsfl - convPricep) * dailyprodmx;
            //const Dsfl = cobj?.buyit ? 0 : (xDsfl - convPricep) * (!TryChecked ? iharvestdmax : iharvestdmaxtry);
            const Dsfl = (!TryChecked ? cobj.dailysfl : cobj.dailysfltry);
            //const titleTrad = selectedQuant !== "unit" ? Math.ceil(iQuant / itradmax) + " * (" + itradmax + " * " + puTrad + " - 0.25$)" : "";
            const titleTrad = ""; // selectedQuant !== 'unit' ? frmtNb(Math.ceil(iQuant / itradmax)) + ` x (${frmtNb(itradmax)} x ${frmtNb(puTrad)}) - ${frmtNb(TaxTradSfl)}SFL(0.25$)` : "";
            const titleNifty = ""; // selectedQuant !== "unit" ? frmtNb(iQuant * 0.7) + " x " + frmtNb(puNifty) + " - 5%" : "";
            const titleOS = ""; // selectedQuant !== "unit" ? frmtNb(iQuant * 0.7) + " x " + frmtNb(puOS) + " - 10%" : "";
            const maxPltfrm = Math.max(puTrad, puNiftyWthdr, puOSWthdr) === puTrad ? "Trader" : Math.max(puTrad, puNiftyWthdr, puOSWthdr) === puNiftyWthdr ? "Niftyswap" :
                Math.max(puTrad, puNiftyWthdr, puOSWthdr) === puOSWthdr ? "OpenSea" : "";
            const titleDsfl = selectedDsfl === "max" ? `${frmtNb(dailyprodmx)} x ${frmtNb(xDsfl)} at ${maxPltfrm}` : "";
            const cellDSflStyle = {};
            cellDSflStyle.backgroundColor = (selectedDsfl === "max" && Dsfl > 0) ? maxPltfrm === "Trader" ? 'rgba(5, 128, 1, 0.14)' :
                maxPltfrm === "Niftyswap" ? 'rgba(103, 1, 128, 0.14)' : maxPltfrm === "OpenSea" ? 'rgba(0, 75, 236, 0.14)' : '' : '';
            cellDSflStyle.color = ColorValue(Dsfl, 0, 10);
            if (selectedQuant !== "unit") {
                const bCost = !isNaN(costp) ? Number(costp) : 0;
                const bShop = !isNaN(pShop) ? Number(pShop) : 0;
                const bTrad = !isNaN(pTrad) ? Number(pTrad) : 0;
                const bNifty = !isNaN(pNifty) ? Number(pNifty) : 0;
                const bOS = !isNaN(pOS) ? Number(pOS) : 0;
                totCost += bCost;
                totShop += bShop;
                totTrader += bTrad;
                totNifty += bNifty;
                totOS += bOS;
            }
            if (selectedQuant !== "unit") {
                const bCost = !isNaN(costp) ? Number(costp) : 0;
                const bShop = !isNaN(pShop) ? Number(pShop) : 0;
                const bTrad = !isNaN(pTrad) ? Number(pTrad) : 0;
                const bNifty = !isNaN(pNifty) ? Number(pNifty) : 0;
                const bOS = !isNaN(pOS) ? Number(pOS) : 0;
                totcCost += bCost;
                totcShop += bShop;
                totcTrader += bTrad;
                totcNifty += bNifty;
                totcOS += bOS;
            }
            const timerElement = (
                <Timer
                    key={`timer-${xIndex}`}
                    timestamp={irdyat}
                    index={item}
                //onTimerFinish={handleTimerFinish}
                />
            );
            const marketDataTooltip = {};
            marketDataTooltip.itemQuant = selectedQuant !== "unit" ? iQuant : 1;
            marketDataTooltip.itemPrice = selectedQuant !== "unit" ? puTrad * iQuant : puTrad;
            marketDataTooltip.CostChecked = CostChecked;
            const xcoinsRatio = TryChecked ? cobj.coinratiotry : cobj.coinratio; //1 / pTrad * (pShop * dataSet.options.coinsRatio); //(pShop * dataSet.options.coinsRatio) / pTrad;
            const cellCoinRatioStyle = {};
            if (indexCoinRatio === xIndex) {
                cellCoinRatioStyle.backgroundColor = 'rgba(13, 63, 21, 0.71)';
            }
            cellCoinRatioStyle.borderBottom = cellStyle.borderBottom;
            cellCoinRatioStyle.borderTop = cellStyle.borderTop;
            return (
                <>
                    <tr key={xIndex}>
                        {xListeCol[0][1] === 1 ? (<td style={cellStyle}>
                            {PBar(quantity, previousQuantity, maxh, 0)}
                            {/* {maxh > 0 && (
                                <div className={`progress-bar ${isNegativeDifference ? 'negative' : ''}`}>
                                    <div className="progress" style={{ width: `${hoardPercentage}%` }}>
                                        <span className="progress-text">
                                            {isNegativeDifference ? `-${parseFloat(absDifference).toFixed(0)}` : `${parseFloat(difference).toFixed(0)}/${parseFloat(maxh > 1000 ? (maxh / 1000) : maxh).toFixed(0)}${maxh > 1000 ? "k" : ""}`}
                                        </span>
                                    </div>
                                </div>
                            )} */}
                        </td>) : ("")}
                        <td id="iccolumn" style={cellStyle}><i><img src={ico} alt={''} className="itico" /></i></td>
                        <td style={cellStyle}>
                            {xSeasonImg.map((value, index) => {
                                if (value !== "") { return (<span key={index}><i>{xSeasonImg[index]}</i></span>) }
                                return null;
                            })}</td>
                        <td style={{ display: 'none' }}>{ido}</td>
                        {xListeCol[1][1] === 1 ? (<td className="tditem" style={cellStyle}>{item}</td>) : ("")}
                        {selectedQuantity === "daily" ? (<td className="tdcenter" style={cellStyle}>
                            <input
                                type="checkbox"
                                name={`farmit:${item}`}
                                checked={ifrmit === 1}
                                onChange={handleUIChange}
                            />
                        </td>) : ("")}
                        {selectedQuantity === "daily" ? (<td className="tdcenter" style={cellStyle}>{idailycycle}</td>) : ("")}
                        {selectedQuantity === "daily" ? (<td className="tdcenter" style={cellStyle}>
                            <CounterInput
                                value={hrvstFieldValue}
                                onChange={(newValue) =>
                                    handleUIChange({ target: { name: hrvstFieldName, value: newValue } })
                                }
                                min={1}
                                max={idailycycle}
                            />
                        </td>) : ("")}
                        {xListeCol[2][1] === 1 ? (
                            selectedQuantity === "custom" ? (
                                <td className="tdcenter" style={{ ...cellStyle, color: `rgb(160, 160, 160)` }}>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        style={{ width: "50px", textAlign: "center" }}
                                        name={`cstPrices.${item}`}
                                        value={cstPrices?.[item] ?? it[item]?.tradmax ?? 100}
                                        onChange={handleUIChange}
                                    />
                                </td>
                            ) : (
                                <td className="tdcenter" style={{ ...cellStyle, color: `rgb(160, 160, 160)` }}>
                                    {parseFloat(iQuant).toFixed(2)}
                                </td>
                            )
                        ) : ("")}
                        {xListeCol[3][1] === 1 ? (<td className="tdcenter" style={{ ...cellStyle, color: `rgb(200, 200, 200)` }}>{timeToDays(time)}</td>) : ("")}
                        {xListeCol[4][1] === 1 ? (<td className="tdcenter tooltipcell" style={cellStyle} onClick={(e) => handleTooltip(item, "costp", costp, e)}>{frmtNb(costp)}{ibuyit ? imgbuyit : null}</td>) : ("")}
                        {xListeCol[5][1] === 1 ? (<td className="tdcenter" style={cellStyle}>{pShop > 0 ? frmtNb(pShop) : ""}</td>) : ("")}
                        {xListeCol[6][1] === 1 ? (<td className="tdcenterbrd" style={cellCoinRatioStyle}>{xcoinsRatio > 0 ? frmtNb(xcoinsRatio) : ""}</td>) : ("")}
                        {xListeCol[7][1] === 1 ? (<td className={(parseFloat(pTrad).toFixed(20) === getMaxValue(pTrad, pNifty, pOS) ? 'tdcentergreen' : 'tdcenterbrd') + " tooltipcell"}
                            onClick={(e) => handleTooltip(item, "market", marketDataTooltip, e)} style={cellStyle} title={titleTrad} >{puTrad !== 0 ? frmtNb(pTrad) : ""}{ximgtrd}</td>) : ("")}
                        {xListeCol[18][1] === 1 && xListeCol[6][1] === 1 ? (<td style={{ ...cellStyle, color: colorT, textAlign: 'center', fontSize: '10px' }}
                            onClick={(e) => handleTooltip(item, "coef", coefT, e)}>{pTrad > 0 ? coefT : ""}</td>) : ("")}
                        {xListeCol[8][1] === 1 ? (<td className="quantity" style={{ ...cellStyle }}>{parseFloat((iQuant) * 0.7).toFixed(2)}</td>) : ("")}
                        {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<td className={prctN > -20 ? 'tdpdiffgrn tooltipcell' : 'tdpdiff tooltipcell'} style={cellStyle}
                            onClick={(e) => handleTooltip(item, "prct", prctN, e)}>{prctN}{((pTrad > 0) && (pNifty > 0)) ? "%" : ""}</td>) : ("")}
                        {xListeCol[9][1] === 1 ? (<td className={parseFloat(pNifty).toFixed(20) === getMaxValue(pTrad, pNifty, pOS) ? 'tdcentergreen' : 'tdcenterbrd'}
                            style={cellStyle} title={titleNifty}>{puNifty !== 0 ? frmtNb(pNifty) : ""}</td>) : ("")}
                        {xListeCol[18][1] === 1 && xListeCol[8][1] === 1 ? (<td classname="tooltipcell" style={{ ...cellStyle, color: colorN, textAlign: 'center', fontSize: '8px' }}
                            onClick={(e) => handleTooltip(item, "coef", coefT, e)}>{coefN > 0 ? coefN : ""}</td>) : ("")}
                        {xListeCol[11][1] === 1 && xListeCol[14][1] === 1 ? (<td className={prctO > -20 ? 'tdpdiffgrn tooltipcell' : 'tdpdiff tooltipcell'} style={cellStyle}
                            onClick={(e) => handleTooltip(item, "prct", prctO, e)}>{prctO}{((pTrad > 0) && (pOS > 0)) ? "%" : ""}</td>) : ("")}
                        {xListeCol[10][1] === 1 ? (<td className={parseFloat(pOS).toFixed(20) === getMaxValue(pTrad, pNifty, pOS) ? 'tdcentergreen' : 'tdcenterbrd'}
                            onClick={(event) => handleTradeListClick(inputValue, ido, "OS")} style={cellStyle} title={titleOS}>{puOS !== 0 ? frmtNb(pOS) : ""}</td>) : ("")}
                        {xListeCol[18][1] === 1 && xListeCol[9][1] === 1 ? (<td classname="tooltipcell" style={{ ...cellStyle, color: colorO, textAlign: 'center', fontSize: '8px' }}
                            onClick={(e) => handleTooltip(item, "coef", coefO, e)}>{coefO > 0 ? coefO : ""}</td>) : ("")}
                        {xListeCol[3][1] === 1 ? (<td style={{ ...cellStyle, fontSize: "11px", color: colorPChange }}>{imgpriceChange}{txtpriceChange}</td>) : ("")}
                        {xListeCol[12][1] === 1 ? (<td className="tdcenter tooltipcell" style={{ ...cellStyle, color: `rgb(255, 234, 204)` }} onClick={(e) => handleTooltip(item, "trynft", "yield", e)}>
                            {parseFloat(imyield).toFixed(2)}</td>) : ("")}
                        {xListeCol[13][1] === 1 ? (<td className="tdcenter tooltipcell" style={{ ...cellStyle, color: `rgb(255, 225, 183)` }} onClick={(e) => handleTooltip(item, "harvest", 0, e)}>
                            {parseFloat(iharvest).toFixed(2)}</td>) : ("")}
                        {xListeCol[14][1] === 1 ? (<td className="tdcenter tooltipcell" style={{ ...cellStyle, color: `rgb(253, 215, 162)` }} onClick={(e) => handleTooltip(item, "harvest", i2bharvest, e)}>
                            {i2bharvest > 0 ? parseFloat(i2bharvest).toFixed(2) : ""}{bswarm && imgbee}{issick ? imgsick : needslove && imglove}</td>) : ("")}
                        {xListeCol[19][1] === 1 ? (<td id={`timer-${xIndex}`} className="tdcenterbrd" style={cellStyle}>{(i2bharvest > 0 || item === "Honey" ? selectedReady === "when" ?
                            (<span>{formatdate(irdyat)}{' '}{ximgrdy}</span>) : timerElement : "")}</td>) : ("")}
                        {xListeCol[15][1] === 1 ? (<td className="tdcenter" style={{ ...cellStyle, color: `rgb(160, 160, 160)` }}>{BBprod > 0 ? parseFloat(BBprod).toFixed(2) : ""}</td>) : ("")}
                        {xListeCol[16][1] === 1 ? (<td className="tdcenter tooltipcell" style={{ ...cellStyle, ...cellDSflStyle }}
                            title={titleDsfl} onClick={(e) => handleTooltip(item, "dailysfl", costp, e)}>
                            {parseFloat(Dsfl).toFixed(2)}</td>) : ("")}
                        {xListeCol[17][1] === 1 ? (<td className="tdcenter" style={{ ...cellStyle, color: `rgb(160, 160, 160)` }}>{parseFloat(dailyprodmx).toFixed(2)}</td>) : ("")}
                    </tr>
                </>
            );
        }
    });
    const result = {
        inventoryItems: inventoryItems,
        totTimeRs: totTimeRs,
        totTimeCrp: totTimeCrp,
        totCost: totCost,
        totShop: totShop,
        totTrader: totTrader,
        totNifty: totNifty,
        totOS: totOS,
        totcCost: totcCost,
        totcShop: totcShop,
        totcTrader: totcTrader,
        totcNifty: totcNifty,
        totcOS: totcOS,
        invIndex: invIndex
    }
    return result;
}
function formatdate(timestamp) {
    if (timestamp < 3600 * 1000 * 24) { timestamp -= 3600 * 1000 }
    if (timestamp <= 0) { return 0 }
    var dateActuelle = new Date(timestamp);
    //var jours = dateActuelle.getDate();
    var heures = dateActuelle.getHours();
    var minutes = dateActuelle.getMinutes();
    //var secondes = dateActuelle.getSeconds();
    var dateFormatee = (
        //(jours < 10 ? "0" : "") + jours + ":" +
        (heures < 10 ? "0" : "") + heures + ":" +
        (minutes < 10 ? "0" : "") + minutes //+ ":" +
        //(secondes < 10 ? "0" : "") + secondes
    );
    return dateFormatee;
}
const getMaxValue = (value1, value2, value3) => {
    const positiveValues = [parseFloat(value1).toFixed(20), parseFloat(value2).toFixed(20), parseFloat(value3).toFixed(20)].filter(value => value > 0);
    return positiveValues.length > 0 ? parseFloat(Math.max(...positiveValues)).toFixed(20).toString() : null;
};