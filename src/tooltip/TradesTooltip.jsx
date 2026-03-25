import React from "react";
import { frmtNb } from "../fct.js";
const imgna = "./icon/nft/na.png";

const EMPTY_TOTAL = { soldPrice: 0, price: 0, marketPrice: 0, count: 0 };

function normalizeTradeType(value) {
    const safeValue = String(value || "").trim().toLowerCase();
    if (safeValue === "resources" || safeValue === "nft" || safeValue === "bud" || safeValue === "pet") {
        return safeValue;
    }
    return "other";
}

function getTradeType(itemName, tables, boostables, fallbackType) {
    const normalizedFallback = normalizeTradeType(fallbackType);
    if (normalizedFallback !== "other") return normalizedFallback;
    const safeName = String(itemName || "");
    const { it, petit, fish, flower } = tables || {};
    const { nft, nftw } = boostables || {};
    if (/\bbud\b/i.test(safeName)) return "bud";
    if (/\bpet\b/i.test(safeName)) return "pet";
    if (nft?.[itemName] || nftw?.[itemName]) return "nft";
    if (it?.[itemName] || petit?.[itemName] || fish?.[itemName] || flower?.[itemName]) return "resources";
    return "other";
}

function resolveMarketData(itemName, quantity, sources, fallbackUnitFloor = 0) {
    const { nft, nftw, it, fish, flower, petit } = sources;
    let marketPrice = Number(fallbackUnitFloor || 0) * Number(quantity || 0);
    let itemImg = "";
    const makeImg = (src) => {
        const safeSrc = typeof src === "string" ? src.trim() : "";
        if (!safeSrc) return "";
        return <img src={safeSrc} className="resicon" alt="" />;
    };

    if (nft?.[itemName]) {
        marketPrice = (nft[itemName].pricemsfl || 0) * quantity;
        itemImg = makeImg(nft[itemName].img);
    }
    if (nftw?.[itemName]) {
        marketPrice = (nftw[itemName].pricemsfl || 0) * quantity;
        itemImg = makeImg(nftw[itemName].img);
    }
    if (it?.[itemName]) {
        marketPrice = (it[itemName].costp2pt || 0) * quantity;
        itemImg = makeImg(it[itemName].img);
    }
    if (fish?.[itemName]) {
        itemImg = makeImg(fish[itemName].img);
    }
    if (flower?.[itemName]) {
        itemImg = makeImg(flower[itemName].img);
    }
    if (petit?.[itemName]) {
        marketPrice = (petit[itemName].costp2pt || 0) * quantity;
        itemImg = makeImg(petit[itemName].img);
    }

    return { marketPrice, itemImg };
}

