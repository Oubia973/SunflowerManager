import React from "react";
import { frmtNb } from "../fct.js";

const isObj = (val) => !!val && typeof val === "object" && !Array.isArray(val);

const normalizeCompoNode = (rawNode) => {
    if (typeof rawNode === "number") {
        return { qty: Number(rawNode) || 0, compoit: {} };
    }
    if (!isObj(rawNode)) {
        return { qty: 0, compoit: {} };
    }
    const qty = Number(rawNode.qty ?? rawNode.quant ?? rawNode.q ?? 0) || 0;
    const compoit = isObj(rawNode.compoit) ? rawNode.compoit : {};
    return { qty, compoit };
};

const isTreeCompo = (compoMap) => {
    if (!isObj(compoMap)) return false;
    return Object.values(compoMap).some((rawNode) => typeof rawNode !== "number");
};

const flattenCompoTree = (tree, out = {}, multiplier = 1) => {
    if (!isObj(tree)) return out;
    Object.entries(tree).forEach(([name, rawNode]) => {
        const node = normalizeCompoNode(rawNode);
        const qty = node.qty * multiplier;
        if (Object.keys(node.compoit).length > 0) {
            flattenCompoTree(node.compoit, out, multiplier);
        } else {
            out[name] = (out[name] || 0) + qty;
        }
    });
    return out;
};

