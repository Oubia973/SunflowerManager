import React from "react";
import { useAppCtx } from "../context/AppCtx";

export default function CraftTable() {
    const {
        data: { dataSet, dataSetFarm, farmData },
        ui: {
            xListeColBounty,
            TryChecked,
        },
        actions: {
            handleTooltip,
        },
        img: {
            imgSFL,
            imgcoins,
            imgExchng,
            imgna,
            imgbuyit
        }
    } = useAppCtx();
    const craftTables = dataSetFarm?.craftData?.itables || dataSetFarm?.itables || {};
    if (craftTables?.it && craftTables?.flower && craftTables?.bounty && craftTables?.craft) {
        const { it, flower, bounty, craft } = craftTables;
        const Keys = Object.keys(craft);
        const imgCoins = <img src={imgcoins} alt={''} className="itico" title="Coins" />;
        const tableContent = Keys.map(element => {
            const cobj = craft[element];
            const itemName = element;
            const ico = <img src={cobj.img} alt={''} className="nftico" title={itemName} />;
            const itime = TryChecked ? cobj.timetry : cobj.time;
            const stock = cobj.instock > 0 ? cobj.instock : '';
            const icost = TryChecked ? cobj.costtry / dataSet.options.coinsRatio : cobj.cost / dataSet.options.coinsRatio;
            const icostm = cobj.costp2pt;
            let icompoimg = [];
            for (let key in cobj.compo) {
                const compoQuant = cobj.compo[key];
                let icompoToAdd = imgna;
                if (it[key]) { icompoToAdd = it[key].img; }
                if (bounty[key]) { icompoToAdd = bounty[key].img; }
                if (flower[key]) { icompoToAdd = flower[key].img; }
                if (craft[key]) { icompoToAdd = craft[key].img; }
                icompoimg.push(
                    <span key={key}>
                        {compoQuant}
                        <img src={icompoToAdd} alt="" class="itico" title={key} />
                    </span>
                );
            }
            return (
                <tr>
                    <td id="iccolumn">{ico}</td>
                    {xListeColBounty[0][1] === 1 ? <td className="tditem">{itemName}</td> : null}
                    {xListeColBounty[1][1] === 1 ? <td className="tdcenter">{stock}</td> : null}
                    {xListeColBounty[2][1] === 1 ? <td className="tdcenter">{itime}</td> : null}
                    {xListeColBounty[3][1] === 1 ? <td className="tdcenter tooltipcell"
                        onClick={(e) => handleTooltip(itemName, "craftcompo", 0, e)}>{icompoimg}</td> : null}
                    {xListeColBounty[4][1] === 1 ? <td className="tdcenter">{parseFloat(icost).toFixed(3)}</td> : null}
                    {xListeColBounty[5][1] === 1 ? <td className="tdcenter">{parseFloat(icostm).toFixed(3)}</td> : null}
                </tr>
            );
        });
        const tableHeader = (
            <thead>
                <tr>
                    <th className="th-icon"></th>
                    {xListeColBounty[0][1] === 1 ? <th className="thcenter">Name</th> : null}
                    {xListeColBounty[1][1] === 1 ? <th className="thcenter">Stock</th> : null}
                    {xListeColBounty[2][1] === 1 ? <th className="thcenter">Time</th> : null}
                    {xListeColBounty[3][1] === 1 ? <th className="thcenter">Compos</th> : null}
                    {xListeColBounty[4][1] === 1 ? <th className="thcenter">Cost</th> : null}
                    {xListeColBounty[5][1] === 1 ? <th className="thcenter">Prod {imgbuyit}</th> : null}
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
