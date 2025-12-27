import React from "react";
import { useAppCtx } from "../context/AppCtx";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function DigTable() {
    const {
        data: { dataSet, dataSetFarm, farmData },
        ui: {
            selectedDigCur,
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
        }
    } = useAppCtx();
    if (farmData.inventory) {
        const { it, bounty } = dataSetFarm.itables;
        const bountyKeys = Object.keys(bounty);
        let valueTotal = 0;
        let vTodayTotal = 0;
        let toolcostTodayTotal = 0;
        let dugTotal = 0;
        let ratioTotal = 0;
        let vTodayPatternTotal = 0;
        let toolcostTodayPatternTotal = 0;
        let ratioPTotal = 0;
        const CurDec = selectedDigCur === "coins" ? 0 : 3;
        const imgCoins = <img src={imgcoins} alt={''} className="itico" title="Coins" />;
        const imgSfl = <img src={imgsfl} alt={''} className="itico" title="Flower" />;
        const dataSetDig = {};
        const tableContent = bountyKeys.map(element => {
            const cobj = bounty[element];
            const bntName = element;
            const ico = <img src={cobj.img} alt={''} className="nodico" title={bntName} />;
            const stock = cobj.stock > 0 ? cobj.stock : '';
            const icost = TryChecked ? cobj.costtry : cobj.cost;
            const xcoinsRatio = (selectedDigCur === "sfl" ? dataSet.options.coinsRatio : 1);
            const value = (icost > 0 && !it[bntName]) ? parseFloat((icost * stock) / xcoinsRatio).toFixed(CurDec) : '';
            const qtoday = cobj.qtoday > 0 ? cobj.qtoday : '';
            const ivtoday = TryChecked ? cobj.vtodaytry : cobj.vtoday;
            const valuetoday = ivtoday > 0 ? parseFloat(ivtoday / xcoinsRatio).toFixed(CurDec) : '';
            const itoolctoday = TryChecked ? cobj.toolctodaytry : cobj.toolctoday;
            const toolcostToday = itoolctoday > 0 ? parseFloat(itoolctoday / xcoinsRatio).toFixed(CurDec) : '';
            const ratioCoins = (itoolctoday || 0) > 0 && (ivtoday || 0) > 0 && (toolcostToday || 0) > 0 ? ivtoday / toolcostToday : '';
            const ratioCoinsS = parseFloat(ratioCoins * (selectedDigCur === "coins" ? dataSet.options.coinsRatio : 1)).toFixed(0);
            const ptoday = cobj.pattern > 0 ? cobj.pattern : '';
            const iptoday = TryChecked ? cobj.ptodaytry : cobj.ptoday;
            const valueptoday = iptoday > 0 ? parseFloat(iptoday / xcoinsRatio).toFixed(CurDec) : '';
            const itoolcpattern = TryChecked ? cobj.toolcpatterntry : cobj.toolcpattern;
            const toolcostpToday = itoolcpattern > 0 ? parseFloat(itoolcpattern / xcoinsRatio).toFixed(CurDec) : '';
            const ratioCoinsPattern = (itoolcpattern || 0) > 0 && (iptoday || 0) > 0 && (toolcostpToday || 0) > 0 ? iptoday / toolcostpToday : '';
            const ratioCoinsPatternS = parseFloat(ratioCoinsPattern * (selectedDigCur === "coins" ? dataSet.options.coinsRatio : 1)).toFixed(0);
            valueTotal += Number(value || 0);
            vTodayTotal += Number(valuetoday || 0);
            toolcostTodayTotal += Number(toolcostToday || 0);
            vTodayPatternTotal += Number(valueptoday || 0);
            toolcostTodayPatternTotal += Number(toolcostpToday || 0);
            const dataSetDig = {};
            dataSetDig.qtoday = qtoday;
            dataSetDig.valuetoday = valuetoday;
            dataSetDig.itoolctoday = toolcostToday;
            dataSetDig.ratioCoins = ratioCoinsS;
            dataSetDig.valueptoday = valueptoday;
            dataSetDig.toolcostpToday = toolcostpToday;
            dataSetDig.ratioCoinsPattern = ratioCoinsPatternS;
            return (
                <tr>
                    <td id="iccolumn">{ico}</td>
                    {xListeColBounty[0][1] === 1 ? <td className="tditem">{bntName}</td> : null}
                    {xListeColBounty[1][1] === 1 ? <td className="tdcenter">{stock}</td> : null}
                    {xListeColBounty[2][1] === 1 ? <td className="tdcenter">{value}</td> : null}
                    {xListeColBounty[3][1] === 1 ? <td className="tdcenter">{qtoday > 0 ? qtoday : ""}</td> : null}
                    {xListeColBounty[4][1] === 1 ? <td className="tdcenter">{valuetoday > 0 ? valuetoday : ""}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="tdcenter">{toolcostToday > 0 ? toolcostToday : ""}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="tdcenter"
                        onClick={(e) => handleTooltip(element, "ratiodig", dataSetDig, e)}>{ratioCoinsS > 0 ? ratioCoinsS : ""}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="tdcenter">{ptoday > 0 ? ptoday : ""}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="tdcenter">{valueptoday > 0 ? valueptoday : ""}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="tdcenter">{toolcostpToday > 0 ? toolcostpToday : ""}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="tdcenter"
                        onClick={(e) => handleTooltip(element, "ratiodigp", dataSetDig, e)}>{ratioCoinsPatternS > 0 ? ratioCoinsPatternS : ""}</td> : null}
                </tr>
            );
        });
        ratioTotal = ((vTodayTotal * dataSet.options.coinsRatio) / toolcostTodayTotal) || 0;
        ratioPTotal = ((vTodayPatternTotal * dataSet.options.coinsRatio) / toolcostTodayPatternTotal) || 0;
        dataSetDig.qtoday = "total";
        dataSetDig.valuetoday = parseFloat(vTodayTotal).toFixed(CurDec);
        dataSetDig.itoolctoday = parseFloat(toolcostTodayTotal).toFixed(CurDec);
        dataSetDig.ratioCoins = parseFloat(ratioTotal).toFixed(0);
        dataSetDig.valueptoday = parseFloat(vTodayPatternTotal).toFixed(CurDec);
        dataSetDig.toolcostpToday = parseFloat(toolcostTodayPatternTotal).toFixed(CurDec);
        dataSetDig.ratioCoinsPattern = parseFloat(ratioPTotal).toFixed(0);
        const tableHeader = (
            <thead>
                <tr>
                    <th className="th-icon"></th>
                    {xListeColBounty[0][1] === 1 ? <th className="thcenter">Name</th> : null}
                    {xListeColBounty[1][1] === 1 ? <th className="thcenter">Stock</th> : null}
                    {xListeColBounty[2][1] === 1 ? <th className="thcenter">
                        <div className="selectquantityback"><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                            <InputLabel>Value</InputLabel>
                            <Select name="selectedDigCur" value={selectedDigCur} onChange={handleUIChange} onClick={(e) => e.stopPropagation()}>
                                <MenuItem value="sfl">{imgSfl}</MenuItem>
                                <MenuItem value="coins">{imgCoins}</MenuItem>
                            </Select></FormControl></div></th> : null}
                    {xListeColBounty[3][1] === 1 ? <th className="thcenter">Today</th> : null}
                    {xListeColBounty[4][1] === 1 ? <th className="thcenter">Value</th> : null}
                    {xListeColBounty[5][1] === 1 ? <th className="thcenter">Tool cost</th> : null}
                    {xListeColBounty[5][1] === 1 ? <th className="thcenter">Ratio <div>{imgCoins}/{imgSfl}</div></th> : null}
                    {xListeColBounty[3][1] === 1 ? <th className="thcenter">Patterns <div>Today</div></th> : null}
                    {xListeColBounty[4][1] === 1 ? <th className="thcenter">Patterns <div>Value</div></th> : null}
                    {xListeColBounty[5][1] === 1 ? <th className="thcenter">Patterns <div>Tool cost</div></th> : null}
                    {xListeColBounty[5][1] === 1 ? <th className="thcenter">Ratio <div>{imgCoins}/{imgSfl}</div></th> : null}
                </tr>
                <tr>
                    <td></td>
                    {xListeColBounty[0][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColBounty[1][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColBounty[2][1] === 1 ? <td className="tdcenter">{parseFloat(valueTotal).toFixed(CurDec)}</td> : null}
                    {xListeColBounty[3][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColBounty[4][1] === 1 ? <td className="tdcenter">{parseFloat(vTodayTotal).toFixed(CurDec)}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="tdcenter">{parseFloat(toolcostTodayTotal).toFixed(CurDec)}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="tdcenter"
                        onClick={(e) => handleTooltip("Total", "ratiodig", dataSetDig, e)}>{parseFloat(ratioTotal).toFixed(0)}</td> : null}
                    {xListeColBounty[3][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColBounty[4][1] === 1 ? <td className="tdcenter">{parseFloat(vTodayPatternTotal).toFixed(CurDec)}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="tdcenter">{parseFloat(toolcostTodayPatternTotal).toFixed(CurDec)}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="tdcenter"
                        onClick={(e) => handleTooltip("Total", "ratiodigp", dataSetDig, e)}>{parseFloat(ratioPTotal).toFixed(0)}</td> : null}
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