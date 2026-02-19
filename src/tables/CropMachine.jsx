import React from "react";
import { useAppCtx } from "../context/AppCtx";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { frmtNb, convtimenbr, convTime, ColorValue } from '../fct.js';
import DList from "../dlist.jsx";


export default function CropMachineTable() {
    const {
        data: { dataSet, dataSetFarm, farmData },
        ui: {
            customSeedCM,
            toCM,
            selectedSeedsCM,
            xListeColBounty,
            TryChecked,
        },
        actions: {
            handleUIChange,
            handleTooltip,
        },
        img: {
            imgsfl,
            imgcoins,
            imgExchng,
        }
    } = useAppCtx();
    if (dataSetFarm?.itables?.it && dataSetFarm?.CropMachine && dataSet?.options) {
        const { it } = dataSetFarm.itables;
        const Keys = Object.keys(it);
        const imgCoins = <img src={imgcoins} alt={''} className="itico" title="Coins" />;
        const imgSfl = <img src={imgsfl} alt={''} className="itico" title="Flower" />;
        const imgoil = <img src={it["Oil"].img} alt={''} className="nodico" title="Oil" style={{ width: '15px', height: '15px' }} />;
        const CM = dataSetFarm.CropMachine || {};
        let actualCMCrop = true;
        const actualLastCrop = "Soybean";
        let TotalSeedCost = 0;
        let TotalOil = 0;
        let TotalOilCost = 0;
        let TotalProd = 0;
        let TotalMarket = 0;
        let TotalProfit = 0;
        let TotalDailyProfit = 0;
        let TotalTime = 0;
        const tableContent = Keys.map((element, index) => {
            if ((it[element].cat !== "crop") || it[element].greenhouse) return null;
            if (element === actualLastCrop) { actualCMCrop = false; }
            const cobj = it[element];
            const itemName = element;
            const ico = <img src={cobj.img} alt={''} className="itico" title={itemName} />;
            const cmCrop = ((TryChecked ? CM.perCroptry : CM.perCrop) || {})[itemName] || {};
            const iseedstock = (TryChecked ? cobj.stocktry : cobj.stock);
            const iseedMax = iseedstock * 2.5;
            const customSeed = customSeedCM?.[element] ?? iseedstock ?? 0;
            const iseeds =
                selectedSeedsCM === "max" ? iseedMax :
                    selectedSeedsCM === "stock" ? iseedstock :
                        customSeed;
            const selectedProfile =
                selectedSeedsCM === "stock" ? cmCrop.stock :
                    selectedSeedsCM === "max" ? cmCrop.max :
                        null;
            const tradeTax = (100 - dataSet.options.tradeTax) / 100;
            const oilCostPerHour = ((TryChecked ? CM.moiltry : CM.moil) * ((TryChecked ? it["Oil"].costtry : it["Oil"].cost) / dataSet.options.coinsRatio));
            const packHoursPerSeed = Number(cmCrop.packHoursPerSeed || (convtimenbr(cobj.btime) * (TryChecked ? CM.mtimetry : CM.mtime) / ((TryChecked ? CM.spottry : CM.spot) || 1)));
            const harvestPerSeed = Number(cmCrop.harvestPerSeed || (TryChecked ? cobj.harvestnodetry : cobj.harvestnode));
            const seedCostPerSeed = Number(cmCrop.seedCostPerSeed || ((TryChecked ? cobj.seedtry : cobj.seed) / dataSet.options.coinsRatio));
            const marketPerUnitAfterTax = Number(cmCrop.marketPerUnitAfterTax || (cobj.costp2pt * tradeTax));
            const batchHours = Number(selectedProfile?.packHours ?? (packHoursPerSeed * iseeds));
            const itime = convTime(batchHours);
            const harvestTotal = Number(selectedProfile?.harvestPerPack ?? (harvestPerSeed * iseeds));
            const iseedCost = Number(selectedProfile?.seedCostPerPack ?? (seedCostPerSeed * iseeds));
            const oilQuant = Number(selectedProfile?.oilPerPack ?? ((TryChecked ? CM.moiltry : CM.moil) * batchHours));
            const oilCost = Number(selectedProfile?.oilCostPerPack ?? (oilCostPerHour * batchHours));
            const iTotalCost = Number(selectedProfile?.packCost ?? (iseedCost + oilCost));
            const icostm = Number(selectedProfile?.packMarket ?? (marketPerUnitAfterTax * harvestTotal));
            const profit = Number(selectedProfile?.packProfit ?? (icostm - iTotalCost));
            const gainH = batchHours > 0 ? (profit / (batchHours * 24)) : 0;
            const dailyBaseProfile = cmCrop.max || null;
            const fullPackSeeds = Number(dailyBaseProfile?.seeds ?? iseedMax);
            const fullPackHours = Number(dailyBaseProfile?.packHours ?? (packHoursPerSeed * fullPackSeeds));
            const fullHarvestPerPack = Number(dailyBaseProfile?.harvestPerPack ?? (harvestPerSeed * fullPackSeeds));
            const fullSeedCostPerPack = Number(dailyBaseProfile?.seedCostPerPack ?? (seedCostPerSeed * fullPackSeeds));
            const dailyCyclesRaw = fullPackHours > 0 ? (1 / fullPackHours) : 0;
            const dailyCycles = fullPackHours > 1
                ? Math.max(0, dailyCyclesRaw)
                : Math.max(0, Math.floor(dailyCyclesRaw));
            const dailySeedCost = fullSeedCostPerPack * dailyCycles;
            const dailyOil = 24 * (TryChecked ? CM.moiltry : CM.moil);
            const dailyOilCost = 24 * oilCostPerHour;
            const seedsPerDay = fullPackSeeds * dailyCycles;
            const seedStock = Number(dailyBaseProfile?.seedStock ?? iseedstock);
            const dailyRestock = seedStock > 0 ? Math.max(0, Math.ceil(seedsPerDay / seedStock) - 1) : 0;
            const dailyRestockGems = dailyRestock * 15;
            const dailyRestockSfl = (Number(dataSet?.options?.gemsRatio || 0) > 0) ? (dailyRestockGems * Number(dataSet.options.gemsRatio)) : 0;
            const dailyCost = dailySeedCost + dailyOilCost + dailyRestockSfl;
            const dailyHarvest = fullHarvestPerPack * dailyCycles;
            const dailyMarket = marketPerUnitAfterTax * dailyHarvest;
            const dailyProfit = dailyMarket - dailyCost;
            const dailyTooltip = {
                cycles: dailyCycles,
                cyclesRaw: dailyCyclesRaw,
                growTime: convTime(fullPackHours),
                seedStock: seedStock,
                seedsPerBatch: fullPackSeeds,
                seedsPerDay: seedsPerDay,
                harvestPerBatch: fullHarvestPerPack,
                harvestPerDay: dailyHarvest,
                seedCostPerBatch: fullSeedCostPerPack,
                seedCostPerDay: dailySeedCost,
                oilPerDay: dailyOil,
                oilCostPerDay: dailyOilCost,
                dailyRestock: dailyRestock,
                dailyRestockGems: dailyRestockGems,
                dailyRestockSfl: dailyRestockSfl,
                costPerDay: dailyCost,
                marketPerDay: dailyMarket,
                profitPerDay: dailyProfit,
            };
            const gainHTooltip = {
                growTime: itime,
                costPerPack: iTotalCost,
                marketPerPack: icostm,
                profitPerPack: profit,
                gainPerHour: gainH,
            };
            const colorT = ColorValue(profit, 0, 10);
            const colorGH = ColorValue(gainH, 0, 10);
            const colorDaily = ColorValue(dailyProfit, 0, 10);
            const cellStyle = {};
            cellStyle.color = colorT;
            const cellStyleGH = {};
            cellStyleGH.color = colorGH;
            const cellStyleDaily = {};
            cellStyleDaily.color = colorDaily;
            const dailyTitle = `Cycles: ${frmtNb(dailyCycles)} | Cost: ${frmtNb(dailyCost)} | Market: ${frmtNb(dailyMarket)} | Profit: ${frmtNb(dailyProfit)}`;
            const isToCM = !!(toCM?.[element] ?? actualCMCrop);
            if (isToCM) {
                TotalSeedCost += iseedCost;
                TotalOil += oilQuant;
                TotalOilCost += oilCost;
                TotalProd += iTotalCost;
                TotalMarket += icostm;
                TotalProfit += profit;
                TotalDailyProfit += dailyProfit;
                TotalTime += convtimenbr(itime);
            }
            return (
                <>
                    {(element === actualLastCrop) ? <tr><td colSpan={10} style={{ textAlign: "center", fontWeight: "bold" }}>
                        Not available yet, maybe in future updates
                    </td></tr> : null}
                    <tr key={index}>
                        <td id="iccolumn" className="cm-icon-sticky">{ico}</td>
                        {xListeColBounty[2][1] === 1 ? <td className="tdcenter cm-check-sticky">{actualCMCrop ? (
                            < input
                                type="checkbox"
                                name={`toCM.${element}`}
                                checked={!!(toCM?.[element] ?? true)}
                                onChange={handleUIChange}
                            />
                        ) : ""}</td> : null}
                        {xListeColBounty[0][1] === 2 ? <td className="tditem">{itemName}</td> : null}
                        {xListeColBounty[1][1] === 1 ? <td className="tdcenter">{itime}</td> : null}
                        {xListeColBounty[2][1] === 1 ? selectedSeedsCM === "custom" ?
                            (<td className="tdcenter">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    style={{ width: "50px", textAlign: "center" }}
                                    name={`customSeedCM.${element}`}
                                    value={customSeedCM?.[element] ?? iseedstock ?? 100}
                                    onChange={handleUIChange}
                                />
                            </td>) :
                            (<td className="tdcenter">{iseeds}</td>) : ("")}
                        {/* {xListeColBounty[2][1] === 1 ? <td className="tdcenter">{nHarvest}</td> : null} */}
                        {xListeColBounty[2][1] === 1 ? <td className="tdcenter">{frmtNb(harvestTotal)}</td> : null}
                        {xListeColBounty[3][1] === 1 ? <td className="tdcenter">{frmtNb(iseedCost)}</td> : null}
                        {xListeColBounty[4][1] === 1 ? <td className="tdcenter">{frmtNb(oilQuant)}</td> : null}
                        {xListeColBounty[5][1] === 1 ? <td className="tdcenter">{frmtNb(oilCost)}</td> : null}
                        {xListeColBounty[5][1] === 1 ? <td className="tdcenter">{frmtNb(iTotalCost)}</td> : null}
                        {xListeColBounty[5][1] === 1 ? <td className="tdcenter">{frmtNb(icostm)}</td> : null}
                        {xListeColBounty[5][1] === 1 ? <td className="tdcenter" style={cellStyle}>{frmtNb(profit)}</td> : null}
                        {xListeColBounty[5][1] === 1 ? <td
                            className="tdcenter tooltipcell"
                            style={cellStyleGH}
                            onClick={(e) => handleTooltip(itemName, "cmgainh", gainHTooltip, e)}
                        >{frmtNb(gainH)}</td> : null}
                        {xListeColBounty[5][1] === 1 && dataSet.options?.isAbo ? <td
                            className="tdcenter tooltipcell"
                            style={cellStyleDaily}
                            title={dailyTitle}
                            onClick={(e) => handleTooltip(itemName, "cmdailysfl", dailyTooltip, e)}
                        >{frmtNb(dailyProfit)}</td> : null}
                    </tr></>
            );
        });
        const colorTP = ColorValue(TotalProfit, 0, 10);
        const totalGainH = TotalTime > 0 ? (TotalProfit / (TotalTime * 24)) : 0;
        const colorTGH = ColorValue(totalGainH, 0, 10);
        const colorTDP = ColorValue(TotalDailyProfit, 0, 10);
        const cellStyleTP = {};
        cellStyleTP.color = colorTP;
        const cellStyleTGH = {};
        cellStyleTGH.color = colorTGH;
        const cellStyleTDP = {};
        cellStyleTDP.color = colorTDP;
        const tableHeader = (
            <thead>
                <tr>
                    <th className="th-icon cm-icon-sticky"></th>
                    {xListeColBounty[0][1] === 1 ? <th className="thcenter cm-check-sticky"> </th> : null}
                    {xListeColBounty[0][1] === 2 ? <th className="thcenter">Name</th> : null}
                    {xListeColBounty[1][1] === 1 ? <th className="thcenter">Time</th> : null}
                    {xListeColBounty[2][1] === 1 ? <th className="thcenter">
                        {/* <div className="selectquantityback"><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                            <InputLabel>Seeds</InputLabel>
                            <Select name="selectedSeedsCM" value={selectedSeedsCM} onChange={handleUIChange} onClick={(e) => e.stopPropagation()}>
                                <MenuItem value="stock">Stock</MenuItem>
                                <MenuItem value="max">Max</MenuItem>
                                <MenuItem value="custom">Custom</MenuItem>
                            </Select></FormControl></div> */}
                        <DList
                            name="selectedSeedsCM"
                            title="Seeds"
                            options={[
                                { value: "stock", label: "Stock" },
                                { value: "max", label: "Max" },
                                { value: "custom", label: "Custom" },
                            ]}
                            value={selectedSeedsCM}
                            onChange={handleUIChange}
                            height={28}
                        />
                    </th> : null}
                    {/* {xListeColBounty[2][1] === 1 ? <th className="thcenter">nHarvst</th> : null} */}
                    {xListeColBounty[1][1] === 1 ? <th className="thcenter">Harvest <div>Average</div></th> : null}
                    {xListeColBounty[3][1] === 1 ? <th className="thcenter"><div style={{ fontSize: "11px" }}>Harvest</div>Cost</th> : null}
                    {xListeColBounty[4][1] === 1 ? <th className="thcenter">Oil {imgoil}</th> : null}
                    {xListeColBounty[5][1] === 1 ? <th className="thcenter"><div style={{ fontSize: "11px" }}>Oil</div>Cost</th> : null}
                    {xListeColBounty[5][1] === 1 ? <th className="thcenter"><div style={{ fontSize: "11px" }}>Total</div>Cost</th> : null}
                    {xListeColBounty[5][1] === 1 ? <th className="thcenter">{imgExchng}</th> : null}
                    {xListeColBounty[5][1] === 1 ? <th className="thcenter">Profit {imgSfl}</th> : null}
                    {xListeColBounty[5][1] === 1 ? <th className="thcenter">Gain/h {imgSfl}</th> : null}
                    {xListeColBounty[5][1] === 1 && dataSet.options?.isAbo ? <th className="thcenter">Daily SFL</th> : null}
                </tr><tr style={{ height: "25px" }}>
                    <td className="cm-icon-sticky"></td>
                    {xListeColBounty[0][1] === 1 ? <td className="thcenter cm-check-sticky"> </td> : null}
                    {xListeColBounty[0][1] === 2 ? <td className="thcenter"> </td> : null}
                    {xListeColBounty[1][1] === 1 ? <td className="thcenter">{convTime(TotalTime)}</td> : null}
                    {xListeColBounty[2][1] === 1 ? <td className="thcenter"> </td> : null}
                    {xListeColBounty[1][1] === 1 ? <td className="thcenter"> </td> : null}
                    {xListeColBounty[3][1] === 1 ? <td className="thcenter">{frmtNb(TotalSeedCost)}</td> : null}
                    {xListeColBounty[4][1] === 1 ? <td className="thcenter">{frmtNb(TotalOil)}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="thcenter">{frmtNb(TotalOilCost)}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="thcenter">{frmtNb(TotalProd)}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="thcenter">{frmtNb(TotalMarket)}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="thcenter" style={cellStyleTP}>{frmtNb(TotalProfit)}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="thcenter" style={cellStyleTGH}>{frmtNb(totalGainH)}</td> : null}
                    {xListeColBounty[5][1] === 1 && dataSet.options?.isAbo ? <td className="thcenter" style={cellStyleTDP}>{frmtNb(TotalDailyProfit)}</td> : null}
                </tr>
            </thead>
        );
        const table = (
            <>
                <table className="table crop-machine-table" style={{ borderCollapse: "separate", borderSpacing: "6px 0", "--cm-check-left": "20px" }}>
                    {tableHeader}
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </>
        );
        return (table);
    }
}
