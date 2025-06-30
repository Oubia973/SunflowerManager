import React, { useEffect, useState } from 'react';
import DropdownCheckbox from './listcol.js';
//import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';

function ModalOptions({ onClose, dataSet, onOptionChange, API_URL }) {
    const [isOpen, setIsOpen] = useState(false);
    const [justOpened, setJustOpened] = useState(true);
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
                dataSet.tradeTax = responseData.tradeTax;
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
                <div><input type="text" onChange={onOptionChange} value={dataSet.inputFarmTime || ""}
                    name={"FarmTime"} style={{ textAlign: "left", width: "30px" }} />Hours you can check your farm daily</div>
                <div><input type="text" onChange={onOptionChange} value={dataSet.inputMaxBB || ""}
                    name={"MaxBB"} style={{ textAlign: "left", width: "30px" }} />Restock daily</div>
                <div><input type="text" onChange={onOptionChange} value={dataSet.coinsRatio || ""}
                    name={"CoinsRatio"} style={{ textAlign: "left", width: "30px" }} />Coins/flower</div>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}><input type="text" onChange={onOptionChange} value={dataSet.tradeTax || ""}
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