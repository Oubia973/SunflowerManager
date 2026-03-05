import React, { useEffect, useState } from "react";
import AdminTooltipContent from "./tooltip/AdminTooltipContent.jsx";

function ModalAdmin({ onClose, value, onAdminFetch }) {
    const [isOpen, setIsOpen] = useState(false);
    const [justOpened, setJustOpened] = useState(true);
    const closeModal = () => {
        setIsOpen(false);
        setTimeout(onClose, 250);
    };
    const handleClickOutside = () => {
        if (justOpened) return;
        // Intentionally keep modal open on outside click (same spirit as Options).
    };

    useEffect(() => {
        const timer = setTimeout(() => setJustOpened(false), 200);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        const t = setTimeout(() => setIsOpen(true), 40);
        return () => clearTimeout(t);
    }, []);
    useEffect(() => {
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, [justOpened]);

    return (
        <div
            className={`tooltip-wrapper ${isOpen ? "open" : ""}`}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <div
                className="tooltip"
                style={{
                    position: "fixed",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90vw",
                    height: "75vh",
                    maxWidth: "90vw",
                    maxHeight: "75vh",
                    overflow: "auto",
                }}
            >
                <button onClick={closeModal} class="button" align="right" position='absolute'><img src="./icon/ui/cancel.png" alt="" className="resico" /></button>
                <AdminTooltipContent
                    value={value}
                    onAdminFetch={onAdminFetch}
                />
            </div>
        </div>
    );
}

export default ModalAdmin;