const createSetCompoTable = ({
    ForTry,
    keyFn,
    dataSet,
    currentItem,
    tables,
    shrine,
    sflortry,
    assets,
    compoState,
}) => {
    const { it, fish, bounty, flower, craft, petit, crustacean, tool, pfood, food } = tables;
    const { imgna, imgmix, imgmp, imgsfl } = assets;
    const { compoExpanded, setCompoExpanded, compoClosing, setCompoClosing, compoCloseTimersRef } = compoState;

    const getItemBase = (name) => [it, fish, bounty, flower, craft, petit, crustacean, tool, pfood, food].find((src) => src?.[name]);

    const getToolCompoTree = (toolName, toolQty = 1) => {
        const out = {};
        const toolEntry = tool?.[toolName];
        if (!toolEntry) return out;
        const qtyMul = Number(toolQty || 0) || 0;
        if (qtyMul <= 0) return out;

        const sflQty = Number(toolEntry?.[sflortry] ?? toolEntry?.sfl ?? 0);
        if (sflQty > 0) {
            out.sfl = { qty: sflQty * qtyMul };
        }

        const added = new Set(["sfl"]);
        Object.keys(toolEntry).forEach((rawKey) => {
            if (!rawKey || rawKey.endsWith("try")) return;
            if (added.has(rawKey)) return;
            const itemBase = getItemBase(rawKey);
            if (!itemBase?.[rawKey]) return;
            const qBase = ForTry ? (toolEntry?.[rawKey + "try"] ?? toolEntry?.[rawKey]) : toolEntry?.[rawKey];
            const qNum = Number(qBase || 0);
            if (qNum > 0) {
                out[rawKey] = { qty: qNum * qtyMul };
                added.add(rawKey);
            }
        });
        return out;
    };

    const getRowValues = (keyItem, compoQuant) => {
        const cleanName = ForTry ? keyItem.replace(/try$/, "") : keyItem;
        const itemBase = getItemBase(cleanName);
        if (!itemBase && keyItem !== "sfl") return null;
        const icompoToAdd = keyItem === "sfl" ? "./icon/res/coins.png" : (itemBase[cleanName]?.img || imgna);
        const titleImg = keyItem === "sfl" ? "Coins" : keyItem;
        const icompoImg = <img src={icompoToAdd} alt={keyItem} className="resicon" title={titleImg} />;
        const compoCost = keyItem === "sfl" ? (1 / dataSet.options.coinsRatio) : (itemBase[cleanName][keyFn("cost")] / dataSet.options.coinsRatio);
        const icompoValue = compoQuant * (compoCost || 0);
        const marketUnit = Number(itemBase?.[cleanName]?.[keyFn("costp2pt")] ?? itemBase?.[cleanName]?.costp2pt ?? 0);
        const fallbackUnit = Number(itemBase?.[cleanName]?.[keyFn("cost")] || 0) / dataSet.options.coinsRatio;
        const marketOrFallback = marketUnit > 0 ? marketUnit : fallbackUnit;
        const icompoValueM = compoQuant * (keyItem === "sfl" ? (1 / dataSet.options.coinsRatio) : marketOrFallback);
        const compName = cleanName !== "sfl" ? cleanName : "Coins";
        return { compName, icompoImg, icompoValue, icompoValueM };
    };

    return function setCompoTable(item, quant) {
        let itemTable = {};
        let itemImgName = imgna;
        let itemQuant = quant || 1;

        if (craft[item]?.compo) {
            itemTable = craft[item]?.compo;
            itemImgName = craft[item]?.img;
        }
        if (tool?.[item]) {
            itemTable = tool?.[item];
            itemImgName = tool?.[item]?.img;
        }
        if (food[item]?.compo) {
            itemTable = food[item]?.compoit;
            itemImgName = food[item]?.img;
        }
        if (pfood[item]?.compo) {
            itemTable = pfood[item]?.compoit;
            itemImgName = pfood[item]?.img;
        }
        if (shrine[item]?.compo) {
            itemTable = shrine[item]?.compo;
            itemImgName = shrine[item]?.img;
        }
        if (crustacean?.[item]?.compoit) {
            itemTable = crustacean[item].compoit;
            itemImgName = crustacean[item]?.img;
            const toolName = crustacean[item]?.tool;
            const transformed = {};
            Object.entries(itemTable || {}).forEach(([name, rawNode]) => {
                const node = normalizeCompoNode(rawNode);
                if (node.qty <= 0) return;
                const hasNodeChildren = Object.keys(node.compoit || {}).length > 0;
                if (toolName && name === toolName) {
                    const toolChildren = hasNodeChildren ? node.compoit : getToolCompoTree(toolName, node.qty);
                    transformed[name] = Object.keys(toolChildren).length > 0
                        ? { qty: node.qty, compoit: toolChildren }
                        : { qty: node.qty };
                } else {
                    transformed[name] = hasNodeChildren ? { qty: node.qty, compoit: node.compoit } : { qty: node.qty };
                }
            });
            itemTable = transformed;
        }
        if (item === "Obsidian") {
            itemTable = ForTry ? currentItem.compotry : currentItem.compo;
            itemImgName = it["Obsidian"]?.img;
        }
        if (item === "Mix Food") {
            itemTable = {
                Corn: itemQuant,
                Barley: itemQuant,
                Wheat: itemQuant,
            };
            itemQuant = 1;
            itemImgName = imgmix;
        }

        const isTool = tool?.[item];
        const itemImg = <img src={itemImgName} alt={item ?? "?"} style={{ width: "22px", height: "22px" }} />;
        let totalCost = 0;
        let totalCostM = 0;
        const hasTreeCompo = isTreeCompo(itemTable);
        const compoList = hasTreeCompo ? flattenCompoTree(itemTable, {}, itemQuant) : itemTable;
        const itemQuantTxt = itemQuant > 1 ? (" x" + itemQuant) : "";

        Object.keys(compoList).forEach((keyItem) => {
            const compoQuant = hasTreeCompo ? compoList[keyItem] : compoList[keyItem] * itemQuant;
            const cleanName = ForTry ? keyItem.replace(/try$/, "") : keyItem;
            let hasQuant = compoQuant > 0;
            if (isTool && keyItem !== "sfl") {
                const hasTryset = tool[item][cleanName] >= 0 && tool[item][cleanName + "try"] >= 0;
                hasQuant = ForTry ? (hasTryset ? (keyItem.endsWith("try") && compoQuant > 0) : compoQuant > 0) : (!keyItem.endsWith("try") && compoQuant > 0);
            }
            if (!hasQuant) return;
            const rowVals = getRowValues(keyItem, compoQuant);
            if (!rowVals) return;
            totalCost += rowVals.icompoValue;
            totalCostM += rowVals.icompoValueM;
        });

        const tableContent = hasTreeCompo
            ? (() => {
                const rows = [];
                const toggleRow = (rowKey) => {
                    const isOpen = !!compoExpanded[rowKey];
                    const existing = compoCloseTimersRef.current[rowKey];
                    if (existing) {
                        clearTimeout(existing);
                        delete compoCloseTimersRef.current[rowKey];
                    }
                    if (isOpen) {
                        setCompoClosing((prev) => {
                            const next = { ...prev };
                            delete next[rowKey];
                            return next;
                        });
                        setCompoExpanded((prev) => ({ ...prev, [rowKey]: false }));
                    } else {
                        setCompoClosing((prev) => {
                            const next = { ...prev };
                            delete next[rowKey];
                            return next;
                        });
                        setCompoExpanded((prev) => ({ ...prev, [rowKey]: true }));
                    }
                };

                const pushRows = (tree, depth = 0, path = "root", ancestorClosing = false) => {
                    if (!isObj(tree)) return;
                    Object.entries(tree).forEach(([keyItem, rawNode], idx) => {
                        const node = normalizeCompoNode(rawNode);
                        const compoQuant = node.qty * itemQuant;
                        if (!(compoQuant > 0)) return;
                        const rowVals = getRowValues(keyItem, compoQuant);
                        if (!rowVals) return;
                        const rowKey = `${path}-${keyItem}-${idx}`;
                        const hasChildren = Object.keys(node.compoit).length > 0;
                        const isOpen = !!compoExpanded[rowKey];
                        const isSelfClosing = !!compoClosing[rowKey];
                        const isClosingRow = ancestorClosing;
                        const childClosing = ancestorClosing || isSelfClosing;
                        const indent = `${10 + (depth * 16)}px`;
                        rows.push(
                            <tr key={rowKey} className={`tooltip-compo-row ${isClosingRow ? "tooltip-compo-row-closing" : ""}`}>
                                <td className="tdcenterbrd tooltip-compo-firstcol">
                                    <div className="tooltip-compo-cell-inner">
                                    <span className="tooltip-compo-label" style={{ paddingLeft: indent }}>
                                        {hasChildren ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleRow(rowKey)}
                                                className={`tooltip-compo-toggle ${isOpen && !childClosing ? "open" : ""}`}
                                                title={isOpen ? "Collapse" : "Expand"}
                                            >
                                                {"▸"}
                                            </button>
                                        ) : <span className="tooltip-compo-toggle-spacer" />}
                                        {frmtNb(compoQuant)} {rowVals.icompoImg}{rowVals.compName}
                                    </span>
                                    </div>
                                </td>
                                <td className="tdcenterbrd"><div className="tooltip-compo-cell-inner">{frmtNb(rowVals.icompoValue)}</div></td>
                                <td className="tdcenterbrd"><div className="tooltip-compo-cell-inner">{frmtNb(rowVals.icompoValueM)}</div></td>
                            </tr>
                        );
                        if (hasChildren && (isOpen || childClosing)) {
                            pushRows(node.compoit, depth + 1, rowKey, childClosing);
                        }
                    });
                };
                pushRows(itemTable, 0, "root");
                return rows;
            })()
            : Object.keys(compoList).map((keyItem) => {
                const compoQuant = compoList[keyItem] * itemQuant;
                const cleanName = ForTry ? keyItem.replace(/try$/, "") : keyItem;
                let hasQuant = compoQuant > 0;
                if (isTool && keyItem !== "sfl") {
                    const hasTryset = tool[item][cleanName] >= 0 && tool[item][cleanName + "try"] >= 0;
                    hasQuant = ForTry ? (hasTryset ? (keyItem.endsWith("try") && compoQuant > 0) : compoQuant > 0) : (!keyItem.endsWith("try") && compoQuant > 0);
                }
                if (!hasQuant) return null;
                const rowVals = getRowValues(keyItem, compoQuant);
                if (!rowVals) return null;
                return (
                    <tr key={`${keyItem}-${compoQuant}`}>
                        <td className="tdcenterbrd tooltip-compo-firstcol">
                            <div className="tooltip-compo-cell-inner">
                                <span className="tooltip-compo-label">
                                    {frmtNb(compoQuant)} {rowVals.icompoImg}{rowVals.compName}
                                </span>
                            </div>
                        </td>
                        <td className="tdcenterbrd"><div className="tooltip-compo-cell-inner">{frmtNb(rowVals.icompoValue, 3)}</div></td>
                        <td className="tdcenterbrd"><div className="tooltip-compo-cell-inner">{frmtNb(rowVals.icompoValueM, 3)}</div></td>
                    </tr>
                );
            });

        const tableHeader = (
            <thead>
                <tr className="tooltip-compo-head-row">
                    <th className="tdcenterbrd tooltip-compo-head-first">{itemImg}{item}{itemQuantTxt}</th>
                    <th className="tdcenterbrd tooltip-compo-head">Prod cost</th>
                    <th className="tdcenterbrd tooltip-compo-head">{imgmp} cost</th>
                </tr>
                <tr className="tooltip-compo-total-row">
                    <th className="tdcenterbrd tooltip-compo-head-first">TOTAL</th>
                    <th className="tdcenterbrd tooltip-compo-head">{frmtNb(totalCost)}{imgsfl}</th>
                    <th className="tdcenterbrd tooltip-compo-head">{frmtNb(totalCostM)}{imgsfl}</th>
                </tr>
            </thead>
        );

        const table = (
            <>
                <table className="tooltip-compo-table">
                    {tableHeader}
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </>
        );
        return {
            table,
            totalCost,
            totalCostM,
        };
    };
};

export default createSetCompoTable;
