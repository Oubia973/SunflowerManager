import React, { useEffect, useState } from 'react';

function ModalHelp({ onClose, image }) {
    const [isOpen, setIsOpen] = useState(false);
    const [justOpened, setJustOpened] = useState(true);
    //const [pos, setPos] = useState({ x: clickPosition.x, y: clickPosition.y });
    //const [inputFarmTime, setInputFarmTime] = useState(dataSet.inputFarmTime);
    //const [inputMaxBB, setInputMaxBB] = useState(dataSet.inputFarmTime);
    const closeModal = () => {
        setIsOpen(false);
        setTimeout(onClose, 300);
    };
    const handleClickOutside = (event) => {
        if (justOpened) return;
        //if (!event.target.closest(".tooltip")) {
            closeModal();
        //}
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
    return (
        <div className={`tooltip-wrapper ${isOpen ? "open" : ""}`}>
            {/* <img src="./help.png" alt={''} style={{ width: '622px', height: '571px' }} /> */}
            <img src={image} alt={''} />
        </div>
    );
}

export default ModalHelp;