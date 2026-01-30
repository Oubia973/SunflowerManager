import { useAppCtx } from "../context/AppCtx";

export default function MapTable() {
    const {
        data: { dataSetFarm },
    } = useAppCtx();
    if (dataSetFarm.isleMap) {
        const { isleMap } = dataSetFarm;
        const { nftw } = dataSetFarm.boostables;
        const { it } = dataSetFarm.itables;
        let minYield = Infinity;
        let minYieldGH = Infinity;
        let cropMachineDone = false;
        let greenhouseDone = false;
        const isGA = nftw["Green Amulet"].isactive;
        const imgcropmachine = "./icon/building/stage1_collector_empty.webp";
        const imggreenhouse = "./icon/building/greenhouse.webp";
        const imgbee = <img src="./icon/ui/bee.webp" alt={''} title="Bee swarm" style={{ position: 'absolute', transform: 'translate(20%, -110%)', width: '14px', height: '14px' }} />;
        const minX = Math.min(...Object.keys(isleMap).map(x => parseInt(x)));
        const minY = Math.min(...Object.values(isleMap).flatMap(row => Object.keys(row).map(y => parseInt(y))));
        const maxX = Math.max(...Object.keys(isleMap).map(x => parseInt(x)));
        const maxY = Math.max(...Object.values(isleMap).flatMap(row => Object.keys(row).map(y => parseInt(y))));
        const adjustedIsleMap = Array.from({ length: maxX - minX + 1 }, () => ({}));
        let rdyAtValues = [];
        let lastCropMachineX = -1;
        let lastCropMachineY = -1;
        let lastGreenhouseX = -1;
        let lastGreenhouseY = -1;
        let greenprocIndices = [];
        let lastGreenProc = 0;
        let cropIndexTotal = 0;
        let cropIndex = 0;
        let isLastCrop = false;
        Object.keys(isleMap).forEach(x => {
            const adjustedX = x - minX;
            Object.keys(isleMap[x]).forEach(y => {
                const adjustedY = y - minY;
                adjustedIsleMap[adjustedX][adjustedY] = isleMap[x][y];
                const typeNode = isleMap[x][y].type;
                const amountNode = isleMap[x][y].amount;
                const amountValue = Number(amountNode);
                if (it[typeNode]?.cat === "crop" && Number.isFinite(amountValue)) {
                    minYield = amountValue < minYield ? amountValue : minYield;
                    rdyAtValues.push(isleMap[x][y].rdyAt);
                }
                if (typeNode === "greenhouse" && Number.isFinite(amountValue)) {
                    minYieldGH = amountValue < minYieldGH ? amountValue : minYieldGH;
                    lastGreenhouseX = adjustedX;
                    lastGreenhouseY = adjustedY;
                }
                if (typeNode === "crop machine") {
                    lastCropMachineX = adjustedX;
                    lastCropMachineY = adjustedY;
                }
            });
        });
        rdyAtValues.sort((a, b) => a - b);
        const rdyAtMap = new Map();
        rdyAtValues.forEach((value, index) => {
            rdyAtMap.set(value, index);
        });
        adjustedIsleMap.forEach((row, x) => {
            Object.keys(row).forEach(y => {
                const item = row[y];
                const itemType = item.type;
                //console.log(item);
                if ((it[itemType]?.cat === "crop") && (item.amount > minYield + 9)) {
                    greenprocIndices.push(rdyAtMap.get(item.rdyAt));
                }
            });
        });
        greenprocIndices.sort((a, b) => a - b);
        let rngColor = [];
        let rngColor2 = [];
        let rngColor3 = [];
        let lastStart = 0;
        const previousColors = [];
        function getBackgroundColor(index) {
            let start = 0;
            let end = rdyAtValues.length - 1;
            for (let i = 0; i < greenprocIndices.length; i++) {
                if (index <= greenprocIndices[i]) {
                    end = greenprocIndices[i];
                    break;
                }
                start = greenprocIndices[i];
                lastStart = start;
            }
            const ratio = (index - start) / (end - start);
            if (!rngColor[end]) {
                let xR, xG, xB, isUnique;
                let min = 0;
                let max = 256;
                do {
                    xR = Math.floor(Math.random() * 156) + 100;
                    xG = Math.floor(Math.random() * 156) + 100;
                    xB = Math.floor(Math.random() * 156) + 100;
                    min = Math.min(xR, xG, xB);
                    max = Math.max(xR, xG, xB);
                    isUnique = (max - min >= 50);
                    for (let prev of previousColors.slice(-5)) {
                        let diff = Math.abs(prev.xR - xR) + Math.abs(prev.xG - xG) + Math.abs(prev.xB - xB);
                        if (diff < 100) {
                            isUnique = false;
                            break;
                        }
                    }
                } while (!isUnique);
                rngColor[end] = xR;
                rngColor2[end] = xG;
                rngColor3[end] = xB;
            }
            return `rgba(${rngColor[end]}, ${rngColor2[end]}, ${rngColor3[end]}, ${ratio})`;
        }
        const table = Array.from({ length: maxY - minY + 1 }, () => Array(maxX - minX + 1).fill(null));
        adjustedIsleMap.forEach((row, x) => {
            Object.keys(row).forEach(y => {
                const item = row[y];
                const tableX = parseInt(x);
                const tableY = maxY - minY - parseInt(y);
                const itemType = item.type;
                const amount = parseFloat(item.amount).toFixed(2 * (itemType !== "crop machine"));
                const Greenproc = (it[itemType]?.cat === "crop") && (item.amount > minYield + 8);
                const GreenprocGH = (itemType === "greenhouse") && (item.amount > minYieldGH + 8);
                const colorAmount = (Greenproc || GreenprocGH) ? 'red' : 'white';
                const rdyAtIndex = rdyAtMap.get(item.rdyAt);
                const backColor = (it[itemType]?.cat === "crop" && isGA) ? getBackgroundColor(rdyAtIndex) : 'transparent';
                const mapX = item?.x || "";
                const mapY = item?.y || "";
                if (Greenproc) {
                    lastGreenProc = rdyAtIndex;
                }
                if (item.type === "crop") {
                    cropIndexTotal++;
                    cropIndex = ((rdyAtIndex + 1) - (lastStart + 1)) + (1 * (rdyAtIndex === 0));
                    isLastCrop = (rdyAtIndex === (rdyAtValues.length - 1));
                    //cropIndex = rdyAtIndex;
                }
                const typeOrName = item.name ? item.name : item.type;
                const isSwarm = item.swarm && imgbee;
                const toReset = item.reset && item.reset;
                const gaProc = item?.gaproc ? "X" : "";
                cropMachineDone = (x === lastCropMachineX && y === lastCropMachineY);
                greenhouseDone = (x === lastGreenhouseX && y === lastGreenhouseY);
                //const ximgcropmachine = (item.type === "crop machine" && cropMachineDone === true) ? <img src={imgcropmachine} className="image-overflow" /> : "";
                //const ximggreenhouse = (item.type === "greenhouse" && greenhouseDone === true) ? <img src={imggreenhouse} className="image-overflow" /> : "";
                table[tableY][tableX] = (
                    <td key={`${tableX}-${tableY}`} style={{ position: 'relative', backgroundColor: backColor }} title={typeOrName}>
                        {/* {ximgcropmachine}
              {ximggreenhouse} */}
                        <img src={item.img} style={{ width: '22px', height: '22px' }} />
                        <span style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -10%)',
                            color: colorAmount,
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            padding: '0px 0px',
                            borderRadius: '0px',
                            fontSize: '11px'
                        }}>
                            {isSwarm}
                            {amount}
                        </span>
                        <span style={{
                            position: 'absolute',
                            top: '10%',
                            left: '90%',
                            transform: 'translate(-50%, -50%)',
                            color: 'rgb(45, 252, 55)',
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            padding: '0px 0px',
                            borderRadius: '0px',
                            fontSize: '11px'
                        }}>
                            {toReset}{gaProc}
                            {(item.type === "crop" && isGA === 1 && (Greenproc || isLastCrop)) && cropIndex}
                        </span>
                        {/* <span style={{
                position: 'absolute',
                top: '0%',
                right: '0%',
                transform: 'translate(-50%, -50%)',
                color: 'rgb(36, 229, 255)',
                padding: '0px 0px',
                borderRadius: '0px',
                fontSize: '11px'
              }}>
                {rdyAtIndex}
                {mapX}{","}{mapY}
              </span> */}
                    </td>
                );
            });
        });

        const tableContent = table.map((row, rowIndex) => (
            <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                    cell || <td key={`${cellIndex}-${rowIndex}`} />
                ))}
            </tr>
        ));

        const tableElement = (
            <>
                <table class="tablemap">
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </>
        );

        return (tableElement);
    }
}
