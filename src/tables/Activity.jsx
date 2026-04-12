// src/sets/SetActivity.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { useAppCtx } from "../context/AppCtx";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { frmtNb, flattenCompoit } from '../fct.js';
import DList from "../dlist.jsx";

Chart.register(...registerables);

function getSflBalance(balance) {
    if (balance && typeof balance === "object") {
        return Number(balance.sfl || 0);
    }
    return Number(balance || 0);
}

function getNormalizedDeliveryRewardQty(deliveryItem, dataSetFarm, tktName) {
    const rewardQty = Number(deliveryItem?.rewardqty || 0);
    const rewardQtyBase = Number(deliveryItem?.rewardqtybase || 0);
    if (rewardQtyBase > 0) return rewardQtyBase;
    return rewardQty;
}

function toDateValue(activityItem) {
    const dt = new Date(activityItem?.date);
    return Number.isNaN(dt.getTime()) ? 0 : dt.getTime();
}

function diffNumericMap(currentMap, prevMap) {
    const result = {};
    const current = (currentMap && typeof currentMap === "object") ? currentMap : {};
    const previous = (prevMap && typeof prevMap === "object") ? prevMap : {};
    Object.keys(current).forEach((key) => {
        const currentValue = Number(current[key] || 0);
        const previousValue = Number(previous[key] || 0);
        const delta = currentValue - previousValue;
        if (delta > 0) {
            result[key] = delta;
        }
    });
    return result;
}

function getCounterMap(dataContext, fieldName, prevActivity, xContext) {
    const dailyFieldMap = {
        totbuild: "dailytotbuild",
        totharvest: "dailytotharvest",
        totharvestn: "dailytotharvestn",
        totfish: "dailytotfish",
        totflower: "dailytotflower",
        toolscrafted: "dailytoolscrafted",
        tottrades: "dailytottrades",
        tottradessfl: "dailytottradessfl",
    };
    const dailyField = dailyFieldMap[fieldName];
    if (dailyField) {
        const dailyMap = dataContext?.data?.[dailyField];
        const hasDailyValues = dailyMap && typeof dailyMap === "object" && Object.keys(dailyMap).length > 0;
        if (hasDailyValues) {
            return dailyMap;
        }
    }
    const mode = dataContext?.data?.activitycountermode || "";
    if (mode === "daily") {
        return dataContext?.data?.[fieldName] || {};
    }
    if (mode === "cumulative_with_daily") {
        if (dailyField) {
            return diffNumericMap(dataContext?.data?.[fieldName], prevActivity?.data?.[fieldName]);
        }
    }
    if (xContext === "day") {
        return dataContext?.data?.[fieldName] || {};
    }
    return diffNumericMap(dataContext?.data?.[fieldName], prevActivity?.data?.[fieldName]);
}

function formatActivityItemCell(value) {
    if (value === '' || value === null || value === undefined) return '';
    const num = Number(value);
    if (!Number.isFinite(num)) return '';
    const rounded = Math.round(num * 10) / 10;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function getFallbackTradeColor(itemName) {
    const source = String(itemName || "");
    let hash = 0;
    for (let i = 0; i < source.length; i += 1) {
        hash = ((hash << 5) - hash) + source.charCodeAt(i);
        hash |= 0;
    }
    return `hsl(${Math.abs(hash) % 360}, 68%, 58%)`;
}

function getSyntheticTradeId(itemName) {
    const source = String(itemName || "");
    let hash = 0;
    for (let i = 0; i < source.length; i += 1) {
        hash = ((hash << 5) - hash) + source.charCodeAt(i);
        hash |= 0;
    }
    return 900000000 + (Math.abs(hash) % 100000000);
}

function getTradeItemMetaMap(dataSetFarm) {
    const metaByName = {};
    const registerTable = (table, extra = {}) => {
        Object.entries(table || {}).forEach(([name, item]) => {
            if (!name) return;
            metaByName[name] = {
                id: Number.isFinite(Number(item?.id)) ? Number(item.id) : getSyntheticTradeId(name),
                name,
                color: item?.color || getFallbackTradeColor(name),
                cat: item?.cat || "",
                img: item?.img || "./icon/nft/na.png",
                boostTable: extra.boostTable || "",
                tradeGroup: extra.tradeGroup || "other",
            };
        });
    };

    const tables = dataSetFarm?.itables || {};
    const boosts = dataSetFarm?.boostables || {};
    registerTable(tables?.it, { tradeGroup: "resources" });
    registerTable(tables?.petit, { tradeGroup: "resources" });
    registerTable(tables?.fish, { tradeGroup: "other" });
    registerTable(tables?.flower, { tradeGroup: "other" });
    registerTable(boosts?.nft, { boostTable: "nft", tradeGroup: "collectibles" });
    registerTable(boosts?.nftw, { boostTable: "nftw", tradeGroup: "collectibles" });

    return metaByName;
}

function parseTradeDate(value) {
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
    const raw = String(value || "").trim();
    if (!raw) return null;
    const direct = new Date(raw);
    if (!Number.isNaN(direct.getTime())) return direct;
    const shortUsMatch = raw.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
    if (shortUsMatch) {
        const [, mm, dd, yy] = shortUsMatch;
        const parsed = new Date(Date.UTC(2000 + Number(yy), Number(mm) - 1, Number(dd), 12, 0, 0));
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
}

function formatTradeDayLabel(value) {
    const parsed = parseTradeDate(value);
    if (!parsed) return String(value || "");
    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    });
}

function getNetTradePrice(value, tradeTax = 10) {
    const raw = Number(value || 0);
    if (!(raw > 0)) return 0;
    const safeTax = Number.isFinite(Number(tradeTax)) ? Number(tradeTax) : 10;
    return raw - (raw * (safeTax / 100));
}

function buildActivityTradesSummary(activityData, dataSetFarm, tradeTax) {
    const metaByName = getTradeItemMetaMap(dataSetFarm);
    const totalsByName = {};

    activityData.forEach((activityItem, index) => {
        const prevActivity = activityData[index - 1] || null;
        const tradesMap = getCounterMap(activityItem, "tottrades", prevActivity, "day");
        const tradesSflMap = getCounterMap(activityItem, "tottradessfl", prevActivity, "day");
        const tradeNames = new Set([
            ...Object.keys(tradesMap || {}),
            ...Object.keys(tradesSflMap || {}),
        ]);

        tradeNames.forEach((itemName) => {
            const quantity = Number(tradesMap?.[itemName] || 0);
            const price = getNetTradePrice(tradesSflMap?.[itemName] || 0, tradeTax);
            if (!(quantity > 0) && !(price > 0)) return;

            const itemMeta = metaByName[itemName] || {
                id: getSyntheticTradeId(itemName),
                name: itemName,
                color: getFallbackTradeColor(itemName),
                cat: "",
                img: "./icon/nft/na.png",
                boostTable: "",
            };

            if (!totalsByName[itemMeta.name]) {
                totalsByName[itemMeta.name] = {
                    id: itemMeta.id,
                    name: itemMeta.name,
                    color: itemMeta.color,
                    img: itemMeta.img,
                qty: 0,
                price: 0,
                tradeGroup: itemMeta.tradeGroup || "other",
            };
        }

            totalsByName[itemMeta.name].qty += quantity;
            totalsByName[itemMeta.name].price += price;
        });
    });

    return Object.values(totalsByName)
        .map((item) => ({
            ...item,
            avgPrice: item.qty > 0 ? (item.price / item.qty) : 0,
        }))
        .sort((a, b) => {
            if (b.qty !== a.qty) return b.qty - a.qty;
            if (b.price !== a.price) return b.price - a.price;
            return a.name.localeCompare(b.name);
        });
}

function buildActivityTradesDailySeries(activityData, dataSetFarm, tradeTax) {
    const metaByName = getTradeItemMetaMap(dataSetFarm);
    const dayRows = [];

    activityData.forEach((activityItem, index) => {
        const prevActivity = activityData[index - 1] || null;
        const tradesMap = getCounterMap(activityItem, "tottrades", prevActivity, "day");
        const tradesSflMap = getCounterMap(activityItem, "tottradessfl", prevActivity, "day");
        const tradeNames = new Set([
            ...Object.keys(tradesMap || {}),
            ...Object.keys(tradesSflMap || {}),
        ]);
        const items = {};

        tradeNames.forEach((itemName) => {
            const qty = Number(tradesMap?.[itemName] || 0);
            const price = getNetTradePrice(tradesSflMap?.[itemName] || 0, tradeTax);
            if (!(qty > 0) && !(price > 0)) return;
            const itemMeta = metaByName[itemName] || {
                id: getSyntheticTradeId(itemName),
                name: itemName,
                color: getFallbackTradeColor(itemName),
                img: "./icon/nft/na.png",
            };
            items[itemMeta.name] = {
                name: itemMeta.name,
                color: itemMeta.color,
                img: itemMeta.img,
                qty,
                price,
                tradeGroup: itemMeta.tradeGroup || "other",
            };
        });

        dayRows.push({
            date: activityItem?.date,
            label: formatTradeDayLabel(activityItem?.date),
            items,
        });
    });

    return dayRows;
}

function TradeSummaryTable({ items, metric }) {
    const sortedItems = [...items].sort((a, b) => {
        const aValue = metric === "price" ? a.price : a.qty;
        const bValue = metric === "price" ? b.price : b.qty;
        if (bValue !== aValue) return bValue - aValue;
        return a.name.localeCompare(b.name);
    });

    return (
        <table className="activity-trades-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th className="activity-trades-metric-header">Qty</th>
                    <th className="activity-trades-metric-header"><img src="./icon/res/flowertoken.webp" alt="Flower" className="itico" /></th>
                    <th className="activity-trades-metric-header">Avg</th>
                </tr>
            </thead>
            <tbody>
                {sortedItems.map((item) => (
                    <tr key={item.name}>
                        <td className="activity-trades-item-cell">
                            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                                <img src={item.img || "./icon/nft/na.png"} alt="" className="itico" />
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                            </div>
                        </td>
                        <td className="activity-trades-metric-cell">{frmtNb(item.qty)}</td>
                        <td className="activity-trades-metric-cell">{frmtNb(item.price)}</td>
                        <td className="activity-trades-metric-cell">{frmtNb(item.avgPrice)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function TradeDailyStackedChart({ days, metric }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const chartData = useMemo(() => {
        const labels = days.map((day) => day.label);
        const itemMap = {};
        days.forEach((day) => {
            Object.values(day.items || {}).forEach((item) => {
                if (!itemMap[item.name]) {
                    itemMap[item.name] = {
                        label: item.name,
                        backgroundColor: item.color || getFallbackTradeColor(item.name),
                        borderColor: item.color || getFallbackTradeColor(item.name),
                        borderWidth: 1,
                        data: new Array(days.length).fill(0),
                        qtyData: new Array(days.length).fill(0),
                        priceData: new Array(days.length).fill(0),
                    };
                }
            });
        });
        days.forEach((day, dayIndex) => {
            Object.values(day.items || {}).forEach((item) => {
                itemMap[item.name].qtyData[dayIndex] = Number(item.qty || 0);
                itemMap[item.name].priceData[dayIndex] = Number(item.price || 0);
                itemMap[item.name].data[dayIndex] = metric === "price" ? Number(item.price || 0) : Number(item.qty || 0);
            });
        });
        const sortedDatasets = Object.values(itemMap).sort((a, b) => {
            const sumA = a.data.reduce((sum, value) => sum + Number(value || 0), 0);
            const sumB = b.data.reduce((sum, value) => sum + Number(value || 0), 0);
            if (sumB !== sumA) return sumB - sumA;
            return a.label.localeCompare(b.label);
        });
        return { labels, datasets: sortedDatasets };
    }, [days, metric]);

    useEffect(() => {
        if (!canvasRef.current) return;
        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }
        const ctx = canvasRef.current.getContext("2d");
        chartRef.current = new Chart(ctx, {
            type: "bar",
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        bottom: 20,
                    },
                },
                animation: {
                    duration: 320,
                },
                interaction: {
                    mode: "index",
                    intersect: false,
                },
                plugins: {
                    mondayMidnightLine: false,
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        filter: (context) => Number(context?.parsed?.y || 0) > 0,
                        callbacks: {
                            beforeBody: (items) => {
                                const totalQty = items.reduce((sum, item) => sum + Number(item?.dataset?.qtyData?.[item.dataIndex] || 0), 0);
                                const totalPrice = items.reduce((sum, item) => sum + Number(item?.dataset?.priceData?.[item.dataIndex] || 0), 0);
                                return [`Total: ${frmtNb(totalQty)} sold | ${frmtNb(totalPrice)} Flower`];
                            },
                            label: (context) => `${context.dataset.label}: ${frmtNb(context.dataset.qtyData?.[context.dataIndex] || 0)} sold | ${frmtNb(context.dataset.priceData?.[context.dataIndex] || 0)} Flower`,
                        },
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            padding: 8,
                        },
                        grid: {
                            color: "rgba(255,255,255,0.08)",
                        },
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => frmtNb(value),
                        },
                        grid: {
                            color: "rgba(255,255,255,0.12)",
                        },
                    },
                },
            },
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [chartData]);

    if (!chartData.datasets.length) {
        return <div style={{ padding: "12px 0" }}>No daily trades in this date range.</div>;
    }

    return (
        <div className="activity-trades-chart-panel">
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }}></canvas>
        </div>
    );
}

