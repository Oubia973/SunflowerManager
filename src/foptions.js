import React, { useEffect, useState, useRef } from 'react';
import DropdownCheckbox from './listcol.js';
import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';
import { frmtNb } from './fct.js';

const imgna = "./icon/nft/na.png";
const imgsfl = <img src="./icon/res/flowertoken.webp" style={{ width: "15px", height: "15px" }} />
const imgcoins = <img src="./icon/res/coins.png" style={{ width: "15px", height: "15px" }} />
const imggems = <img src="./icon/res/gem.webp" style={{ width: "15px", height: "15px" }} />

function ModalOptions({ onClose, dataSet, onOptionChange, API_URL }) {
    const [isOpen, setIsOpen] = useState(false);
    const [justOpened, setJustOpened] = useState(true);
    const [tradeTax, setTradeTax] = useState(dataSet.tradeTax || "");
    //const [gemRatio, setGemRatio] = useState(dataSet.gemsRatio || "");
    //const [pos, setPos] = useState({ x: clickPosition.x, y: clickPosition.y });
    //const [inputFarmTime, setInputFarmTime] = useState(dataSet.inputFarmTime);
    //const [inputMaxBB, setInputMaxBB] = useState(dataSet.inputFarmTime);
    //const windowRef = useRef(null);
    /* let centerX, centerY = 0
    if (windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        centerX = (window.innerWidth - rect.width) / 2;
        centerY = (window.innerHeight - rect.height) / 2;
        //setPos({ x: centerX, y: centerY });
    } */
    const [pos, setPos] = useState({ x: 100, y: 100 });
    const [dragging, setDragging] = useState(false);
    const offset = useRef({ x: 0, y: 0 });
    const getClientPos = (e) => {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    };
    const isInteractive = (target) =>
        !!target.closest(
            'input, textarea, select, button, a, label, [role="button"], .MuiInputBase-root, .MuiButtonBase-root'
        );
    const handleMouseDown = (e) => {
        if (isInteractive(e.target)) return;
        const { x, y } = getClientPos(e);
        setDragging(true);
        offset.current = { x: x - pos.x, y: y - pos.y };
    };
    const handleMouseMove = (e) => {
        if (!dragging) return;
        const { x, y } = getClientPos(e);
        setPos({ x: x - offset.current.x, y: y - offset.current.y });
    };
    const handleMouseUp = () => {
        setDragging(false);
    };

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
                username: dataSet.username,
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
        dataSet.gemsPack = e.target.value;
        const gemPack = dataSet.gemsPack;
        let gemRatioValue = 0;
        const usdFlwr = Number(dataSet.usdSfl) || 0;
        if (gemPack === "100") { gemRatioValue = (0.9 / usdFlwr) / gemPack }
        if (gemPack === "650") { gemRatioValue = (4.54 / usdFlwr) / gemPack }
        if (gemPack === "1350") { gemRatioValue = (9.09 / usdFlwr) / gemPack }
        if (gemPack === "2800") { gemRatioValue = (18.19 / usdFlwr) / gemPack }
        if (gemPack === "7400") { gemRatioValue = (45.49 / usdFlwr) / gemPack }
        if (gemPack === "15500") { gemRatioValue = (90.99 / usdFlwr) / gemPack }
        if (gemPack === "200000") { gemRatioValue = (909.99 / usdFlwr) / gemPack }
        dataSet.gemsRatio = gemRatioValue;
        setGemRatio(gemRatioValue);
        onOptionChange(e);
    }
    const handleClickOutside = (event) => {
        if (justOpened) return;
        if (!event.target.closest(".tooltip")) {
            //closeModal();
        }
    };
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
    useEffect(() => {
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [justOpened]);
    useEffect(() => {
        //setTradeTax(dataSet.tradeTax || "");
    }, [dataSet]);
    return (
        <div className={`tooltip-wrapper ${isOpen ? "open" : ""}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}>
            <div className="tooltip"
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                style={{
                    position: "fixed",
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    cursor: dragging ? "grabbing" : "grab",
                }}
                /* style={{
                    left: typeof pos.x === "number" ? `${pos.x}px` : pos.x,
                    top: typeof pos.y === "number" ? `${pos.y}px` : pos.y,
                }}> */
                /* style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }} */>
                <button onClick={closeModal} class="button" align="right" position='absolute'><img src="./icon/ui/cancel.png" alt="" className="resico" /></button>
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Preferences</span>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.checkPlacedEquiped || 0}
                    name={"checkPlacedEquiped"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Check boosts placed/equipped</div>
                <div><input type="number" onChange={onOptionChange} value={dataSet.inputFarmTime || 15}
                    name={"FarmTime"} style={{ textAlign: "left", width: "45px" }} />Hours you can check your farm daily</div>
                <div><input type="number" onChange={onOptionChange} value={dataSet.inputMaxBB || 1}
                    name={"inputMaxBB"} style={{ textAlign: "left", width: "45px" }} />Restock daily</div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.autoRefill || 0}
                    name={"autoRefill"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Auto restock by time
                    <input type="checkbox" onChange={onOptionChange} checked={!!dataSet.showRestockCost || 0}
                        name={"showRestockCost"} style={{ width: "18px", height: "18px", marginRight: 6 }} />show in tooltip</div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.restockCostDaily || 0}
                    name={"restockCostDaily"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Restock counted in daily</div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.averageDailyCycles || 0}
                    name={"averageDailyCycles"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Daily cycles average when more than 24h</div>
                <div><input type="number" onChange={onOptionChange} value={dataSet.coinsRatio || 1000}
                    name={"CoinsRatio"} style={{ textAlign: "left", width: "45px" }} />Coins{imgcoins}/{imgsfl}Flower
                    <input type="checkbox" onChange={onOptionChange} checked={!!dataSet.autoCoinRatio || 0}
                        name={"autoCoinRatio"} style={{ width: "18px", height: "18px", marginRight: 6 }} />Auto</div>
                <div style={{ display: 'flex', alignItems: 'center' }}><input type="text" disabled onChange={onOptionChange} value={dataSet.gemsRatio || 0.07}
                    name={"GemsRatio"} style={{ textAlign: "left", width: "45px" }} />Flower{imgsfl}/{imggems}Gems
                    <div className="selectinvback" style={{ display: 'flex', alignItems: 'left', height: '20px', width: '80px', margin: "0", padding: "0" }}>
                        <FormControl variant="standard" id="formselectinv" className="selectinv" size="small">
                            <InputLabel></InputLabel>
                            <Select value={dataSet.gemsPack} onChange={handleChangeGemRatio}>
                                <MenuItem value="100">100{imggems}</MenuItem>
                                <MenuItem value="650">650{imggems}</MenuItem>
                                <MenuItem value="1350">1350{imggems}</MenuItem>
                                <MenuItem value="2800">2800{imggems}</MenuItem>
                                <MenuItem value="7400">7400{imggems}</MenuItem>
                                <MenuItem value="15500">15k5{imggems}</MenuItem>
                                <MenuItem value="200000">200k{imggems}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}><input type="number" onChange={handleChangeTradeTax} value={tradeTax}
                    name={"tradeTax"} style={{ textAlign: "left", width: "45px" }} />
                    <button
                        onPointerDown={(e) => {
                            const el = e.currentTarget;
                            if (el.dataset.locked === "1") {
                                e.preventDefault();
                                e.stopPropagation();
                                return;
                            }
                            el.dataset.locked = "1";
                        }}
                        onClick={(e) => {
                            const el = e.currentTarget;
                            if (el.disabled) return;
                            resetTax();
                            el.disabled = true;
                            el.classList.add("is-wait");
                            setTimeout(() => {
                                el.disabled = false;
                                el.classList.remove("is-wait");
                                el.dataset.locked = "";
                            }, 2000);
                        }}
                        //onClick={resetTax}
                        class="button small-btn"
                        align="right"
                        position='absolute'><img src="./icon/ui/refresh.png" alt="" className="resico" />
                    </button>
                    Trade Tax
                    <input type="checkbox" onChange={onOptionChange} checked={!!dataSet.autoTradeTax}
                        name={"autoTradeTax"} style={{ width: "18px", height: "18px", marginRight: 6 }} />Auto refresh
                </div>
                {dataSet.animalLvl && Object.entries(dataSet.animalLvl).map(([animal, lvl]) => (
                    <div key={animal}>
                        <input
                            type="number"
                            min={1}
                            max={15}
                            name={`animalLvl_${animal}`}
                            value={lvl}
                            onChange={e => {
                                let xvalue = e.target.value;
                                if (isNaN(xvalue)) xvalue = 7;
                                if (xvalue < 1) xvalue = 1;
                                if (xvalue > 15) xvalue = 15;
                                onOptionChange({
                                    target: {
                                        name: `animalLvl_${animal}`,
                                        value: xvalue
                                    }
                                });
                            }}
                            style={{ textAlign: "left", width: "45px" }}
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
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.oilFood}
                    name={"oilFood"} style={{ width: "18px", height: "18px", marginRight: 12 }} />use Oil for foods</div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.toolsBurn}
                    name={"toolsBurn"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Ressources burned by tools in daily</div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.usePriceFood}
                    name={"usePriceFood"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Use cheaper food for animals</div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.mergeAniProd}
                    name={"mergeAniProd"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Set animals 2nd prod.cost to 0</div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.ignoreAniLvl}
                    name={"ignoreAniLvl"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Ignore animals above selected lvl</div>
                {dataSet.isAbo ? (<>
                </>) : null}
                <div>
                    <p></p>
                    <div>if you liked this tool you can give me a coffee here : </div>
                    <div><a id="copy-link" href="#" onClick={(event) => handleDonClick("0xAc3c7f9f1f8492Cc10A4fdb8C738DD82013d61dA", event.target)} title="Clic to copy">
                        0xAc3c7f9f1f8492Cc10A4fdb8C738DD82013d61dA</a></div>
                    <div>and you can help my farm here :
                        <a id="visit-link" href="https://sunflower-land.com/play/#/visit/1972" title="Clic to visit my farm" target="_blank" rel="noopener noreferrer">
                            : Oubia</a></div>
                </div>
            </div>
        </div>
    );
}

export default ModalOptions;