import React from "react";
import { useAppCtx } from "../context/AppCtx";
import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';
import { frmtNb, convtimenbr, convTime, ColorValue, Timer, filterTryit } from '../fct.js';

let xdxp = 0;
var dProd = [];
var dProdtry = [];

export default function CookTable() {
    const {
        data: {
            dataSet,
            dataSetFarm,
            farmData,
            bumpkinData,
            priceData,
        },
        config: { API_URL },
        ui: {
            inputFromLvl,
            inputToLvl,
            fromtolvltime,
            fromtolvlxp,
            xHrvst,
            xHrvsttry,
            selectedCurr,
            selectedQuantCook,
            selectedCostCook,
            selectedQuantityCook,
            xListeColCook,
            TryChecked,
        },
        actions: {
            handleUIChange,
            setUIField,
            handleOptionChange,
            handleTooltip,
        },
        img: {
            imgSFL,
            imgExchng,
            imgna,
        }
    } = useAppCtx();
    function handleFromLvlChange(event) {
        const value = event.target.value.replace(/\D/g, '');
        //setInputFromLvl(value);
        if (value > 0 && value <= 149) { getxpFromToLvl(value, inputToLvl, xdxp); }
    }
    function handleToLvlChange(event) {
        const value = event.target.value.replace(/\D/g, '');
        //setInputToLvl(value);
        if (value > 0 && value <= 150) { getxpFromToLvl(inputFromLvl, value, xdxp); }
    }
    async function getxpFromToLvl(xfrom, xto, xdxp) {
        const responseLVL = await fetch(API_URL + "/getfromtolvl", {
            method: 'GET',
            headers: {
                frmid: dataSet.farmId,
                from: xfrom,
                to: xto,
                xdxp: xdxp,
            }
        });
        if (responseLVL.ok) {
            const responseDataLVL = await responseLVL.json();
            //console.log(responseData);
            //setpriceData(JSON.parse(JSON.stringify(responseData.priceData)));
            setUIField("fromtolvltime", responseDataLVL.time);
            //setfromtolvltime(responseDataLVL.time);
            setUIField("fromtolvlxp", responseDataLVL.xp);
            //setfromtolvlxp(responseDataLVL.xp);
        } else {
            console.log(`Error : ${responseLVL.status}`);
        }
    }
    if (farmData.inventory) {
        const { it, food, fish, bounty } = dataSetFarm.itables;
        const inventoryEntries = selectedQuantityCook === "farm" || "daily" || "dailymax" ? Object.entries(farmData.inventory) : Object.entries(farmData.inventory);
        const foodNames = Object.keys(food);
        const Compo = [];
        Compo["total"] = [];
        const sortedCompo = [];
        const sortedInventoryItems = foodNames.map(item => {
            const quantity = inventoryEntries.find(([entryItem]) => entryItem === item)?.[1] || 0;
            for (let compofood in food[item].compoit) {
                const compo = compofood;
                const quant = food[item].compoit[compofood];
                if (it[compo] || fish[compo] || bounty[compo]) {
                    Compo[item] = Compo[item] || [];
                    Compo["total"][compo] = 0;
                    Compo[item][compo] = Compo[item][compo] || 0;
                    Compo[item][compo] += Number(quant);
                }
            }
            return [item, quantity];
        });
        Object.keys(it).forEach(item => {
            if (Object.hasOwn(Compo["total"], item)) {
                sortedCompo.push(item);
            }
        });
        Object.keys(fish).forEach(item => {
            if (Object.hasOwn(Compo["total"], item)) {
                sortedCompo.push(item);
            }
        });
        Object.keys(bounty).forEach(item => {
            if (Object.hasOwn(Compo["total"], item)) {
                sortedCompo.push(item);
            }
        });
        //console.log(sortedCompo);
        const farmTime = dataSet.options.inputFarmTime / 24;
        var totXP = 0;
        var totCost = 0;
        var totCostp2p = 0;
        var BldTime = [];
        var totTime = 0;
        const inventoryItems = sortedInventoryItems.map(([item, quantity], index) => {
            const cobj = food[item];
            const ico = cobj ? cobj.img : '';
            const ibld = cobj ? cobj.bld : '';
            var time = cobj ? !TryChecked ? cobj.time : cobj.timetry : '';
            const timenbr = convtimenbr(time);
            var timecomp = cobj ? !TryChecked ? cobj.timecrp : cobj.timecrptry : '';
            //if (timecomp === '') {console.log (item + ": error timecomp" )}
            const timecrpnbr = convtimenbr(timecomp);
            const icookit = cobj ? cobj.cookit : 0;
            const iquantd = Math.ceil(farmTime / timenbr) !== Infinity ? Math.ceil(farmTime / timenbr) : 0;
            let prodValues = [];
            for (let compofood in food[item].compoit) {
                const compo = compofood;
                const quant = food[item].compoit[compofood];
                if (it[compo]) {
                    const bhrvstItem = !TryChecked ? xHrvst[compo] : xHrvsttry[compo];
                    dProd[compo] = it[compo].farmit ? bhrvstItem * it[compo].harvest : 0;
                    dProdtry[compo] = it[compo].farmit ? bhrvstItem * it[compo].harvesttry : 0;
                    const itdprod = dProd[compo] ? dProd[compo] : 0;
                    const itdprodtry = dProdtry[compo] ? dProdtry[compo] : 0;
                    const dCook = Math.floor(!TryChecked ? itdprod / quant : itdprodtry / quant);
                    prodValues.push(dCook);
                }
            }
            //const prodValues = selectedQuantityCook === "dailymax" ? iquantd : selectedQuantityCook === "daily" ? [dprod1, dprod2, dprod3, dprod4, dprod5].filter(value => value > 0) : 0;
            var xquantd = selectedQuantityCook === "dailymax" ? iquantd : selectedQuantityCook === "daily" ? Math.min(...prodValues) !== Infinity ? Math.min(...prodValues) : 0 : 0;
            xquantd = selectedQuantityCook === "daily" ? xquantd > iquantd ? iquantd : xquantd : xquantd;
            //!TryChecked ? food[item].dprod = xquantd : food[item].dprodtry = xquantd;
            const iKeep = selectedQuantCook !== "unit" ? dataSet.options.inputKeep : 0;
            const iQuant = selectedQuantityCook === "farm" ? (quantity - iKeep > 0 ? quantity - iKeep : 0) : xquantd;
            const ixp = cobj ? selectedQuantCook === "unit" ? (!TryChecked ? cobj.xp : cobj.xptry) : (!TryChecked ? cobj.xp : cobj.xptry) * iQuant : 0;
            const ixph = cobj ? (!TryChecked ? cobj.xph : cobj.xphtry) : 0;
            const ixpsfl = cobj ? (!TryChecked ? cobj.xpsfl * dataSet.options.coinsRatio : cobj.xpsfltry * dataSet.options.coinsRatio) : 0;
            totXP += (selectedQuantityCook === "daily" || selectedQuantityCook === "dailymax" ? isNaN(ixp) ? 0 : Number(ixp) * food[item].cookit : isNaN(ixp) ? 0 : Number(ixp));
            if (cobj.cookit) {
                if (!BldTime[ibld]) { BldTime[ibld] = 0 }
                BldTime[ibld] += xquantd * timenbr;
            }
            const ixphcomp = cobj ? timecomp !== 0 ? parseFloat(ixp / (timecrpnbr * 24)).toFixed(1) : 0 : 0;
            var icost = cobj ? selectedQuantCook === "unit" ? ((!TryChecked ? cobj.cost : cobj.costtry) / dataSet.options.coinsRatio) : ((!TryChecked ? cobj.cost : cobj.costtry) / dataSet.options.coinsRatio) * iQuant : 0;
            var icostp2p = cobj ? selectedQuantCook === "unit" ?
                selectedCostCook === "shop" ? (cobj.costshop / dataSet.options.coinsRatio) : selectedCostCook === "trader" ? cobj.costp2pt : selectedCostCook === "nifty" ? cobj.costp2pn : selectedCostCook === "opensea" ? cobj.costp2po : 0
                : selectedCostCook === "shop" ? (cobj.costshop / dataSet.options.coinsRatio) * iQuant : selectedCostCook === "trader" ? cobj.costp2pt * iQuant : selectedCostCook === "nifty" ? cobj.costp2pn * iQuant : selectedCostCook === "opensea" ? cobj.costp2po * iQuant : 0 : 0;
            if (isNaN(icostp2p)) { icostp2p = 0 }
            let convPricep = 0;
            let convPricep2p = 0;
            if (selectedCurr === "SFL") {
                convPricep = icost;
                convPricep2p = icostp2p;
            }
            if (selectedCurr === "MATIC") {
                convPricep = (icost * priceData[2]) / priceData[1];
                convPricep2p = (icostp2p * priceData[2]) / priceData[1];
            }
            if (selectedCurr === "USDC") {
                convPricep = icost * priceData[2];
                convPricep2p = icostp2p * priceData[2];
            }
            icost = convPricep;
            icostp2p = convPricep2p;
            if (selectedQuantCook !== "unit") {
                if (time !== "" && time !== 0) { time = convTime(iQuant * timenbr) }
                if (timecomp !== "" && timecomp !== 0) { timecomp = convTime(iQuant * timecrpnbr) }
            }
            if (((selectedQuantityCook === "daily" || selectedQuantityCook === "dailymax") && cobj.cookit) || selectedQuantityCook === "farm") {
                totCost += icost;
                totCostp2p += icostp2p;
                for (let compofood in food[item].compoit) {
                    const compo = compofood;
                    const quant = food[item].compoit[compofood];
                    if (it[compo] || fish[compo] || bounty[compo]) { Compo["total"][compo] += quant * (selectedQuantCook === "unit" ? 1 : iQuant) }
                }
            }
            const CellXPSflStyle = {};
            const CellXPHStyle = {};
            CellXPSflStyle.color = ColorValue(ixpsfl, 0, 50000);
            CellXPHStyle.color = ColorValue(ixph, 0, 2000);
            return (
                <tr key={index}>
                    {xListeColCook[0][1] === 1 ? <td className="tdcenter">{ibld}</td> : null}
                    <td id="iccolumn"><i><img src={ico} alt={''} className="itico" title={item} /></i></td>
                    {xListeColCook[1][1] === 1 ? <td className="tditem">{item}</td> : null}
                    {selectedQuantityCook === "daily" || selectedQuantityCook === "dailymax" ? <td className="tdcenter">
                        <input
                            type="checkbox"
                            name={`cookit:${item}`}
                            checked={icookit === 1}
                            onChange={handleUIChange}
                        />
                    </td> : null}
                    {xListeColCook[2][1] === 1 ? <td className="tdcenter">{iQuant}</td> : null}
                    {xListeColCook[3][1] === 1 ? <td className="tdcenter">{parseFloat(ixp).toFixed(1)}</td> : null}
                    {xListeColCook[4][1] === 1 ? <td className="tdcenter">{time}</td> : null}
                    {xListeColCook[5][1] === 1 ? <td className="tdcenter">{timecomp}</td> : null}
                    {xListeColCook[6][1] === 1 ? <td className="tdcenter" style={CellXPHStyle}>{ixph}</td> : null}
                    {xListeColCook[7][1] === 1 ? <td className="tdcenter">{ixphcomp}</td> : null}
                    {xListeColCook[8][1] === 1 ? <td className="tdcenter" style={CellXPSflStyle}>{frmtNb(ixpsfl)}</td> : null}
                    {xListeColCook[9][1] === 1 ? <td className="tdcenter"
                        onClick={(e) => handleTooltip(item, "cookcost", selectedQuantCook !== "unit" ? iQuant : 1, e)}>{frmtNb(icost)}</td> : null}
                    {xListeColCook[10][1] === 1 ? <td className="tdcenter"
                        onClick={(e) => handleTooltip(item, "cookcost", selectedQuantCook !== "unit" ? iQuant : 1, e)}>{frmtNb(icostp2p)}</td> : null}
                    {xListeColCook[11][1] === 1 ? Object.values(sortedCompo).map((itemName, itIndex) => (
                        <td className="tdcenterbrd" style={{ fontSize: '12px' }} key={itemName}>
                            {food[item].compoit[itemName] ? food[item].compoit[itemName] * (selectedQuantCook === "unit" ? 1 : iQuant) : ""}
                        </td>
                    )) : null}
                </tr>
            );
        });

        var maxTime = 0;
        for (var key in BldTime) {
            if (BldTime.hasOwnProperty(key)) {
                var value = BldTime[key];
                if (typeof value === 'number' && !isNaN(value)) {
                    if (value > maxTime) {
                        maxTime = value;
                    }
                }
            }
        }
        totTime = convTime(maxTime);
        const timeOver = maxTime > 1; //farmTime / 24;
        const xinputKeep = selectedQuantCook !== "unit" && selectedQuantityCook === "farm" ? <input type="text" name="inputKeep" value={dataSet?.options?.inputKeep} onChange={handleOptionChange} style={{ width: '11px' }} maxLength={1} /> : "";
        const xinputKeept = selectedQuantCook !== "unit" && selectedQuantityCook === "farm" ? "Keep " : "";
        const xinputFromLvl = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm" ?
            <input
                type="number"
                min={1}
                max={150}
                step={1}
                name="inputFromLvl"
                value={inputFromLvl}
                onChange={(e) => {
                    handleUIChange(e);
                    handleFromLvlChange(e);
                }}
                style={{ width: "40px", marginLeft: "auto" }}
                maxLength={3}
            />
            : "";
        const xinputToLvl = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm" ?
            <input
                type="number"
                min={1}
                max={150}
                step={1}
                name="inputToLvl"
                value={inputToLvl}
                onChange={(e) => {
                    handleUIChange(e);
                    handleToLvlChange(e);
                }}
                style={{ width: "40px", marginLeft: "auto" }}
                maxLength={3}
            />
            : "";
        const xinputFromLvlt = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm" ? "From " : "";
        const xinputToLvlt = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm" ? " to " : "";
        const xLvlconft = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm" ? " days, " + fromtolvlxp + "xp" : "";
        const xspace = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm" ? " " : "";
        const bfdtolvl = !TryChecked ? bumpkinData[0].foodtolvl : bumpkinData[0].foodtolvltry;
        const bfdpstlvl = !TryChecked ? bumpkinData[0].foodxppastlvl : bumpkinData[0].foodxppastlvltry;
        const bxptonxtlvl = !TryChecked ? bumpkinData[0].xptonextlvl : bumpkinData[0].xptonextlvltry;
        xdxp = totXP;
        //const icolspan = xListeColCook[0][1] === 1 ? 3 : 2;
        const tableContent = (
            <>
                {selectedQuantityCook !== "farm" ?
                    <span>{xinputFromLvlt}{xinputFromLvl}{xinputToLvlt}{xinputToLvl}{xspace}{selectedQuantCook !== "unit" ? parseFloat(fromtolvltime).toFixed(1) : ""}{xLvlconft}</span>
                    : null}
                <table className="table">
                    <thead>
                        <tr>
                            {xListeColCook[0][1] === 1 ? <th className="thcenter" >Building</th> : null}
                            <th className="th-icon">   </th>
                            {xListeColCook[1][1] === 1 ? <th className="thcenter" >Food</th> : null}
                            {selectedQuantityCook === "daily" || selectedQuantityCook === "dailymax" ? <th className="thcenter" >Cook</th> : null}
                            {xListeColCook[2][1] === 1 ? <th className="thcenter" >
                                <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                                    <InputLabel>Quant</InputLabel>
                                    <Select name="selectedQuantityCook" value={selectedQuantityCook} onChange={handleUIChange}>
                                        <MenuItem value="farm">Farm</MenuItem>
                                        {/* <MenuItem value="daily">Daily/Farm</MenuItem> */}
                                        <MenuItem value="dailymax">Daily</MenuItem>
                                    </Select></FormControl></div></th> : null}
                            {xListeColCook[3][1] === 1 ? <th className="thcenter"  >
                                <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                                    <InputLabel>XP</InputLabel>
                                    <Select name="selectedQuantCook" value={selectedQuantCook} onChange={handleUIChange}>
                                        <MenuItem value="unit">/ Unit</MenuItem>
                                        <MenuItem value="quant">x Quantity</MenuItem>
                                    </Select></FormControl></div></th> : null}
                            {xListeColCook[4][1] === 1 ? <th className="thcenter" >Time</th> : null}
                            {xListeColCook[5][1] === 1 ? <th className="thcenter" >Time comp</th> : null}
                            {xListeColCook[6][1] === 1 ? <th className="thcenter" >XP/H</th> : null}
                            {xListeColCook[7][1] === 1 ? <th className="thcenter" >XP/H comp</th> : null}
                            {xListeColCook[8][1] === 1 ? <th className="thcenter" >XP/{imgSFL}</th> : null}
                            {xListeColCook[9][1] === 1 ? <th className="thcenter" >Cost</th> : null}
                            {xListeColCook[10][1] === 1 ? <th className="thcenter" >
                                {/* <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                    <InputLabel>Cost</InputLabel>
                    <Select value={selectedCostCook} onChange={handleChangeCostCook}>
                      <MenuItem value="shop">Shop</MenuItem>
                      <MenuItem value="trader">Market</MenuItem>
                      <MenuItem value="nifty">Niftyswap</MenuItem>
                      <MenuItem value="opensea">OpenSea</MenuItem>
                    </Select></FormControl></div> */}{imgExchng}</th> : null}
                            {xListeColCook[11][1] === 1 ? Object.values(sortedCompo).map((itemName, itIndex) => (
                                <th className="thcenter" key={itemName}><i><img src={(it[itemName] ? it[itemName].img : fish[itemName] ? fish[itemName].img : bounty[itemName] ? bounty[itemName].img : imgna)} alt={itemName} className="itico" /></i></th>
                            )) : null}
                        </tr>
                        {(selectedQuantCook !== "unit" || selectedQuantityCook !== "farm") ?
                            <tr key="total">
                                {xListeColCook[0][1] === 1 ? <td className="tdcenter">Total</td> : null}
                                {xListeColCook[1][1] === 1 ? <td></td> : null}
                                {selectedQuantityCook !== "farm" ? <td className="tdcenter"></td> : null}
                                {/* {xListeColCook[1][1] === 1 && selectedQuantityCook === "farm" ? <td className="tditem"></td> : null} */}
                                {xListeColCook[2][1] === 1 ? <td></td> : null}
                                {selectedQuantityCook !== "farm" ? <td className="tdcenter"></td> : null}
                                {xListeColCook[2][1] === 1 && selectedQuantityCook === "farm" ?
                                    <td className="tdcenter" title="Keep for deliveries">{xinputKeept}{xinputKeep}</td> : null}
                                {xListeColCook[3][1] === 1 ? <td className="tdcenter">{selectedQuantCook !== "unit" ? parseFloat(totXP).toFixed(1) : ""}</td> : null}
                                {xListeColCook[4][1] === 1 ? <td className="tdcenter" style={{ color: timeOver && selectedQuantityCook !== "farm" ? "rgb(255, 0, 0)" : "rgb(255, 255, 255)" }}>
                                    {selectedQuantityCook !== "farm" ? totTime :
                                        <><span>to lvl{bfdtolvl}</span>
                                            <div className="progress-bar" style={{ width: "80px" }}>
                                                <div className="progress" style={{ width: `${bfdpstlvl / (bfdpstlvl + bxptonxtlvl) * 100}%` }}>
                                                    <span className="progress-text">
                                                        {`${parseFloat(bfdpstlvl).toFixed(0)}`}
                                                    </span>
                                                </div>
                                            </div></>}</td> : null}
                                {xListeColCook[5][1] === 1 ? <td className="tdcenter"></td> : null}
                                {xListeColCook[6][1] === 1 ? <td className="tdcenter"></td> : null}
                                {xListeColCook[7][1] === 1 ? <td className="tdcenter"></td> : null}
                                {xListeColCook[8][1] === 1 ? <td className="tdcenter"></td> : null}
                                {xListeColCook[9][1] === 1 ? <td className="tdcenter">{selectedQuantCook !== "unit" ? frmtNb(totCost) : ""}</td> : null}
                                {xListeColCook[10][1] === 1 ? <td className="tdcenter">{selectedQuantCook !== "unit" ? frmtNb(totCostp2p) : ""}</td> : null}
                                {xListeColCook[11][1] === 1 ? Object.values(sortedCompo).map((itemName, itIndex) => (
                                    <td className="tdcenterbrd" key={itemName}
                                        style={{
                                            fontSize: '12px', color: it[itemName] ? (Compo["total"][itemName] > (!TryChecked ? dProd[itemName] : dProdtry[itemName])
                                                && selectedQuantityCook !== "farm" ? "rgb(255, 0, 0)" : "rgb(255, 255, 255)") : "rgb(255, 255, 255)"
                                        }}>
                                        {selectedQuantCook !== "unit" && Compo["total"][itemName] > 0 ? Compo["total"][itemName] : ""}
                                    </td>
                                )) : null}
                            </tr> : null}
                    </thead>
                    <tbody>
                        {inventoryItems}
                    </tbody>
                </table>
            </>
        );
        return (tableContent);
    }
}