const TradesTooltip = ({ trades, tradesHeader, itables, boostables }) => {
    const tradeRows = trades && typeof trades === "object" ? Object.values(trades) : [];
    const headerRows = Array.isArray(tradesHeader) ? tradesHeader.filter((row) => row?.name) : [];
    const headerImgByName = Object.fromEntries(
        headerRows.map((row) => [String(row?.name || "").trim().toLowerCase(), row?.img || ""])
    );
    const headerFloorByName = Object.fromEntries(
        headerRows.map((row) => [String(row?.name || "").trim().toLowerCase(), Number(row?.floor || 0)])
    );
    const headerCategoryByName = Object.fromEntries(
        headerRows.map((row) => [String(row?.name || "").trim().toLowerCase(), normalizeTradeType(row?.category)])
    );
    if (tradeRows.length === 0 && headerRows.length === 0) {
        return <div>No trades available.</div>;
    }

    const { nft, nftw } = boostables || {};
    const { it, fish, flower, petit } = itables || {};
    const totalsByType = {
        resources: { ...EMPTY_TOTAL, label: "Resources" },
        nft: { ...EMPTY_TOTAL, label: "Boosts" },
        bud: { ...EMPTY_TOTAL, label: "Buds" },
        pet: { ...EMPTY_TOTAL, label: "Pets" },
        other: { ...EMPTY_TOTAL, label: "Other" },
    };

    if (tradeRows.length === 0 && headerRows.length > 0) {
        return (
            <table className="tooltip-trades-table">
                <thead>
                    <tr>
                        <th className="tdcenterbrd">Item</th>
                        <th className="tdcenterbrd">Sold</th>
                    </tr>
                </thead>
                <tbody>
                    {headerRows.map((row, index) => (
                        <tr key={`${row.name}-${index}`}>
                            <td className="tdcenterbrd">
                                <img src={row?.img || ""} className="resicon" alt="" />
                                {row?.name || ""}
                            </td>
                            <td className="tdcenterbrd">
                                {row?.fulfilledAt ? <img src="./icon/ui/confirm.png" className="resicon" alt="" /> : ""}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    const rows = tradeRows.map((traderow, index) => {
        if (!traderow || !traderow.items) return null;
        const date = new Date(traderow.createdAt).toLocaleString();
        let itemName = "";
        let quantity = 0;
        const isSold = traderow.fulfilledAt;

        Object.entries(traderow.items).forEach(([name, qty]) => {
            itemName = name;
            quantity = qty;
        });

        const price = traderow.sfl || 0;
        const normalizedName = String(itemName || "").trim().toLowerCase();
        const fallbackFloor = headerFloorByName[normalizedName] || 0;
        const fallbackCategory = headerCategoryByName[normalizedName];
        const { marketPrice, itemImg } = resolveMarketData(itemName, quantity, {
            nft,
            nftw,
            it,
            fish,
            flower,
            petit,
        }, fallbackFloor);
        const fallbackImgSrc = headerImgByName[normalizedName] || imgna;
        const safeItemImg = itemImg || <img src={fallbackImgSrc} className="resicon" alt="" />;
        const marketDiffPct = marketPrice ? ((price - marketPrice) / marketPrice) * 100 : null;
        const marketDiff = marketDiffPct !== null ? `${marketDiffPct.toFixed(2)}%` : "N/A";
        const marketDiffStyle = marketDiffPct !== null && marketDiffPct > 20 ? { color: "red" } : {};
        const tradeType = getTradeType(itemName, { it, petit, fish, flower }, { nft, nftw }, fallbackCategory);
        const totalsTarget = totalsByType[tradeType];
        totalsTarget.count += 1;
        totalsTarget.price += price;
        totalsTarget.marketPrice += marketPrice;
        if (isSold) totalsTarget.soldPrice += price;

        return (
            <tr key={index}>
                <td className="tdcenterbrd">{safeItemImg}{itemName}</td>
                <td className="tdcenterbrd">{quantity}</td>
                <td className="tdcenterbrd">{isSold && <img src="./icon/ui/confirm.png" className="resicon" alt="" />}</td>
                <td className="tdcenterbrd">{frmtNb(price)}</td>
                <td className="tdcenterbrd">{frmtNb(marketPrice)}</td>
                <td className="tdcenterbrd" style={marketDiffStyle}>{marketDiff}</td>
                <td className="tdcenterbrd">{date}</td>
            </tr>
        );
    }).filter(Boolean);

    const totalRows = [
        totalsByType.resources,
        totalsByType.nft,
        totalsByType.bud,
        totalsByType.pet,
        totalsByType.other,
    ].filter((row) => row.count > 0);

    return (
        <table className="tooltip-trades-table">
            <thead>
                <tr>
                    <th className="tdcenterbrd">Item</th>
                    <th className="tdcenterbrd">Quantity</th>
                    <th className="tdcenterbrd">Sold</th>
                    <th className="tdcenterbrd">Price</th>
                    <th className="tdcenterbrd">Floor</th>
                    <th className="tdcenterbrd">Diff</th>
                    <th className="tdcenterbrd">Date</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
            <tfoot>
                {totalRows.map((totalsRow, rowIndex, allRows) => {
                    const bottomOffset = (allRows.length - 1 - rowIndex) * 22;
                    return (
                        <tr key={`${totalsRow.label}-${rowIndex}`} className="tooltip-trades-total-row">
                            <td className="tdcenterbrd" style={{ bottom: `${bottomOffset}px` }}>{totalsRow.label}</td>
                            <td className="tdcenterbrd" style={{ bottom: `${bottomOffset}px` }}></td>
                            <td className="tdcenterbrd" style={{ bottom: `${bottomOffset}px` }}>{frmtNb(totalsRow.soldPrice)}</td>
                            <td className="tdcenterbrd" style={{ bottom: `${bottomOffset}px` }}>{frmtNb(totalsRow.price)}</td>
                            <td className="tdcenterbrd" style={{ bottom: `${bottomOffset}px` }}>{frmtNb(totalsRow.marketPrice)}</td>
                            <td className="tdcenterbrd" style={{ bottom: `${bottomOffset}px` }}></td>
                            <td className="tdcenterbrd" style={{ bottom: `${bottomOffset}px` }}></td>
                        </tr>
                    );
                })}
            </tfoot>
        </table>
    );
};

export default TradesTooltip;
