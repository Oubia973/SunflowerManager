import React, { useEffect, useRef, useState } from "react";
import { useAppCtx } from "../context/AppCtx";
import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { frmtNb, convtimenbr, convTime, ColorValue, Timer, filterTryit, PBar, timeToDays, flattenCompoit } from '../fct.js';
import DList from "../dlist.jsx";

let xdxp = 0;
var dProd = [];
var dProdtry = [];
const maxLvl = 200;

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
            cookSortBy,
            cookSortDir,
            cookCategories,
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
    const levelReqTimerRef = useRef(null);
    const levelReqSeqRef = useRef(0);
    const stickyBarRef = useRef(null);
    const cookHeaderRowRef = useRef(null);
    const [isLevelRangeLoading, setIsLevelRangeLoading] = useState(false);
    const [cookHeaderStickyTop, setCookHeaderStickyTop] = useState(0);
    const [cookHeaderRowHeight, setCookHeaderRowHeight] = useState(0);
    useEffect(() => {
        return () => {
            if (levelReqTimerRef.current) {
                clearTimeout(levelReqTimerRef.current);
            }
            levelReqSeqRef.current += 1;
        };
    }, []);
    useEffect(() => {
        const updateCookHeaderTop = () => {
            setCookHeaderStickyTop(stickyBarRef.current?.offsetHeight || 0);
            setCookHeaderRowHeight(cookHeaderRowRef.current?.offsetHeight || 0);
        };
        const raf = requestAnimationFrame(updateCookHeaderTop);
        window.addEventListener("resize", updateCookHeaderTop);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", updateCookHeaderTop);
        };
    }, [selectedQuantityCook, selectedQuantCook, isLevelRangeLoading, fromtolvltime, fromtolvlxp, xListeColCook]);
    useEffect(() => {
        const shouldFetchLevelRange = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm";
        if (!shouldFetchLevelRange) {
            if (levelReqTimerRef.current) {
                clearTimeout(levelReqTimerRef.current);
                levelReqTimerRef.current = null;
            }
            setIsLevelRangeLoading(false);
            return;
        }
        scheduleLevelRangeFetch(inputFromLvl, inputToLvl);
    }, [
        inputFromLvl,
        inputToLvl,
        selectedQuantCook,
        selectedQuantityCook,
        dataSetFarm?.itables?.food,
        dataSetFarm?.itables?.pfood,
    ]);
    function scheduleLevelRangeFetch(xfromRaw, xtoRaw) {
        if (levelReqTimerRef.current) {
            clearTimeout(levelReqTimerRef.current);
            levelReqTimerRef.current = null;
        }
        const xfrom = Number.parseInt(String(xfromRaw), 10);
        const xto = Number.parseInt(String(xtoRaw), 10);
        const isValid = Number.isFinite(xfrom) && Number.isFinite(xto) && xfrom > 0 && xto > 0;
        if (!isValid) {
            setUIField("fromtolvltime", 0);
            setUIField("fromtolvlxp", 0);
            setIsLevelRangeLoading(false);
            levelReqSeqRef.current += 1;
            return;
        }
        const reqId = ++levelReqSeqRef.current;
        setIsLevelRangeLoading(true);
        levelReqTimerRef.current = setTimeout(async () => {
            try {
                const responseLVL = await fetch(API_URL + "/getfromtolvl", {
                    method: 'GET',
                    headers: {
                        frmid: dataSet.farmId,
                        from: xfrom,
                        to: xto,
                        xdxp: xdxp,
                    }
                });
                if (!responseLVL.ok) {
                    throw new Error(`Error : ${responseLVL.status}`);
                }
                const responseDataLVL = await responseLVL.json();
                if (reqId !== levelReqSeqRef.current) return;
                setUIField("fromtolvltime", responseDataLVL.time);
                setUIField("fromtolvlxp", responseDataLVL.xp);
            } catch {
                if (reqId !== levelReqSeqRef.current) return;
                setUIField("fromtolvltime", 0);
                setUIField("fromtolvlxp", 0);
            } finally {
                if (reqId === levelReqSeqRef.current) {
                    setIsLevelRangeLoading(false);
                }
            }
        }, 750);
    }
    if (farmData.inventory) {
        const { it, food, fish, bounty, pfood, crustacean } = dataSetFarm.itables;
        //const inventoryEntries = selectedQuantityCook === "farm" || "daily" || "dailymax" ? Object.entries(farmData.inventory) : Object.entries(farmData.inventory);
        const inventoryEntries = Object.entries(farmData.inventory);
        const foodNames = Object.keys(food);
        const pfoodNames = Object.keys(pfood);
        const cookNames = [...foodNames, ...pfoodNames];
        const Compo = [];
        Compo["total"] = [];
        const sortedCompo = [];
        const baseInventoryItems = cookNames.map(item => {
            const cobj = food[item] || pfood[item];
            const cobjCompo = flattenCompoit(cobj?.compoit);
            const quantityInventory = inventoryEntries.find(([entryItem]) => entryItem === item)?.[1] || 0;
            const quantity = Number((food[item] || pfood[item])?.instock ?? quantityInventory ?? 0);
            for (let compofood in cobjCompo) {
                const compo = compofood;
                const quant = cobjCompo[compofood];
                if (it[compo] || fish[compo] || bounty[compo] || pfood[compo]) {
                    Compo[item] = Compo[item] || [];
                    Compo["total"][compo] = 0;
                    Compo[item][compo] = Compo[item][compo] || 0;
                    Compo[item][compo] += Number(quant);
                }
            }
            return [item, quantity];
        });
        const sortedInventoryItems = (!cookSortBy || cookSortBy === "none")
            ? baseInventoryItems
            : [...baseInventoryItems].sort((a, b) => {
                const [itemA, qtyA] = a;
                const [itemB, qtyB] = b;
                const valueA = getCookSortValue(cookSortBy, itemA, qtyA, food, pfood, TryChecked, dataSet.options.coinsRatio);
                const valueB = getCookSortValue(cookSortBy, itemB, qtyB, food, pfood, TryChecked, dataSet.options.coinsRatio);
                const direction = cookSortDir === "desc" ? -1 : 1;
                if (typeof valueA === "string" || typeof valueB === "string") {
                    const cmp = String(valueA ?? "").localeCompare(String(valueB ?? ""));
                    return cmp * direction;
                }
                const aNum = Number.isFinite(Number(valueA)) ? Number(valueA) : -Infinity;
                const bNum = Number.isFinite(Number(valueB)) ? Number(valueB) : -Infinity;
                if (aNum === bNum) return itemA.localeCompare(itemB);
                return (aNum - bNum) * direction;
            });
        const selectedCookCategories = new Set(cookCategories || ["base", "honey", "cheese", "fish", "cake"]);
        const cheeseRegex = /(cheese|cheddar|chedder|curd)/i;
        const honeyRegex = /honey/i;
        const filteredInventoryItems = sortedInventoryItems.filter(([item]) => {
            if (selectedCookCategories.size === 0) return false;
            const cobj = food[item] || pfood[item];
            const rawCompo = cobj?.compoit || {};
            const directKeys = Object.keys(rawCompo || {});
            const hasHoney = directKeys.some((name) => honeyRegex.test(String(name)));
            const hasCheese = String(item) === "Cheese" || hasIngredientMatching(rawCompo, (name) => cheeseRegex.test(String(name)));
            const hasFish = hasIngredientFromTable(rawCompo, fish) || hasIngredientFromTable(rawCompo, pfood);
            const isCake = String(item).toLowerCase().includes("cake");
            const isBase = !hasHoney && !hasCheese && !hasFish && !isCake;
            return (
                (selectedCookCategories.has("base") && isBase) ||
                (selectedCookCategories.has("honey") && hasHoney) ||
                (selectedCookCategories.has("cheese") && hasCheese) ||
                (selectedCookCategories.has("fish") && hasFish) ||
                (selectedCookCategories.has("cake") && isCake)
            );
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
        Object.keys(pfood).forEach(item => {
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
        const inventoryItems = filteredInventoryItems.map(([item, quantity], index) => {
            const cobj = food[item] || pfood[item];
            const cobjCompo = flattenCompoit(cobj?.compoit);
            const ico = cobj ? cobj.img : '';
            const ibld = cobj ? (cobj.bld || "Fish Market") : '';
            var time = cobj ? !TryChecked ? cobj.time : cobj.timetry : '';
            const timenbr = convtimenbr(time);
            var timecomp = cobj ? (!TryChecked ? cobj.timecrp : cobj.timecrptry) || '' : '';
            //if (timecomp === '') {console.log (item + ": error timecomp" )}
            const timecrpnbr = convtimenbr(timecomp);
            const icookit = Number(cobj?.cookit) || 0;
            const iquantd = Math.ceil(farmTime / timenbr) !== Infinity ? Math.ceil(farmTime / timenbr) : 0;
            let prodValues = [];
            for (let compofood in cobjCompo) {
                const compo = compofood;
                const quant = cobjCompo[compofood];
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
            const cookitValue = Number(cobj?.cookit) || 0;
            const xpBase = Number(cobj ? (!TryChecked ? cobj.xp : cobj.xptry) : 0) || 0;
            const ixp = selectedQuantCook === "unit" ? xpBase : xpBase * iQuant;
            const ixph = Number(cobj ? (!TryChecked ? cobj.xph : cobj.xphtry) : 0) || 0;
            const xpsflBase = Number(cobj ? (!TryChecked ? cobj.xpsfl : cobj.xpsfltry) : 0) || 0;
            const ixpsfl = xpsflBase * dataSet.options.coinsRatio;
            totXP += (selectedQuantityCook === "daily" || selectedQuantityCook === "dailymax" ? isNaN(ixp) ? 0 : Number(ixp) * cookitValue : isNaN(ixp) ? 0 : Number(ixp));
            if (cookitValue === 1) {
                if (!BldTime[ibld]) { BldTime[ibld] = 0 }
                BldTime[ibld] += xquantd * timenbr;
            }
            const ixphcomp = cobj ? timecrpnbr > 0 ? parseFloat(ixp / (timecrpnbr * 24)).toFixed(1) : 0 : 0;
            var icost = cobj ? selectedQuantCook === "unit" ? ((!TryChecked ? cobj.cost : cobj.costtry) / dataSet.options.coinsRatio) : ((!TryChecked ? cobj.cost : cobj.costtry) / dataSet.options.coinsRatio) * iQuant : 0;
            const getMarketUnitWithFallback = (name) => {
                const src = it[name] || fish[name] || bounty[name] || crustacean[name] || pfood[name] || food[name];
                if (!src) { return 0; }
                const market = Number(!TryChecked ? (src.costp2pt || 0) : (src.costp2pttry || 0));
                const prod = (Number(!TryChecked ? src.cost : src.costtry) || 0) / dataSet.options.coinsRatio;
                return market > 0 ? market : prod;
            };
            const traderUnitFromCompo = cobjCompo
                ? Object.entries(cobjCompo).reduce((sum, [name, quant]) => sum + (Number(quant || 0) * getMarketUnitWithFallback(name)), 0)
                : 0;
            const traderUnit = traderUnitFromCompo > 0
                ? traderUnitFromCompo
                : (cobj ? ((Number(!TryChecked ? (cobj.costp2pt || 0) : (cobj.costp2pttry ?? cobj.costp2pt ?? 0)) > 0
                    ? Number(!TryChecked ? (cobj.costp2pt || 0) : (cobj.costp2pttry ?? cobj.costp2pt ?? 0))
                    : (Number(!TryChecked ? cobj.cost : cobj.costtry) || 0) / dataSet.options.coinsRatio)) : 0);
            var icostp2p = cobj ? selectedQuantCook === "unit" ?
                selectedCostCook === "shop" ? (cobj.costshop / dataSet.options.coinsRatio) : selectedCostCook === "trader" ? traderUnit : selectedCostCook === "nifty" ? cobj.costp2pn : selectedCostCook === "opensea" ? cobj.costp2po : 0
                : selectedCostCook === "shop" ? (cobj.costshop / dataSet.options.coinsRatio) * iQuant : selectedCostCook === "trader" ? traderUnit * iQuant : selectedCostCook === "nifty" ? cobj.costp2pn * iQuant : selectedCostCook === "opensea" ? cobj.costp2po * iQuant : 0 : 0;
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
            if (((selectedQuantityCook === "daily" || selectedQuantityCook === "dailymax") && cookitValue === 1) || selectedQuantityCook === "farm") {
                totCost += icost;
                totCostp2p += icostp2p;
                for (let compofood in cobjCompo) {
                    const compo = compofood;
                    const quant = cobjCompo[compofood];
                    if (it[compo] || fish[compo] || bounty[compo] || pfood[compo]) { Compo["total"][compo] += quant * (selectedQuantCook === "unit" ? 1 : iQuant) }
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
                    {xListeColCook[3][1] === 1 ? <td className="tdcenter tooltipcell"
                        onClick={(e) => handleTooltip(item, "trynft", "xp", e)}>{parseFloat(ixp).toFixed(1)}</td> : null}
                    {xListeColCook[4][1] === 1 ? <td className="tdcenter">{timeToDays(time)}</td> : null}
                    {xListeColCook[5][1] === 1 ? <td className="tdcenter">{timecomp}</td> : null}
                    {xListeColCook[6][1] === 1 ? <td className="tdcenter" style={CellXPHStyle}>{ixph}</td> : null}
                    {xListeColCook[7][1] === 1 ? <td className="tdcenter">{ixphcomp}</td> : null}
                    {xListeColCook[8][1] === 1 ? <td className="tdcenter" style={CellXPSflStyle}>{frmtNb(ixpsfl)}</td> : null}
                    {xListeColCook[9][1] === 1 ? <td className="tdcenter tooltipcell"
                        onClick={(e) => handleTooltip(item, "cookcost", selectedQuantCook !== "unit" ? iQuant : 1, e)}>{frmtNb(icost)}</td> : null}
                    {xListeColCook[10][1] === 1 ? <td className="tdcenter tooltipcell"
                        onClick={(e) => handleTooltip(item, "cookcost", selectedQuantCook !== "unit" ? iQuant : 1, e)}>{frmtNb(icostp2p)}</td> : null}
                    {xListeColCook[11][1] === 1 ? Object.values(sortedCompo).map((itemName, itIndex) => (
                        <td className="tdcenterbrd" style={{ fontSize: '12px' }} key={itemName}>
                            {cobjCompo[itemName] ? cobjCompo[itemName] * (selectedQuantCook === "unit" ? 1 : iQuant) : ""}
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
                max={maxLvl - 1}
                step={10}
                name="inputFromLvl"
                value={inputFromLvl}
                onChange={handleUIChange}
                style={{ width: "40px", marginLeft: "auto" }}
                maxLength={3}
            />
            : "";
        const xinputToLvl = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm" ?
            <input
                type="number"
                min={0}
                max={maxLvl}
                step={10}
                name="inputToLvl"
                value={inputToLvl}
                onChange={handleUIChange}
                style={{ width: "40px", marginLeft: "auto" }}
                maxLength={3}
            />
            : "";
        const showLevelRange = selectedQuantCook !== "unit" && selectedQuantityCook !== "farm";
        const levelDays = Number(fromtolvltime);
        const levelXp = Number(fromtolvlxp);
        const levelDaysLabel = Number.isFinite(levelDays) ? `${levelDays.toFixed(1)} days` : "- days";
        const levelXpLabel = Number.isFinite(levelXp) ? `${frmtNb(levelXp)}xp` : "-xp";
        const levelRangeBadge = showLevelRange ? (
            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    margin: "0",
                    padding: "4px 8px",
                    border: "1px solid rgb(90, 90, 90)",
                    borderRadius: "6px",
                    background: "rgba(0, 0, 0, 0.28)",
                    width: "fit-content",
                    maxWidth: "340px",
                    fontSize: "12px",
                }}
            >
                <span>From</span>
                {xinputFromLvl}
                <span>to</span>
                {xinputToLvl}
                <span>{levelDaysLabel}, {levelXpLabel}</span>
                {isLevelRangeLoading ? <CircularProgress size={12} sx={{ color: "rgb(255, 205, 96)" }} /> : null}
            </div>
        ) : null;
        const bfdtolvl = !TryChecked ? bumpkinData[0].foodtolvl : bumpkinData[0].foodtolvltry;
        const bfdpstlvl = !TryChecked ? Math.ceil(bumpkinData[0].foodxppastlvl) : Math.ceil(bumpkinData[0].foodxppastlvltry);
        const bxptonxtlvl = !TryChecked ? Math.ceil(bumpkinData[0].xptonextlvl) : Math.ceil(bumpkinData[0].xptonextlvltry);
        const stockProgressBadge = selectedQuantityCook === "farm" ? (
            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    margin: "0",
                    padding: "4px 8px",
                    border: "1px solid rgb(90, 90, 90)",
                    borderRadius: "6px",
                    background: "rgba(0, 0, 0, 0.28)",
                    width: "fit-content",
                    maxWidth: "340px",
                }}
            >
                <span style={{ fontSize: "12px", whiteSpace: "nowrap" }}>Stock XP to lvl{bfdtolvl} {"("}not counting Keep quantity{")"}</span>
                {PBar(bfdpstlvl, 0, bxptonxtlvl, 0, 110)}
            </div>
        ) : null;
        const hasCookStickyBar = Boolean(levelRangeBadge || stockProgressBadge);
        const stickyCookBadgeBar = hasCookStickyBar ? (
            <div
                ref={stickyBarRef}
                style={{
                    position: "sticky",
                    top: "0px",
                    zIndex: 7,
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    flexWrap: "wrap",
                    padding: "2px 0 4px 0",
                    background: "rgb(18, 8, 2)",
                }}
            >
                {levelRangeBadge}
                {stockProgressBadge}
            </div>
        ) : null;

        xdxp = totXP;
        //const icolspan = xListeColCook[0][1] === 1 ? 3 : 2;
        const tableContent = (
            <>
                {stickyCookBadgeBar}
                <table
                    className="table cook-table"
                    style={{
                        "--cook-head-top": `${cookHeaderStickyTop}px`,
                        "--cook-head-row-h": `${cookHeaderRowHeight}px`,
                    }}
                >
                    <thead>
                        <tr ref={cookHeaderRowRef}>
                            {xListeColCook[0][1] === 1 ? <th className="thcenter" >Building</th> : null}
                            <th className="th-icon">   </th>
                            {xListeColCook[1][1] === 1 ? <th className="thcenter" >Food</th> : null}
                            {selectedQuantityCook === "daily" || selectedQuantityCook === "dailymax" ? <th className="thcenter" >Cook</th> : null}
                            {xListeColCook[2][1] === 1 ? <th className="thcenter" >
                                <DList
                                    name="selectedQuantityCook"
                                    title="Quantity"
                                    options={[
                                        { value: "farm", label: "Farm" },
                                        { value: "dailymax", label: "Daily" },
                                    ]}
                                    value={selectedQuantityCook}
                                    onChange={handleUIChange}
                                    height={20}
                                />
                            </th> : null}
                            {xListeColCook[3][1] === 1 ? <th className="thcenter"  >
                                <DList
                                    name="selectedQuantCook"
                                    title="XP"
                                    options={[
                                        { value: "unit", label: "/ Unit" },
                                        { value: "quant", label: "x Quantity" },
                                    ]}
                                    value={selectedQuantCook}
                                    onChange={handleUIChange}
                                    height={20}
                                />
                            </th> : null}
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
                                <th className="thcenter" key={itemName}><i><img src={(it[itemName] ? it[itemName].img : fish[itemName] ? fish[itemName].img : bounty[itemName] ? bounty[itemName].img : pfood[itemName] ? pfood[itemName].img : imgna)} alt={itemName} className="itico" /></i></th>
                            )) : null}
                        </tr>
                        {(selectedQuantCook !== "unit" || selectedQuantityCook !== "farm") ?
                            <tr key="total">
                                {xListeColCook[0][1] === 1 ? <td className="tdcenter">Total</td> : null}
                                <td></td>
                                {xListeColCook[1][1] === 1 ? <td></td> : null}
                                {selectedQuantityCook !== "farm" ? <td className="tdcenter"></td> : null}
                                {/* {xListeColCook[1][1] === 1 && selectedQuantityCook === "farm" ? <td className="tditem"></td> : null} */}
                                {xListeColCook[2][1] === 1 ? (
                                    <td className="tdcenter">
                                        {selectedQuantityCook === "farm" ? (
                                            <span title="Keep for deliveries">{xinputKeept}{xinputKeep}</span>
                                        ) : null}
                                    </td>
                                ) : null}
                                {xListeColCook[3][1] === 1 ? <td className="tdcenter">{selectedQuantCook !== "unit" ? parseFloat(totXP).toFixed(1) : ""}</td> : null}
                                {xListeColCook[4][1] === 1 ? <td className="tdcenter" style={{ color: timeOver && selectedQuantityCook !== "farm" ? "rgb(255, 0, 0)" : "rgb(255, 255, 255)" }}>
                                    {selectedQuantityCook !== "farm" ? totTime : ""}</td> : null}
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
function hasIngredientFromTable(tree, table) {
    if (!tree || typeof tree !== "object" || !table) return false;
    return Object.entries(tree).some(([name, rawNode]) => {
        if (table[name]) return true;
        if (rawNode && typeof rawNode === "object" && rawNode.compoit && typeof rawNode.compoit === "object") {
            return hasIngredientFromTable(rawNode.compoit, table);
        }
        return false;
    });
}
function hasIngredientMatching(tree, matcher) {
    if (!tree || typeof tree !== "object" || typeof matcher !== "function") return false;
    return Object.entries(tree).some(([name, rawNode]) => {
        if (matcher(name)) return true;
        if (rawNode && typeof rawNode === "object" && rawNode.compoit && typeof rawNode.compoit === "object") {
            return hasIngredientMatching(rawNode.compoit, matcher);
        }
        return false;
    });
}
function getCookSortValue(sortBy, item, quantity, food, pfood, tryChecked, coinsRatio) {
    const cobj = food[item] || pfood[item] || {};
    const unitCost = ((Number(tryChecked ? cobj.costtry : cobj.cost) || 0) / (coinsRatio || 1));
    const unitXpSfl = (Number(tryChecked ? cobj.xpsfltry : cobj.xpsfl) || 0) * (coinsRatio || 1);
    switch (sortBy) {
        case "building":
            return String(cobj.bld || "Fish Market");
        case "item":
            return String(item || "");
        case "quantity":
            return Number(quantity || 0);
        case "xp":
            return Number(tryChecked ? cobj.xptry : cobj.xp) || 0;
        case "time":
            return convtimenbr(tryChecked ? cobj.timetry : cobj.time);
        case "xph":
            return Number(tryChecked ? cobj.xphtry : cobj.xph) || 0;
        case "xpsfl":
            return Number(unitXpSfl) || 0;
        case "cost":
            return Number(unitCost) || 0;
        case "market":
            return Number(tryChecked ? (cobj.costp2pttry ?? cobj.costp2pt) : cobj.costp2pt) || 0;
        case "components":
            return Object.keys(flattenCompoit(cobj?.compoit) || {}).length;
        default:
            return 0;
    }
}
