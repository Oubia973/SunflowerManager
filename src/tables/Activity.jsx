// src/sets/SetActivity.jsx
import React, { useEffect, useState } from "react";
import { useAppCtx } from "../context/AppCtx";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { frmtNb } from '../fct.js';

export default function ActivityTable() {
    const {
        data: { dataSetFarm },
        ui: {
            selectedInv,
            selectedFromActivity,
            selectedFromActivityDay,
            activityDisplay,
        },
        config: { API_URL },
    } = useAppCtx();
    const { ui } = useAppCtx();

    const [activityData, setActivityData] = useState(null);
    const [loading, setLoading] = useState(false);
    const farmId = dataSetFarm?.frmid;

    useEffect(() => {
        let cancelled = false;

        async function run() {
            if (selectedInv !== "activity") return;
            setLoading(true);
            try {
                const result = await getActivity();
                if (!cancelled) setActivityData(result);
            } catch (e) {
                console.log(e);
                if (!cancelled) setActivityData(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [
        selectedInv,
        selectedFromActivity,
        selectedFromActivityDay,
        activityDisplay,
    ]);

    if (selectedInv !== "activity") return null;

    if (loading) return <div>Loading activity…</div>;

    if (!activityData) return null;

    if (activityDisplay === "day") {
        return setActivityDay(activityData, dataSetFarm, ui);
    }

    if (activityDisplay === "item") {
        return setActivityItem(activityData, dataSetFarm, ui);
    }

    if (activityDisplay === "quest") {
        return setActivityQuest(activityData, dataSetFarm, ui);
    }

    return null;

    async function getActivity() {
        if (!farmId) return null;

        const xContextTime =
            activityDisplay === "day"
                ? selectedFromActivityDay
                : activityDisplay === "item"
                    ? selectedFromActivity
                    : activityDisplay === "quest"
                        ? "season"
                        : "today";

        const response = await fetch(API_URL + "/getactivity", {
            method: "GET",
            headers: {
                frmid: farmId,
                time: xContextTime,
            },
        });

        if (!response.ok) {
            console.log("Error :", response.status);
            return null;
        }

        return await response.json();
    }

}
function setActivityDay(activityData, dataSetFarm, ui) {
    //const { it, fish, flower, nft, nftw, ftrades } = dataSetFarm;
    const {
        data: { dataSet },
        actions: {
            handleUIChange,
        },
        img: {
            imgxp,
        }
    } = useAppCtx();
    const {
        useNotif,
        inputValue,
        inputMaxBB,
        inputFarmTime,
        inputCoinsRatio,
        inputFromLvl,
        inputToLvl,
        inputKeep,
        fromtolvltime,
        fromtolvlxp,
        dailyxp,
        cstPrices,
        customSeedCM,
        customQuantFetch,
        toCM,
        fromexpand,
        toexpand,
        fromtoexpand,
        selectedCurr,
        selectedQuant,
        selectedQuantCook,
        selectedQuantFish,
        selectedCostCook,
        selectedQuantity,
        selectedQuantityCook,
        selectedAnimalLvl,
        selectedReady,
        selectedDsfl,
        selectedFromActivity,
        selectedFromActivityDay,
        selectedExpandType,
        selectedSeedsCM,
        selectedQuantFetch,
        activityDisplay,
        selectedInv,
        selectedDigCur,
        selectedSeason,
        GraphType,
        petView,
        xListeCol,
        xListeColCook,
        xListeColFish,
        xListeColFlower,
        xListeColBounty,
        xListeColAnimals,
        xListeColExpand,
        xListeColActivity,
        xListeColActivityItem,
        xListeColActivityQuest,
        CostChecked,
        TryChecked,
        BurnChecked,
        Refresh,
    } = ui;
    if (activityData[0]) {
        const dateSeasonConst = dataSetFarm.constants.dateSeason;
        const actKeys = Object.keys(activityData);
        var totXP = 0;
        var tottktdchest = 0;
        //var tottktcrop = 0;
        var tottktbert = 0;
        //var tottktwactv = 0;
        //var tottkttntcl = 0;
        var totdeliveriestkt = 0;
        var totchorestkt = 0;
        var totmaxtkt = 0;
        var totdeliveriescost = 0;
        var totdeliveriescostp2pt = 0;
        var totdeliveriessfl = 0;
        var totdeliveriescoins = 0;
        const ximgxp = <i><img src={imgxp} alt='' className="resico" title="XP" style={{ width: `20px`, height: `20px` }} /></i>;
        const ximgtkt = <i><img src={dataSet.imgtkt} alt='' className="itico" title="Tickets" /></i>;
        //const ximgcoins = <i><img src={imgcoins} alt='' className="itico" title="Coins" /></i>;
        const ximgdchest = <i><img src="./icon/ui/synced.gif" alt='' className="itico" title="Tickets from daily chest" style={{ width: `20px`, height: `20px` }} /></i>;
        //const ximgcrop = <i><img src={imgcrop} alt='' className="resico" title="Tickets from crops" style={{ width: `20px`, height: `20px` }} /></i>;
        const ximgbert = <i><img src="./icon/pnj/bert.png" alt='' className="itico" title="Tickets from Bert obsession" /></i>;
        //const ximgwactv = <i><img src={it["Flower"].img} alt='' className="itico" title="Tickets from Weekly activity" /></i>;
        //const ximgtntcl = <i><img src="./icon/fish/tentacle.png" alt='' className="itico" title="Tickets from tentacles" /></i>;
        const imgdeliv = <i><img src="./icon/ui/delivery_board.png" alt='' className="resico" title="Deliveries" /></i>;
        const imgchore = <i><img src="./icon/ui/expression_chat.png" alt='' className="resico" title="Chores" style={{ width: `20px`, height: `20px` }} /></i>;
        //const imgmaxtkt = <i><img src={dataSet.imgtkt} alt='' className="resico" title="Tickets max by day" /></i>;
        let i = 0;
        const dateSeason = new Date(dateSeasonConst);
        const sfs = new Date() - dateSeason;
        const dfs = Math.floor(sfs / (1000 * 60 * 60 * 24));
        const tableContent = actKeys.map(([element]) => {
            const idData = i;
            i++;
            const endDate = new Date(activityData[idData].date);
            //const isSeasonDay = endDate >= dateSeason;
            const isSeasonDay = endDate.setHours(0, 0, 0, 0) >= dateSeason.setHours(0, 0, 0, 0);
            //const curw = ((endDate.getDate()) / 8);
            //const isweeklyactday = Number.isInteger(curw) || (endDate.getDate() === dateSeason.getDate() && endDate.getMonth() === dateSeason.getMonth());
            //const curD = endDate.getDay() === resetDay;
            //const wactdone = isweeklyactday && wklactivity[Math.floor(curw) + 1];
            if (isSeasonDay) {
                const ActTot = setActivityTot(activityData[idData], "day", dataSetFarm, dataSet);
                //const allSortedItems = ActTot.allSortedItems;
                //const compoHarvested = ActTot.compoHarvested;
                //const compoHarvestn = ActTot.compoHarvestn;
                //const compoBurn = ActTot.compoBurn;
                const tot = ActTot.tot;
                //const cobj = activityData[idData].data;
                const sday = String(endDate.getDate()).padStart(2, '0');
                const smonth = String(endDate.getMonth() + 1).padStart(2, '0');
                const syear = String(endDate.getFullYear()).slice(-2);
                const sxdate = `${smonth}/${sday}/${syear}`;
                const idate = sxdate
                const itotxp = tot.XP;
                const itktdchest = tot.tktchest;
                //const itktcrop = tot.tktcrop;
                const itktbert = tot.tktbert;
                //const itktwactv = isweeklyactday ? wactdone ? tktWeekly : 0 : 0;
                //const itktbertMax = tot.tktbertMax;
                //const itkttntcl = cobj.tickettentacle ? cobj.tickettentacle : 0; //compoHarvested["Kraken Tenacle"] * 12;
                //const itkttntcl = 0; //compoHarvested["Kraken Tentacle"] ? compoHarvested["Kraken Tentacle"] * 12 : 0;
                const ideliveriestkt = tot.deliveriestkt;
                const ichorestkt = tot.chorestkt;
                const itktmax = tot.tktMax;
                const ideliveriescost = tot.deliveriescost;
                const ideliveriescostp2pt = tot.deliveriescostp2pt;
                const itktcost = tot.tktCost;
                const ideliveriessfl = tot.deliveriessfl;
                const ideliveriescoins = tot.deliveriescoins;
                const ichoresdelivtkt = Number(ideliveriestkt) + Number(ichorestkt) + Number(itktdchest) + Number(itktbert); //+ Number(itktwactv);
                totXP += itotxp;
                tottktdchest += itktdchest;
                //tottktcrop += itktcrop;
                tottktbert += itktbert;
                //tottktwactv += itktwactv;
                //tottkttntcl += Number(itkttntcl);
                totdeliveriestkt += ideliveriestkt;
                totchorestkt += ichorestkt;
                totdeliveriescost += ideliveriescost;
                totdeliveriescostp2pt += ideliveriescostp2pt;
                totdeliveriessfl += ideliveriessfl;
                totdeliveriescoins += ideliveriescoins;
                totmaxtkt += itktmax;
                return (
                    <tr>
                        {xListeColActivity[0][1] === 1 ? <td className="tdcenter" id="iccolumn">{idate}</td> : null}
                        {xListeColActivity[1][1] === 1 ? <td className="tdcenter">{parseFloat(itotxp).toFixed(1)}</td> : null}
                        {xListeColActivity[2][1] === 1 ? <td className="tdcenter">{itktdchest > 0 ? itktdchest : ""}</td> : null}
                        {/* {xListeColActivity[3][1] === 1 ? <td className="tdcenter">{itktcrop > 0 ? itktcrop : ""}</td> : null} */}
                        {/* {xListeColActivity[4][1] === 1 ? <td className="tdcenter">{itktbert > 0 ? itktbert : ""}</td> : null} */}
                        {/* {xListeColActivity[5][1] === 1 ? <td className="tdcenter">{itktwactv > 0 ? itktwactv : ""}</td> : null} */}
                        {xListeColActivity[6][1] === 1 ? <td className="tdcenter">{ideliveriestkt > 0 ? ideliveriestkt : ""}</td> : null}
                        {xListeColActivity[7][1] === 1 ? <td className="tdcenter">{ichorestkt > 0 ? ichorestkt : ""}</td> : null}
                        {xListeColActivity[8][1] === 1 ? <td className="tdcenter">{ichoresdelivtkt}/{itktmax}</td> : null}
                        {xListeColActivity[9][1] === 1 ? <td className="tdcenter">{ideliveriescost > 0 ? frmtNb(ideliveriescost) : ""}</td> : null}
                        {xListeColActivity[10][1] === 1 ? <td className="tdcenter">{ideliveriescostp2pt > 0 ? frmtNb(ideliveriescostp2pt) : ""}</td> : null}
                        {xListeColActivity[11][1] === 1 ? <td className="tdcenter">{itktcost > 0 ? frmtNb(itktcost) : ""}</td> : null}
                        {xListeColActivity[12][1] === 1 ? <td className="tdcenter">{ideliveriessfl > 0 ? frmtNb(ideliveriessfl) : ""}</td> : null}
                        {xListeColActivity[12][1] === 1 ? <td className="tdcenter">{ideliveriescoins > 0 ? frmtNb(ideliveriescoins) : ""}</td> : null}
                    </tr>
                );
            }

        });
        const tableHeader = (
            <thead>
                <tr>
                    {xListeColActivity[0][1] === 1 ? <th className="th-icon">
                        <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                            <InputLabel>From</InputLabel>
                            <Select name={"selectedFromActivityDay"} value={selectedFromActivityDay} onChange={handleUIChange}>
                                <MenuItem value="7">7 days</MenuItem>
                                <MenuItem value="31">1 month</MenuItem>
                                <MenuItem value="season">season</MenuItem>
                            </Select></FormControl></div></th> : null}
                    {xListeColActivity[1][1] === 1 ? <th className="thcenter">{ximgxp}</th> : null}
                    {xListeColActivity[2][1] === 1 ? <th className="thcenter">{ximgdchest}</th> : null}
                    {/* {xListeColActivity[3][1] === 1 ? <th className="thcenter">{ximgcrop}</th> : null} */}
                    {/* {xListeColActivity[4][1] === 1 ? <th className="thcenter">{ximgbert}</th> : null} */}
                    {/* {xListeColActivity[5][1] === 1 ? <th className="thcenter">{ximgwactv}</th> : null} */}
                    {xListeColActivity[6][1] === 1 ? <th className="thcenter">{imgdeliv}</th> : null}
                    {xListeColActivity[7][1] === 1 ? <th className="thcenter">{imgchore}</th> : null}
                    {xListeColActivity[8][1] === 1 ? <th className="thcenter">Max{ximgtkt}</th> : null}
                    {xListeColActivity[9][1] === 1 ? <th className="thcenter">Cost{imgdeliv}</th> : null}
                    {xListeColActivity[10][1] === 1 ? <th className="thcenter">CostP2P{imgdeliv}</th> : null}
                    {xListeColActivity[11][1] === 1 ? <th className="thcenter">Cost{ximgtkt}</th> : null}
                    {xListeColActivity[12][1] === 1 ? <th className="thcenter">SFL{imgdeliv}</th> : null}
                    {xListeColActivity[12][1] === 1 ? <th className="thcenter">Coins{imgdeliv}</th> : null}
                </tr>
                <tr>
                    {xListeColActivity[0][1] === 1 ? <td className="tdcenter">TOTAL</td> : null}
                    {xListeColActivity[1][1] === 1 ? <td className="tdcenter">{parseFloat(totXP).toFixed(1)}</td> : null}
                    {xListeColActivity[2][1] === 1 ? <td className="tdcenter">{tottktdchest}</td> : null}
                    {/* {xListeColActivity[3][1] === 1 ? <td className="tdcenter">{tottktcrop}</td> : null} */}
                    {/* {xListeColActivity[4][1] === 1 ? <td className="tdcenter">{tottktbert}</td> : null} */}
                    {/* {xListeColActivity[5][1] === 1 ? <td className="tdcenter">{tottktwactv}</td> : null} */}
                    {xListeColActivity[6][1] === 1 ? <td className="tdcenter">{totdeliveriestkt}</td> : null}
                    {xListeColActivity[7][1] === 1 ? <td className="tdcenter">{totchorestkt}</td> : null}
                    {xListeColActivity[8][1] === 1 ? <td className="tdcenter">{totdeliveriestkt + totchorestkt + tottktdchest + tottktbert}/{totmaxtkt}</td> : null}
                    {xListeColActivity[9][1] === 1 ? <td className="tdcenter">{frmtNb(totdeliveriescost)}</td> : null}
                    {xListeColActivity[10][1] === 1 ? <td className="tdcenter">{frmtNb(totdeliveriescostp2pt)}</td> : null}
                    {xListeColActivity[11][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColActivity[12][1] === 1 ? <td className="tdcenter">{frmtNb(totdeliveriessfl)}</td> : null}
                    {xListeColActivity[12][1] === 1 ? <td className="tdcenter">{frmtNb(totdeliveriescoins)}</td> : null}
                </tr>
            </thead>
        );
        const table = (
            <>
                <table className="table">
                    {tableHeader}
                    <tbody>
                        {tableContent.reverse()}
                    </tbody>
                </table>
            </>
        );
        return (table);
    }
}
function setActivityItem(activityData, dataSetFarm, ui) {
    const {
        data: { dataSet },
        actions: {
            handleUIChange,
            setCstPrices,
            setSelectedInv,
            setPetView,
            setInputValue,
            setInputMaxBB,
            setInputFarmTime,
            setInputCoinsRatio,
            setInputFromLvl,
            setInputToLvl,
            setInputKeep,
            setSelectedQuantFetch,
            setcustomQuantFetch,
            setfromexpand,
            settoexpand,
            setfromtoexpand,
            setuseNotif,
            handleTooltip,
            handleChangeQuant,
            handleChangeQuantCook,
            handleChangeQuantFish,
            handleChangeFromActivity,
            handleChangeFromActivityDay,
            handleChangeActivityDisplay,
            handleChangepetView,
            handleChangeExpandType,
            handleChangeQuantity,
            handleChangeQuantityCook,
            handleChangeAnimalLvl,
            handleChangeSeason,
            handleChangeReady,
            handleChangeDsfl,
            handleChangeDigCur,
            handleChangeSeedsCM,
            handleChangeQuantFetch,
            handleChangeCurr,
            handleInputKeepChange,
            handleInputcstPricesChange,
            handleInputcustomSeedCMChange,
            handleInputcustomQuantFetchChange,
            handleInputtoCMChange,
            handleFromLvlChange,
            handleToLvlChange,
            handleCostCheckedChange,
            handleTryCheckedChange,
            handleBurnCheckedChange,
            handleFarmitChange,
            handleCookitChange,
            handleIncrement,
            handleDecrement,
            handleFromExpandChange,
            handleToExpandChange,
            handleSetHrvMax,
            handleTraderClick
        },
        img: {
            imgsfl,
            imgSFL,
            imgcoins,
            imgCoins,
            imgxp,
            imgrdy,
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
            imgpet,
            imgexchng,
            imgExchng,
            imgbuyit,
            imgna,
            imgrod,
        }
    } = useAppCtx();
    const {
        useNotif,
        inputValue,
        inputMaxBB,
        inputFarmTime,
        inputCoinsRatio,
        inputFromLvl,
        inputToLvl,
        inputKeep,
        fromtolvltime,
        fromtolvlxp,
        dailyxp,
        cstPrices,
        customSeedCM,
        customQuantFetch,
        toCM,
        fromexpand,
        toexpand,
        fromtoexpand,
        selectedCurr,
        selectedQuant,
        selectedQuantCook,
        selectedQuantFish,
        selectedCostCook,
        selectedQuantity,
        selectedQuantityCook,
        selectedAnimalLvl,
        selectedReady,
        selectedDsfl,
        selectedFromActivity,
        selectedFromActivityDay,
        selectedExpandType,
        selectedSeedsCM,
        selectedQuantFetch,
        activityDisplay,
        selectedInv,
        selectedDigCur,
        selectedSeason,
        GraphType,
        petView,
        xListeCol,
        xListeColCook,
        xListeColFish,
        xListeColFlower,
        xListeColBounty,
        xListeColAnimals,
        xListeColExpand,
        xListeColActivity,
        xListeColActivityItem,
        xListeColActivityQuest,
        CostChecked,
        TryChecked,
        BurnChecked,
        Refresh,
    } = ui;
    if (activityData[0]) {
        const { it, food, fish, flower } = dataSetFarm.itables;
        const { nft, nftw } = dataSetFarm.boostables;
        const ActTot = setActivityTot(activityData, "items", dataSetFarm, dataSet);
        const allSortedItems = ActTot.allSortedItems;
        const compoHarvested = ActTot.compoHarvested;
        const compoHarvestn = ActTot.compoHarvestn;
        const compoTraded = ActTot.compoTraded;
        const compoTradedSfl = ActTot.compoTradedSfl;
        const compoBurn = ActTot.compoBurn;
        const foodBuild = ActTot.foodBuild;
        const delivBurn = ActTot.delivBurn;
        const tot = ActTot.tot;
        var totCost = 0;
        var totCostt = 0;
        var totCostn = 0;
        var totCosto = 0;
        var totTradedSfl = tot.totTradedSfl - (tot.totTradedSfl * 0.1);
        const tableContent = allSortedItems.map(([element]) => {
            if (compoHarvested[element] > 0 || compoBurn[element] > 0 || compoTraded[element] > 0) {
                const cobj = it[element] || fish[element] || flower[element] || nft[element] || nftw[element] || null;
                const ico = cobj ? cobj.img : element === "SFL" ? imgsfl : element === "TKT" ? dataSet.imgtkt : element === "COINS" ? imgcoins : imgxp;
                const iburn = element === "SFL" ? '' : compoBurn[element] || '';
                var iquant = compoHarvested[element] ? compoHarvested[element] : '';
                var iquantmax = 0;
                if (element === "TKT") {
                    iquant = (tot.deliveriestkt + tot.chorestkt + tot.tktchest + tot.tktbert);
                    iquantmax = tot.tktMax;
                }
                const iquanttraded = compoTraded[element] ? compoTraded[element] : '';
                const iquanttradedsfl = compoTradedSfl[element] ? (compoTradedSfl[element] - (compoTradedSfl[element] * 0.1)) : '';
                const iquantb = element !== "TKT" ? parseFloat(iquant - (BurnChecked ? iburn : 0)).toFixed(1) : iquant;
                const iharvestn = element === "SFL" ? frmtNb(tot.balSfl) : compoHarvestn[element] || ''; //tot.balSfl
                const titlesfl = element === "SFL" ? "based on farm balance" : "";
                //const icostb = !iquant && cobj ? cobj.cost * iburn || 0 : element === "SFL" && iburn;
                //const icostb = cobj ? cobj.cost * iburn || 0 : element === "SFL" && iburn;
                const icost = cobj ? ((cobj.cost / dataSet.options.coinsRatio) * (iquant || iburn)) : (element === "SFL" && (iburn - iquant));
                const icostp2pt = cobj && iquant > 0 ? !isNaN(Number(cobj.costp2pt)) ? Number(cobj.costp2pt) * (iquant || 0) : '' : '';
                const icostp2pn = cobj && iquant > 0 ? !isNaN(Number(cobj.costp2pn)) ? Number(cobj.costp2pn) * (iquant || 0) : '' : '';
                const icostp2po = cobj && iquant > 0 ? !isNaN(Number(cobj.costp2po)) ? Number(cobj.costp2po) * (iquant || 0) : '' : '';
                const icostt = icost || 0;
                //const itoolscraft = cobj.toolscrafted;
                totCost += Number(icostt);
                totCostt += Number(icostp2pt);
                totCostn += Number(icostp2pn);
                totCosto += Number(icostp2po);
                return (
                    <tr>
                        <td className="tdcenter" id="iccolumn"><i><img src={ico} alt={''} className="itico" title={element} /></i></td>
                        {xListeColActivityItem[0][1] === 1 ? <td className="tditem">{element}</td> : null}
                        {xListeColActivityItem[1][1] === 1 ? <td className="tdcenter" title={titlesfl}>{iharvestn && iharvestn}</td> : null}
                        {xListeColActivityItem[2][1] === 1 ? <td className="tdcenter">{iquantb && iquantb}{iquantmax > 0 ? `/${iquantmax}` : ""}</td> : null}
                        {xListeColActivityItem[3][1] === 1 ? <td className="tdcenter">{iburn}</td> : null}
                        {xListeColActivityItem[4][1] === 1 ? <td className="tdcenter">{icostt && frmtNb(icostt)}</td> : null}
                        {xListeColActivityItem[5][1] === 1 ? <td className="tdcenter">{icostp2pt && frmtNb(icostp2pt)}</td> : null}
                        {/* {xListeColActivityItem[6][1] === 1 ? <td className="tdcenter">{icostp2pn && frmtNb(icostp2pn)}</td> : null}
                {xListeColActivityItem[7][1] === 1 ? <td className="tdcenter">{icostp2po && frmtNb(icostp2po)}</td> : null} */}
                        {xListeColActivityItem[8][1] === 1 ? <td className="tdcenterbrd">{iquanttraded && parseFloat(iquanttraded).toFixed(0)}</td> : null}
                        {xListeColActivityItem[8][1] === 1 ? <td className="tdcenterbrd">{iquanttradedsfl && parseFloat(iquanttradedsfl).toFixed(1)}</td> : null}
                        {xListeColActivityItem[9][1] === 1 ? <td className="tdcenterbrd">{delivBurn["total"][element]}</td> : null}
                        {xListeColActivityItem[9][1] === 1 ? Object.entries(foodBuild).map(([itemName]) => (
                            (food[itemName]) ? (<td className="tdcenterbrd">{!isNaN(foodBuild[itemName][element]) ? parseFloat(foodBuild[itemName][element]).toFixed(0) : ""}</td>) : null)) : null}
                    </tr>
                );
            }
        });
        const tableHeader = (
            <thead>
                <tr>
                    <th className="th-icon"></th>
                    {xListeColActivityItem[0][1] === 1 ? <th className="thcenter">Item</th> : null}
                    {xListeColActivityItem[1][1] === 1 ? <th className="thcenter">Hrvst</th> : null}
                    {xListeColActivityItem[2][1] === 1 ? <th className="thcenter">
                        <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                            <InputLabel>Quantity</InputLabel>
                            <Select name={"selectedFromActivity"} value={selectedFromActivity} onChange={handleUIChange}>
                                <MenuItem value="today">today</MenuItem>
                                <MenuItem value="1">24h</MenuItem>
                                <MenuItem value="7">7 days</MenuItem>
                                <MenuItem value="31">1 month</MenuItem>
                                <MenuItem value="season">season</MenuItem>
                            </Select></FormControl></div></th> : null}
                    {xListeColActivityItem[3][1] === 1 ? <th className="thcenter">
                        <div className="checktry"><input type="checkbox" id="CostColumnCheckbox" style={{ alignContent: `right` }} checked={BurnChecked} onChange={handleBurnCheckedChange} /></div>
                        Burn</th> : null}
                    {xListeColActivityItem[4][1] === 1 ? <th className="thcenter">Cost</th> : null}
                    {xListeColActivityItem[5][1] === 1 ? <th className="thcenter">Market</th> : null}
                    {/* {xListeColActivityItem[6][1] === 1 ? <th className="thcenter">Niftyswap</th> : null}
              {xListeColActivityItem[7][1] === 1 ? <th className="thcenter">OpenSea</th> : null} */}
                    {xListeColActivityItem[8][1] === 1 ? <th className="tdcenterbrd"><i><img src="./icon/ui/exchange.png" title="Traded" className="itico" /></i></th> : null}
                    {xListeColActivityItem[8][1] === 1 ? <th className="tdcenterbrd"><i><img src={imgsfl} title="SFL" className="itico" /></i></th> : null}
                    {xListeColActivityItem[9][1] === 1 ? <th className="tdcenterbrd"><i><img src="./icon/ui/delivery_board.png" title="Deliveries burn" className="itico" /></i></th> : null}
                    {xListeColActivityItem[9][1] === 1 ? Object.entries(foodBuild).map(([itemName]) => (
                        (food[itemName]) ? (<th className="tdcenterbrd" key={itemName}><i><img src={food[itemName].img} title={itemName} className="itico" /></i></th>) : null)) : null}
                </tr>
                <tr>
                    <td className="tdcenter">TOTAL</td>
                    {xListeColActivityItem[0][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColActivityItem[1][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColActivityItem[2][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColActivityItem[3][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColActivityItem[4][1] === 1 ? <td className="tdcenter">{frmtNb(totCost)}</td> : null}
                    {xListeColActivityItem[5][1] === 1 ? <td className="tdcenter">{frmtNb(totCostt)}</td> : null}
                    {/* {xListeColActivityItem[6][1] === 1 ? <td className="tdcenter">{frmtNb(totCostn)}</td> : null}
              {xListeColActivityItem[7][1] === 1 ? <td className="tdcenter">{frmtNb(totCosto)}</td> : null} */}
                    {xListeColActivityItem[8][1] === 1 ? <td className="tdcenterbrd"></td> : null}
                    {xListeColActivityItem[8][1] === 1 ? <td className="tdcenterbrd">{frmtNb(totTradedSfl)}</td> : null}
                    {xListeColActivityItem[9][1] === 1 ? <td className="tdcenterbrd"></td> : null}
                    {xListeColActivityItem[9][1] === 1 ? Object.entries(foodBuild).map(([itemName]) => (
                        (food[itemName]) ? (<td className="tdcenterbrd" key={itemName}>{foodBuild[itemName]["quant"]}</td>) : null)) : null}
                </tr>
            </thead>
        );
        const table = (
            <>
                <table className="table">
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
function setActivityQuest(activityData, dataSetFarm, ui) {
    const { selectedInv,
        selectedFromActivity,
        selectedFromActivityDay,
        activityDisplay,
        xListeColActivity,
        xListeColActivityItem,
        xListeColActivityQuest
    } = ui;
    if (activityData[0]) {
        //const { it, food, fish, flower, nft, nftw } = dataSetFarm;
        const tot = setActivityTotQuest(activityData);
        const Quest = tot.Quest;
        const questKeys = Object.keys(Quest);
        const dayKeys = Object.keys(activityData);
        const uniqueQuests = new Set();
        const completionsByDate = {};
        const dToday = formatDate(new Date());
        questKeys.forEach((element) => {
            const cobj = Quest[element];
            //const idate = new Date(cobj.date);
            //const qxdate = `${String(idate.getMonth() + 1).padStart(2, '0')}/${String(idate.getDate()).padStart(2, '0')}/${String(idate.getFullYear()).slice(-2)}`;
            const qxdate = formatDate(cobj.date);
            uniqueQuests.add(JSON.stringify({
                from: cobj.from,
                description: cobj.description,
                reward: Number(cobj.reward),
                istkt: cobj.istkt,
            }));
            if (!completionsByDate[qxdate]) {
                completionsByDate[qxdate] = {};
            }
            completionsByDate[qxdate][JSON.stringify({
                from: cobj.from,
                description: cobj.description,
                reward: Number(cobj.reward),
                istkt: cobj.istkt,
            })] = cobj.completed ? "X" : qxdate === dToday ? "." : "-";
        });
        const uniqueQuestsArray = Array.from(uniqueQuests).map(JSON.parse).sort((a, b) => {
            if (a.from === "hank" && b.from !== "hank") {
                return -1;
            } else if (a.from !== "hank" && b.from === "hank") {
                return 1;
            } else {
                return a.from.localeCompare(b.from);
            }
        });
        const tableContent = uniqueQuestsArray.reverse().map((uniqueQuest) => {
            const columns = dayKeys.map((date, index) => {
                //const qxdate = `${String(new Date(date).getMonth() + 1).padStart(2, '0')}/${String(new Date(date).getDate()).padStart(2, '0')}/${String(new Date(date).getFullYear()).slice(-2)}`;
                const qxdate = formatDate(activityData[index].date);
                return completionsByDate[qxdate] ? completionsByDate[qxdate][JSON.stringify(uniqueQuest)] || "" : "";
            });
            var xfrom = "";
            const ofrom = uniqueQuest.from;
            xfrom = "./icon/pnj/" + ofrom + ".png";
            if (ofrom === "pumpkin' pete") { xfrom = "./icon/pnj/pumpkinpete.png" }
            const ximgfrom = <img src={xfrom} alt="" title={ofrom} style={{ width: '20px', height: '20px' }} />;
            //const ximgrew = <img src={imgtkt} alt="" title={ofrom} style={{ width: '25px', height: '25px' }} />;
            return (
                <tr>
                    {xListeColActivityQuest[0][1] === 1 ? <td className="tdcenter" id="iccolumn">{ximgfrom}</td> : null}
                    {xListeColActivityQuest[1][1] === 1 ? <td className="tdcenter" id="iccolumn" style={{ fontSize: '11px' }} dangerouslySetInnerHTML={{ __html: uniqueQuest.description }}></td> : null}
                    {xListeColActivityQuest[2][1] === 1 ? <td className="tdcenter" style={{ fontSize: '11px' }}>{uniqueQuest.reward}</td> : null}
                    {xListeColActivityQuest[3][1] === 1 ? columns.map((value, index) => (
                        (value === "X") ? (<td className="tdcenterbrd" style={{ backgroundColor: 'rgba(0, 110, 0, 0.39)' }} title='completed'></td>) :
                            (value === "-") ? (<td className="tdcenterbrd" style={{ backgroundColor: 'rgba(110, 0, 0, 0.39)' }} title='skipped'></td>) :
                                (value === ".") ? (<td className="tdcenterbrd" style={{ backgroundColor: 'rgba(110, 110, 0, 0.39)' }} title='not done'></td>) :
                                    (<td className="tdcenterbrd"></td>))) : null}
                </tr>
            );
        });
        const tableHeader = (
            <thead>
                <tr>
                    {xListeColActivityQuest[0][1] === 1 ? <th className="th-icon">From</th> : null}
                    {xListeColActivityQuest[1][1] === 1 ? <th className="thcenter" style={{ fontSize: '14px' }}>Description</th> : null}
                    {xListeColActivityQuest[2][1] === 1 ? <th className="thcenter" style={{ fontSize: '14px' }}>Reward</th> : null}
                    {xListeColActivityQuest[3][1] === 1 ? Object.entries(dayKeys).map((date, index) => (
                        (<th className="tdcenterbrd" style={{ fontSize: '8px' }}>{formatDateAndSupYr(activityData[index].date)}</th>))) : null}
                </tr>
            </thead>
        );
        const table = (
            <>
                <table className="table">
                    {tableHeader}
                    <tbody>
                        {tableContent.reverse()}
                    </tbody>
                </table>
            </>
        );
        return (table);
    }
}
function setActivityTot(activityData, xContext, dataSetFarm, dataSet) {
    const { it, food, fish, flower } = dataSetFarm.itables;
    const { nft, nftw } = dataSetFarm.boostables;
    const dateSeasonConst = dataSetFarm.constants.dateSeason;
    let compoHarvested = [];
    compoHarvested["XP"] = 0;
    compoHarvested["TKT"] = 0;
    compoHarvested["SFL"] = 0;
    compoHarvested["COINS"] = 0;
    let compoHarvestn = [];
    let compoTraded = [];
    let compoTradedSfl = [];
    let compoBurn = [];
    compoBurn["SFL"] = 0;
    let foodBuild = [];
    let delivBurn = [];
    delivBurn["total"] = [];
    var tot = {
        XP: 0,
        tktchest: 0,
        tktcrop: 0,
        tktbert: 0,
        //tktwact: 0,
        tktbertMax: 0,
        deliveriestkt: 0,
        deliveriessfl: 0,
        deliveriescoins: 0,
        deliveriescost: 0,
        deliveriestktcost: 0,
        deliveriescostp2pt: 0,
        deliveriescostp2pn: 0,
        deliveriescostp2po: 0,
        chorestkt: 0,
        tktMax: 0,
        tktCost: 0,
        totTradedSfl: 0,
        balSfl: 0
    };
    //const dataEntries = Object.entries(activityData);
    const dataEntries = Object.keys(activityData);
    let i = 0;
    dataEntries.map((value, index) => {
        const DataContext = xContext === "items" ? activityData[index] : activityData;
        //const endDate = new Date(DataContext.date).toISOString();
        const endDate = new Date(DataContext.date);
        const dateSeason = new Date(dateSeasonConst);
        //const endDateFormatted = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
        //const isSeasonDay = endDateFormatted >= dateSeason;
        /* const isSeasonDay = endDate.getFullYear() === dateSeason.getFullYear() &&
          endDate.getMonth() === dateSeason.getMonth() &&
          endDate.getDate() === dateSeason.getDate(); */
        const isSeasonDay = endDate.setHours(0, 0, 0, 0) >= dateSeason.setHours(0, 0, 0, 0);
        //const curw = ((endDate.getDate()) / 8);
        //const isweeklyactday = Number.isInteger(curw) || (endDate.getDate() === dateSeason.getDate() && endDate.getMonth() === dateSeason.getMonth());
        //const wactdone = isweeklyactday && wklactivity[Math.floor(curw) + 1];
        if (((xContext === "day" && i === 0) || xContext !== "day") && isSeasonDay) {
            const itktdchest = DataContext.data.ticketdailychest;
            const itktcrop = DataContext.data.ticketsoncrop || 0;
            const ibert = DataContext.data.bert || 0;
            const itktbertMax = ibert ? ibert.reward ? ibert.reward : 0 : 0;
            const ibertcompleted = ibert ? ibert.completed && ibert.completed : false;
            const itktbert = ibertcompleted === true ? itktbertMax : 0;
            //const itktwact = isweeklyactday ? wactdone ? tktWeekly : 0 : 0;
            //const itktwactMax = isweeklyactday ? tktWeekly : 0;
            //const itkttntcl = DataContext.data.tickettentacle ? DataContext.data.tickettentacle : 0;
            //const itkttntcl = DataContext.data.totfish["Kraken Tentacle"] ? DataContext.data.totfish["Kraken Tentacle"] * 12 : 0;
            //const istoday = selectedFromActivity === "today";
            //compoHarvested["TKT"] += !istoday ? itkttntcl : 0;
            tot.tktchest += itktdchest;
            tot.tktcrop += itktcrop;
            tot.tktbert += itktbert;
            //tot.tktwact += itktwact;
            //tot.tktbertMax += itktbertMax;
            tot.tktMax += 1 + itktbertMax; //+ itktwactMax;
            //console.log("tktMax +1+bert -> " + (itktbertMax + 1));
            compoHarvested["TKT"] += itktcrop + itktdchest + itktbert; // + itktwact; // + itkttntcl;
            const prevBalance = activityData[i + 1] ? activityData[i + 1].data.balance : 0;
            const dayBalance = DataContext.data.balance;
            const dayGain = activityData[i + 1] ? prevBalance - dayBalance : 0;
            tot.balSfl += activityData.length > 1 ? dayGain : 0;
            const totHarvestEntries = Object.entries(DataContext.data.totharvest);
            totHarvestEntries.map(([item]) => {
                compoHarvested[item] = compoHarvested[item] || 0;
                compoHarvested[item] += DataContext.data.totharvest[item];
                compoHarvestn[item] = compoHarvestn[item] || 0;
                compoHarvestn[item] += DataContext.data.totharvestn[item];
            });
            if (DataContext.data.totfish) {
                const totFishEntries = Object.entries(DataContext.data.totfish);
                totFishEntries.map(([item]) => {
                    compoHarvested[item] = compoHarvested[item] || 0;
                    compoHarvested[item] += DataContext.data.totfish[item];
                    //compoHarvested["TKT"] += item === "Kraken Tentacle" ? DataContext.data.totfish[item] : 0;
                });
            }
            if (DataContext.data.totflower) {
                const totFlowerEntries = Object.entries(DataContext.data.totflower);
                totFlowerEntries.map(([item]) => {
                    compoHarvested[item] = compoHarvested[item] || 0;
                    compoHarvested[item] += DataContext.data.totflower[item];
                    //compoHarvested["TKT"] += item === "Kraken Tentacle" ? DataContext.data.totfish[item] : 0;
                });
            }
            if (DataContext.data.tottrades) {
                const totTradesEntries = Object.entries(DataContext.data.tottrades);
                totTradesEntries.map(([item]) => {
                    const itemName = DataContext.data.tottrades[item].item;
                    //if (!fish[itemName] && !flower[itemName]) {
                    const itemTraded = DataContext.data.tottrades[item].item;
                    compoTraded[itemTraded] = compoTraded[itemTraded] || 0;
                    compoTraded[itemTraded] += DataContext.data.tottrades[item].quant;
                    compoTradedSfl[itemTraded] = compoTradedSfl[itemTraded] || 0;
                    compoTradedSfl[itemTraded] += DataContext.data.tottrades[item].sfl;
                    tot.totTradedSfl += DataContext.data.tottrades[item].sfl;
                    //}
                });
            }
            const totBuildEntries = Object.entries(DataContext.data.totbuild);
            totBuildEntries.map(([item, quantity]) => {
                const buildQuant = DataContext.data.totbuild[item];
                if (food[item]) {
                    foodBuild[item] = foodBuild[item] || [];
                    foodBuild[item]["quant"] = foodBuild[item]["quant"] || 0;
                    foodBuild[item]["quant"] += buildQuant;
                    for (let compofood in food[item].compoit) {
                        const compo = compofood;
                        const quant = food[item].compoit[compofood];
                        if (it[compo] || fish[compo]) {
                            compoBurn[compo] = compoBurn[compo] || 0;
                            compoBurn[compo] += quant * buildQuant;
                            foodBuild[item][compo] = foodBuild[item][compo] || 0;
                            foodBuild[item][compo] += quant * buildQuant;
                            //console.log(item + ":" + compoValues[compo]);
                        }
                    }
                    tot.XP += Number(food[item].xp) * buildQuant;
                    compoHarvested["XP"] += Number(food[item].xp) * buildQuant;
                    foodBuild[item]["XP"] = foodBuild[item]["XP"] || 0;
                    foodBuild[item]["XP"] += Number(food[item].xp) * buildQuant;
                }
                if (fish[item]) {
                    compoHarvested[item] = compoHarvested[item] || 0;
                    compoHarvested[item] += buildQuant;
                    tot.XP += !isNaN(Number(fish[item].xp)) ? Number(fish[item].xp) * buildQuant : 0;
                }
            });
            const totToolEntries = Object.entries(DataContext.data.toolscrafted);
            totToolEntries.map(([item], quantity) => {
                const iquant = DataContext.data.toolscrafted[item];
                if (item === "Axe") {
                    compoBurn["SFL"] += 0.065 * iquant;
                }
                if (item === "Pickaxe") {
                    compoBurn["SFL"] += 0.065 * iquant;
                    compoBurn["Wood"] = compoBurn["Wood"] || 0;
                    compoBurn["Wood"] += 3 * iquant;
                }
                if (item === "Stone Pickaxe") {
                    compoBurn["SFL"] += 0.065 * iquant;
                    compoBurn["Wood"] = compoBurn["Wood"] || 0;
                    compoBurn["Wood"] += 3 * iquant;
                    compoBurn["Stone"] = compoBurn["Stone"] || 0;
                    compoBurn["Stone"] += 5 * iquant;
                }
                if (item === "Iron Pickaxe") {
                    compoBurn["SFL"] += 0.25 * iquant;
                    compoBurn["Wood"] = compoBurn["Wood"] || 0;
                    compoBurn["Wood"] += 3 * iquant;
                    compoBurn["Iron"] = compoBurn["Iron"] || 0;
                    compoBurn["Iron"] += 5 * iquant;
                }
                if (item === "Gold Pickaxe") {
                    compoBurn["SFL"] += 0.3125 * iquant;
                    compoBurn["Wood"] = compoBurn["Wood"] || 0;
                    compoBurn["Wood"] += 3 * iquant;
                    compoBurn["Gold"] = compoBurn["Gold"] || 0;
                    compoBurn["Gold"] += 3 * iquant;
                }
                if (item === "Rod") {
                    compoBurn["SFL"] += 0.065 * iquant;
                    compoBurn["Wood"] = compoBurn["Wood"] || 0;
                    compoBurn["Wood"] += 3 * iquant;
                    compoBurn["Stone"] = compoBurn["Stone"] || 0;
                    compoBurn["Stone"] += 1 * iquant;
                }
            });
            const totDelivEntries = Object.entries(DataContext.data.deliveries);
            totDelivEntries.map(([item]) => {
                const OrderItem = DataContext.data.deliveries[item];
                /* const createdDate = new Date(OrderItem.createdAt);
                const offsetInMinutes = createdDate.getTimezoneOffset();
                const createdDateUTC = new Date(createdDate.getTime() + offsetInMinutes * 60 * 1000);
                const dNow = new Date();
                const isToday = createdDateUTC.getDay() === dNow.getDay() && createdDateUTC.getMonth() === dNow.getMonth(); */
                //const Shelly = ["shelly"];
                //const isShelly = Shelly.some(valeur => new RegExp(valeur).test(totDelivEntries[item][1].from));
                //if (isToday) {
                const isShelly = item === "shelly";
                let patterntkn = /res\/(.*?)\ alt=/g;
                let correspondancetkn = patterntkn.exec(OrderItem.reward);
                let pattern = /(.*?)<img/g;
                let correspondance = pattern.exec(OrderItem.reward);
                let correspondancetktname = OrderItem.reward.includes(dataSet.imgtkt);
                const istkt = correspondancetktname;
                const issfl = correspondancetkn && correspondancetkn[1] === "flowertoken.webp";
                const iscoins = correspondancetkn && correspondancetkn[1] === "coins.png";
                const isPreSeason = OrderItem.preSeason && OrderItem.preSeason;
                if (OrderItem.completed) {
                    delivBurn[item] = [];
                    //"items": "1<img src=./icon/food/fermented_carrots.png alt=\"\" title=\"Fermented Carrots\" style=\"width: 17px; height: 17px\"/>",
                    var regex = /(\d+)<img[^>]+title="([^"]+)"[^>]*\/>/g;
                    var match;
                    while ((match = regex.exec(OrderItem.items)) !== null) {
                        var value = match[1];
                        const ivalue = Number(value);
                        var title = match[2];
                        if (food[title]) {
                            //for (let i = 1; i < 5; i++) {
                            for (let compofood in food[title].compoit) {
                                const compo = compofood;
                                const quant = food[title].compoit[compofood];
                                if (it[compo] || fish[compo]) {
                                    compoBurn[compo] = compoBurn[compo] || 0;
                                    compoBurn[compo] += quant * ivalue;
                                    delivBurn[item][compo] = delivBurn[item][compo] || 0;
                                    delivBurn[item][compo] += quant * ivalue;
                                    delivBurn["total"][compo] = delivBurn["total"][compo] || 0;
                                    delivBurn["total"][compo] += quant * ivalue;
                                    const xcompo = it[compo] ? it[compo] : fish[compo] ? fish[compo] : null;
                                    const icost = (xcompo.cost / dataSet.options.coinsRatio) * (quant * ivalue);
                                    const icostt = xcompo.costp2pt ? xcompo.costp2pt : 0 * (quant * ivalue);
                                    const icostn = xcompo.costp2pn ? xcompo.costp2pn : 0 * (quant * ivalue);
                                    const icosto = xcompo.costp2po ? xcompo.costp2po : 0 * (quant * ivalue);
                                    tot.deliveriescost += icost;
                                    tot.deliveriescostp2pt += Number(icostt);
                                    tot.deliveriescostp2pn += Number(icostn);
                                    tot.deliveriescostp2po += Number(icosto);
                                    tot.deliveriestktcost += istkt ? icost : 0
                                    //console.log(item + ":" + compoValues[compo]);
                                }
                            }
                            //tot.XP += Number(food[title].xp) * ivalue;
                        }
                        if (it[title] || fish[title]) {
                            compoBurn[title] = compoBurn[title] || 0;
                            compoBurn[title] += ivalue;
                            delivBurn[item][title] = delivBurn[item][title] || 0;
                            delivBurn[item][title] += ivalue;
                            delivBurn["total"][title] = delivBurn["total"][title] || 0;
                            delivBurn["total"][title] += ivalue;
                            const xcompo = it[title] ? it[title] : fish[title] ? fish[title] : null;
                            const icost = (xcompo.cost / dataSet.options.coinsRatio) * ivalue;
                            const icostt = xcompo.costp2pt ? xcompo.costp2pt : 0 * ivalue;
                            const icostn = xcompo.costp2pn ? xcompo.costp2pn : 0 * ivalue;
                            const icosto = xcompo.costp2po ? xcompo.costp2po : 0 * ivalue;
                            tot.deliveriescost += icost;
                            tot.deliveriescostp2pt += Number(icostt);
                            tot.deliveriescostp2pn += Number(icostn);
                            tot.deliveriescostp2po += Number(icosto);
                            tot.deliveriestktcost += istkt ? icost : 0
                            //console.log(item + ":" + compoValues[compo]);
                        }
                    }
                    //"reward": "1.42<img src=./icon/res/sfltoken.png alt=\"\" style=\"width: 20px; height: 20px\"/>",
                    //"reward": "4<img src=./icon/res/mermaid_scale.webp alt=\"\" style=\"width: 20px; height: 20px\"/>",
                    const itm = istkt ? "TKT" : (issfl ? "SFL" : "COINS");
                    if (correspondance || istkt) {
                        compoHarvested[itm] += Number(correspondance[1]) || 0;
                        tot.deliveriestkt += !isPreSeason && istkt && (Number(correspondance[1]) || 0);
                        tot.deliveriessfl += issfl && (Number(correspondance[1]) || 0);
                        tot.deliveriescoins += iscoins && (Number(correspondance[1]) || 0);
                    }
                }
                tot.tktMax += !isShelly && istkt && (correspondance && (Number(correspondance[1]) || 0));
                //if (istkt) { console.log("tktMax +deliv: " + item + "-> " + Number(correspondance[1])) }
                //}
            });
            const totChoreEntries = Object.entries(DataContext.data.chores);
            totChoreEntries.map(([item]) => {
                const choreItem = DataContext.data.chores[item];
                /* const createdDate = new Date(totChoreEntries[item][1].createdAt);
                const offsetInMinutes = createdDate.getTimezoneOffset();
                const createdDateUTC = new Date(createdDate.getTime() + offsetInMinutes * 60 * 1000);
                const dNow = new Date();
                const isToday = createdDateUTC.getDay() === dNow.getDay() && createdDateUTC.getMonth() === dNow.getMonth(); */
                //if (isToday) {
                //const choreItem = totChoreEntries[item][1] && totChoreEntries[item][1];

                let completedToday = false;
                if (activityData[i - 1]) {
                    if (activityData[i - 1].data.chores[item]?.completed) { completedToday = true }
                    //activityData[i + 1].data.chores[item].completed;
                }

                if (choreItem && choreItem.completed && completedToday) {
                    if (choreItem.rewarditem === dataSet.tktName) {
                        compoHarvested["TKT"] = compoHarvested["TKT"] || 0;
                        compoHarvested["TKT"] += choreItem.reward;
                        tot.chorestkt += choreItem.reward;
                    } else {
                        compoHarvested[choreItem.rewarditem] = compoHarvested[choreItem.rewarditem] || 0;
                        compoHarvested[choreItem.rewarditem] += choreItem.reward;
                    }
                }
                tot.tktMax += choreItem && (choreItem.rewarditem === dataSet.tktName) && Number(choreItem.reward);
                //if ((choreItem.rewarditem === dataSet.tktName)) { console.log("tktMax +chore: " + item + "-> " + choreItem.reward) }
                //}
            });
        }
        i++;
    });
    //console.log(compoBurn);
    tot.tktCost = tot.deliveriestktcost / (tot.deliveriestkt);
    let compoTotal = [];
    compoTotal = Object.assign({}, compoHarvested, compoTraded, compoBurn);
    const itemOrder = Object.keys(it);
    const fishOrder = Object.keys(fish);
    const flowerOrder = Object.keys(flower);
    const compoEntries = Object.entries(compoTotal);
    const sortedInventoryItems = itemOrder.map((item) => {
        const entry = compoEntries.find(([entryItem]) => entryItem === item);
        const quantity = entry ? entry[1] : 0;
        return [item, quantity];
    });
    const sortedFishItems = fishOrder.map((item) => {
        const entry = compoEntries.find(([entryItem]) => entryItem === item);
        const quantity = entry ? entry[1] : 0;
        return [item, quantity];
    });
    const sortedFlowerItems = flowerOrder.map((item) => {
        const entry = compoEntries.find(([entryItem]) => entryItem === item);
        const quantity = entry ? entry[1] : 0;
        return [item, quantity];
    });
    const tradedNFTItems = Object.entries(compoTraded).map((item) => {
        if ((nft[item[0]] || nftw[item[0]]) && (!fish[item[0]] && !flower[item[0]])) {
            const entry = compoEntries.find(([entryItem]) => entryItem === item[0]);
            const quantity = entry ? entry[1] : 0;
            return [item[0], quantity];
        }
    }).filter(Boolean);
    sortedInventoryItems.unshift(["TKT", compoHarvested["TKT"]]);
    sortedInventoryItems.unshift(["SFL", compoBurn["SFL"]]);
    sortedInventoryItems.unshift(["COINS", compoBurn["COINS"]]);
    sortedInventoryItems.unshift(["XP", compoHarvested["XP"]]);
    const allSortedItems1 = sortedInventoryItems.concat(sortedFlowerItems);
    const allSortedItems2 = allSortedItems1.concat(sortedFishItems);
    const allSortedItems = allSortedItems2.concat(tradedNFTItems);
    const result = {
        allSortedItems: allSortedItems,
        compoHarvested: compoHarvested,
        compoHarvestn: compoHarvestn,
        compoTraded: compoTraded,
        compoTradedSfl: compoTradedSfl,
        compoBurn: compoBurn,
        foodBuild: foodBuild,
        delivBurn: delivBurn,
        tot: tot
    }
    //console.log("tktMax -> " + tot.tktMax);
    return result;
}
function setActivityTotQuest(activityData, dataSetFarm) {
    let Quest = [];
    let i = 0;
    //const dataEntries = Object.entries(activityData);
    const dataEntries = Object.keys(activityData);
    dataEntries.map((value, index) => {
        const totChoreEntries = Object.entries(activityData[index].data.chores);
        totChoreEntries.map(([item]) => {
            const choreItem = activityData[index].data.chores[item];
            const choreFrom = "hank";
            const choreDesc = choreItem.description;
            const choreDate = formatDate(activityData[index].date);
            const choreCompleted = choreItem.completed;
            const choreTkt = choreItem.tickets;
            Quest[i] = {
                from: choreFrom,
                description: choreDesc,
                date: choreDate,
                completed: choreCompleted,
                istkt: true,
                reward: choreTkt
            }
            i++;
            //if (!Dates.includes(choreDate)) { Dates.push(choreDate) }
            //console.log(Quest[i - 1]);
        });
        const totDelivEntries = Object.entries(activityData[index].data.deliveries);
        totDelivEntries.map(([item]) => {
            const isShelly = item === "shelly";
            if (!isShelly) {
                const delivItem = activityData[index].data.deliveries[item];
                const delivFrom = item;
                const delivDesc = delivItem.items;
                const delivDate = formatDate(activityData[index].date);
                const delivCompleted = delivItem.completed;
                let patterntkn = /res\/(.*?)\ alt=/g;
                let correspondancetkn = patterntkn.exec(delivItem.reward);
                let pattern = /(.*?)<img/g;
                let correspondance = pattern.exec(delivItem.reward);
                const istkt = correspondancetkn && correspondancetkn[1] !== "flowertoken.webp";
                const delivRew = correspondance && correspondance[1];
                Quest[i] = {
                    from: delivFrom,
                    description: delivDesc,
                    date: delivDate,
                    completed: delivCompleted,
                    istkt: istkt,
                    reward: delivRew
                }
                i++;
                //if (!Dates.includes(delivDate)) { Dates.push(delivDate) }
                //console.log(Quest[i - 1]);
            }
        });
    });
    const result = {
        Quest: Quest,
        //Dates: Dates,
    }
    return result;
}
function formatDate(xDate, setUTC) {
  const currentDate = (xDate instanceof Date) ? xDate : new Date(xDate);
  var day = "";
  var month = "";
  var year = "";
  if (setUTC) {
    day = String(currentDate.getUTCDate()).padStart(2, '0');
    month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
    year = String(currentDate.getUTCFullYear()).slice(-2);
  } else {
    day = String(currentDate.getDate()).padStart(2, '0');
    month = String(currentDate.getMonth() + 1).padStart(2, '0');
    year = String(currentDate.getFullYear()).slice(-2);
  }
  const dateNow = `${month}/${day}/${year}`;
  return dateNow;
}
function formatDateAndSupYr(xDate, setUTC) {
  const currentDate = (xDate instanceof Date) ? xDate : new Date(xDate);
  var day = "";
  var month = "";
  if (setUTC) {
    day = String(currentDate.getUTCDate()).padStart(2, '0');
    month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
  } else {
    day = String(currentDate.getDate()).padStart(2, '0');
    month = String(currentDate.getMonth() + 1).padStart(2, '0');
  }
  const dateNow = `${month}/${day}`;
  return dateNow;
}