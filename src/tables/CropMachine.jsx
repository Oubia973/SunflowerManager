import React from "react";
import { useAppCtx } from "../context/AppCtx";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { frmtNb, convtimenbr, convTime, ColorValue } from '../fct.js';


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
        },
        img: {
            imgsfl,
            imgcoins,
            imgExchng,
        }
    } = useAppCtx();
    if (farmData.inventory) {
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
        let TotalTime = 0;
        const tableContent = Keys.map((element, index) => {
            if ((it[element].cat !== "crop") || it[element].greenhouse) return null;
            if (element === actualLastCrop) { actualCMCrop = false; }
            const cobj = it[element];
            const itemName = element;
            const ico = <img src={cobj.img} alt={''} className="itico" title={itemName} />;
            const iseedstock = (TryChecked ? cobj.stocktry : cobj.stock);
            const iseedMax = iseedstock * 2.5;
            const customSeed = customSeedCM?.[element] ?? iseedstock ?? 0;
            const iseeds =
                selectedSeedsCM === "max" ? iseedMax :
                    selectedSeedsCM === "stock" ? iseedstock :
                        customSeed;
            //const iseeds = selectedSeedsCM === "max" ? iseedMax : selectedSeedsCM === "stock" ? iseedstock : customSeedCM[element];
            const itime = convTime((convtimenbr(cobj.btime) * (TryChecked ? CM.mtimetry : CM.mtime)) * (iseeds / (TryChecked ? CM.spottry : CM.spot)));
            const imyieldp = (TryChecked ? cobj.harvestnodetry : cobj.harvestnode);
            const harvestTotal = iseeds * imyieldp;
            const iseedCost = (TryChecked ? cobj.seedtry / dataSet.options.coinsRatio : cobj.seed / dataSet.options.coinsRatio) * iseeds;
            const oilQuant = (24 * convtimenbr(itime)) * (TryChecked ? CM.moiltry : CM.moil);
            const oilCost = oilQuant * (TryChecked ? it["Oil"].costtry : it["Oil"].cost) / dataSet.options.coinsRatio;
            const iTotalCost = iseedCost + oilCost;
            const tradeTax = (100 - dataSet.options.tradeTax) / 100;
            const icostm = cobj.costp2pt * harvestTotal;
            const profit = (icostm * tradeTax) - iTotalCost;
            const colorT = ColorValue(profit, 0, 10);
            const cellStyle = {};
            cellStyle.color = colorT;
            const isToCM = !!(toCM?.[element] ?? actualCMCrop);
            if (isToCM) {
                TotalSeedCost += iseedCost;
                TotalOil += oilQuant;
                TotalOilCost += oilCost;
                TotalProd += iTotalCost;
                TotalMarket += icostm;
                TotalProfit += profit;
                TotalTime += convtimenbr(itime);
            }
            return (
                <>
                    {(element === actualLastCrop) ? <tr><td colSpan={10} style={{ textAlign: "center", fontWeight: "bold" }}>
                        Not available yet, maybe in future updates
                    </td></tr> : null}
                    <tr key={index}>
                        <td id="iccolumn">{ico}</td>
                        {xListeColBounty[2][1] === 1 ? <td className="tdcenter">{actualCMCrop ? (
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
                    </tr></>
            );
        });
        const colorTP = ColorValue(TotalProfit, 0, 10);
        const cellStyleTP = {};
        cellStyleTP.color = colorTP;
        const tableHeader = (
            <thead>
                <tr>
                    <th className="th-icon"></th>
                    {xListeColBounty[0][1] === 1 ? <th className="thcenter"> </th> : null}
                    {xListeColBounty[0][1] === 2 ? <th className="thcenter">Name</th> : null}
                    {xListeColBounty[1][1] === 1 ? <th className="thcenter">Time</th> : null}
                    {xListeColBounty[2][1] === 1 ? <th className="thcenter">
                        <div className="selectquantityback"><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                            <InputLabel>Seeds</InputLabel>
                            <Select name="selectedSeedsCM" value={selectedSeedsCM} onChange={handleUIChange} onClick={(e) => e.stopPropagation()}>
                                <MenuItem value="stock">Stock</MenuItem>
                                <MenuItem value="max">Max</MenuItem>
                                <MenuItem value="custom">Custom</MenuItem>
                            </Select></FormControl></div></th> : null}
                    {/* {xListeColBounty[2][1] === 1 ? <th className="thcenter">nHarvst</th> : null} */}
                    {xListeColBounty[1][1] === 1 ? <th className="thcenter">Harvest <div>Average</div></th> : null}
                    {xListeColBounty[3][1] === 1 ? <th className="thcenter"><div style={{ fontSize: "11px" }}>Harvest</div>Cost</th> : null}
                    {xListeColBounty[4][1] === 1 ? <th className="thcenter">Oil {imgoil}</th> : null}
                    {xListeColBounty[5][1] === 1 ? <th className="thcenter"><div style={{ fontSize: "11px" }}>Oil</div>Cost</th> : null}
                    {xListeColBounty[5][1] === 1 ? <th className="thcenter"><div style={{ fontSize: "11px" }}>Total</div>Cost</th> : null}
                    {xListeColBounty[5][1] === 1 ? <th className="thcenter">{imgExchng}</th> : null}
                    {xListeColBounty[5][1] === 1 ? <th className="thcenter">Profit {imgSfl}</th> : null}
                </tr><tr style={{ height: "25px" }}>
                    <td></td>
                    {xListeColBounty[0][1] === 1 ? <td className="thcenter"> </td> : null}
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
                </tr>
            </thead>
        );
        const table = (
            <>
                <table className="table" style={{ borderCollapse: "separate", borderSpacing: "6px 0" }}>
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