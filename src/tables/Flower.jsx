import React from "react";
import { useAppCtx } from "../context/AppCtx";

export default function FlowerTable() {
    const {
        data: { dataSetFarm, farmData },
        ui: {
            xListeColFlower,
        },
    } = useAppCtx();
    if (farmData.inventory) {
        const { it, flower } = dataSetFarm.itables;
        const flwrKeys = Object.keys(flower);
        const tableContent = flwrKeys.map(element => {
            const cobj = flower[element];
            const flName = element;
            const ico = <img src={cobj.img} alt={''} className="nodico" title={flName} />;
            const seed = cobj.cat && cobj.cat;
            const ibreed = cobj ? cobj.breed : '';
            const ibreedimgs = cobj ? cobj.breedimgs : '';
            const xBreeds = ibreed.split("*");
            const xBreedsImg = ibreedimgs.split("*");
            const iquant = cobj.quant > 0 ? cobj.quant : '';
            const ihrvstd = cobj.harvested > 0 ? cobj.harvested : '';
            let growingQuant = 0;
            let nBeds = 0;
            for (let key in it["Flower"].beds) {
                const nKey = Number(key);
                if (it["Flower"].beds[nKey].name === flName) { growingQuant += it["Flower"].beds[nKey].quant };
                nBeds++;
            }
            return (
                <tr>
                    {xListeColFlower[0][1] === 1 ? <td className="tdcenter">{seed}</td> : null}
                    <td id="iccolumn">{ico}</td>
                    {xListeColFlower[1][1] === 1 ? <td className="tditem">{flName}</td> : null}
                    {xListeColFlower[2][1] === 1 ? <td className="tdcenter">
                        {xBreeds.map((value, index) => {
                            if (value !== "") { return (<span key={index}><i><img src={xBreedsImg[index]} alt={''} className="itico" title={value} /></i></span>) }
                            return null;
                        })}</td> : null}
                    {xListeColFlower[3][1] === 1 ? <td className="tdcenter">{iquant}</td> : null}
                    {xListeColFlower[4][1] === 1 ? <td className="tdcenter">{ihrvstd}</td> : null}
                    {xListeColFlower[4][1] === 1 ? <td className="tdcenter">{growingQuant > 0 ? growingQuant : ""}</td> : null}
                </tr>
            );
        });
        const tableHeader = (
            <thead>
                <tr>
                    {xListeColFlower[0][1] === 1 ? <th className="thcenter">Seed</th> : null}
                    <th className="th-icon"></th>
                    {xListeColFlower[1][1] === 1 ? <th className="thcenter">Name</th> : null}
                    {xListeColFlower[2][1] === 1 ? <th className="thcenter">Breed</th> : null}
                    {xListeColFlower[3][1] === 1 ? <th className="thcenter">Quant</th> : null}
                    {xListeColFlower[4][1] === 1 ? <th className="thcenter">Hrvst</th> : null}
                    {xListeColFlower[4][1] === 1 ? <th className="thcenter">Grow</th> : null}
                </tr>
                <tr>
                    {xListeColFlower[0][1] === 1 ? <td className="tdcenter">TOTAL</td> : null}
                    <td></td>
                    {xListeColFlower[1][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColFlower[2][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColFlower[3][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColFlower[4][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColFlower[4][1] === 1 ? <td className="tdcenter"></td> : null}
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