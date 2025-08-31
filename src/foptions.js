import React, { useEffect, useState } from 'react';
import DropdownCheckbox from './listcol.js';
import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';

const imgna = "./icon/nft/na.png";
const imgsfl = <img src="./icon/res/flowertoken.webp" style={{ width: "15px", height: "15px" }} />
const imgcoins = <img src="./icon/res/coins.png" style={{ width: "15px", height: "15px" }} />
const imggems = <img src="./icon/res/gem.webp" style={{ width: "15px", height: "15px" }} />

function ModalOptions({ onClose, dataSet, onOptionChange, API_URL }) {
    const [isOpen, setIsOpen] = useState(false);
    const [justOpened, setJustOpened] = useState(true);
    const [tradeTax, setTradeTax] = useState(dataSet.tradeTax || "");
    const [gemRatio, setGemRatio] = useState(dataSet.gemsRatio || "");
    //const [pos, setPos] = useState({ x: clickPosition.x, y: clickPosition.y });
    //const [inputFarmTime, setInputFarmTime] = useState(dataSet.inputFarmTime);
    //const [inputMaxBB, setInputMaxBB] = useState(dataSet.inputFarmTime);

    const closeModal = () => {
        setIsOpen(false);
        setTimeout(onClose, 300);
    };
    const handleDonClick = (address, element) => {
        const textarea = document.createElement('textarea');
        textarea.value = address;
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        if (success) {
            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltipfrmid');
            tooltip.textContent = address + ' copied !';
            const rect = element.getBoundingClientRect();
            tooltip.style.top = rect.top + 40 + 'px';
            tooltip.style.left = rect.left - 70 + 'px';
            document.body.appendChild(tooltip);
            setTimeout(() => {
                document.body.removeChild(tooltip);
            }, 2000);
            document.body.removeChild(textarea);
        };
    }
    const resetTax = async () => {
        try {
            const headers = {
                frmid: dataSet.farmId,
                //xoptions: dataSet.options,
            };
            const response = await fetch(API_URL + "/settax", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(headers)
                //headers: headers
            });
            if (response.ok) {
                const responseData = await response.json();
                dataSet.tradeTax = responseData;
                setTradeTax(responseData);
            } else {
                if (response.status === 429) {
                    console.log('Too many requests, wait a few seconds');
                } else {
                    console.log(`Error : ${response.status}`);
                }
            }
        } catch (error) {
            console.log(`Error : ${error}`);
        }
    };
    function handleChangeTradeTax(e) {
        setTradeTax(e.target.value);
        onOptionChange(e);
    }
    function handleChangeGemRatio(e) {
        e.name = "gemsRatio";
        const gemPack = dataSet.gemsPack;
        let gemRatioValue = 0;
        const usdFlwr = Number(dataSet.usdSfl) || 0;
        if(gemPack === "100") {gemRatioValue = (0.9 / usdFlwr) / gemPack}
        if(gemPack === "650") {gemRatioValue = (4.54 / usdFlwr) / gemPack}
        if(gemPack === "1350") {gemRatioValue = (9.09 / usdFlwr) / gemPack}
        if(gemPack === "2800") {gemRatioValue = (18.19 / usdFlwr) / gemPack}
        if(gemPack === "7400") {gemRatioValue = (45.49 / usdFlwr) / gemPack}
        if(gemPack === "15500") {gemRatioValue = (90.99 / usdFlwr) / gemPack}
        if(gemPack === "200000") {gemRatioValue = (909.99 / usdFlwr) / gemPack}
        dataSet.gemsRatio = gemRatioValue;
        setGemRatio(gemRatioValue);
        onOptionChange(e);
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setJustOpened(false);
        }, 200);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        setTimeout(() => {
            //setPos({ x: "50%", y: "50%" });
            setIsOpen(true);
        }, 50);
    }, []);
    /* useEffect(() => {
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [justOpened]); */
    useEffect(() => {
        //setTradeTax(dataSet.tradeTax || "");
    }, [dataSet.tradeTax]);
    return (
        <div className={`tooltip-wrapper ${isOpen ? "open" : ""}`}>
            <div className="tooltip"
                /* style={{
                    left: typeof pos.x === "number" ? `${pos.x}px` : pos.x,
                    top: typeof pos.y === "number" ? `${pos.y}px` : pos.y,
                }}> */
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}>
                <button onClick={closeModal} class="button" align="right" position='absolute'><img src="./icon/ui/cancel.png" alt="" className="resico" /></button>
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Preferences</span>
                <div><input type="text" onChange={onOptionChange} value={dataSet.inputFarmTime || 0}
                    name={"FarmTime"} style={{ textAlign: "left", width: "30px" }} />Hours you can check your farm daily</div>
                <div><input type="text" onChange={onOptionChange} value={dataSet.inputMaxBB || 0}
                    name={"MaxBB"} style={{ textAlign: "left", width: "30px" }} />Restock daily</div>
                <div><input type="text" onChange={onOptionChange} value={dataSet.coinsRatio || 0}
                    name={"CoinsRatio"} style={{ textAlign: "left", width: "30px" }} />Coins{imgcoins}/{imgsfl}Flower</div>
                {dataSet.isAbo ? (<><div style={{ display: 'flex', alignItems: 'center' }}><input type="text" onChange={onOptionChange} value={dataSet.gemsRatio || 0}
                    name={"GemsRatio"} style={{ textAlign: "left", width: "30px" }} />Gems{imggems}/{imgsfl}Flower 
                    <div className="selectinvback" style={{ display: 'flex', alignItems: 'left', height: '20px', width: '80px', margin: "0", padding: "0" }}>
                        <FormControl variant="standard" id="formselectinv" className="selectinv" size="small">
                            <InputLabel>Pack</InputLabel>
                            <Select value={dataSet.gemsPack} onChange={handleChangeGemRatio}>
                                <MenuItem value="100">100{imggems}</MenuItem>
                                <MenuItem value="650">650{imggems}</MenuItem>
                                <MenuItem value="1350">1350{imggems}</MenuItem>
                                <MenuItem value="2800">2800{imggems}</MenuItem>
                                <MenuItem value="7400">7400{imggems}</MenuItem>
                                <MenuItem value="15500">15500{imggems}</MenuItem>
                                <MenuItem value="200000">200000{imggems}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                </>) : null}
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}><input type="text" onChange={handleChangeTradeTax} value={tradeTax}
                    name={"tradeTax"} style={{ textAlign: "left", width: "30px" }} />
                    <button onClick={resetTax} class="button small-btn" align="right" position='absolute'><img src="./icon/ui/refresh.png" alt="" className="resico" /></button>
                    Trade Tax
                </div>
                {dataSet.animalLvl && Object.entries(dataSet.animalLvl).map(([animal, lvl]) => (
                    <div key={animal}>
                        <input
                            type="text"
                            name={`animalLvl_${animal}`}
                            value={lvl}
                            onChange={e => onOptionChange({
                                target: {
                                    name: `animalLvl_${animal}`,
                                    value: e.target.value
                                }
                            })}
                            style={{ textAlign: "left", width: "25px" }}
                        />
                        <label style={{ marginRight: "8px" }}>{animal} lvl</label>
                    </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                        type="checkbox"
                        onChange={onOptionChange}
                        checked={!!dataSet.useNotifications}
                        name={"useNotifications"}
                        style={{ width: "18px", height: "18px", marginRight: 6 }}
                    />
                    <span style={{ fontSize: 15, marginRight: 6 }}>Notifications</span>
                    <DropdownCheckbox
                        options={dataSet.notifList}
                        onChange={onOptionChange}
                        listIcon={"./options.png"}
                    />
                </div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.toolsBurn}
                    name={"toolsBurn"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Ressources burned by tools in daily numbers</div>
                {dataSet.isAbo ? (<>
                    <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.usePriceFood}
                        name={"usePriceFood"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Use cheaper food for animals</div>
                </>) : null}
                <div className="don">
                    <a id="copy-link" href="#" onClick={(event) => handleDonClick("0xAc3c7f9f1f8492Cc10A4fdb8C738DD82013d61dA", event.target)} title="Clic to copy">
                        0xAc3c7f9f1f8492Cc10A4fdb8C738DD82013d61dA</a>
                    <p>if you want to give me a coffee : </p>
                </div>
            </div>
        </div>
    );
}

export default ModalOptions;