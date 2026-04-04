import React, { useEffect, useState, useRef } from 'react';
import DropdownCheckbox from './listcol.js';
import DList from "./dlist.jsx";
import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';
import { frmtNb } from './fct.js';
import { computeGemsRatio, getGemsPackUsd } from './gemsRatio.js';
import { promptInfo } from './promptW';

const imgna = "./icon/nft/na.png";
const imgusdc = "./usdc.png";
const imgsfl = <img src="./icon/res/flowertoken.webp" style={{ width: "15px", height: "15px" }} />
const imgcoins = <img src="./icon/res/coins.png" style={{ width: "15px", height: "15px" }} />
const imggems = <img src="./icon/res/gem.webp" style={{ width: "15px", height: "15px" }} />
const imgusdcIcon = <img src={imgusdc} alt="USDC" style={{ width: "15px", height: "15px" }} />

function formatUsdLabel(value) {
    const num = Number(value) || 0;
    return num.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function renderGemPackOption(pack) {
    const usd = getGemsPackUsd(pack);
    const gemLabel = <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{pack}{imggems}</span>;
    const usdLabel = <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{formatUsdLabel(usd)}{imgusdcIcon}</span>;
    return {
        value: pack,
        searchText: `${pack} gems ${usd} usdc`,
        label: gemLabel,
        labelEnd: usdLabel,
        triggerLabel: <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{gemLabel}{usdLabel}</span>,
    };
}

function ModalOptions({ onClose, dataSet, onOptionChange, API_URL }) {
    const [isOpen, setIsOpen] = useState(false);
    const [justOpened, setJustOpened] = useState(true);
    const [tradeTax, setTradeTax] = useState(dataSet.tradeTax || "");
    const [gemsPack, setGemsPack] = useState(Number(dataSet.gemsPack || 7400));
    const [draftOptions, setDraftOptions] = useState(() => ({
        inputFarmTime: String(dataSet.inputFarmTime ?? 15),
        inputMaxBB: String(dataSet.inputMaxBB ?? 1),
        coinsRatio: String(dataSet.coinsRatio ?? 1000),
        animalLvl: { ...(dataSet.animalLvl || {}) },
    }));
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
    const handleNotifHelpClick = async (e) => {
        e?.preventDefault?.();
        e?.stopPropagation?.();
        await promptInfo(
            "Browser notifications:\nWork from a normal browser tab and are the easiest to start, but they can be less reliable depending on the browser.\nPWA notifications:\nUsually work a bit better because the site is installed like an app while still using web push.\nNative app notifications:\nUsually the most reliable option on Android because they use native mobile notifications.\nAndroid app GitHub:\nhttps://github.com/Oubia973/SunflowerManager",
            "Notifications",
            "Got it"
        );
    };

    const closeModal = () => {
        setIsOpen(false);
        setTimeout(onClose, 300);
    };
    const handleDonClick = (address, element) => {
        if (!address) return;
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
    const paymentWalletAddress = "0xAc3c7f9f1f8492Cc10A4fdb8C738DD82013d61dA";
    const paymentExplorerBaseUrl = "https://polygonscan.com";
    const paymentToken = "USDC";
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
    }
    const sanitizeNumber = (raw, { min = null, max = null, fallback = 0, allowDecimal = false } = {}) => {
        const cleaned = allowDecimal
            ? String(raw ?? "").replace(/[^0-9.]/g, "")
            : String(raw ?? "").replace(/\D/g, "");
        let xvalue = Number(cleaned);
        if (isNaN(xvalue)) xvalue = fallback;
        if (min !== null && xvalue < min) xvalue = min;
        if (max !== null && xvalue > max) xvalue = max;
        return xvalue;
    };
    const commitNumber = (name, raw, opts) => {
        const value = sanitizeNumber(raw, opts);
        onOptionChange({ target: { name, value } });
        return value;
    }
    function handleChangeGemRatio(e) {
        const gemPack = Number(e.target.value);
        setGemsPack(gemPack);
        dataSet.gemsPack = gemPack;
        const gemRatioValue = computeGemsRatio(gemPack, dataSet.usdSfl);
        dataSet.gemsRatio = gemRatioValue;
        onOptionChange({ target: { name: "GemsRatio", value: gemRatioValue } });
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
    useEffect(() => {
        setDraftOptions({
            inputFarmTime: String(dataSet.inputFarmTime ?? 15),
            inputMaxBB: String(dataSet.inputMaxBB ?? 1),
            coinsRatio: String(dataSet.coinsRatio ?? 1000),
            animalLvl: { ...(dataSet.animalLvl || {}) },
        });
        setTradeTax(dataSet.tradeTax ?? "");
        setGemsPack(Number(dataSet.gemsPack || 7400));
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
                <div><input type="checkbox" onChange={onOptionChange} checked={dataSet.autoRefresh !== false}
                    name={"autoRefresh"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Auto refresh tables</div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.checkPlacedEquiped || 0}
                    name={"checkPlacedEquiped"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Check boosts placed/equipped</div>
                <div><input type="number"
                    onChange={(e) => setDraftOptions(prev => ({ ...prev, inputFarmTime: e.target.value }))}
                    onBlur={(e) => {
                        const value = commitNumber("FarmTime", e.target.value, { min: 1, max: 24, fallback: 15 });
                        setDraftOptions(prev => ({ ...prev, inputFarmTime: String(value) }));
                    }}
                    value={draftOptions.inputFarmTime}
                    name={"FarmTime"} style={{ textAlign: "left", width: "45px" }} />Hours you can check your farm daily</div>
                <div><input type="number"
                    onChange={(e) => setDraftOptions(prev => ({ ...prev, inputMaxBB: e.target.value }))}
                    onBlur={(e) => {
                        const value = commitNumber("inputMaxBB", e.target.value, { min: 0, fallback: 1 });
                        setDraftOptions(prev => ({ ...prev, inputMaxBB: String(value) }));
                    }}
                    value={draftOptions.inputMaxBB}
                    name={"inputMaxBB"} style={{ textAlign: "left", width: "45px" }} />Restock daily</div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.autoRefill || 0}
                    name={"autoRefill"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Auto restock by time
                    <input type="checkbox" onChange={onOptionChange} checked={!!dataSet.showRestockCost || 0}
                        name={"showRestockCost"} style={{ width: "18px", height: "18px", marginRight: 6 }} />show in tooltip</div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.restockCostDaily || 0}
                    name={"restockCostDaily"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Restock counted in daily</div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.averageDailyCycles || 0}
                    name={"averageDailyCycles"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Daily cycles average when more than 24h</div>
                <div><input type="number"
                    onChange={(e) => setDraftOptions(prev => ({ ...prev, coinsRatio: e.target.value }))}
                    onBlur={(e) => {
                        const value = commitNumber("CoinsRatio", e.target.value, { min: 300, fallback: 1000 });
                        setDraftOptions(prev => ({ ...prev, coinsRatio: String(value) }));
                    }}
                    value={draftOptions.coinsRatio}
                    name={"CoinsRatio"} style={{ textAlign: "left", width: "45px" }} />Coins{imgcoins}/{imgsfl}Flower
                    <input type="checkbox" onChange={onOptionChange} checked={!!dataSet.autoCoinRatio || 0}
                        name={"autoCoinRatio"} style={{ width: "18px", height: "18px", marginRight: 6 }} />Auto</div>
                <div style={{ display: 'flex', alignItems: 'center' }}><input type="text" disabled onChange={onOptionChange} value={dataSet.gemsRatio || 0.07}
                    name={"GemsRatio"} style={{ textAlign: "left", width: "45px" }} />Flower{imgsfl}/{imggems}Gems
                    {/* <FormControl variant="standard" id="formselectinv" className="selectinv" size="small">
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
                        </FormControl> */}
                    <DList
                        name="gemPack"
                        options={[
                            renderGemPackOption(100),
                            renderGemPackOption(650),
                            renderGemPackOption(1350),
                            renderGemPackOption(2800),
                            renderGemPackOption(7400),
                            renderGemPackOption(15500),
                            renderGemPackOption(200000),
                        ]}
                        value={gemsPack}
                        onChange={handleChangeGemRatio}
                        menuMinWidth={180}
                    />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}><input type="number"
                    onChange={handleChangeTradeTax}
                    onBlur={(e) => {
                        const value = commitNumber("tradeTax", e.target.value, { min: 0, fallback: 0, allowDecimal: true });
                        setTradeTax(String(value));
                    }}
                    value={tradeTax}
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
                            value={(draftOptions.animalLvl && draftOptions.animalLvl[animal] !== undefined)
                                ? draftOptions.animalLvl[animal]
                                : lvl}
                            onChange={e => {
                                const value = e.target.value;
                                setDraftOptions(prev => ({
                                    ...prev,
                                    animalLvl: {
                                        ...(prev.animalLvl || {}),
                                        [animal]: value,
                                    },
                                }));
                            }}
                            onBlur={e => {
                                const value = commitNumber(`animalLvl_${animal}`, e.target.value, { min: 1, max: 15, fallback: 7 });
                                setDraftOptions(prev => ({
                                    ...prev,
                                    animalLvl: {
                                        ...(prev.animalLvl || {}),
                                        [animal]: String(value),
                                    },
                                }));
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
                    {/* <DropdownCheckbox
                        options={dataSet.notifList}
                        onChange={onOptionChange}
                        listIcon={"./options.png"}
                    /> */}
                    <div className="dlist-icon-only">
                        <DList
                            name="NotifList"
                            options={dataSet.notifList}
                            onChange={onOptionChange}
                            listIcon={"./options.png"}
                            multiple
                            clearable={false}
                            emitEvent={false}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleNotifHelpClick}
                        title="Notifications help"
                        className="button small-btn"
                        style={{ marginLeft: 2 }}
                    >
                        <img src={imgna} alt="?" className="itico" />
                    </button>
                </div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.oilFood}
                    name={"oilFood"} style={{ width: "18px", height: "18px", marginRight: 12 }} />use Oil for foods</div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.toolsBurn}
                    name={"toolsBurn"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Ressources burned by tools in daily</div>
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.usePriceFood}
                    name={"usePriceFood"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Use cheaper food for animals</div>
                {/* <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.mergeAniProd}
                    name={"mergeAniProd"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Set animals 2nd prod.cost to 0</div> */}
                <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.ignoreAniLvl}
                    name={"ignoreAniLvl"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Ignore animals above selected lvl</div>
                {/* <div><input type="checkbox" onChange={onOptionChange} checked={!!dataSet.chumFishCost}
                    name={"chumFishCost"} style={{ width: "18px", height: "18px", marginRight: 12 }} />Chum cost in Fish cost</div> */}
                {dataSet.isAbo ? (<>
                </>) : null}
                <div>
                    <p></p>
                    <div>if you liked this tool you can give me a coffee here : </div>
                    <div>{paymentWalletAddress ? (
                        <a
                            id="copy-link"
                            href="#"
                            onClick={(event) => {
                                event.preventDefault();
                                handleDonClick(paymentWalletAddress, event.target);
                            }}
                            title={`Click to copy ${paymentToken} wallet`}
                        >
                            {paymentWalletAddress}
                        </a>
                    ) : (
                        <span>Wallet unavailable</span>
                    )}</div>
                    {/* {paymentWalletAddress ? (
                        <div>
                            <a
                                href={`${paymentExplorerBaseUrl}/address/${paymentWalletAddress}`}
                                title="Open PolygonScan"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open PolygonScan
                            </a>
                        </div>
                    ) : null} */}
                    <div>and you can help my farm here :
                        <a id="visit-link" href="https://sunflower-land.com/play/#/visit/1972" title="Clic to visit my farm" target="_blank" rel="noopener noreferrer">
                            : Oubia</a></div>
                </div>
            </div>
        </div>
    );
}

export default ModalOptions;
