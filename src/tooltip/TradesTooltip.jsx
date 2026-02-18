import React from "react";
import { frmtNb } from "../fct.js";

const EMPTY_TOTAL = { soldPrice: 0, price: 0, marketPrice: 0, count: 0 };

function getTradeType(itemName, tables, boostables) {
    const safeName = String(itemName || "");
    const { it, petit } = tables || {};
    const { nft, nftw } = boostables || {};
    if (/\bbud\b/i.test(safeName)) return "bud";
    if (/\bpet\b/i.test(safeName)) return "pet";
    if (nft?.[itemName] || nftw?.[itemName]) return "nft";
    if (it?.[itemName] || petit?.[itemName]) return "resources";
    return "other";
}

function resolveMarketData(itemName, quantity, sources) {
    const { nft, nftw, it, fish, flower, petit } = sources;
    let marketPrice = 0;
    let itemImg = "";

    if (nft?.[itemName]) {
        marketPrice = (nft[itemName].pricemsfl || 0) * quantity;
        itemImg = <img src={nft[itemName].img} className="resicon" alt="" />;
    }
    if (nftw?.[itemName]) {
        marketPrice = (nftw[itemName].pricemsfl || 0) * quantity;
        itemImg = <img src={nftw[itemName].img} className="resicon" alt="" />;
    }
    if (it?.[itemName]) {
        marketPrice = (it[itemName].costp2pt || 0) * quantity;
        itemImg = <img src={it[itemName].img} className="resicon" alt="" />;
    }
    if (fish?.[itemName]) {
        itemImg = <img src={fish[itemName].img} className="resicon" alt="" />;
    }
    if (flower?.[itemName]) {
        itemImg = <img src={flower[itemName].img} className="resicon" alt="" />;
    }
    if (petit?.[itemName]) {
        marketPrice = (petit[itemName].costp2pt || 0) * quantity;
        itemImg = <img src={petit[itemName].img} className="resicon" alt="" />;
    }

    return { marketPrice, itemImg };
}

const TradesTooltip = ({ trades, itables, boostables }) => {
    if (!trades || Object.keys(trades).length === 0) {
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

    const rows = Object.keys(trades).map((_, index) => {
        const traderow = trades[index];
        const date = new Date(traderow.createdAt).toLocaleString();
        let itemName = "";
        let quantity = 0;
        const isSold = traderow.fulfilledAt;

        Object.entries(traderow.items).forEach(([name, qty]) => {
            itemName = name;
            quantity = qty;
        });

        const price = traderow.sfl || 0;
        const { marketPrice, itemImg } = resolveMarketData(itemName, quantity, {
            nft,
            nftw,
            it,
            fish,
            flower,
            petit,
        });
        const marketDiffPct = marketPrice ? ((price - marketPrice) / marketPrice) * 100 : null;
        const marketDiff = marketDiffPct !== null ? `${marketDiffPct.toFixed(2)}%` : "N/A";
        const marketDiffStyle = marketDiffPct !== null && marketDiffPct > 20 ? { color: "red" } : {};
        const tradeType = getTradeType(itemName, { it, petit }, { nft, nftw });
        const totalsTarget = totalsByType[tradeType];
        totalsTarget.count += 1;
        totalsTarget.price += price;
        totalsTarget.marketPrice += marketPrice;
        if (isSold) totalsTarget.soldPrice += price;

        return (
            <tr key={index}>
                <td className="tdcenterbrd">{itemImg}{itemName}</td>
                <td className="tdcenterbrd">{quantity}</td>
                <td className="tdcenterbrd">{isSold && <img src="./icon/ui/confirm.png" className="resicon" alt="" />}</td>
                <td className="tdcenterbrd">{frmtNb(price)}</td>
                <td className="tdcenterbrd">{frmtNb(marketPrice)}</td>
                <td className="tdcenterbrd" style={marketDiffStyle}>{marketDiff}</td>
                <td className="tdcenterbrd">{date}</td>
            </tr>
        );
    });

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
