import React from "react";
import { useAppCtx } from "../context/AppCtx";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { frmtNb, ColorValue } from '../fct.js';

export default function AnimalTable() {
    const {
        data: { dataSet, dataSetFarm },
        ui: {
            selectedAnimalLvl,
            xListeColAnimals,
            TryChecked,
        },
        actions: {
            handleUIChange,
        },
        img: {
            imgsfl,
            imgcow,
            imgsheep,
            imgchkn,
            imgexchng,
            imgExchng,
            imgna,
        }
    } = useAppCtx();
    if (dataSetFarm.Animals) {
        const { Animals, animalsAllLvl } = dataSetFarm;
        const { it, mutant } = dataSetFarm.itables;
        const { nft } = dataSetFarm.boostables;
        let table = [];
        const imgmix = "./icon/res/mixed_grain_v2.webp";
        const ximgmix = <img src={imgmix} alt={''} className="itico" title={"Food"} />;
        const imgomni = "./icon/res/omnifeed.webp";
        const ximgomni = <img src={imgomni} alt={''} className="itico" title={"Corn"} />;
        const imgcorn = <img src={it["Corn"].img} alt={''} className="itico" title={"Corn"} />;
        const imgwheat = <img src={it["Wheat"].img} alt={''} className="itico" title={"Wheat"} />;
        const imgbarley = <img src={it["Barley"].img} alt={''} className="itico" title={"Barley"} />;
        const imgkale = <img src={it["Kale"].img} alt={''} className="itico" title={"Kale"} />;
        const imgtrade = <img src={imgexchng} alt={''} className="itico" title={"Marketplace price"} />;
        const ximgsfl = <img src={imgsfl} alt={''} className="itico" title={"SFL"} />;
        const showTotal = selectedAnimalLvl === "farm";
        const AnimalsTable = selectedAnimalLvl === "farm" ? Animals : animalsAllLvl;
        for (let key in AnimalsTable) {
            const animalKeys = Object.values(AnimalsTable[key]);
            let prod1Total = 0;
            let prod2Total = 0;
            let foodTotal = {};
            foodTotal.corn = 0;
            foodTotal.wheat = 0;
            foodTotal.barley = 0;
            foodTotal.kale = 0;
            foodTotal.omni = 0;
            let prod1costTotal = 0;
            let prod1costp2pTotal = 0;
            let prod2costTotal = 0;
            let prod2costp2pTotal = 0;
            let foodcostTotal = 0;
            let foodcostp2pTotal = 0;
            //let love1Total = 0;
            //let love2Total = 0;
            const itemName = key;
            const prod1name = (itemName === "Chicken") ? "Egg" : (itemName === "Cow") ? "Milk" : (itemName === "Sheep") ? "Wool" : "";
            const xprod1img = it[prod1name].img || imgna;
            const prod1img = <img src={xprod1img} alt={''} className="itico" title={prod1name} />;
            const prod1img2 = <img src={xprod1img} alt={''} className="nftico" title={prod1name} />;
            const prod2name = (itemName === "Chicken") ? "Feather" : (itemName === "Cow") ? "Leather" : (itemName === "Sheep") ? "Merino Wool" : "";;
            const xprod2img = it[prod2name].img || imgna;
            const prod2img = <img src={xprod2img} alt={''} className="itico" title={prod2name} />;
            const prod2img2 = <img src={xprod2img} alt={''} className="nftico" title={prod2name} />;
            const itemImg = (itemName === "Chicken") ? imgchkn : (itemName === "Cow") ? imgcow : (itemName === "Sheep") ? imgsheep : imgna;
            const animalImg = <img src={itemImg} alt={''} className="nftico" title={itemName} />;
            const tableContent = animalKeys.map(element => {
                const cobj = element;
                const xpprogress = cobj.xpProgress || 0;
                const xptolvl = cobj.xpToLvl || 0;
                const xlvl = cobj.lvl > 0 ? (xpprogress === xptolvl) ? cobj.lvl - 1 : cobj.lvl : 0;
                const ignoreAnimal = dataSet.options?.ignoreAniLvl && (xlvl > dataSet.options.animalLvl[itemName]);
                const food = Number(parseFloat(!TryChecked ? cobj.quantfood : cobj.quantfoodtry).toFixed(2));
                const foodname = !TryChecked ? cobj.food : cobj.foodtry;
                const xfoodimg = it[foodname] ? it[foodname].img : (foodname === "Mix" ? imgmix : (foodname === "Omnifeed" ? imgomni : imgna));
                const foodimg = <img src={xfoodimg} alt={''} className="itico" title={foodname} />;
                const foodcost = frmtNb((!TryChecked ? cobj.costFood : cobj.costFoodtry) / dataSet.options.coinsRatio) || 0;
                const foodcostp2p = frmtNb(!TryChecked ? cobj.costFoodp2p : cobj.costFoodp2ptry) || 0;
                const prod1 = Number(parseFloat(!TryChecked ? cobj.yield1 : cobj.yield1try).toFixed(2)) || 0;
                const prod1cost = frmtNb((!TryChecked ? cobj.costyield1 : cobj.costyield1try) / dataSet.options.coinsRatio) || 0;
                const prod1costp2p = it[prod1name].costp2pt || 0;
                const prod2 = Number(parseFloat(!TryChecked ? cobj.yield2 : cobj.yield2try).toFixed(2)) || 0;
                const prod2cost = frmtNb((!TryChecked ? cobj.costyield2 : cobj.costyield2try) / dataSet.options.coinsRatio) || 0;
                const prod2costp2p = it[prod2name].costp2pt || 0;
                const prod1costuwithfoodp2p = frmtNb(foodcostp2p / prod1);
                const coefprod1p2p = frmtNb(prod1costp2p / prod1cost);
                const coefprod1p2pPercentTxt = (Math.ceil(coefprod1p2p * 100) - 100) === Infinity ? "ꝏ" : (Math.ceil(coefprod1p2p * 100) - 100);
                const coefprod1p2pPercent = coefprod1p2pPercentTxt || 0;
                const coefprod1costuwithfoodp2p = frmtNb(prod1costp2p / prod1costuwithfoodp2p);
                const coefprod1costuwithfoodp2pPercentTxt = (Math.ceil(coefprod1costuwithfoodp2p * 100) - 100) === Infinity ? "ꝏ" : (Math.ceil(coefprod1costuwithfoodp2p * 100) - 100);
                const coefprod1costuwithfoodp2pPercent = coefprod1costuwithfoodp2pPercentTxt || 0;
                const prod2costuwithfoodp2p = frmtNb(foodcostp2p / prod2);
                const coefprod2p2p = frmtNb(prod2costp2p / prod2cost);
                const coefprod2p2pPercentTxt = (Math.ceil(coefprod2p2p * 100) - 100) === Infinity ? "ꝏ" : (Math.ceil(coefprod2p2p * 100) - 100);
                const coefprod2p2pPercent = coefprod2p2pPercentTxt || 0;
                const coefprod2costuwithfoodp2p = frmtNb(prod2costp2p / prod2costuwithfoodp2p);
                const coefprod2costuwithfoodp2pPercentTxt = (Math.ceil(coefprod2costuwithfoodp2p * 100) - 100) === Infinity ? "ꝏ" : (Math.ceil(coefprod2costuwithfoodp2p * 100) - 100);
                const coefprod2costuwithfoodp2pPercent = coefprod2costuwithfoodp2pPercentTxt || 0;
                const color1 = ColorValue(coefprod1p2p);
                const color1costufoodp2p = ColorValue(coefprod1costuwithfoodp2p);
                const color2 = ColorValue(coefprod2p2p);
                const color2costufoodp2p = ColorValue(coefprod2costuwithfoodp2p);
                const cellStyle = {};
                const xppercent = Math.floor(((xpprogress) / (xptolvl)) * 100);
                if (ignoreAnimal) { cellStyle.color = "gray" }

                let rewardImg = "";
                if (cobj.reward) {
                    let rwdImg = imgna;
                    if (nft?.[cobj.reward]) { rwdImg = nft?.[cobj.reward]?.img; }
                    if (mutant?.[cobj.reward]) { rwdImg = mutant?.[cobj.reward]?.img; }
                    rewardImg = <img src={rwdImg} alt={''} className="nftico" title={cobj.reward} />;
                }
                //const love1 = 0;
                //const love2 = 0;
                if (!ignoreAnimal) {
                    prod1Total += Number(prod1);
                    prod2Total += Number(prod2);
                    foodTotal.corn += (foodname === "Corn") ? food : 0;
                    foodTotal.wheat += (foodname === "Wheat") ? food : 0;
                    foodTotal.barley += (foodname === "Barley") ? food : 0;
                    foodTotal.kale += (foodname === "Kale") ? food : 0;
                    foodTotal.omni += (foodname === "Omnifeed") ? food : 0;
                    if (foodname === "Mix") {
                        foodTotal.corn += food;
                        foodTotal.wheat += food;
                        foodTotal.barley += food;
                    }
                    prod1costTotal += Number(prod1cost);
                    prod1costp2pTotal += Number(prod1costp2p) * prod1;
                    prod2costTotal += Number(prod2cost);
                    prod2costp2pTotal += Number(prod2costp2p) * prod2;
                    foodcostTotal += Number(foodcost);
                    foodcostp2pTotal += Number(foodcostp2p);
                    //love1Total += Number(love1);
                    //love2Total += Number(love2);
                }

                return (
                    <tr style={{ ...cellStyle }}>
                        {/* <td id="iccolumn"></td> */}
                        {xListeColAnimals[0][1] === 1 ? <td className="tdcenter">
                            <div className={`progress-bar`}>
                                <div className="progress" style={{ width: `${xppercent}%` }}>
                                    <span className="progress-text">
                                        {`${parseFloat(xpprogress).toFixed(0)}/${parseFloat(xptolvl > 1000 ? (xptolvl / 1000) : xptolvl).toFixed(0)}${xptolvl > 1000 ? "k" : ""}`}
                                    </span>
                                </div>
                            </div></td> : null}
                        {xListeColAnimals[1][1] === 1 ? <td className="tdcenter">{rewardImg}{xlvl}</td> : null}
                        {xListeColAnimals[2][1] === 1 ? <td className="tdcenter">{prod1 > 0 && prod1}{prod1 > 0 && prod1img}</td> : null}
                        {xListeColAnimals[3][1] === 1 ? <td className="tdcenter">{prod2 > 0 && prod2}{prod2 > 0 && prod2img}</td> : null}
                        {xListeColAnimals[4][1] === 1 ? <td className="tdcenter">{food}{foodimg}</td> : null}
                        {xListeColAnimals[5][1] === 1 ? <td className="tdcenter">{foodcost}</td> : null}
                        {xListeColAnimals[6][1] === 1 ? <td className="tdcenter">{foodcostp2p}</td> : null}
                        {xListeColAnimals[7][1] === 1 ? <td className="tdcenterbrdleft">{prod1cost}</td> : null}
                        {xListeColAnimals[8][1] === 1 ? (<td style={{ ...cellStyle, color: color1, textAlign: 'center', fontSize: '10px' }}>{coefprod1p2pPercent}</td>) : ("")}
                        {xListeColAnimals[8][1] === 1 ? <td className="tdcenter">{prod1costuwithfoodp2p}</td> : null}
                        {xListeColAnimals[8][1] === 1 ? (<td style={{ ...cellStyle, color: color1costufoodp2p, textAlign: 'center', fontSize: '10px' }}>{coefprod1costuwithfoodp2pPercent}</td>) : ("")}
                        {xListeColAnimals[8][1] === 1 ? <td className="tdcenter">{prod1costp2p}</td> : null}
                        {xListeColAnimals[9][1] === 1 ? <td className="tdcenterbrdleft">{prod2cost}</td> : null}
                        {xListeColAnimals[10][1] === 1 ? (<td style={{ ...cellStyle, color: color2, textAlign: 'center', fontSize: '10px' }}>{coefprod2p2pPercent}</td>) : ("")}
                        {xListeColAnimals[10][1] === 1 ? <td className="tdcenter">{prod2costuwithfoodp2p}</td> : null}
                        {xListeColAnimals[10][1] === 1 ? (<td style={{ ...cellStyle, color: color2costufoodp2p, textAlign: 'center', fontSize: '10px' }}>{coefprod2costuwithfoodp2pPercent}</td>) : ("")}
                        {xListeColAnimals[10][1] === 1 ? <td className="tdcenterbrdright">{prod2costp2p}</td> : null}
                    </tr>
                );
            });
            const tableHeader = (
                <thead>
                    <tr>
                        {/* <th className="th-icon"></th> */}
                        {xListeColAnimals[0][1] === 1 ? <th id="ichcolumn">{animalImg}</th> : null}
                        {xListeColAnimals[1][1] === 1 ? <th className="thcenter">LVL</th> : null}
                        {xListeColAnimals[2][1] === 1 ? <th className="thcenter">Prod1</th> : null}
                        {xListeColAnimals[3][1] === 1 ? <th className="thcenter">Prod2</th> : null}
                        {xListeColAnimals[4][1] === 1 ? <th className="thcenter">Food</th> : null}
                        {xListeColAnimals[5][1] === 1 ? <th className="thcenter">Food cost</th> : null}
                        {xListeColAnimals[6][1] === 1 ? <th className="thcenter">{imgExchng}</th> : null}
                        {xListeColAnimals[7][1] === 1 ? <th className="thcenterbrdleft" title="Prod cost per unit">{prod1img2}Cost/u</th> : null}
                        {xListeColAnimals[8][1] === 1 ? <th className="thcenter" title="Coef market / production"> % </th> : null}
                        {xListeColAnimals[8][1] === 1 ? <th className="thcenter" title="Prod cost per unit buying food at market">Buy<div>crops</div></th> : null}
                        {xListeColAnimals[8][1] === 1 ? <th className="thcenter" title="Coef market / production buying food comp at p2p"> % </th> : null}
                        {xListeColAnimals[8][1] === 1 ? <th className="thcenter" title="Market price per unit">{imgExchng}</th> : null}
                        {xListeColAnimals[9][1] === 1 ? <th className="thcenterbrdleft" title="Prod cost per unit">{prod2img2}Cost/u</th> : null}
                        {xListeColAnimals[10][1] === 1 ? <th className="thcenter" title="Coef market / production"> % </th> : null}
                        {xListeColAnimals[10][1] === 1 ? <th className="thcenter" title="Prod cost per unit buying food at market">Buy<div>crops</div></th> : null}
                        {xListeColAnimals[10][1] === 1 ? <th className="thcenter" title="Coef market / production buying food comp at p2p"> % </th> : null}
                        {xListeColAnimals[10][1] === 1 ? <th className="thcenterbrdright" title="Market price per unit">{imgExchng}</th> : null}
                    </tr>
                    <tr>
                        {/* <td></td> */}
                        {xListeColAnimals[0][1] === 1 ? <td className="tdcenter">
                            <div className="selectquantityback" style={{ top: `4px` }}>
                                <FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                                    <InputLabel></InputLabel>
                                    <Select name="selectedAnimalLvl" value={selectedAnimalLvl} onChange={handleUIChange}>
                                        <MenuItem value="farm">Farm</MenuItem>
                                        <MenuItem value="all">All lvl</MenuItem>
                                    </Select></FormControl>
                            </div>
                        </td> : null}
                        {xListeColAnimals[1][1] === 1 ? <td className="tdcenter"></td> : null}
                        {xListeColAnimals[2][1] === 1 ? <td className="tdcenter">{showTotal && parseFloat(prod1Total).toFixed(2)}</td> : null}
                        {xListeColAnimals[3][1] === 1 ? <td className="tdcenter">{showTotal && parseFloat(prod2Total).toFixed(2)}</td> : null}
                        {xListeColAnimals[4][1] === 1 ? <td className="tdcenter" style={{ fontSize: "11px", verticalAlign: "middle" }}>
                            {/* {foodTotal.corn > 0 && (
                  <div style={{ marginLeft: "0px" }}>
                    {parseFloat(foodTotal.corn).toFixed(2)} {imgcorn}
                  </div>
                )}
                {foodTotal.wheat > 0 && (
                  <div style={{ marginLeft: "8px" }}>
                    {parseFloat(foodTotal.wheat).toFixed(2)} {imgwheat}
                  </div>
                )}
                {foodTotal.barley > 0 && (
                  <div style={{ marginLeft: "16px" }}>
                    {parseFloat(foodTotal.barley).toFixed(2)} {imgbarley}
                  </div>
                )}
                {foodTotal.kale > 0 && (
                  <div style={{ marginLeft: "8px" }}>
                    {parseFloat(foodTotal.kale).toFixed(2)} {imgkale}
                  </div>
                )}
                {foodTotal.omni > 0 && (
                  <div style={{ marginLeft: "0px" }}>
                    {parseFloat(foodTotal.omni).toFixed(2)} {ximgomni}
                  </div>
                )} */}
                            {showTotal && (<>
                                {foodTotal.corn > 0 && parseFloat(foodTotal.corn).toFixed(2)}{foodTotal.corn > 0 && imgcorn}
                                {foodTotal.wheat > 0 && parseFloat(foodTotal.wheat).toFixed(2)}{foodTotal.wheat > 0 && imgwheat}
                                {foodTotal.barley > 0 && parseFloat(foodTotal.barley).toFixed(2)}{foodTotal.barley > 0 && imgbarley}
                                {foodTotal.kale > 0 && parseFloat(foodTotal.kale).toFixed(2)}{foodTotal.kale > 0 && imgkale}
                                {foodTotal.omni > 0 && parseFloat(foodTotal.omni).toFixed(2)}{foodTotal.omni > 0 && ximgomni}</>)}
                        </td> : null}
                        {xListeColAnimals[5][1] === 1 ? <td className="tdcenter">{showTotal && (<>{parseFloat(foodcostTotal).toFixed(3)}{ximgsfl}</>)}</td> : null}
                        {xListeColAnimals[6][1] === 1 ? <td className="tdcenter">{showTotal && (<>{parseFloat(foodcostp2pTotal).toFixed(3)}{ximgsfl}</>)}</td> : null}
                        {xListeColAnimals[7][1] === 1 ? <td className="tdcenterbrdleft"></td> : null}
                        {xListeColAnimals[8][1] === 1 ? <td className="tdcenter"></td> : null}
                        {xListeColAnimals[8][1] === 1 ? <td className="tdcenter"></td> : null}
                        {xListeColAnimals[8][1] === 1 ? <td className="tdcenter"></td> : null}
                        {xListeColAnimals[8][1] === 1 ? <td className="tdcenter">{showTotal && (<>{parseFloat(prod1costp2pTotal).toFixed(3)}{ximgsfl}</>)}</td> : null}
                        {xListeColAnimals[9][1] === 1 ? <td className="tdcenterbrdleft"></td> : null}
                        {xListeColAnimals[10][1] === 1 ? <td className="tdcenter"></td> : null}
                        {xListeColAnimals[10][1] === 1 ? <td className="tdcenter"></td> : null}
                        {xListeColAnimals[10][1] === 1 ? <td className="tdcenter"></td> : null}
                        {xListeColAnimals[10][1] === 1 ? <td className="tdcenterbrdright">{showTotal && (<>{parseFloat(prod2costp2pTotal).toFixed(3)}{ximgsfl}</>)}</td> : null}
                    </tr>
                </thead>
            );
            table.push(
                <>
                    <table className="table">
                        {tableHeader}
                        <tbody>
                            {tableContent}
                        </tbody>
                    </table>
                </>
            );
        }

        return (table);
    }
}