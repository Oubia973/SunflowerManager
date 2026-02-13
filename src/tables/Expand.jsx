import React from "react";
import { useAppCtx } from "../context/AppCtx";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { frmtNb, convTime } from '../fct.js';
import DList from "../dlist.jsx";

export default function ExpandTable() {
  const {
    data: { dataSet, dataSetFarm, farmData },
    ui: {
      fromexpand,
      toexpand,
      selectedExpandType,
      xListeColExpand,
      TryChecked,
    },
    actions: {
      handleUIChange,
    },
    img: {
      imgsfl,
      imgcrop,
      imgwood,
      imgstone,
      imgexchng,
      imgExchng
    }
  } = useAppCtx();
  if (farmData.inventory) {
    const { expandData } = dataSetFarm.frmData;
    const { it } = dataSetFarm.itables;
    //const expEntries = Object.entries(expand);
    //const expKeys = Object.keys(expand);
    const fromtoexpand = dataSet.fromtoexpand;
    const expKeys = Object.keys(fromtoexpand.expandData);
    var i = 0;
    const imgcropnode = <img src={imgcrop} alt={''} className="nodico" title="Crop Node" />;
    const imgfruitnode = <img src="./icon/res/apple_tree.png" alt={''} className="nodico" title="Fruit Patch" />;
    const imgwoodnode = <img src={imgwood} alt={''} className="nodico" title="Tree" />;
    const imgstonenode = <img src={imgstone} alt={''} className="nodico" title="Stone Node" />;
    const imgironnode = <img src="./icon/res/iron_small.png" alt={''} className="nodico" title="Iron Node" />;
    const imggoldnode = <img src="./icon/res/gold_small.png" alt={''} className="nodico" title="Gold Node" />;
    const imgcrimstonenode = <img src="./icon/res/crimstone_rock_5.webp" alt={''} className="nodico" title="Crimstone Node" />;
    const imgsunstonenode = <img src="./icon/res/sunstone_rock_1.webp" alt={''} className="nodico" title="Sunstone Node" />;
    const imgoilnode = <img src="./icon/res/oil.webp" alt={''} className="nodico" title="Oil Node" />;
    const imglavapitnode = <img src="./icon/res/lava_pit.webp" alt={''} className="nodico" title="Lavapit Node" />;
    const imgbeehivenode = <img src="./icon/res/beehive.webp" alt={''} className="itico" title="Beehive" />;
    const imgwoodres = <img src="./icon/res/wood.png" alt={''} className="itico" title="Wood" />;
    const imgstoneres = <img src="./icon/res/stone.png" alt={''} className="itico" title="Stone" />;
    const imgironres = <img src="./icon/res/iron_ore.png" alt={''} className="itico" title="Iron" />;
    const imggoldres = <img src="./icon/res/gold_ore.png" alt={''} className="itico" title="Gold" />;
    const imgcrimstoneres = <img src="./icon/res/crimstone.png" alt={''} className="itico" title="Crimstone" />;
    const imgoilres = <img src="./icon/res/oil.webp" alt={''} className="itico" title="Oil" />;
    const imgobsidianres = <img src="./icon/res/obsidian.webp" alt={''} className="itico" title="Obsidian" />;
    const imgbbres = <img src="./icon/res/gem.webp" alt={''} className="itico" title="Gems" />;
    const imgcoinres = <img src="./icon/res/coins.png" alt={''} className="itico" title="Coins" />;
    const imgsflres = <img src={imgsfl} alt={''} className="itico" title="Flower" />;
    const itotTime = fromtoexpand.expand.totalTime / (60 * 60 * 24);
    const totTime = convTime(itotTime);
    const imglvl = './icon/ui/confirm.png';
    const tableContent = expKeys.map(([element]) => {
      let resTotal = 0;
      let resTotalM = 0;
      i++;
      //const indx = Number(element);
      //const cobj = expand[i];
      const cobj = fromtoexpand.expandData[i];
      const resBB = cobj.resources ? cobj.resources["Block Buck"] : "";
      const resCoins = cobj.resources ? cobj.resources.Coins : "";
      const resWood = cobj.resources ? cobj.resources.Wood || "" : "";
      const resStone = cobj.resources ? cobj.resources.Stone || "" : "";
      const resIron = cobj.resources ? cobj.resources.Iron || "" : "";
      const resGold = cobj.resources ? cobj.resources.Gold || "" : "";
      const resCrimstone = cobj.resources ? cobj.resources.Crimstone ? cobj.resources.Crimstone || "" : "" : "";
      const resOil = cobj.resources ? cobj.resources.Oil ? cobj.resources.Oil || "" : "" : "";
      const resObsidian = cobj.resources ? cobj.resources.Obsidian ? cobj.resources.Obsidian || "" : "" : "";
      const nodCrop = cobj.nodes ? cobj.nodes.Crop || "" : "";
      const nodFruit = cobj.nodes ? cobj.nodes.Fruit || "" : "";
      const nodTree = cobj.nodes ? cobj.nodes.Wood || "" : "";
      const nodStone = cobj.nodes ? cobj.nodes.Stone || "" : "";
      const nodIron = cobj.nodes ? cobj.nodes.Iron || "" : "";
      const nodGold = cobj.nodes ? cobj.nodes.Gold || "" : "";
      const nodCrimstone = cobj.nodes ? cobj.nodes.Crimstone ? cobj.nodes.Crimstone || "" : "" : "";
      const nodSunstone = cobj.nodes ? cobj.nodes.Sunstone ? cobj.nodes.Sunstone || "" : "" : "";
      const nodBeehive = cobj.nodes ? cobj.nodes.Beehive ? cobj.nodes.Beehive || "" : "" : "";
      const nodOil = cobj.nodes ? cobj.nodes.Oil ? cobj.nodes.Oil || "" : "" : "";
      const nodLavapit = cobj.nodes ? cobj.nodes.Lavapit ? cobj.nodes.Lavapit || "" : "" : "";
      const itime = cobj.seconds ? cobj.seconds / (60 * 60 * 24) : 0;
      const time = convTime(itime);
      const level = cobj.bumpkinLevel || "";
      const imglvlfarm = expandData.current === i ? <img src={imglvl} alt={''} className="itico" title="Your lvl" /> : "";
      const indexrow = i;
      if (cobj.resources) {
        for (let [resItem, resValue] of Object.entries(cobj.resources)) {
          //console.log("hello");
          const resPrice = resItem === "Block Buck" ?
            resValue * dataSet.options.gemsRatio
            : resItem === "Coins" ?
              resValue
              : ((!TryChecked ? it[resItem].cost : it[resItem].costtry) * resValue);
          resTotal += (resPrice / dataSet.options.coinsRatio);
          const resPriceM = resItem === "Block Buck" ?
            resValue * (dataSet.options?.gemsRatio || 0.07)
            : resItem === "Coins" ?
              resValue / dataSet.options.coinsRatio
              : ((it[resItem].costp2pt) * resValue);
          resTotalM += (resPriceM);
        }
      }
      return (
        <tr key={indexrow}>
          {xListeColExpand[0][1] === 1 ? <td className="tdcenter">{i}</td> : null}
          {xListeColExpand[1][1] === 1 ? <td className="tdcenter">{level}</td> : null}
          <td className="tdcenter">{imglvlfarm}</td>
          {xListeColExpand[2][1] === 1 ? <td className="tdcenter">
            <input
              type="radio"
              name="fromexpand"
              value={indexrow}
              className="round-checkbox"
              checked={Number(fromexpand) === indexrow}
              onChange={handleUIChange}
            />
          </td> : null}
          {xListeColExpand[2][1] === 1 ? <td className="tdcenter">
            <input
              type="radio"
              name="toexpand"
              value={indexrow}
              className="round-checkbox"
              checked={Number(toexpand) === indexrow}
              onChange={handleUIChange}
            />
          </td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodCrop}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodFruit}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodTree}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodStone}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodIron}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodGold}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodCrimstone}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodSunstone}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodBeehive}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodOil}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{nodLavapit}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{time}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resWood}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resStone}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resIron}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resGold}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resCrimstone}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resOil}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resObsidian}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resBB}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{resCoins}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{frmtNb(resTotal)}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{frmtNb(resTotalM)}</td> : null}
        </tr>
      );
    });
    let resTTotal = 0;
    let resTTotalM = 0;
    for (let [resItem, resValue] of Object.entries(fromtoexpand.expand.totalResources)) {
      //console.log("hello");
      const resPrice = resItem === "Block Buck" ?
        resValue * dataSet.options.gemsRatio
        : resItem === "Coins" ?
          resValue
          : ((!TryChecked ? it[resItem].cost : it[resItem].costtry) * resValue);
      resTTotal += (resPrice / dataSet.options.coinsRatio);
      const resPriceM = resItem === "Block Buck" ?
        resValue * (dataSet.options?.gemsRatio || 0.07)
        : resItem === "Coins" ?
          resValue / dataSet.options.coinsRatio
          : (it[resItem].costp2pt * resValue);
      resTTotalM += (resPriceM);
    }
    const tableHeader = (
      <thead>
        <tr>
          {xListeColExpand[0][1] === 1 ? <th className="th-icon">
            {/* <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
              <InputLabel>LVL</InputLabel>
              <Select name="selectedExpandType" value={selectedExpandType} onChange={handleUIChange}>
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="spring">Spring</MenuItem>
                <MenuItem value="desert">Desert</MenuItem>
                <MenuItem value="volcano">Volcan</MenuItem>
              </Select></FormControl></div> */}
              <DList
                name="selectedExpandType"
                title="LVL"
                options={[
                  { value: "basic", label: "Basic" },
                  { value: "spring", label: "Spring" },
                  { value: "desert", label: "Desert" },
                  { value: "volcano", label: "Volcan" },
                ]}
                value={selectedExpandType}
                onChange={handleUIChange}
                height={28}
              />
              </th> : null}
          {xListeColExpand[1][1] === 1 ? <th className="thcenter">Bumpkin</th> : null}
          <th className="tdcenter">Farm</th>
          {xListeColExpand[2][1] === 1 ? <th className="thcenter">From</th> : null}
          {xListeColExpand[2][1] === 1 ? <th className="thcenter">To</th> : null}
          {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgcropnode}</th> : null}
          {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgfruitnode}</th> : null}
          {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgwoodnode}</th> : null}
          {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgstonenode}</th> : null}
          {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgironnode}</th> : null}
          {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imggoldnode}</th> : null}
          {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgcrimstonenode}</th> : null}
          {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgsunstonenode}</th> : null}
          {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgbeehivenode}</th> : null}
          {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imgoilnode}</th> : null}
          {xListeColExpand[3][1] === 1 ? <th className="thcenter">{imglavapitnode}</th> : null}
          {xListeColExpand[3][1] === 1 ? <th className="thcenter">Time</th> : null}
          {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgwoodres}</th> : null}
          {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgstoneres}</th> : null}
          {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgironres}</th> : null}
          {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imggoldres}</th> : null}
          {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgcrimstoneres}</th> : null}
          {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgoilres}</th> : null}
          {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgobsidianres}</th> : null}
          {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgbbres}</th> : null}
          {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgcoinres}</th> : null}
          {xListeColExpand[4][1] === 1 ? <th className="thcenter">Value {imgsflres}</th> : null}
          {xListeColExpand[4][1] === 1 ? <th className="thcenter">{imgExchng}</th> : null}
        </tr>
        <tr>
          {xListeColExpand[0][1] === 1 ? <td className="tdcenter">TOTAL</td> : null}
          {xListeColExpand[1][1] === 1 ? <td className="tdcenter"></td> : null}
          <td className="tdcenter"></td>
          {xListeColExpand[2][1] === 1 ? <td className="tdcenter"></td> : null}
          {xListeColExpand[2][1] === 1 ? <td className="tdcenter"></td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Crop}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Fruit}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Wood}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Stone}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Iron}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Gold}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Crimstone}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Sunstone}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Beehive}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Oil}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalNodes.Lavapit}</td> : null}
          {xListeColExpand[3][1] === 1 ? <td className="tdcenter">{totTime}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Wood}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Stone}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Iron}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Gold}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Crimstone}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Oil}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Obsidian}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources["Block Buck"]}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{fromtoexpand.expand.totalResources.Coins}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{frmtNb(resTTotal)}</td> : null}
          {xListeColExpand[4][1] === 1 ? <td className="tdcenter">{frmtNb(resTTotalM)}</td> : null}
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