export default function ActivityTable() {
    const {
        data: { dataSet, dataSetFarm },
        ui: {
            selectedInv,
            selectedFromActivity,
            selectedFromActivityDay,
            activityDisplay,
            selectedActivityTradeFilters,
        },
        config: { API_URL },
    } = useAppCtx();
    const { ui } = useAppCtx();

    const [activityData, setActivityData] = useState(null);
    const [loading, setLoading] = useState(false);
    const farmId = dataSetFarm?.frmid;
    const tradeTax = Number(dataSet?.options?.tradeTax ?? 10);
    const tradeSummaryItems = useMemo(() => {
        if (!Array.isArray(activityData)) return [];
        return buildActivityTradesSummary(activityData, dataSetFarm, tradeTax);
    }, [activityData, dataSetFarm, tradeTax]);
    const tradeDailySeries = useMemo(() => {
        if (!Array.isArray(activityData)) return [];
        return buildActivityTradesDailySeries(activityData, dataSetFarm, tradeTax);
    }, [activityData, dataSetFarm, tradeTax]);
    const tradeFilterSet = useMemo(() => {
        const values = Array.isArray(selectedActivityTradeFilters) && selectedActivityTradeFilters.length > 0
            ? selectedActivityTradeFilters
            : ["resources", "collectibles", "other"];
        return new Set(values);
    }, [selectedActivityTradeFilters]);
    const filteredTradeSummaryItems = useMemo(() => {
        return tradeSummaryItems.filter((item) => tradeFilterSet.has(String(item?.tradeGroup || "other")));
    }, [tradeSummaryItems, tradeFilterSet]);
    const filteredTradeDailySeries = useMemo(() => {
        return tradeDailySeries.map((day) => {
            const nextItems = {};
            Object.entries(day?.items || {}).forEach(([name, item]) => {
                if (tradeFilterSet.has(String(item?.tradeGroup || "other"))) {
                    nextItems[name] = item;
                }
            });
            return {
                ...day,
                items: nextItems,
            };
        });
    }, [tradeDailySeries, tradeFilterSet]);
    useEffect(() => {
        let cancelled = false;

        async function run() {
            if (selectedInv !== "activity") return;
            setLoading(true);
            try {
                const result = await getActivity();
                if (!cancelled) setActivityData(result);
            } catch (e) {
                console.log(e);
                if (!cancelled) setActivityData(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [
        selectedInv,
        selectedFromActivity,
        selectedFromActivityDay,
        activityDisplay,
    ]);

    if (selectedInv !== "activity") return null;
    if (!dataSetFarm?.itables || !dataSetFarm?.boostables?.nft || !dataSetFarm?.boostables?.nftw || !dataSetFarm?.constants) {
        return <div>Loading activity data...</div>;
    }

    if (loading) return <div>Loading activity</div>;

    if (!activityData) return null;

    if (activityDisplay === "day") {
        return setActivityDay(activityData, dataSetFarm, ui);
    }

    if (activityDisplay === "item") {
        return setActivityItem(activityData, dataSetFarm, ui);
    }

    if (activityDisplay === "quest") {
        return setActivityQuest(activityData, dataSetFarm, ui);
    }

    if (activityDisplay === "trades") {
        return setActivityTrades(activityData, dataSetFarm, ui, filteredTradeSummaryItems, filteredTradeDailySeries);
    }

    return null;

    async function getActivity() {
        if (!farmId) return null;

        const xContextTime =
            activityDisplay === "day"
                ? selectedFromActivityDay
                : activityDisplay === "item"
                    ? selectedFromActivity
                    : activityDisplay === "trades"
                        ? selectedFromActivity
                    : activityDisplay === "quest"
                        ? "season"
                        : "today";

        const response = await fetch(API_URL + "/getactivity", {
            method: "GET",
            headers: {
                frmid: farmId,
                time: xContextTime,
            },
        });

        if (!response.ok) {
            console.log("Error :", response.status);
            return null;
        }

        const result = await response.json();
        if (!Array.isArray(result)) return result;
        return [...result].sort((a, b) => toDateValue(a) - toDateValue(b));
    }

}
function setActivityDay(activityData, dataSetFarm, ui) {
    //const { it, fish, flower, nft, nftw, ftrades } = dataSetFarm;
    const {
        data: { dataSet },
        actions: {
            handleUIChange,
            handleTooltip,
        },
        img: {
            imgSFL,
            imgCoins,
            imgbuyit,
            imgxp,
        }
    } = useAppCtx();
    const {
        selectedFromActivityDay,
        xListeColActivity,
    } = ui;
    if (activityData[0]) {
        const dateSeasonConst = dataSetFarm.constants.dateSeason;
        const actKeys = Object.keys(activityData);
        var totXP = 0;
        var totXPDetails = {};
        var tottktdchest = 0;
        //var tottktcrop = 0;
        //var tottktwactv = 0;
        //var tottkttntcl = 0;
        var totdeliveriestkt = 0;
        var totchorestkt = 0;
        var totBountyChickensTkt = 0;
        var totBountyBarnTkt = 0;
        var totBountyPoppyTkt = 0;
        var totmaxtkt = 0;
        var totdeliveriescost = 0;
        var totdeliveriescostp2pt = 0;
        var totdeliveriessfl = 0;
        var totdeliveriescoins = 0;
        var totdeliveriestktcost = 0;
        var tottktmaxchest = 0;
        var tottktmaxdeliveries = 0;
        var tottktmaxchores = 0;
        var tottktmaxbounties = 0;
        var totpoppycost = 0;
        var totpoppycostp2p = 0;
        var totpoppytktcostweight = 0;
        var totpoppytktreward = 0;
        const ximgxp = <i><img src={imgxp} alt='' className="resico" title="XP" style={{ width: `20px`, height: `20px` }} /></i>;
        const ximgtkt = <i><img src={dataSet.imgtkt} alt='' className="itico" title="Tickets" /></i>;
        //const ximgcoins = <i><img src={imgcoins} alt='' className="itico" title="Coins" /></i>;
        const ximgdchest = <i><img src="./icon/ui/synced.gif" alt='' className="itico" title="Tickets from daily chest" style={{ width: `20px`, height: `20px` }} /></i>;
        //const ximgcrop = <i><img src={imgcrop} alt='' className="resico" title="Tickets from crops" style={{ width: `20px`, height: `20px` }} /></i>;
        //const ximgwactv = <i><img src={it["Flower"].img} alt='' className="itico" title="Tickets from Weekly activity" /></i>;
        //const ximgtntcl = <i><img src="./icon/fish/tentacle.png" alt='' className="itico" title="Tickets from tentacles" /></i>;
        const imgdeliv = <i><img src="./icon/ui/delivery.webp" alt='' className="resico" title="Deliveries" style={{ width: `20px`, height: `20px` }} /></i>;
        const imgchore = <i><img src="./icon/ui/chores.webp" alt='' className="resico" title="Chores" style={{ width: `20px`, height: `20px` }} /></i>;
        const imgBountyChicken = <i><img src="./icon/res/chkn.png" alt='' className="itico" title="Bounty Chickens" /></i>;
        const imgBountyBarn = <i><img src="./icon/res/cow.webp" alt='' className="itico" title="Bounty Barn" /></i>;
        const imgBountyPoppy = <i><img src="./icon/pnj/poppy.png" alt='' className="itico" title="Bounty Poppy" /></i>;
        //const imgmaxtkt = <i><img src={dataSet.imgtkt} alt='' className="resico" title="Tickets max by day" /></i>;
        const deliveryGroupStyle = { borderLeft: '1px solid rgba(255,255,255,0.28)', borderRight: '1px solid rgba(255,255,255,0.28)' };
        const deliveryLeftStyle = { borderLeft: '1px solid rgba(255,255,255,0.28)' };
        const deliveryRightStyle = { borderRight: '1px solid rgba(255,255,255,0.28)' };
        const poppyGroupStyle = { borderLeft: '1px solid rgba(255,255,255,0.28)', borderRight: '1px solid rgba(255,255,255,0.28)' };
        const poppyLeftStyle = { borderLeft: '1px solid rgba(255,255,255,0.28)' };
        const poppyRightStyle = { borderRight: '1px solid rgba(255,255,255,0.28)' };
        const buildMaxTooltip = (tot) => ([
            `Daily chest: ${Number(tot?.tktMaxChest || 0)}`,
            `Deliveries: ${Number(tot?.tktMaxDeliveries || 0)}`,
            `Chores: ${Number(tot?.tktMaxChores || 0)}`,
            `Bounties: ${Number(tot?.tktMaxBounties || 0)}`,
            `Total: ${Number(tot?.tktMax || 0)}`,
        ].join('\n'));
        const dateSeason = new Date(dateSeasonConst);
        const sfs = new Date() - dateSeason;
        const dfs = Math.floor(sfs / (1000 * 60 * 60 * 24));
        const dayRows = activityData.map((activityItem, index) => ({
            activityItem,
            prevDayActivity: activityData[index - 1] || null,
        })).reverse();
        const tableContent = dayRows.map(({ activityItem, prevDayActivity }) => {
            const endDate = new Date(activityItem.date);
            const rowStyle = endDate.getDay() === 1 ? { backgroundColor: 'rgba(255, 236, 140, 0.1)' } : undefined;
            //const isSeasonDay = endDate >= dateSeason;
            const isSeasonDay = endDate.setHours(0, 0, 0, 0) >= dateSeason.setHours(0, 0, 0, 0);
            //const curw = ((endDate.getDate()) / 8);
            //const isweeklyactday = Number.isInteger(curw) || (endDate.getDate() === dateSeason.getDate() && endDate.getMonth() === dateSeason.getMonth());
            //const curD = endDate.getDay() === resetDay;
            //const wactdone = isweeklyactday && wklactivity[Math.floor(curw) + 1];
            if (isSeasonDay) {
                const ActTot = setActivityTot(activityItem, "day", dataSetFarm, dataSet, prevDayActivity);
                //const allSortedItems = ActTot.allSortedItems;
                //const compoHarvested = ActTot.compoHarvested;
                //const compoHarvestn = ActTot.compoHarvestn;
                //const compoBurn = ActTot.compoBurn;
                const tot = ActTot.tot;
                //const cobj = activityData[idData].data;
                const sday = String(endDate.getDate()).padStart(2, '0');
                const smonth = String(endDate.getMonth() + 1).padStart(2, '0');
                const syear = String(endDate.getFullYear()).slice(-2);
                const sxdate = `${smonth}/${sday}/${syear}`;
                const idate = sxdate
                const itotxp = tot.XP;
                const xpTooltip = { date: idate, totalXp: itotxp, items: tot.xpDetails || {} };
                const itktdchest = tot.tktchest;
                //const itktcrop = tot.tktcrop;
                //const itktwactv = isweeklyactday ? wactdone ? tktWeekly : 0 : 0;
                //const itkttntcl = cobj.tickettentacle ? cobj.tickettentacle : 0; //compoHarvested["Kraken Tenacle"] * 12;
                //const itkttntcl = 0; //compoHarvested["Kraken Tentacle"] ? compoHarvested["Kraken Tentacle"] * 12 : 0;
                const ideliveriestkt = tot.deliveriestkt;
                const ichorestkt = tot.chorestkt;
                const ibountiestkt = tot.bountiestkt;
                const ibountyChickensTkt = tot.bountyChickensTkt;
                const ibountyBarnTkt = tot.bountyBarnTkt;
                const ibountyPoppyTkt = tot.bountyPoppyTkt;
                const itktmax = tot.tktMax;
                const ideliveriescost = tot.deliveriescost;
                const ideliveriescostp2pt = tot.deliveriescostp2pt;
                const itktcost = tot.tktCost;
                const ideliveriessfl = tot.deliveriessfl;
                const ideliveriescoins = tot.deliveriescoins;
                const ipoppycost = tot.poppyCost;
                const ipoppycostp2p = tot.poppyCostP2P;
                const ipoppytktcost = tot.poppyTktCost;
                const ichoresdelivtkt = Number(ideliveriestkt) + Number(ichorestkt) + Number(ibountiestkt) + Number(itktdchest); //+ Number(itktwactv);
                const maxTooltip = buildMaxTooltip(tot);
                totXP += itotxp;
                Object.entries(tot.xpDetails || {}).forEach(([dish, info]) => {
                    totXPDetails[dish] = totXPDetails[dish] || { qty: 0, xpUnit: Number(info?.xpUnit || 0), xpTotal: 0 };
                    totXPDetails[dish].qty += Number(info?.qty || 0);
                    totXPDetails[dish].xpUnit = Number(info?.xpUnit || totXPDetails[dish].xpUnit || 0);
                    totXPDetails[dish].xpTotal += Number(info?.xpTotal || 0);
                });
                tottktdchest += itktdchest;
                //tottktcrop += itktcrop;
                //tottktwactv += itktwactv;
                //tottkttntcl += Number(itkttntcl);
                totdeliveriestkt += ideliveriestkt;
                totchorestkt += ichorestkt;
                totBountyChickensTkt += ibountyChickensTkt;
                totBountyBarnTkt += ibountyBarnTkt;
                totBountyPoppyTkt += ibountyPoppyTkt;
                totdeliveriescost += ideliveriescost;
                totdeliveriescostp2pt += ideliveriescostp2pt;
                totdeliveriessfl += ideliveriessfl;
                totdeliveriescoins += ideliveriescoins;
                totdeliveriestktcost += Number(tot.deliveriestktcost || 0);
                tottktmaxchest += Number(tot.tktMaxChest || 0);
                tottktmaxdeliveries += Number(tot.tktMaxDeliveries || 0);
                tottktmaxchores += Number(tot.tktMaxChores || 0);
                tottktmaxbounties += Number(tot.tktMaxBounties || 0);
                totpoppycost += Number(tot.poppyCost || 0);
                totpoppycostp2p += Number(tot.poppyCostP2P || 0);
                totpoppytktcostweight += Number(tot.poppyTktCost || 0) * Number(tot.poppyTktReward || 0);
                totpoppytktreward += Number(tot.poppyTktReward || 0);
                totmaxtkt += itktmax;
                return (
                    <tr key={activityItem.date} style={rowStyle}>
                        {xListeColActivity[0][1] === 1 ? <td className="tdcenter" id="iccolumn">{idate}</td> : null}
                        {xListeColActivity[1][1] === 1 ? <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip("XP", "activityxp", xpTooltip, e)}>{parseFloat(itotxp).toFixed(1)}</td> : null}
                        {xListeColActivity[2][1] === 1 ? <td className="tdcenter">{itktdchest > 0 ? itktdchest : ""}</td> : null}
                        {/* {xListeColActivity[3][1] === 1 ? <td className="tdcenter">{itktcrop > 0 ? itktcrop : ""}</td> : null} */}
                        {/* {xListeColActivity[5][1] === 1 ? <td className="tdcenter">{itktwactv > 0 ? itktwactv : ""}</td> : null} */}
                        {xListeColActivity[3][1] === 1 ? <td className="tdcenter">{ideliveriestkt > 0 ? ideliveriestkt : ""}</td> : null}
                        {xListeColActivity[4][1] === 1 ? <td className="tdcenter">{ichorestkt > 0 ? ichorestkt : ""}</td> : null}
                        {xListeColActivity[5][1] === 1 ? <td className="tdcenter">{ibountyChickensTkt > 0 ? ibountyChickensTkt : ""}</td> : null}
                        {xListeColActivity[6][1] === 1 ? <td className="tdcenter">{ibountyBarnTkt > 0 ? ibountyBarnTkt : ""}</td> : null}
                        {xListeColActivity[7][1] === 1 ? <td className="tdcenter">{ibountyPoppyTkt > 0 ? ibountyPoppyTkt : ""}</td> : null}
                        {xListeColActivity[8][1] === 1 ? <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip("Max", "activitymax", {
                            date: idate,
                            got: ichoresdelivtkt,
                            max: itktmax,
                            gotChest: Number(itktdchest || 0),
                            gotDeliveries: Number(ideliveriestkt || 0),
                            gotChores: Number(ichorestkt || 0),
                            gotBounties: Number(ibountiestkt || 0),
                            chest: Number(tot?.tktMaxChest || 0),
                            deliveries: Number(tot?.tktMaxDeliveries || 0),
                            chores: Number(tot?.tktMaxChores || 0),
                            bounties: Number(tot?.tktMaxBounties || 0),
                        }, e)}>{ichoresdelivtkt}/{itktmax}</td> : null}
                        {xListeColActivity[9][1] === 1 ? <td className="tdcenter" style={deliveryLeftStyle}>{ideliveriescost > 0 ? frmtNb(ideliveriescost) : ""}</td> : null}
                        {xListeColActivity[10][1] === 1 ? <td className="tdcenter">{ideliveriescostp2pt > 0 ? frmtNb(ideliveriescostp2pt) : ""}</td> : null}
                        {xListeColActivity[11][1] === 1 ? <td className="tdcenter">{itktcost > 0 ? frmtNb(itktcost) : ""}</td> : null}
                        {xListeColActivity[12][1] === 1 ? <td className="tdcenter">{ideliveriessfl > 0 ? frmtNb(ideliveriessfl) : ""}</td> : null}
                        {xListeColActivity[13][1] === 1 ? <td className="tdcenter" style={deliveryRightStyle}>{ideliveriescoins > 0 ? frmtNb(ideliveriescoins) : ""}</td> : null}
                        {xListeColActivity[14][1] === 1 ? <td className="tdcenter" style={poppyLeftStyle}>{ipoppycost > 0 ? frmtNb(ipoppycost) : ""}</td> : null}
                        {xListeColActivity[15][1] === 1 ? <td className="tdcenter">{ipoppycostp2p > 0 ? frmtNb(ipoppycostp2p) : ""}</td> : null}
                        {xListeColActivity[16][1] === 1 ? <td className="tdcenter" style={poppyRightStyle}>{ipoppytktcost > 0 ? frmtNb(ipoppytktcost) : ""}</td> : null}
                    </tr>
                );
            }

        });
        const tableHeader = (
            <thead>
                <tr>
                    {xListeColActivity[0][1] === 1 ? <th className="th-icon" rowSpan="2">
                        {/* <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                            <InputLabel>From</InputLabel>
                            <Select name={"selectedFromActivityDay"} value={selectedFromActivityDay} onChange={handleUIChange}>
                                <MenuItem value="7">7 days</MenuItem>
                                <MenuItem value="31">1 month</MenuItem>
                                <MenuItem value="season">season</MenuItem>
                            </Select></FormControl></div> */}
                        <DList
                            name="selectedFromActivityDay"
                            title="From"
                            options={[
                                { value: "7", label: "7 days" },
                                { value: "31", label: "1 month" },
                                { value: "season", label: "Season" },
                            ]}
                            value={selectedFromActivityDay}
                            onChange={handleUIChange}
                            height={28}
                        />
                    </th> : null}
                    {xListeColActivity[1][1] === 1 ? <th className="thcenter" rowSpan="2">{ximgxp}</th> : null}
                    {xListeColActivity[2][1] === 1 ? <th className="thcenter" rowSpan="2">{ximgdchest}</th> : null}
                    {/* {xListeColActivity[3][1] === 1 ? <th className="thcenter">{ximgcrop}</th> : null} */}
                    {/* {xListeColActivity[5][1] === 1 ? <th className="thcenter">{ximgwactv}</th> : null} */}
                    {xListeColActivity[3][1] === 1 ? <th className="thcenter" rowSpan="2">{imgdeliv}</th> : null}
                    {xListeColActivity[4][1] === 1 ? <th className="thcenter" rowSpan="2">{imgchore}</th> : null}
                    {xListeColActivity[5][1] === 1 ? <th className="thcenter" rowSpan="2">{imgBountyChicken}</th> : null}
                    {xListeColActivity[6][1] === 1 ? <th className="thcenter" rowSpan="2">{imgBountyBarn}</th> : null}
                    {xListeColActivity[7][1] === 1 ? <th className="thcenter" rowSpan="2">{imgBountyPoppy}</th> : null}
                    {xListeColActivity[8][1] === 1 ? <th className="thcenter" rowSpan="2">Max{ximgtkt}</th> : null}
                    {xListeColActivity.slice(9, 14).some(([, visible]) => visible === 1) ? <th className="thcenter" style={deliveryGroupStyle} colSpan={xListeColActivity.slice(9, 14).filter(([, visible]) => visible === 1).length}>{imgdeliv}Delivery</th> : null}
                    {xListeColActivity.slice(14, 17).some(([, visible]) => visible === 1) ? <th className="thcenter" style={poppyGroupStyle} colSpan={xListeColActivity.slice(14, 17).filter(([, visible]) => visible === 1).length}>{imgBountyPoppy}Poppy</th> : null}
                </tr>
                <tr>
                    {xListeColActivity[9][1] === 1 ? <th className="thcenter" style={deliveryLeftStyle}>Cost</th> : null}
                    {xListeColActivity[10][1] === 1 ? <th className="thcenter">{imgbuyit}</th> : null}
                    {xListeColActivity[11][1] === 1 ? <th className="thcenter">{imgSFL}/{ximgtkt}</th> : null}
                    {xListeColActivity[12][1] === 1 ? <th className="thcenter">{imgSFL}</th> : null}
                    {xListeColActivity[13][1] === 1 ? <th className="thcenter" style={deliveryRightStyle}>{imgCoins}</th> : null}
                    {xListeColActivity[14][1] === 1 ? <th className="thcenter" style={poppyLeftStyle}>Cost</th> : null}
                    {xListeColActivity[15][1] === 1 ? <th className="thcenter">{imgbuyit}</th> : null}
                    {xListeColActivity[16][1] === 1 ? <th className="thcenter" style={poppyRightStyle}>{imgSFL}/{ximgtkt}</th> : null}
                </tr>
                <tr>
                    {xListeColActivity[0][1] === 1 ? <td className="tdcenter">TOTAL</td> : null}
                    {xListeColActivity[1][1] === 1 ? <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip("XP", "activityxp", {
                        date: "TOTAL",
                        totalXp: totXP,
                        items: totXPDetails
                    }, e)}>{parseFloat(totXP).toFixed(1)}</td> : null}
                    {xListeColActivity[2][1] === 1 ? <td className="tdcenter">{tottktdchest}</td> : null}
                    {/* {xListeColActivity[3][1] === 1 ? <td className="tdcenter">{tottktcrop}</td> : null} */}
                    {/* {xListeColActivity[5][1] === 1 ? <td className="tdcenter">{tottktwactv}</td> : null} */}
                    {xListeColActivity[3][1] === 1 ? <td className="tdcenter">{totdeliveriestkt}</td> : null}
                    {xListeColActivity[4][1] === 1 ? <td className="tdcenter">{totchorestkt}</td> : null}
                    {xListeColActivity[5][1] === 1 ? <td className="tdcenter">{totBountyChickensTkt}</td> : null}
                    {xListeColActivity[6][1] === 1 ? <td className="tdcenter">{totBountyBarnTkt}</td> : null}
                    {xListeColActivity[7][1] === 1 ? <td className="tdcenter">{totBountyPoppyTkt}</td> : null}
                    {xListeColActivity[8][1] === 1 ? <td className="tdcenter tooltipcell" onClick={(e) => handleTooltip("Max", "activitymax", {
                        date: "TOTAL",
                        got: totdeliveriestkt + totchorestkt + totBountyChickensTkt + totBountyBarnTkt + totBountyPoppyTkt + tottktdchest,
                        max: totmaxtkt,
                        gotChest: tottktdchest,
                        gotDeliveries: totdeliveriestkt,
                        gotChores: totchorestkt,
                        gotBounties: totBountyChickensTkt + totBountyBarnTkt + totBountyPoppyTkt,
                        chest: tottktmaxchest,
                        deliveries: tottktmaxdeliveries,
                        chores: tottktmaxchores,
                        bounties: tottktmaxbounties,
                    }, e)}>{totdeliveriestkt + totchorestkt + totBountyChickensTkt + totBountyBarnTkt + totBountyPoppyTkt + tottktdchest}/{totmaxtkt}</td> : null}
                    {xListeColActivity[9][1] === 1 ? <td className="tdcenter" style={deliveryLeftStyle}>{frmtNb(totdeliveriescost)}</td> : null}
                    {xListeColActivity[10][1] === 1 ? <td className="tdcenter">{frmtNb(totdeliveriescostp2pt)}</td> : null}
                    {xListeColActivity[11][1] === 1 ? <td className="tdcenter">{totdeliveriestkt > 0 ? frmtNb(totdeliveriestktcost / totdeliveriestkt) : ""}</td> : null}
                    {xListeColActivity[12][1] === 1 ? <td className="tdcenter">{frmtNb(totdeliveriessfl)}</td> : null}
                    {xListeColActivity[13][1] === 1 ? <td className="tdcenter" style={deliveryRightStyle}>{frmtNb(totdeliveriescoins)}</td> : null}
                    {xListeColActivity[14][1] === 1 ? <td className="tdcenter" style={poppyLeftStyle}>{frmtNb(totpoppycost)}</td> : null}
                    {xListeColActivity[15][1] === 1 ? <td className="tdcenter">{frmtNb(totpoppycostp2p)}</td> : null}
                    {xListeColActivity[16][1] === 1 ? <td className="tdcenter" style={poppyRightStyle}>{totpoppytktreward > 0 ? frmtNb(totpoppytktcostweight / totpoppytktreward) : ""}</td> : null}
                </tr>
            </thead>
        );
        const table = (
            <>
                <table className="table">
                    {tableHeader}
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </>
        );
        return (table);
    }
}
function setActivityItem(activityData, dataSetFarm, ui) {
    const {
        data: { dataSet },
        actions: {
            handleUIChange,
            setCstPrices,
            setSelectedInv,
            setPetView,
            setInputValue,
            setInputMaxBB,
            setInputFarmTime,
            setInputCoinsRatio,
            setInputFromLvl,
            setInputToLvl,
            setInputKeep,
            setSelectedQuantFetch,
            setcustomQuantFetch,
            setfromexpand,
            settoexpand,
            setfromtoexpand,
            setuseNotif,
            handleTooltip,
            handleChangeQuant,
            handleChangeQuantCook,
            handleChangeQuantFish,
            handleChangeFromActivity,
            handleChangeFromActivityDay,
            handleChangeActivityDisplay,
            handleChangepetView,
            handleChangeExpandType,
            handleChangeQuantity,
            handleChangeQuantityCook,
            handleChangeAnimalLvl,
            handleChangeSeason,
            handleChangeReady,
            handleChangeDsfl,
            handleChangeDigCur,
            handleChangeSeedsCM,
            handleChangeQuantFetch,
            handleChangeCurr,
            handleInputKeepChange,
            handleInputcstPricesChange,
            handleInputcustomSeedCMChange,
            handleInputcustomQuantFetchChange,
            handleInputtoCMChange,
            handleFromLvlChange,
            handleToLvlChange,
            handleCostCheckedChange,
            handleTryCheckedChange,
            handleFarmitChange,
            handleCookitChange,
            handleIncrement,
            handleDecrement,
            handleFromExpandChange,
            handleToExpandChange,
            handleSetHrvMax,
            handleTraderClick
        },
        img: {
            imgsfl,
            imgSFL,
            imgcoins,
            imgCoins,
            imgxp,
            imgrdy,
            imgwinter,
            imgspring,
            imgsummer,
            imgautumn,
            imgcrop,
            imgwood,
            imgstone,
            imgbeehive,
            imgcow,
            imgsheep,
            imgflowerbed,
            imgchkn,
            imgpet,
            imgexchng,
            imgExchng,
            imgbuyit,
            imgna,
            imgrod,
        }
    } = useAppCtx();
    const {
        useNotif,
        inputValue,
        inputMaxBB,
        inputFarmTime,
        inputCoinsRatio,
        inputFromLvl,
        inputToLvl,
        inputKeep,
        fromtolvltime,
        fromtolvlxp,
        dailyxp,
        cstPrices,
        customSeedCM,
        customQuantFetch,
        toCM,
        fromexpand,
        toexpand,
        fromtoexpand,
        selectedCurr,
        selectedQuant,
        selectedQuantCook,
        selectedQuantFish,
        selectedCostCook,
        selectedQuantity,
        selectedQuantityCook,
        selectedAnimalLvl,
        selectedReady,
        selectedDsfl,
        selectedFromActivity,
        selectedFromActivityDay,
        selectedExpandType,
        selectedSeedsCM,
        selectedQuantFetch,
        activityDisplay,
        selectedInv,
        selectedDigCur,
        selectedSeason,
        GraphType,
        petView,
        xListeCol,
        xListeColCook,
        xListeColFish,
        xListeColFlower,
        xListeColBounty,
        xListeColAnimals,
        xListeColExpand,
        xListeColActivity,
        xListeColActivityItem,
        xListeColActivityQuest,
        CostChecked,
        TryChecked,
        BurnChecked,
        Refresh,
    } = ui;
    if (activityData[0]) {
        const { it, food, fish, flower } = dataSetFarm.itables;
        const { nft, nftw } = dataSetFarm.boostables;
        const ActTot = setActivityTot(activityData, "items", dataSetFarm, dataSet);
        const allSortedItems = ActTot.allSortedItems;
        const compoHarvested = ActTot.compoHarvested;
        const compoHarvestn = ActTot.compoHarvestn;
        const compoTraded = ActTot.compoTraded;
        const compoTradedSfl = ActTot.compoTradedSfl;
        const compoBurn = ActTot.compoBurn;
        const foodBuild = ActTot.foodBuild;
        const delivBurn = ActTot.delivBurn;
        const tot = ActTot.tot;
        const tradeTax = Number(dataSet?.options?.tradeTax ?? 10);
        var totCost = 0;
        var totCostt = 0;
        var totCostn = 0;
        var totCosto = 0;
        var totTradedSfl = getNetTradePrice(tot.totTradedSfl, tradeTax);
        const tableContent = allSortedItems.map(([element]) => {
            if (compoHarvested[element] > 0 || compoBurn[element] > 0 || compoTraded[element] > 0) {
                const cobj = it[element] || fish[element] || flower[element] || nft[element] || nftw[element] || null;
                const ico = cobj ? cobj.img : element === "SFL" ? imgsfl : element === "TKT" ? dataSet.imgtkt : element === "COINS" ? imgcoins : imgxp;
                const iburn = element === "SFL" ? '' : compoBurn[element] || '';
                var iquant = compoHarvested[element] ? compoHarvested[element] : '';
                var iquantmax = 0;
                if (element === "TKT") {
                    iquant = (tot.deliveriestkt + tot.chorestkt + tot.bountiestkt + tot.tktchest);
                    iquantmax = tot.tktMax;
                }
                const iquanttraded = compoTraded[element] ? compoTraded[element] : '';
                const iquanttradedsfl = compoTradedSfl[element] ? getNetTradePrice(compoTradedSfl[element], tradeTax) : '';
                const iquantb = element !== "TKT" ? formatActivityItemCell(iquant - (BurnChecked ? iburn : 0)) : iquant;
                const iharvestn = element === "SFL" ? frmtNb(tot.balSfl) : formatActivityItemCell(compoHarvestn[element] || ''); //tot.balSfl
                const titlesfl = element === "SFL" ? "based on farm balance" : "";
                //const icostb = !iquant && cobj ? cobj.cost * iburn || 0 : element === "SFL" && iburn;
                //const icostb = cobj ? cobj.cost * iburn || 0 : element === "SFL" && iburn;
                const icost = cobj ? ((cobj.cost / dataSet.options.coinsRatio) * (iquant || iburn)) : (element === "SFL" && (iburn - iquant));
                const icostp2pt = cobj && iquant > 0 ? !isNaN(Number(cobj.costp2pt)) ? Number(cobj.costp2pt) * (iquant || 0) : '' : '';
                const icostp2pn = cobj && iquant > 0 ? !isNaN(Number(cobj.costp2pn)) ? Number(cobj.costp2pn) * (iquant || 0) : '' : '';
                const icostp2po = cobj && iquant > 0 ? !isNaN(Number(cobj.costp2po)) ? Number(cobj.costp2po) * (iquant || 0) : '' : '';
                const icostt = icost || 0;
                //const itoolscraft = cobj.toolscrafted;
                totCost += Number(icostt);
                totCostt += Number(icostp2pt);
                totCostn += Number(icostp2pn);
                totCosto += Number(icostp2po);
                return (
                    <tr>
                        <td className="tdcenter" id="iccolumn"><i><img src={ico} alt={''} className="itico" title={element} /></i></td>
                        {xListeColActivityItem[0][1] === 1 ? <td className="tditem">{element}</td> : null}
                        {xListeColActivityItem[1][1] === 1 ? <td className="tdcenter" title={titlesfl}>{iharvestn && iharvestn}</td> : null}
                        {xListeColActivityItem[2][1] === 1 ? <td className="tdcenter">{iquantb && iquantb}{iquantmax > 0 ? `/${iquantmax}` : ""}</td> : null}
                        {xListeColActivityItem[3][1] === 1 ? <td className="tdcenter">{formatActivityItemCell(iburn)}</td> : null}
                        {xListeColActivityItem[4][1] === 1 ? <td className="tdcenter">{icostt && frmtNb(icostt)}</td> : null}
                        {xListeColActivityItem[5][1] === 1 ? <td className="tdcenter">{icostp2pt && frmtNb(icostp2pt)}</td> : null}
                        {/* {xListeColActivityItem[6][1] === 1 ? <td className="tdcenter">{icostp2pn && frmtNb(icostp2pn)}</td> : null}
                {xListeColActivityItem[7][1] === 1 ? <td className="tdcenter">{icostp2po && frmtNb(icostp2po)}</td> : null} */}
                        {xListeColActivityItem[8][1] === 1 ? <td className="tdcenterbrd">{iquanttraded && parseFloat(iquanttraded).toFixed(0)}</td> : null}
                        {xListeColActivityItem[8][1] === 1 ? <td className="tdcenterbrd">{iquanttradedsfl && parseFloat(iquanttradedsfl).toFixed(1)}</td> : null}
                        {xListeColActivityItem[9][1] === 1 ? <td className="tdcenterbrd">{formatActivityItemCell(delivBurn["total"][element])}</td> : null}
                        {xListeColActivityItem[9][1] === 1 ? Object.entries(foodBuild).map(([itemName]) => (
                            (food[itemName]) ? (<td className="tdcenterbrd">{formatActivityItemCell(foodBuild[itemName][element])}</td>) : null)) : null}
                    </tr>
                );
            }
        });
        const tableHeader = (
            <thead>
                <tr>
                    <th className="th-icon"></th>
                    {xListeColActivityItem[0][1] === 1 ? <th className="thcenter">Item</th> : null}
                    {xListeColActivityItem[1][1] === 1 ? <th className="thcenter">Hrvst</th> : null}
                    {xListeColActivityItem[2][1] === 1 ? <th className="thcenter">
                        {/* <div className="selectquantback" style={{ top: `4px` }}><FormControl variant="standard" id="formselectquant" className="selectquant" size="small">
                            <InputLabel>Quantity</InputLabel>
                            <Select name={"selectedFromActivity"} value={selectedFromActivity} onChange={handleUIChange}>
                                <MenuItem value="today">today</MenuItem>
                                <MenuItem value="1">24h</MenuItem>
                                <MenuItem value="7">7 days</MenuItem>
                                <MenuItem value="31">1 month</MenuItem>
                                <MenuItem value="season">season</MenuItem>
                            </Select></FormControl></div> */}
                        <DList
                            name="selectedFromActivity"
                            title="Quantity"
                            options={[
                                { value: "today", label: "Today" },
                                { value: "1", label: "24h" },
                                { value: "7", label: "7 days" },
                                { value: "31", label: "1 month" },
                                { value: "season", label: "Season" },
                            ]}
                            value={selectedFromActivity}
                            onChange={handleUIChange}
                            height={28}
                        />
                    </th> : null}
                    {xListeColActivityItem[3][1] === 1 ? <th className="thcenter">
                        <div className="checktry"><input type="checkbox" id="BurnColumnCheckbox" name="BurnChecked" style={{ alignContent: `right` }} checked={BurnChecked} onChange={handleUIChange} /></div>
                        Burn</th> : null}
                    {xListeColActivityItem[4][1] === 1 ? <th className="thcenter">Cost</th> : null}
                    {xListeColActivityItem[5][1] === 1 ? <th className="thcenter">Market</th> : null}
                    {/* {xListeColActivityItem[6][1] === 1 ? <th className="thcenter">Niftyswap</th> : null}
              {xListeColActivityItem[7][1] === 1 ? <th className="thcenter">OpenSea</th> : null} */}
                    {xListeColActivityItem[8][1] === 1 ? <th className="tdcenterbrd"><i><img src="./icon/ui/exchange.png" title="Traded" className="itico" /></i></th> : null}
                    {xListeColActivityItem[8][1] === 1 ? <th className="tdcenterbrd"><i><img src={imgsfl} title="SFL" className="itico" /></i></th> : null}
                    {xListeColActivityItem[9][1] === 1 ? <th className="tdcenterbrd"><i><img src="./icon/ui/delivery_board.png" title="Deliveries burn" className="itico" /></i></th> : null}
                    {xListeColActivityItem[9][1] === 1 ? Object.entries(foodBuild).map(([itemName]) => (
                        (food[itemName]) ? (<th className="tdcenterbrd" key={itemName}><i><img src={food[itemName].img} title={itemName} className="itico" /></i></th>) : null)) : null}
                </tr>
                <tr>
                    <td className="tdcenter">TOTAL</td>
                    {xListeColActivityItem[0][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColActivityItem[1][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColActivityItem[2][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColActivityItem[3][1] === 1 ? <td className="tdcenter"></td> : null}
                    {xListeColActivityItem[4][1] === 1 ? <td className="tdcenter">{frmtNb(totCost)}</td> : null}
                    {xListeColActivityItem[5][1] === 1 ? <td className="tdcenter">{frmtNb(totCostt)}</td> : null}
                    {/* {xListeColActivityItem[6][1] === 1 ? <td className="tdcenter">{frmtNb(totCostn)}</td> : null}
              {xListeColActivityItem[7][1] === 1 ? <td className="tdcenter">{frmtNb(totCosto)}</td> : null} */}
                    {xListeColActivityItem[8][1] === 1 ? <td className="tdcenterbrd"></td> : null}
                    {xListeColActivityItem[8][1] === 1 ? <td className="tdcenterbrd">{frmtNb(totTradedSfl)}</td> : null}
                    {xListeColActivityItem[9][1] === 1 ? <td className="tdcenterbrd"></td> : null}
                    {xListeColActivityItem[9][1] === 1 ? Object.entries(foodBuild).map(([itemName]) => (
                        (food[itemName]) ? (<td className="tdcenterbrd" key={itemName}>{foodBuild[itemName]["quant"]}</td>) : null)) : null}
                </tr>
            </thead>
        );
        const table = (
            <>
                <table className="table">
                    {tableHeader}
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </>
        );
        return (table);
    }
}
function setActivityTrades(activityData, dataSetFarm, ui, tradeSummaryItems, tradeDailySeries) {
    const {
        actions: {
            handleUIChange,
        }
    } = useAppCtx();
    const {
        selectedFromActivity,
        selectedActivityTradeMetric,
        selectedActivityTradeFilters,
    } = ui;
    const metric = selectedActivityTradeMetric === "price" ? "price" : "quantity";
    const summaryItems = Array.isArray(tradeSummaryItems) ? tradeSummaryItems : [];
    const totalPrice = summaryItems.reduce((sum, item) => sum + Number(item?.price || 0), 0);

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div className="modalgraph-buttons" style={{ marginBottom: 12 }}>
                <div className="modalgraph-header-left" style={{ width: "100%", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <button
                        type="button"
                        onClick={() => handleUIChange({ target: { name: "selectedActivityTradeMetric", value: "quantity" } })}
                        className={`graph-mode-btn ${metric === "quantity" ? "is-active" : ""}`}
                    >
                        Sold
                    </button>
                    <button
                        type="button"
                        onClick={() => handleUIChange({ target: { name: "selectedActivityTradeMetric", value: "price" } })}
                        className={`graph-mode-btn ${metric === "price" ? "is-active" : ""}`}
                    >
                        Price
                    </button>
                    <DList
                        name="selectedFromActivity"
                        title="Range"
                        options={[
                            { value: "today", label: "Today" },
                            { value: "1", label: "24h" },
                            { value: "7", label: "7 days" },
                            { value: "31", label: "1 month" },
                            { value: "season", label: "Season" },
                        ]}
                        value={selectedFromActivity}
                        onChange={handleUIChange}
                        height={28}
                    />
                    <DList
                        name="selectedActivityTradeFilters"
                        title="Show"
                        options={[
                            { value: "resources", label: "Resources" },
                            { value: "collectibles", label: "Collectibles" },
                            { value: "other", label: "Other" },
                        ]}
                        multiple={true}
                        closeOnSelect={false}
                        value={selectedActivityTradeFilters}
                        onChange={handleUIChange}
                    />
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 8px",
                            border: "1px solid rgb(90, 90, 90)",
                            borderRadius: "6px",
                            background: "rgba(0, 0, 0, 0.28)",
                            width: "fit-content",
                            maxWidth: "100%",
                        }}
                    >
                        <img src="./icon/res/flowertoken.webp" alt="" style={{ width: 14, height: 14, objectFit: "contain" }} />
                        <span style={{ fontSize: "12px", whiteSpace: "nowrap" }}>{frmtNb(totalPrice)}</span>
                    </div>
                </div>
            </div>
            {summaryItems.length > 0 ? (
                <div className="activity-trades-layout">
                    <div className="activity-trades-list-section">
                        <div className="activity-trades-list-panel">
                            <TradeSummaryTable items={summaryItems} metric={metric} />
                        </div>
                    </div>
                    <div className="activity-trades-graph-section">
                        <TradeDailyStackedChart days={tradeDailySeries} metric={metric} />
                    </div>
                </div>
            ) : (
                <div style={{ padding: "12px 0" }}>No trades in this date range.</div>
            )}
        </div>
    );
}
function setActivityQuest(activityData, dataSetFarm, ui) {
    const {
        actions: {
            handleUIChange,
        }
    } = useAppCtx();
    const { selectedInv,
        selectedFromActivity,
        selectedFromActivityDay,
        activityDisplay,
        selectedActivityQuestCategory,
        xListeColActivity,
        xListeColActivityItem,
        xListeColActivityQuest
    } = ui;
    if (activityData[0]) {
        const toNumber = (value) => {
            if (typeof value === "number") return Number.isFinite(value) ? value : 0;
            if (typeof value === "string") {
                const n = Number(value.replace(",", "."));
                return Number.isFinite(n) ? n : 0;
            }
            return 0;
        };
        //const { it, food, fish, flower, nft, nftw } = dataSetFarm;
        const tot = setActivityTotQuest(activityData, dataSetFarm);
        const Quest = tot.Quest;
        const questKeys = Object.keys(Quest);
        const dayKeys = Object.keys(activityData);
        const uniqueQuests = new Set();
        const completionsByDate = {};
        const dToday = formatDate(new Date());
        const getQuestKey = (quest) => JSON.stringify({
            from: quest.from,
            fromIcon: quest.fromIcon || "",
            questCategory: quest.questCategory || "Delivery",
            description: quest.description,
            reward: toNumber(quest.reward),
            istkt: quest.istkt,
        });
        questKeys.forEach((element) => {
            const cobj = Quest[element];
            const qxdate = formatDate(cobj.date);
            const questKey = getQuestKey(cobj);
            uniqueQuests.add(questKey);
            if (!completionsByDate[qxdate]) {
                completionsByDate[qxdate] = {};
            }
            completionsByDate[qxdate][questKey] = cobj.completed ? "X" : qxdate === dToday ? "." : "-";
        });
        const uniqueQuestsArray = Array.from(uniqueQuests).map(JSON.parse).sort((a, b) => {
            if (a.from === "hank" && b.from !== "hank") {
                return -1;
            } else if (a.from !== "hank" && b.from === "hank") {
                return 1;
            } else {
                return a.from.localeCompare(b.from);
            }
        }).filter((quest) => (quest.questCategory || "Delivery") === selectedActivityQuestCategory);
        const tableContent = uniqueQuestsArray.reverse().map((uniqueQuest) => {
            const columns = dayKeys.map((date, index) => {
                //const qxdate = `${String(new Date(date).getMonth() + 1).padStart(2, '0')}/${String(new Date(date).getDate()).padStart(2, '0')}/${String(new Date(date).getFullYear()).slice(-2)}`;
                const qxdate = formatDate(activityData[index].date);
                return completionsByDate[qxdate] ? completionsByDate[qxdate][getQuestKey(uniqueQuest)] || "" : "";
            });
            var xfrom = "";
            const ofrom = uniqueQuest.from;
            xfrom = uniqueQuest.fromIcon || ("./icon/pnj/" + ofrom + ".png");
            if (ofrom === "pumpkin' pete") { xfrom = "./icon/pnj/pumpkinpete.png" }
            const ximgfrom = <img src={xfrom} alt="" title={ofrom} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "./icon/nft/na.png"; }} style={{ width: '20px', height: '20px' }} />;
            //const ximgrew = <img src={imgtkt} alt="" title={ofrom} style={{ width: '25px', height: '25px' }} />;
            return (
                <tr>
                    {xListeColActivityQuest[0][1] === 1 ? <td className="tdcenter" id="iccolumn">{ximgfrom}</td> : null}
                    {xListeColActivityQuest[1][1] === 1 ? <td className="tdcenter" id="iccolumn" style={{ fontSize: '11px' }} dangerouslySetInnerHTML={{ __html: uniqueQuest.description }}></td> : null}
                    {xListeColActivityQuest[2][1] === 1 ? <td className="tdcenter" style={{ fontSize: '11px' }}>{uniqueQuest.reward}</td> : null}
                    {xListeColActivityQuest[3][1] === 1 ? columns.map((value, index) => (
                        (value === "X") ? (<td className="tdcenterbrd" style={{ backgroundColor: 'rgba(0, 110, 0, 0.39)' }} title='completed'></td>) :
                            (value === "-") ? (<td className="tdcenterbrd" style={{ backgroundColor: 'rgba(110, 0, 0, 0.39)' }} title='skipped'></td>) :
                                (value === ".") ? (<td className="tdcenterbrd" style={{ backgroundColor: 'rgba(110, 110, 0, 0.39)' }} title='not done'></td>) :
                                    (<td className="tdcenterbrd"></td>))) : null}
                </tr>
            );
        });
        const tableHeader = (
            <thead>
                <tr>
                    {xListeColActivityQuest[0][1] === 1 ? <th className="th-icon">
                        <DList
                            name="selectedActivityQuestCategory"
                            title="Type"
                            options={[
                                { value: "Delivery", label: "Delivery" },
                                { value: "Chore", label: "Chore" },
                                { value: "Chickens", label: "Chicken" },
                                { value: "Barn", label: "Barn" },
                                { value: "Poppy", label: "Poppy" },
                            ]}
                            value={selectedActivityQuestCategory}
                            onChange={handleUIChange}
                            height={28}
                        />
                    </th> : null}
                    {xListeColActivityQuest[1][1] === 1 ? <th className="thcenter" style={{ fontSize: '14px' }}>Description</th> : null}
                    {xListeColActivityQuest[2][1] === 1 ? <th className="thcenter" style={{ fontSize: '14px' }}>Reward</th> : null}
                    {xListeColActivityQuest[3][1] === 1 ? Object.entries(dayKeys).map((date, index) => (
                        (<th className="tdcenterbrd" style={{ fontSize: '8px' }}>{formatDateAndSupYr(activityData[index].date)}</th>))) : null}
                </tr>
            </thead>
        );
        const table = (
            <>
                <table className="table">
                    {tableHeader}
                    <tbody>
                        {tableContent.reverse()}
                    </tbody>
                </table>
            </>
        );
        return (table);
    }
}
function setActivityTot(activityData, xContext, dataSetFarm, dataSet, prevDayActivity = null) {
    const { it, food, pfood, fish, flower, bounty, craft, tool, compost, petit, mutant, crustacean } = dataSetFarm.itables;
    const { nft, nftw } = dataSetFarm.boostables;
    const dateSeasonConst = dataSetFarm.constants.dateSeason;
    const dateSeasonDailyStartConst = dataSetFarm.constants.dateSeasonDailyStart || dateSeasonConst;
    let compoHarvested = [];
    compoHarvested["XP"] = 0;
    compoHarvested["TKT"] = 0;
    compoHarvested["SFL"] = 0;
    compoHarvested["COINS"] = 0;
    let compoHarvestn = [];
    let compoTraded = [];
    let compoTradedSfl = [];
    let compoBurn = [];
    compoBurn["SFL"] = 0;
    let foodBuild = [];
    let delivBurn = [];
    delivBurn["total"] = [];
    var tot = {
        XP: 0,
        xpDetails: {},
        tktchest: 0,
        tktcrop: 0,
        //tktwact: 0,
        deliveriestkt: 0,
        bountiestkt: 0,
        deliveriessfl: 0,
        deliveriescoins: 0,
        deliveriescost: 0,
        deliveriestktcost: 0,
        deliveriescostp2pt: 0,
        deliveriescostp2pn: 0,
        deliveriescostp2po: 0,
        chorestkt: 0,
        bountyChickensTkt: 0,
        bountyBarnTkt: 0,
        bountyPoppyTkt: 0,
        bountyTktMax: 0,
        tktMaxChest: 0,
        tktMaxDeliveries: 0,
        tktMaxChores: 0,
        tktMaxBounties: 0,
        poppyCost: 0,
        poppyCostP2P: 0,
        poppyTktReward: 0,
        poppyTktCostRaw: 0,
        poppyTktCost: 0,
        tktMax: 0,
        tktCost: 0,
        totTradedSfl: 0,
        balSfl: 0
    };
    //const dataEntries = Object.entries(activityData);
    const dataEntries = Object.keys(activityData);
    let i = 0;
    dataEntries.map((value, index) => {
        const DataContext = xContext === "items" ? activityData[index] : activityData;
        const usesDailyCounters = DataContext?.data?.activitycountermode === "daily" || DataContext?.data?.activitycountermode === "cumulative_with_daily";
        //const endDate = new Date(DataContext.date).toISOString();
        const endDate = new Date(DataContext.date);
        const dateSeason = new Date(dateSeasonConst);
        const dateSeasonDailyStart = new Date(dateSeasonDailyStartConst);
        //const endDateFormatted = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
        //const isSeasonDay = endDateFormatted >= dateSeason;
        /* const isSeasonDay = endDate.getFullYear() === dateSeason.getFullYear() &&
          endDate.getMonth() === dateSeason.getMonth() &&
          endDate.getDate() === dateSeason.getDate(); */
        const isSeasonDay = endDate.setHours(0, 0, 0, 0) >= dateSeason.setHours(0, 0, 0, 0);
        const isDeliverySeasonDay = new Date(DataContext.date).setHours(0, 0, 0, 0) >= dateSeasonDailyStart.setHours(0, 0, 0, 0);
        //const curw = ((endDate.getDate()) / 8);
        //const isweeklyactday = Number.isInteger(curw) || (endDate.getDate() === dateSeason.getDate() && endDate.getMonth() === dateSeason.getMonth());
        //const wactdone = isweeklyactday && wklactivity[Math.floor(curw) + 1];
        if (((xContext === "day" && i === 0) || xContext !== "day") && isSeasonDay) {
            const itktdchest = DataContext.data.ticketdailychest;
            const itktcrop = DataContext.data.ticketsoncrop || 0;
            //const itktwact = isweeklyactday ? wactdone ? tktWeekly : 0 : 0;
            //const itktwactMax = isweeklyactday ? tktWeekly : 0;
            //const itkttntcl = DataContext.data.tickettentacle ? DataContext.data.tickettentacle : 0;
            //const itkttntcl = DataContext.data.totfish["Kraken Tentacle"] ? DataContext.data.totfish["Kraken Tentacle"] * 12 : 0;
            //const istoday = selectedFromActivity === "today";
            //compoHarvested["TKT"] += !istoday ? itkttntcl : 0;
            tot.tktchest += itktdchest;
            tot.tktcrop += itktcrop;
            //tot.tktwact += itktwact;
            tot.tktMax += 1; //+ itktwactMax;
            tot.tktMaxChest += 1;
            compoHarvested["TKT"] += itktcrop + itktdchest; // + itktwact; // + itkttntcl;
            const prevBalance = xContext === "day"
                ? getSflBalance(prevDayActivity?.data?.balance)
                : activityData[i - 1] ? getSflBalance(activityData[i - 1].data.balance) : 0;
            const dayBalance = getSflBalance(DataContext.data.balance);
            const dayGain = prevBalance > 0 ? (dayBalance - prevBalance) : 0;
            tot.balSfl += ((xContext === "day" && prevDayActivity) || (xContext !== "day" && activityData[i - 1])) ? dayGain : 0;
            const prevContext = xContext === "day" ? prevDayActivity : activityData[i - 1];
            const harvestMap = getCounterMap(DataContext, "totharvest", prevContext, xContext);
            const totHarvestEntries = Object.entries(harvestMap);
            const harvestnMap = getCounterMap(DataContext, "totharvestn", prevContext, xContext);
            totHarvestEntries.map(([item]) => {
                compoHarvested[item] = compoHarvested[item] || 0;
                compoHarvested[item] += harvestMap[item];
                compoHarvestn[item] = compoHarvestn[item] || 0;
                compoHarvestn[item] += Number(harvestnMap[item] || 0);
            });
            if (DataContext.data.totfish) {
                const fishMap = getCounterMap(DataContext, "totfish", prevContext, xContext);
                const totFishEntries = Object.entries(fishMap);
                totFishEntries.map(([item]) => {
                    compoHarvested[item] = compoHarvested[item] || 0;
                    compoHarvested[item] += fishMap[item];
                    //compoHarvested["TKT"] += item === "Kraken Tentacle" ? DataContext.data.totfish[item] : 0;
                });
            }
            if (DataContext.data.totflower) {
                const flowerMap = getCounterMap(DataContext, "totflower", prevContext, xContext);
                const totFlowerEntries = Object.entries(flowerMap);
                totFlowerEntries.map(([item]) => {
                    compoHarvested[item] = compoHarvested[item] || 0;
                    compoHarvested[item] += flowerMap[item];
                    //compoHarvested["TKT"] += item === "Kraken Tentacle" ? DataContext.data.totfish[item] : 0;
                });
            }
            if (DataContext.data.tottrades) {
                const tradesMap = getCounterMap(DataContext, "tottrades", prevContext, xContext);
                const tradesSflMap = getCounterMap(DataContext, "tottradessfl", prevContext, xContext);
                const totTradesEntries = Object.entries(tradesMap);
                totTradesEntries.map(([item]) => {
                    const tradeQty = Number(tradesMap[item] || 0);
                    const tradeSfl = Number(tradesSflMap[item] || 0);
                    if (!(tradeQty > 0) && !(tradeSfl > 0)) return;
                    compoTraded[item] = compoTraded[item] || 0;
                    compoTraded[item] += tradeQty;
                    compoTradedSfl[item] = compoTradedSfl[item] || 0;
                    compoTradedSfl[item] += tradeSfl;
                    tot.totTradedSfl += tradeSfl;
                });
            }
            const buildMap = getCounterMap(DataContext, "totbuild", prevContext, xContext);
            const totBuildEntries = Object.entries(buildMap);
            totBuildEntries.map(([item, quantity]) => {
                const buildQuant = Number(quantity || 0);
                if (buildQuant <= 0) {
                    return;
                }
                const factionXpBonus = Number(DataContext.data.factionxpbonus || 0);
                const xpMultiplier = 1 + factionXpBonus;
                if (food[item]) {
                    const foodCompo = flattenCompoit(food[item].compoit);
                    foodBuild[item] = foodBuild[item] || [];
                    foodBuild[item]["quant"] = foodBuild[item]["quant"] || 0;
                    foodBuild[item]["quant"] += buildQuant;
                    for (let compofood in foodCompo) {
                        const compo = compofood;
                        const quant = foodCompo[compofood];
                        if (it[compo] || fish[compo]) {
                            compoBurn[compo] = compoBurn[compo] || 0;
                            compoBurn[compo] += quant * buildQuant;
                            foodBuild[item][compo] = foodBuild[item][compo] || 0;
                            foodBuild[item][compo] += quant * buildQuant;
                            //console.log(item + ":" + compoValues[compo]);
                        }
                    }
                    const unitXp = Number(food[item].xp || 0) * xpMultiplier;
                    const totalXp = unitXp * buildQuant;
                    tot.XP += totalXp;
                    compoHarvested["XP"] += totalXp;
                    foodBuild[item]["XP"] = foodBuild[item]["XP"] || 0;
                    foodBuild[item]["XP"] += totalXp;
                    tot.xpDetails[item] = tot.xpDetails[item] || { qty: 0, xpUnit: unitXp, xpTotal: 0 };
                    tot.xpDetails[item].qty += buildQuant;
                    tot.xpDetails[item].xpUnit = unitXp;
                    tot.xpDetails[item].xpTotal += totalXp;
                }
                if (fish[item]) {
                    compoHarvested[item] = compoHarvested[item] || 0;
                    compoHarvested[item] += buildQuant;
                    tot.XP += !isNaN(Number(fish[item].xp)) ? Number(fish[item].xp) * buildQuant : 0;
                }
            });
            const toolMap = getCounterMap(DataContext, "toolscrafted", prevContext, xContext);
            const totToolEntries = Object.entries(toolMap);
            totToolEntries.map(([item], quantity) => {
                const iquant = toolMap[item];
                if (item === "Axe") {
                    compoBurn["SFL"] += 0.065 * iquant;
                }
                if (item === "Pickaxe") {
                    compoBurn["SFL"] += 0.065 * iquant;
                    compoBurn["Wood"] = compoBurn["Wood"] || 0;
                    compoBurn["Wood"] += 3 * iquant;
                }
                if (item === "Stone Pickaxe") {
                    compoBurn["SFL"] += 0.065 * iquant;
                    compoBurn["Wood"] = compoBurn["Wood"] || 0;
                    compoBurn["Wood"] += 3 * iquant;
                    compoBurn["Stone"] = compoBurn["Stone"] || 0;
                    compoBurn["Stone"] += 5 * iquant;
                }
                if (item === "Iron Pickaxe") {
                    compoBurn["SFL"] += 0.25 * iquant;
                    compoBurn["Wood"] = compoBurn["Wood"] || 0;
                    compoBurn["Wood"] += 3 * iquant;
                    compoBurn["Iron"] = compoBurn["Iron"] || 0;
                    compoBurn["Iron"] += 5 * iquant;
                }
                if (item === "Gold Pickaxe") {
                    compoBurn["SFL"] += 0.3125 * iquant;
                    compoBurn["Wood"] = compoBurn["Wood"] || 0;
                    compoBurn["Wood"] += 3 * iquant;
                    compoBurn["Gold"] = compoBurn["Gold"] || 0;
                    compoBurn["Gold"] += 3 * iquant;
                }
                if (item === "Rod") {
                    compoBurn["SFL"] += 0.065 * iquant;
                    compoBurn["Wood"] = compoBurn["Wood"] || 0;
                    compoBurn["Wood"] += 3 * iquant;
                    compoBurn["Stone"] = compoBurn["Stone"] || 0;
                    compoBurn["Stone"] += 1 * iquant;
                }
            });
            const totDelivEntries = Object.entries(DataContext.data.deliveries);
            totDelivEntries.map(([item]) => {
                const OrderItem = DataContext.data.deliveries[item];
                /* const createdDate = new Date(OrderItem.createdAt);
                const offsetInMinutes = createdDate.getTimezoneOffset();
                const createdDateUTC = new Date(createdDate.getTime() + offsetInMinutes * 60 * 1000);
                const dNow = new Date();
                const isToday = createdDateUTC.getDay() === dNow.getDay() && createdDateUTC.getMonth() === dNow.getMonth(); */
                //const Shelly = ["shelly"];
                //const isShelly = Shelly.some(valeur => new RegExp(valeur).test(totDelivEntries[item][1].from));
                //if (isToday) {
                const deliveryFrom = String(OrderItem?.from || item || "");
                const isShelly = deliveryFrom === "shelly";
                const rewardImg = String(OrderItem?.rewardimg || "");
                const rewardItem = String(OrderItem?.rewarditem || "");
                const rewardItemLower = rewardItem.toLowerCase();
                const rewardQty = getNormalizedDeliveryRewardQty(OrderItem, dataSetFarm, dataSet.tktName);
                const deliveryCreatedAt = OrderItem?.createdAt ? new Date(OrderItem.createdAt) : null;
                const deliveryCompletedAt = OrderItem?.completedAt ? new Date(OrderItem.completedAt) : null;
                const deliveryStartsToday = deliveryCreatedAt && !Number.isNaN(deliveryCreatedAt.getTime())
                    ? formatDate(deliveryCreatedAt) === formatDate(DataContext.date)
                    : false;
                const deliveryCompletedToday = OrderItem?.completed && deliveryCompletedAt && !Number.isNaN(deliveryCompletedAt.getTime())
                    ? formatDate(deliveryCompletedAt) === formatDate(DataContext.date)
                    : false;
                const istkt = rewardImg === dataSet.imgtkt
                    || rewardImg.includes("ticket")
                    || rewardItem === dataSet.tktName
                    || rewardItemLower.includes("ticket");
                const issfl = rewardImg.includes("flowertoken.webp")
                    || rewardItemLower === "sfl"
                    || rewardItemLower.includes("flower token");
                const iscoins = rewardImg.includes("coins.png")
                    || rewardItemLower === "coins"
                    || rewardItemLower === "coin";
                const isPreSeason = OrderItem.preSeason && OrderItem.preSeason;
                const itemsMap = (OrderItem?.itemsMap && typeof OrderItem.itemsMap === "object")
                    ? OrderItem.itemsMap
                    : Array.isArray(OrderItem?.itemsList)
                        ? OrderItem.itemsList.reduce((acc, x) => {
                            const name = x?.name;
                            const qty = Number(x?.qty ?? x?.quantity ?? 0);
                            if (!name || qty <= 0) return acc;
                            acc[name] = (acc[name] || 0) + qty;
                            return acc;
                        }, {})
                        : {};
                const getItemBase = (name) => (
                    it?.[name] || food?.[name] || pfood?.[name] || fish?.[name] || flower?.[name] || bounty?.[name] || craft?.[name] || tool?.[name] || compost?.[name] || petit?.[name] || mutant?.[name] || crustacean?.[name] || null
                );
                if (OrderItem.completed && (xContext !== "day" || deliveryCompletedToday)) {
                    delivBurn[item] = [];
                    Object.entries(itemsMap).forEach(([title, rawValue]) => {
                        const ivalue = Number(rawValue || 0);
                        if (ivalue <= 0) return;
                        if (food[title]) {
                            const foodCompo = flattenCompoit(food[title].compoit);
                            //for (let i = 1; i < 5; i++) {
                            for (let compofood in foodCompo) {
                                const compo = compofood;
                                const quant = foodCompo[compofood];
                                if (String(compo).toLowerCase() === "oil") {
                                    continue;
                                }
                                const xcompo = getItemBase(compo);
                                if (xcompo) {
                                    compoBurn[compo] = compoBurn[compo] || 0;
                                    compoBurn[compo] += quant * ivalue;
                                    delivBurn[item][compo] = delivBurn[item][compo] || 0;
                                    delivBurn[item][compo] += quant * ivalue;
                                    delivBurn["total"][compo] = delivBurn["total"][compo] || 0;
                                    delivBurn["total"][compo] += quant * ivalue;
                                    const icost = ((Number(xcompo.cost || 0)) / dataSet.options.coinsRatio) * (quant * ivalue);
                                    const icostt = xcompo.costp2pt ? xcompo.costp2pt : 0 * (quant * ivalue);
                                    const icostn = xcompo.costp2pn ? xcompo.costp2pn : 0 * (quant * ivalue);
                                    const icosto = xcompo.costp2po ? xcompo.costp2po : 0 * (quant * ivalue);
                                    tot.deliveriescost += icost;
                                    tot.deliveriescostp2pt += Number(icostt);
                                    tot.deliveriescostp2pn += Number(icostn);
                                    tot.deliveriescostp2po += Number(icosto);
                                    tot.deliveriestktcost += istkt ? icost : 0
                                    //console.log(item + ":" + compoValues[compo]);
                                }
                            }
                            //tot.XP += Number(food[title].xp) * ivalue;
                        }
                        const low = String(title).toLowerCase();
                        if (low === "coins" || low === "sfl" || getItemBase(title)) {
                            compoBurn[title] = compoBurn[title] || 0;
                            compoBurn[title] += ivalue;
                            delivBurn[item][title] = delivBurn[item][title] || 0;
                            delivBurn[item][title] += ivalue;
                            delivBurn["total"][title] = delivBurn["total"][title] || 0;
                            delivBurn["total"][title] += ivalue;
                            const xcompo = getItemBase(title);
                            const icost = (low === "coins" ? (1 / dataSet.options.coinsRatio) : low === "sfl" ? 1 : ((Number(xcompo?.cost || 0)) / dataSet.options.coinsRatio)) * ivalue;
                            const icostt = (low === "coins" ? (1 / dataSet.options.coinsRatio) : low === "sfl" ? 1 : (xcompo?.costp2pt || 0)) * ivalue;
                            const icostn = (low === "coins" ? (1 / dataSet.options.coinsRatio) : low === "sfl" ? 1 : (xcompo?.costp2pn || 0)) * ivalue;
                            const icosto = (low === "coins" ? (1 / dataSet.options.coinsRatio) : low === "sfl" ? 1 : (xcompo?.costp2po || 0)) * ivalue;
                            tot.deliveriescost += icost;
                            tot.deliveriescostp2pt += Number(icostt);
                            tot.deliveriescostp2pn += Number(icostn);
                            tot.deliveriescostp2po += Number(icosto);
                            tot.deliveriestktcost += istkt ? icost : 0
                            //console.log(item + ":" + compoValues[compo]);
                        }
                    });
                    //"reward": "1.42<img src=./icon/res/sfltoken.png alt=\"\" style=\"width: 20px; height: 20px\"/>",
                    //"reward": "4<img src=./icon/res/mermaid_scale.webp alt=\"\" style=\"width: 20px; height: 20px\"/>",
                    const itm = istkt ? "TKT" : (issfl ? "SFL" : "COINS");
                    if (rewardQty > 0 || istkt) {
                        compoHarvested[itm] += rewardQty || 0;
                        tot.deliveriestkt += !isPreSeason && isDeliverySeasonDay && istkt && (rewardQty || 0);
                        tot.deliveriessfl += issfl && (rewardQty || 0);
                        tot.deliveriescoins += iscoins && (rewardQty || 0);
                    }
                }
                const deliveryMaxReward = !isShelly && !isPreSeason && isDeliverySeasonDay && deliveryStartsToday && istkt && (rewardQty || 0);
                tot.tktMax += deliveryMaxReward;
                tot.tktMaxDeliveries += Number(deliveryMaxReward || 0);
                //if (istkt) { console.log("tktMax +deliv: " + item + "-> " + Number(correspondance[1])) }
                //}
            });
            const totChoreEntries = Object.entries(DataContext.data.chores);
            totChoreEntries.map(([item]) => {
                const choreItem = DataContext.data.chores[item];
                const parseDate = (value) => {
                    if (!value) return null;
                    const dt = new Date(value);
                    return Number.isNaN(dt.getTime()) ? null : dt;
                };
                const currentActivityDate = formatDate(DataContext.date);
                const createdAt = parseDate(choreItem?.createdAt);
                const completedAt = parseDate(choreItem?.completedAt);
                let completedToday = !!choreItem?.completed && (!completedAt || formatDate(completedAt) === currentActivityDate);
                if (xContext === "items" && activityData[i - 1]) {
                    completedToday = !!choreItem?.completed && !activityData[i - 1].data.chores[item]?.completed;
                }

                if (choreItem && choreItem.completed && completedToday) {
                    if (choreItem.rewarditem === dataSet.tktName) {
                        compoHarvested["TKT"] = compoHarvested["TKT"] || 0;
                        compoHarvested["TKT"] += choreItem.reward;
                        tot.chorestkt += choreItem.reward;
                    } else {
                        compoHarvested[choreItem.rewarditem] = compoHarvested[choreItem.rewarditem] || 0;
                        compoHarvested[choreItem.rewarditem] += choreItem.reward;
                    }
                }
                const isTicketChore = choreItem && (choreItem.rewarditem === dataSet.tktName);
                const choreStartsToday = createdAt && formatDate(createdAt) === currentActivityDate;
                if (isTicketChore && choreStartsToday) {
                    tot.tktMax += Number(choreItem.reward);
                    tot.tktMaxChores += Number(choreItem.reward);
                }
                //if ((choreItem.rewarditem === dataSet.tktName)) { console.log("tktMax +chore: " + item + "-> " + choreItem.reward) }
                //}
            });
            const parseCompletedDate = (value) => {
                if (!value) return null;
                const dt = new Date(value);
                return Number.isNaN(dt.getTime()) ? null : dt;
            };
            const currentActivityDate = formatDate(DataContext.date);
            const poppyBounties = [];
            Object.values(DataContext.data.bounties || {}).forEach((bountyItem) => {
                const rewardItem = String(bountyItem?.rewarditem || "");
                const isTicketReward = rewardItem === dataSet.tktName || rewardItem.toLowerCase().includes("ticket");
                const reward = Number(bountyItem?.reward || 0);
                const category = String(bountyItem?.category || "");
                if (category === "Poppy") {
                    poppyBounties.push(bountyItem);
                }
                const createdAt = parseCompletedDate(bountyItem?.createdAt);
                const bountyStartsToday = createdAt && formatDate(createdAt) === currentActivityDate;
                if (isTicketReward && bountyStartsToday) {
                    tot.bountyTktMax += reward;
                    tot.tktMax += reward;
                    tot.tktMaxBounties += reward;
                }
                if (!bountyItem?.completed || !isTicketReward) return;
                const completedAt = parseCompletedDate(bountyItem?.completedAt);
                if (!completedAt || formatDate(completedAt) !== currentActivityDate) return;
                tot.bountiestkt += reward;
                if (category === "Chickens") {
                    tot.bountyChickensTkt += reward;
                } else if (category === "Barn") {
                    tot.bountyBarnTkt += reward;
                } else if (category === "Poppy") {
                    tot.bountyPoppyTkt += reward;
                    tot.poppyCost += Number(bountyItem?.cost || 0) / dataSet.options.coinsRatio;
                    tot.poppyCostP2P += Number(bountyItem?.market || 0);
                    tot.poppyTktReward += reward;
                    tot.poppyTktCostRaw += (Number(bountyItem?.cost || 0) / dataSet.options.coinsRatio);
                }
            });
            const poppyAllDone = poppyBounties.length > 0 && poppyBounties.every((entry) => !!entry?.completed);
            const poppyCompletedToday = poppyBounties.some((entry) => {
                const completedAt = parseCompletedDate(entry?.completedAt);
                return !!entry?.completed && !!completedAt && formatDate(completedAt) === currentActivityDate;
            });
            if (poppyAllDone && poppyCompletedToday) {
                tot.bountiestkt += 50;
                tot.bountyPoppyTkt += 50;
                tot.poppyTktReward += 50;
                compoHarvested["TKT"] = compoHarvested["TKT"] || 0;
                compoHarvested["TKT"] += 50;
            }
        }
        i++;
    });
    //console.log(compoBurn);
    tot.tktCost = tot.deliveriestkt > 0 ? (tot.deliveriestktcost / tot.deliveriestkt) : 0;
    tot.poppyTktCost = tot.poppyTktReward > 0 ? (tot.poppyTktCostRaw / tot.poppyTktReward) : 0;
    let compoTotal = [];
    compoTotal = Object.assign({}, compoHarvested, compoTraded, compoBurn);
    const itemOrder = Object.keys(it);
    const fishOrder = Object.keys(fish);
    const flowerOrder = Object.keys(flower);
    const compoEntries = Object.entries(compoTotal);
    const sortedInventoryItems = itemOrder.map((item) => {
        const entry = compoEntries.find(([entryItem]) => entryItem === item);
        const quantity = entry ? entry[1] : 0;
        return [item, quantity];
    });
    const sortedFishItems = fishOrder.map((item) => {
        const entry = compoEntries.find(([entryItem]) => entryItem === item);
        const quantity = entry ? entry[1] : 0;
        return [item, quantity];
    });
    const sortedFlowerItems = flowerOrder.map((item) => {
        const entry = compoEntries.find(([entryItem]) => entryItem === item);
        const quantity = entry ? entry[1] : 0;
        return [item, quantity];
    });
    const tradedNFTItems = Object.entries(compoTraded).map((item) => {
        if ((nft[item[0]] || nftw[item[0]]) && (!fish[item[0]] && !flower[item[0]])) {
            const entry = compoEntries.find(([entryItem]) => entryItem === item[0]);
            const quantity = entry ? entry[1] : 0;
            return [item[0], quantity];
        }
    }).filter(Boolean);
    sortedInventoryItems.unshift(["TKT", compoHarvested["TKT"]]);
    sortedInventoryItems.unshift(["SFL", compoBurn["SFL"]]);
    sortedInventoryItems.unshift(["COINS", compoBurn["COINS"]]);
    sortedInventoryItems.unshift(["XP", compoHarvested["XP"]]);
    const allSortedItems1 = sortedInventoryItems.concat(sortedFlowerItems);
    const allSortedItems2 = allSortedItems1.concat(sortedFishItems);
    const allSortedItems = allSortedItems2.concat(tradedNFTItems);
    const result = {
        allSortedItems: allSortedItems,
        compoHarvested: compoHarvested,
        compoHarvestn: compoHarvestn,
        compoTraded: compoTraded,
        compoTradedSfl: compoTradedSfl,
        compoBurn: compoBurn,
        foodBuild: foodBuild,
        delivBurn: delivBurn,
        tot: tot
    }
    //console.log("tktMax -> " + tot.tktMax);
    return result;
}
function setActivityTotQuest(activityData, dataSetFarm) {
    const tktName = dataSetFarm?.constants?.tktName || "Mermaid Scale";
    const itables = dataSetFarm?.itables || {};
    const imgna = "./icon/nft/na.png";
    const toNumber = (value) => {
        if (typeof value === "number") return Number.isFinite(value) ? value : 0;
        if (typeof value === "string") {
            const n = Number(value.replace(",", "."));
            return Number.isFinite(n) ? n : 0;
        }
        return 0;
    };
    const parseLegacyDeliveryItemsMap = (legacyItems) => {
        const result = {};
        if (!legacyItems || typeof legacyItems !== "string") return result;
        const htmlRegex = /(\d+(?:[.,]\d+)?)\s*x?\s*<img[^>]*title=['"]([^'"]+)['"][^>]*>/gi;
        let match = null;
        while ((match = htmlRegex.exec(legacyItems)) !== null) {
            const qty = toNumber(match[1]);
            const name = String(match[2] || "").trim();
            if (!name || qty <= 0) continue;
            result[name] = (result[name] || 0) + qty;
        }
        if (Object.keys(result).length > 0) return result;
        const text = legacyItems.replace(/<br\s*\/?>/gi, ", ").replace(/<[^>]+>/g, " ");
        const txtRegex = /(\d+(?:[.,]\d+)?)\s*x?\s*([A-Za-z][A-Za-z0-9' -]+)/g;
        while ((match = txtRegex.exec(text)) !== null) {
            const qty = toNumber(match[1]);
            const name = String(match[2] || "").trim().replace(/\s+/g, " ");
            if (!name || qty <= 0) continue;
            result[name] = (result[name] || 0) + qty;
        }
        return result;
    };
    const getDeliveryItemImg = (name) => {
        const key = String(name || "").trim();
        const lower = key.toLowerCase();
        if (lower === "coins" || lower === "coin") return "./icon/res/coins.png";
        if (lower === "sfl") return "./icon/res/flowertoken.webp";
        const tables = ["it", "food", "pfood", "fish", "flower", "bounty", "craft", "tool", "compost", "petit", "mutant", "crustacean"];
        for (const tableName of tables) {
            const table = itables?.[tableName];
            const hit = table?.[key];
            if (hit?.img) return hit.img;
        }
        return imgna;
    };
    let Quest = [];
    let i = 0;
    //const dataEntries = Object.entries(activityData);
    const dataEntries = Object.keys(activityData);
    dataEntries.map((value, index) => {
        const totChoreEntries = Object.entries(activityData[index].data.chores);
        totChoreEntries.map(([item]) => {
            const choreItem = activityData[index].data.chores[item];
            const choreFrom = "hank";
            const choreDesc = choreItem.description;
            const choreDate = formatDate(activityData[index].date);
            const choreCompleted = choreItem.completed;
            const choreRewardItem = String(choreItem?.rewarditem || "");
            const choreReward = toNumber(choreItem?.reward ?? choreItem?.tickets ?? 0);
            const choreIsTicket = choreRewardItem === tktName || choreRewardItem.toLowerCase().includes("ticket");
            Quest[i] = {
                from: choreFrom,
                fromIcon: String(choreItem?.itemimg || "./icon/ui/chores.webp"),
                questCategory: "Chore",
                description: choreDesc,
                date: choreDate,
                completed: choreCompleted,
                istkt: choreIsTicket,
                reward: choreReward
            }
            i++;
            //if (!Dates.includes(choreDate)) { Dates.push(choreDate) }
            //console.log(Quest[i - 1]);
        });
            const totDelivEntries = Object.entries(activityData[index].data.deliveries);
            totDelivEntries.map(([item]) => {
            const delivItem = activityData[index].data.deliveries[item];
            const delivFrom = String(delivItem?.from || item || "");
            const isShelly = delivFrom === "shelly";
            if (!isShelly) {
                const delivItemsMap = (delivItem?.itemsMap && typeof delivItem.itemsMap === "object")
                    ? delivItem.itemsMap
                    : Array.isArray(delivItem?.itemsList)
                        ? delivItem.itemsList.reduce((acc, x) => {
                            const name = x?.name;
                            const qty = Number(x?.qty ?? x?.quantity ?? 0);
                            if (!name || qty <= 0) return acc;
                            acc[name] = (acc[name] || 0) + qty;
                            return acc;
                        }, {})
                        : parseLegacyDeliveryItemsMap(delivItem?.items);
                const delivDesc = Object.entries(delivItemsMap).map(([name, qty]) => {
                    const icon = getDeliveryItemImg(name);
                    return `${qty}<img src="${icon}" alt="" title="${name}" style="width:14px;height:14px;vertical-align:middle;margin:0 2px 1px 1px;" />`;
                }).join(" ");
                const delivDate = formatDate(activityData[index].date);
                const delivCompleted = delivItem.completed;
                const rewardImg = String(delivItem?.rewardimg || "");
                const rewardItem = String(delivItem?.rewarditem || "");
                const rewardItemLower = rewardItem.toLowerCase();
                const istkt = rewardImg.includes("ticket")
                    || rewardItem === tktName
                    || rewardItemLower.includes("ticket");
                const delivRew = toNumber(getNormalizedDeliveryRewardQty(delivItem, dataSetFarm, tktName) || 0);
                if (Object.keys(delivItemsMap).length === 0) return;
                Quest[i] = {
                    from: delivFrom,
                    questCategory: "Delivery",
                    description: delivDesc,
                    date: delivDate,
                    completed: delivCompleted,
                    istkt: istkt,
                    reward: delivRew
                }
                i++;
                //if (!Dates.includes(delivDate)) { Dates.push(delivDate) }
                //console.log(Quest[i - 1]);
            }
        });
        const totBountyEntries = Object.entries(activityData[index].data.bounties || {});
        totBountyEntries.map(([item, bountyItem]) => {
            const bountyDate = formatDate(activityData[index].date);
            const bountyName = String(bountyItem?.item || item || "Bounty");
            const bountyLevel = bountyItem?.lvl ? ` Lv.${bountyItem.lvl}` : "";
            const bountyItemImg = String(bountyItem?.itemimg || "./icon/bounty/pirate_bounty.webp");
            const bountyRewardItem = String(bountyItem?.rewarditem || "");
            const bountyRewardImg = String(bountyItem?.rewardimg || "");
            const bountyReward = toNumber(bountyItem?.reward || 0);
            const bountyIsTicket = bountyRewardImg.includes("ticket")
                || bountyRewardItem === tktName
                || bountyRewardItem.toLowerCase().includes("ticket");
            const bountyDesc = `${bountyName}${bountyLevel}<img src="${bountyItemImg}" alt="" title="${bountyName}" style="width:14px;height:14px;vertical-align:middle;margin:0 2px 1px 4px;" />`;
            Quest[i] = {
                from: "bounty",
                fromIcon: bountyRewardImg || "./icon/bounty/pirate_bounty.webp",
                questCategory: String(bountyItem?.category || "Poppy"),
                description: bountyDesc,
                date: bountyDate,
                completed: !!bountyItem?.completed,
                istkt: bountyIsTicket,
                reward: bountyReward
            }
            i++;
        });
    });
    const result = {
        Quest: Quest,
        //Dates: Dates,
    }
    return result;
}
function formatDate(xDate, setUTC) {
    const currentDate = (xDate instanceof Date) ? xDate : new Date(xDate);
    var day = "";
    var month = "";
    var year = "";
    if (setUTC) {
        day = String(currentDate.getUTCDate()).padStart(2, '0');
        month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
        year = String(currentDate.getUTCFullYear()).slice(-2);
    } else {
        day = String(currentDate.getDate()).padStart(2, '0');
        month = String(currentDate.getMonth() + 1).padStart(2, '0');
        year = String(currentDate.getFullYear()).slice(-2);
    }
    const dateNow = `${month}/${day}/${year}`;
    return dateNow;
}
function formatDateAndSupYr(xDate, setUTC) {
    const currentDate = (xDate instanceof Date) ? xDate : new Date(xDate);
    var day = "";
    var month = "";
    if (setUTC) {
        day = String(currentDate.getUTCDate()).padStart(2, '0');
        month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
    } else {
        day = String(currentDate.getDate()).padStart(2, '0');
        month = String(currentDate.getMonth() + 1).padStart(2, '0');
    }
    const dateNow = `${month}/${day}`;
    return dateNow;
}
