import React, { useEffect, useState } from 'react';

function ModalOptions({ onClose, dataSet, onFarmTimeChange, onMaxBBChange, onCoinsRatioChange, onAnimalLvlChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [justOpened, setJustOpened] = useState(true);
    //const [pos, setPos] = useState({ x: clickPosition.x, y: clickPosition.y });
    //const [inputFarmTime, setInputFarmTime] = useState(dataSet.inputFarmTime);
    //const [inputMaxBB, setInputMaxBB] = useState(dataSet.inputFarmTime);
    const closeModal = () => {
        setIsOpen(false);
        setTimeout(onClose, 300);
    };
    const handleMaxBBChange = (event) => {
        if (event.target && event.target.value !== undefined) {
            const newValue = event.target.value;
            onMaxBBChange(newValue);
        }
    };
    const handleFarmTimeChange = (event) => {
        if (event.target && event.target.value !== undefined) {
            const newValue = event.target.value;
            onFarmTimeChange(newValue);
        }
    };
    const handleAnimalLvlChange = (event) => {
        if (event.target && event.target.value !== undefined) {
            const newValue = event.target.value;
            onAnimalLvlChange(newValue);
        }
    };
    const handleCoinsRatioChange = (event) => {
        if (event.target && event.target.value !== undefined) {
            const newValue = event.target.value;
            onCoinsRatioChange(newValue);
        }
    };
    const handleClickOutside = (event) => {
        if (justOpened) return;
        if (!event.target.closest(".tooltip")) {
            closeModal();
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
                <div><input type="text" onChange={handleFarmTimeChange} value={dataSet.inputFarmTime || ""} style={{ textAlign: "left", width: "30px" }} />Hours your can check your farm daily</div>
                <div><input type="text" onChange={handleMaxBBChange} value={dataSet.inputMaxBB || ""} style={{ textAlign: "left", width: "30px" }} />Restock daily</div>
                <div><input type="text" onChange={handleCoinsRatioChange} value={dataSet.coinsRatio || ""} style={{ textAlign: "left", width: "30px" }} />Coins/flower</div>
                <div><input type="text" onChange={handleAnimalLvlChange} value={dataSet.inputAnimalLvl || ""} style={{ textAlign: "left", width: "30px" }} />Animal lvl for details</div>
            </div>
        </div>
    );
}

export default ModalOptions;