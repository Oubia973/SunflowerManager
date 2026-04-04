import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppCtx } from "../context/AppCtx";
import { frmtNb } from "../fct.js";
import DList from "../dlist.jsx";

function isToday(date) {
  if (!date) return false;
  const today = new Date();
  const givenDate = new Date(date);
  return (
    today.getUTCDate() === givenDate.getUTCDate() &&
    today.getUTCMonth() === givenDate.getUTCMonth() &&
    today.getUTCFullYear() === givenDate.getUTCFullYear()
  );
}

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function addDays(date, days) {
  const value = startOfDay(date);
  value.setDate(value.getDate() + days);
  return value;
}

function overlapDays(rangeStart, rangeEnd, blockStart, blockEnd) {
  if (!rangeStart || !rangeEnd || !blockStart || !blockEnd) return 0;
  const startMs = Math.max(startOfDay(rangeStart).getTime(), startOfDay(blockStart).getTime());
  const endMs = Math.min(startOfDay(rangeEnd).getTime(), startOfDay(blockEnd).getTime());
  if (endMs <= startMs) return 0;
  return Math.round((endMs - startMs) / (1000 * 60 * 60 * 24));
}

function startOfWeek(date) {
  const value = startOfDay(date);
  const day = value.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  value.setDate(value.getDate() + diff);
  return value;
}

function formatBadgeDate(date) {
  if (!date) return "-";
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "-";
  return value.toLocaleDateString("en-US", {
    weekday: "short",
    month: "2-digit",
    day: "2-digit",
  });
}

function isTicketReward(entry, imgtkt, tktName) {
  const rewardImg = String(entry?.rewardimg || "");
  const rewardItem = String(entry?.rewarditem || "");
  return rewardImg === imgtkt
    || rewardImg.includes(String(imgtkt || "").split("/").pop() || "")
    || rewardItem === tktName;
}

function getNpcIcon(name) {
  if (name === "pumpkin' pete") return "./icon/pnj/pumpkinpete.png";
  return `./icon/pnj/${name}.png`;
}

function getCategoryIcon(category) {
  if (category === "Chickens") return "./icon/res/chkn.png";
  if (category === "Barn") return "./icon/res/cow.webp";
  return "./icon/pnj/poppy.png";
}

function getDeliveryBaseReward(item, isDoubleDeliveryActive, forTry = false) {
  const rewardField = forTry ? "rewardqtytry" : "rewardqty";
  const baseRewardField = forTry ? "rewardqtybasetry" : "rewardqtybase";
  const boostedReward = Number(item?.[rewardField] || 0);
  const explicitBaseReward = Number(item?.[baseRewardField]);
  if (Number.isFinite(explicitBaseReward) && explicitBaseReward > 0) {
    return explicitBaseReward;
  }
  if (isDoubleDeliveryActive && boostedReward > 0) {
    return boostedReward / 2;
  }
  return boostedReward;
}

export default function ChapterTable() {
  const stickyBarRef = useRef(null);
  const chapterHeaderTopRowRef = useRef(null);
  const chapterHeaderSubRowRef = useRef(null);
  const [chapterHeaderStickyTop, setChapterHeaderStickyTop] = useState(0);
  const [chapterHeaderTopRowHeight, setChapterHeaderTopRowHeight] = useState(0);
  const [chapterHeaderSubRowHeight, setChapterHeaderSubRowHeight] = useState(0);
  const {
    data: {
      dataSet,
      dataSetFarm,
    },
    ui: {
      chapterNpcSelection,
      chapterNpcCostOverride,
      chapterCurrentTickets,
      chapterBountySelection,
      chapterBountyCostOverride,
      chapterBountyReplace,
      chapterBountyOverride,
      chapterBountyRewardType,
      chapterVipDone,
      chapterCostMode,
      chapterCostType,
      TryChecked,
    },
    actions: {
      handleUIChange,
      setUIField,
    },
    img: {
      imgSFL,
    }
  } = useAppCtx();
  const imgDone = <img src={"./icon/ui/confirm.png"} alt={""} className="itico" title={"Done"} />;
  const imgCancel = <img src={"./icon/ui/cancel.png"} alt={""} className="itico" title={"Not done"} />;

  const orderstable = dataSetFarm?.orderstable || {};
  const tktName = dataSetFarm?.constants?.tktName || dataSet?.tktName || "Tickets";
  const imgtkt = dataSetFarm?.constants?.imgtkt || dataSet?.imgtkt || "./icon/nft/na.png";
  const imgTKT = <img src={imgtkt} alt="" className="itico" />;
  const marketIconSrc = "./icon/ui/exchange.png";
  const flowerIconSrc = "./icon/res/flowertoken.webp";
  const coinsRatio = Number(dataSet?.options?.coinsRatio || 1000) || 1;
  const seasonStartRaw = dataSetFarm?.constants?.dateSeason || "";
  const seasonQuestStartRaw = dataSetFarm?.constants?.dateSeasonDailyStart || seasonStartRaw;
  const seasonEndRaw = dataSetFarm?.constants?.dateSeasonEnd || "";
  const seasonAuctionTicketWeekStartRaw = dataSetFarm?.constants?.dateSeasonAuctionTicketWeekStart || "";
  const calendarDates = dataSetFarm?.frmData?.calendarDates || [];
  const isDoubleDeliveryActive = dataSetFarm?.frmData?.seasonEvent === "doubledelivery";
  const vipChapterTickets = 740;
  const isTryMode = !!TryChecked;
  const costMode = chapterCostMode === "market" ? "market" : "prod";
  const isMarketCostMode = costMode === "market";
  const costType = chapterCostType === "custom" ? "custom" : "average";
  const isCustomCostType = costType === "custom";
  const costModeIconSrc = isMarketCostMode ? marketIconSrc : flowerIconSrc;
  const costModeOptions = [
    { value: "prod", label: "Production", iconSrc: flowerIconSrc },
    { value: "market", label: "Market", iconSrc: marketIconSrc },
  ];
  const bountyRewardType = chapterBountyRewardType === "custom" ? "custom" : "actual";
  const isCustomBountyRewardType = bountyRewardType === "custom";
  const bountyRewardTypeOptions = [
    { value: "actual", label: "Actual" },
    { value: "custom", label: "Custom" },
  ];
  const costTypeOptions = [
    { value: "average", label: "Average" },
    { value: "custom", label: "Custom" },
  ];
  const handleCostHelpClick = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.55)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "99999";

    const box = document.createElement("div");
    box.style.width = "min(520px, 92vw)";
    box.style.background = "#151515";
    box.style.border = "1px solid rgba(255,255,255,0.25)";
    box.style.borderRadius = "8px";
    box.style.padding = "12px";
    box.style.color = "#fff";

    const titleEl = document.createElement("div");
    titleEl.textContent = "Cost";
    titleEl.style.fontWeight = "700";
    titleEl.style.marginBottom = "8px";

    const messageEl = document.createElement("div");
    messageEl.style.lineHeight = "1.35";
    messageEl.style.marginBottom = "12px";

    const lines = [
      { icon: flowerIconSrc, text: ": production prices." },
      { icon: marketIconSrc, text: ": market prices." },
      { text: "Cost per ticket values are based on the current delivery and bounty prices." },
      { text: "These prices can change from one day or week to the next." },
    ];

    lines.forEach((line, index) => {
      const lineEl = document.createElement("div");
      lineEl.style.display = "flex";
      lineEl.style.alignItems = "center";
      lineEl.style.gap = "6px";
      if (index < lines.length - 1) {
        lineEl.style.marginBottom = "4px";
      }
      if (line.icon) {
        const iconEl = document.createElement("img");
        iconEl.src = line.icon;
        iconEl.alt = "";
        iconEl.style.width = "16px";
        iconEl.style.height = "16px";
        iconEl.style.objectFit = "contain";
        lineEl.appendChild(iconEl);
      }
      lineEl.appendChild(document.createTextNode(line.text));
      messageEl.appendChild(lineEl);
    });

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.justifyContent = "flex-end";
    actions.style.gap = "8px";

    const okBtn = document.createElement("button");
    okBtn.textContent = "Got it";
    okBtn.className = "graph-mode-btn is-active";

    actions.appendChild(okBtn);
    box.appendChild(titleEl);
    box.appendChild(messageEl);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const cleanup = () => {
      overlay.remove();
    };

    okBtn.addEventListener("click", cleanup);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) cleanup();
    });
    okBtn.focus();
  };
  const vipChapterPendingTickets = chapterVipDone ? 0 : vipChapterTickets;

  const deliveryRows = useMemo(() => {
    return Object.entries(orderstable?.orders || {})
      .filter(([, item]) => isTicketReward(item, imgtkt, tktName))
      .map(([name, item]) => {
        const rewardBase = Number(getDeliveryBaseReward(item, false, isTryMode) || 0);
        const baseCostTkt = rewardBase > 0
          ? (((isMarketCostMode && (Number(item?.costt || 0) > 0))
            ? Number(item?.costt || 0)
            : (Number(item?.[isTryMode ? "costtry" : "cost"] || 0) / coinsRatio)) / rewardBase)
          : 0;
        const overrideRaw = String(chapterNpcCostOverride?.[name] ?? "");
        const parsedOverride = Number(overrideRaw);
        const hasOverride = overrideRaw.trim() !== "" && Number.isFinite(parsedOverride) && parsedOverride >= 0;
        return {
          key: name,
          name,
          reward: Number(getDeliveryBaseReward(item, isDoubleDeliveryActive, isTryMode) || 0),
          rewardDouble: Number(item?.[isTryMode ? "rewardqtytry" : "rewardqty"] || 0),
          rewardBase,
          baseCostTkt,
          overrideRaw,
          costTkt: isCustomCostType && hasOverride ? parsedOverride : baseCostTkt,
          completed: !!item?.completed,
          icon: getNpcIcon(name),
        };
      });
  }, [orderstable?.orders, imgtkt, tktName, isDoubleDeliveryActive, coinsRatio, isMarketCostMode, isTryMode, chapterNpcCostOverride, isCustomCostType]);

  useEffect(() => {
    if (!deliveryRows.length) return;
    setUIField("chapterNpcSelection", (prev) => {
      const next = { ...(prev || {}) };
      let hasChanged = false;
      deliveryRows.forEach((row) => {
        if (typeof next[row.key] !== "boolean") {
          next[row.key] = true;
          hasChanged = true;
        }
      });
      return hasChanged ? next : (prev || next);
    });
    setUIField("chapterNpcCostOverride", (prev) => {
      const next = { ...(prev || {}) };
      let hasChanged = false;
      deliveryRows.forEach((row) => {
        if (typeof next[row.key] !== "string") {
          next[row.key] = "";
          hasChanged = true;
        }
      });
      return hasChanged ? next : (prev || next);
    });
  }, [deliveryRows, setUIField]);

  const choresTickets = useMemo(() => {
    return Object.values(orderstable?.chores || {}).reduce((sum, item) => {
      if (!isTicketReward(item, imgtkt, tktName)) return sum;
      return sum + Number(item?.[isTryMode ? "rewardtry" : "reward"] || item?.reward || 0);
    }, 0);
  }, [orderstable?.chores, imgtkt, tktName, isTryMode]);
  const choreTicketRows = useMemo(() => (
    Object.values(orderstable?.chores || {}).filter((item) => isTicketReward(item, imgtkt, tktName))
  ), [orderstable?.chores, imgtkt, tktName]);
  const choresCompletedCount = choreTicketRows.filter((item) => !!item?.completed).length;
  const choresTotalCount = choreTicketRows.length;
  const choresDoneTickets = choreTicketRows.reduce((sum, item) => {
    if (!item?.completed) return sum;
    return sum + Number(item?.[isTryMode ? "rewardtry" : "reward"] || item?.reward || 0);
  }, 0);
  const choresPendingTickets = Math.max(0, choresTickets - choresDoneTickets);
  const choresDone = useMemo(() => {
    return choresTotalCount > 0 && choresCompletedCount === choresTotalCount;
  }, [choresCompletedCount, choresTotalCount]);

  const rawBountyRows = useMemo(() => {
    const grouped = {};
    Object.entries(orderstable?.bounties || {}).forEach(([name, item]) => {
      if (!isTicketReward(item, imgtkt, tktName)) return;
      const category = String(item?.category || "Poppy");
      if (!grouped[category]) {
        grouped[category] = { reward: 0, cost: 0, market: 0, done: true };
      }
      grouped[category].reward += Number(item?.[isTryMode ? "rewardtry" : "reward"] || item?.reward || 0);
      grouped[category].cost += Number(item?.[isTryMode ? "costtry" : "cost"] || item?.cost || 0) / coinsRatio;
      grouped[category].market += Number(item?.market || 0);
      grouped[category].done = grouped[category].done && !!item?.completed;
    });
    return ["Chickens", "Barn", "Poppy"]
      .filter((category) => Number(grouped?.[category]?.reward || 0) > 0)
      .map((category) => {
        const reward = Number(grouped?.[category]?.reward || 0);
        const done = !!grouped?.[category]?.done;
        const appliedBonusReward = category === "Poppy" && done ? 50 : 0;
        const totalRewardWithBonus = reward + appliedBonusReward;
        const totalCost = isMarketCostMode
          ? Number(grouped?.[category]?.market || 0)
          : Number(grouped?.[category]?.cost || 0);
        return ({
          key: category,
          label: `Bounty ${category}`,
          reward,
          appliedBonusReward,
          costTkt: category === "Poppy" && totalRewardWithBonus > 0
            ? totalCost / totalRewardWithBonus
            : 0,
          done,
          icon: getCategoryIcon(category),
        });
      });
  }, [orderstable?.bounties, imgtkt, tktName, isMarketCostMode, isTryMode, coinsRatio]);
  useEffect(() => {
    if (!rawBountyRows.length) return;
    setUIField("chapterBountySelection", (prev) => {
      const next = { ...(prev || {}) };
      let hasChanged = false;
      rawBountyRows.forEach((row) => {
        if (typeof next[row.key] !== "boolean") {
          next[row.key] = true;
          hasChanged = true;
        }
      });
      return hasChanged ? next : (prev || next);
    });
    setUIField("chapterBountyOverride", (prev) => {
      const next = { ...(prev || {}) };
      let hasChanged = false;
      rawBountyRows.forEach((row) => {
        if (typeof next[row.key] !== "string") {
          next[row.key] = "";
          hasChanged = true;
        }
      });
      return hasChanged ? next : (prev || next);
    });
    setUIField("chapterBountyReplace", (prev) => {
      const next = { ...(prev || {}) };
      let hasChanged = false;
      rawBountyRows.forEach((row) => {
        if (typeof next[row.key] !== "boolean") {
          next[row.key] = false;
          hasChanged = true;
        }
      });
      return hasChanged ? next : (prev || next);
    });
    setUIField("chapterBountyCostOverride", (prev) => {
      const next = { ...(prev || {}) };
      let hasChanged = false;
      rawBountyRows.forEach((row) => {
        if (typeof next[row.key] !== "string") {
          next[row.key] = "";
          hasChanged = true;
        }
      });
      return hasChanged ? next : (prev || next);
    });
  }, [rawBountyRows, setUIField]);
  const bountyRows = useMemo(() => {
    return rawBountyRows.map((row) => {
      const selected = chapterBountySelection?.[row.key] ?? true;
      const overrideRaw = String(chapterBountyOverride?.[row.key] ?? "");
      const parsedOverride = Number(overrideRaw);
      const hasOverride = overrideRaw.trim() !== "" && Number.isFinite(parsedOverride) && parsedOverride >= 0;
      const baseReward = Number(row.reward || 0);
      const effectiveReward = isCustomBountyRewardType && hasOverride ? parsedOverride : baseReward;
      const costOverrideRaw = String(chapterBountyCostOverride?.[row.key] ?? "");
      const parsedCostOverride = Number(costOverrideRaw);
      const hasCostOverride = costOverrideRaw.trim() !== "" && Number.isFinite(parsedCostOverride) && parsedCostOverride >= 0;
      const baseCostTkt = Number(baseReward || 0) > 0
        ? (Number(row.costTkt || 0) * Number(effectiveReward || 0)) / Number(baseReward || 0)
        : Number(row.costTkt || 0);
      const effectiveDisplayCostTkt = isCustomCostType && hasCostOverride ? parsedCostOverride : Number(row.costTkt || 0);
      return {
        ...row,
        selected,
        overrideRaw,
        baseReward,
        effectiveReward,
        costOverrideRaw,
        baseCostTkt,
        effectiveDisplayCostTkt,
        effectiveCostTkt: isCustomCostType && hasCostOverride ? parsedCostOverride : baseCostTkt,
      };
    });
  }, [rawBountyRows, chapterBountySelection, chapterBountyOverride, chapterBountyCostOverride, isCustomCostType, isCustomBountyRewardType]);
  const hasPoppyBounties = bountyRows.some((row) => row.key === "Poppy" && row.selected);
  const poppyBountyRows = useMemo(() => (
    Object.values(orderstable?.bounties || {}).filter((item) => (
      isTicketReward(item, imgtkt, tktName) && String(item?.category || "Poppy") === "Poppy"
    ))
  ), [orderstable?.bounties, imgtkt, tktName]);
  const poppyBountiesCompletedCount = poppyBountyRows.filter((item) => !!item?.completed).length;
  const poppyBountiesTotalCount = poppyBountyRows.length;
  const poppyBountiesDone = bountyRows.find((row) => row.key === "Poppy")?.done ?? false;
  const poppyBonusWeekly = hasPoppyBounties ? 50 : 0;
  const dailyChestDone = isToday(dataSet?.dailychest?.chest || dataSetFarm?.frmData?.dailychest?.chest);
  const dailyChestTickets = 1;

  const autoDaysRemaining = useMemo(() => {
    if (!seasonEndRaw) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const seasonEnd = new Date(seasonEndRaw);
    seasonEnd.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((seasonEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [seasonEndRaw]);
  const totalChapterDaysValue = useMemo(() => {
    if (!seasonStartRaw || !seasonEndRaw) return 0;
    const seasonStart = new Date(seasonStartRaw);
    const seasonEnd = new Date(seasonEndRaw);
    seasonStart.setHours(0, 0, 0, 0);
    seasonEnd.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((seasonEnd.getTime() - seasonStart.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [seasonStartRaw, seasonEndRaw]);
  const totalQuestDaysValue = useMemo(() => {
    if (!seasonQuestStartRaw || !seasonEndRaw) return 0;
    const questStart = new Date(seasonQuestStartRaw);
    const seasonEnd = new Date(seasonEndRaw);
    questStart.setHours(0, 0, 0, 0);
    seasonEnd.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((seasonEnd.getTime() - questStart.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [seasonQuestStartRaw, seasonEndRaw]);

  const currentTicketsValue = Number(chapterCurrentTickets || 0);
  const remainingDaysValue = Number(autoDaysRemaining || 0);
  const remainingWeeksValue = Math.ceil(Math.max(0, remainingDaysValue) / 7);
  const totalChapterWeeksValue = Math.ceil(Math.max(0, totalChapterDaysValue) / 7);
  const totalQuestWeeksValue = Math.ceil(Math.max(0, totalQuestDaysValue) / 7);
  const todayStart = startOfDay(new Date());
  const seasonQuestStartDate = seasonQuestStartRaw ? startOfDay(seasonQuestStartRaw) : null;
  const seasonEndDate = seasonEndRaw ? startOfDay(seasonEndRaw) : null;
  const auctionTicketWeekStart = seasonAuctionTicketWeekStartRaw ? startOfDay(seasonAuctionTicketWeekStartRaw) : null;
  const auctionTicketWeekEnd = auctionTicketWeekStart ? addDays(auctionTicketWeekStart, 7) : null;
  const totalQuestAuctionBlockedDays = overlapDays(seasonQuestStartDate, seasonEndDate, auctionTicketWeekStart, auctionTicketWeekEnd);
  const futureQuestAuctionBlockedDays = overlapDays(addDays(todayStart, 1), seasonEndDate, auctionTicketWeekStart, auctionTicketWeekEnd);
  const adjustedQuestDaysValue = Math.max(0, totalQuestDaysValue - totalQuestAuctionBlockedDays);
  const todayInAuctionTicketWeek = !!(
    auctionTicketWeekStart
    && auctionTicketWeekEnd
    && todayStart.getTime() >= auctionTicketWeekStart.getTime()
    && todayStart.getTime() < auctionTicketWeekEnd.getTime()
  );
  const todayQuestEligible = !!(
    seasonQuestStartDate
    && seasonEndDate
    && todayStart.getTime() >= seasonQuestStartDate.getTime()
    && todayStart.getTime() < seasonEndDate.getTime()
    && !todayInAuctionTicketWeek
  );
  const futureExtraDays = Math.max(0, remainingDaysValue - 1 - futureQuestAuctionBlockedDays);
  const currentWeekStart = startOfWeek(todayStart);
  const nextWeekBoundary = addDays(currentWeekStart, 7);
  const auctionTicketWeekInQuestTotal = !!(
    auctionTicketWeekStart
    && auctionTicketWeekEnd
    && seasonQuestStartDate
    && seasonEndDate
    && auctionTicketWeekEnd.getTime() > seasonQuestStartDate.getTime()
    && auctionTicketWeekStart.getTime() < seasonEndDate.getTime()
  );
  const auctionTicketWeekFuture = !!(
    auctionTicketWeekStart
    && seasonEndDate
    && auctionTicketWeekStart.getTime() > currentWeekStart.getTime()
    && auctionTicketWeekStart.getTime() < seasonEndDate.getTime()
  );
  const adjustedQuestWeeksValue = Math.max(0, totalQuestWeeksValue - (auctionTicketWeekInQuestTotal ? 1 : 0));
  const futureExtraWeeks = Math.max(0, remainingWeeksValue - 1 - (auctionTicketWeekFuture ? 1 : 0));
  const currentWeekQuestEligible = !todayInAuctionTicketWeek;
  const seasonStartLabel = formatBadgeDate(seasonStartRaw);
  const seasonQuestStartLabel = formatBadgeDate(seasonQuestStartRaw);
  const auctionTicketWeekStartLabel = formatBadgeDate(seasonAuctionTicketWeekStartRaw);
  const selectedNpcTickets = deliveryRows.reduce((sum, row) => {
    return sum + ((chapterNpcSelection?.[row.key] ?? true) ? row.reward : 0);
  }, 0);
  const selectedNpcPendingToday = deliveryRows.reduce((sum, row) => {
    if (!todayQuestEligible || !(chapterNpcSelection?.[row.key] ?? true) || row.completed) return sum;
    return sum + row.reward;
  }, 0);
  const selectedNpcDoubleBonus = deliveryRows.reduce((sum, row) => {
    if (!(chapterNpcSelection?.[row.key] ?? true)) return sum;
    return sum + Math.max(0, Number(row.rewardDouble || 0) - Number(row.rewardBase || 0));
  }, 0);
  const selectedNpcDoubleBonusPending = deliveryRows.reduce((sum, row) => {
    if (!(chapterNpcSelection?.[row.key] ?? true) || row.completed) return sum;
    return sum + Number(row.rewardBase || 0);
  }, 0);
  const selectedNpcDoubleBonusBase = deliveryRows.reduce((sum, row) => {
    if (!(chapterNpcSelection?.[row.key] ?? true)) return sum;
    return sum + Number(row.rewardBase || 0);
  }, 0);
  const baseWeeklyTickets = choresTickets + bountyRows.reduce((sum, row) => sum + (row.selected ? row.effectiveReward : 0), 0) + poppyBonusWeekly;
  const weeklyTickets = currentWeekQuestEligible ? baseWeeklyTickets : 0;
  const doubleDeliveryDates = useMemo(() => {
    return (calendarDates || [])
      .filter((entry) => entry?.name === "doubleDelivery" && entry?.date)
      .map((entry) => startOfDay(entry.date))
      .sort((a, b) => a.getTime() - b.getTime());
  }, [calendarDates]);
  const currentWeekDoubleDeliveryDates = doubleDeliveryDates.filter((date) => (
    date.getTime() >= currentWeekStart.getTime()
    && date.getTime() < nextWeekBoundary.getTime()
  ));
  const hasCalendarDoubleDeliveryInfo = doubleDeliveryDates.length > 0;
  const hasUpcomingDoubleDeliveryThisWeek = currentWeekDoubleDeliveryDates.some((date) => (
    date.getTime() > todayStart.getTime()
  ));
  const hasDoubleDeliveryToday = currentWeekDoubleDeliveryDates.some((date) => (
    date.getTime() === todayStart.getTime()
  ));
  const doubleDeliveryDoneThisWeek = hasCalendarDoubleDeliveryInfo && !isDoubleDeliveryActive && !hasUpcomingDoubleDeliveryThisWeek;
  const remainingTodayDoubleDeliveryBonus = isDoubleDeliveryActive ? selectedNpcDoubleBonusPending : 0;
  const currentWeekDoubleDeliveryBonus = !currentWeekQuestEligible
    ? 0
    : isDoubleDeliveryActive || hasDoubleDeliveryToday
      ? selectedNpcDoubleBonusPending
      : (hasUpcomingDoubleDeliveryThisWeek ? selectedNpcDoubleBonusBase : 0);
  const chapterDoubleDeliveryBonus = currentWeekDoubleDeliveryBonus + (selectedNpcDoubleBonusBase * futureExtraWeeks);
  const totalFromZeroDoubleDeliveryBonus = selectedNpcDoubleBonusBase * adjustedQuestWeeksValue;
  const weekDoubleDeliveryBonus = currentWeekQuestEligible ? selectedNpcDoubleBonusBase : 0;
  const currentWeekPendingTickets = currentWeekQuestEligible
    ? (
      choresPendingTickets
      + bountyRows.reduce((sum, row) => sum + ((row.selected && !row.done) ? row.effectiveReward : 0), 0)
      + ((hasPoppyBounties && !poppyBountiesDone) ? poppyBonusWeekly : 0)
    )
    : 0;
  const projectedEndSeasonTickets =
    currentTicketsValue
    + selectedNpcPendingToday
    + (selectedNpcTickets * futureExtraDays)
    + (dailyChestDone ? 0 : dailyChestTickets)
    + (dailyChestTickets * futureExtraDays)
    + chapterDoubleDeliveryBonus
    + currentWeekPendingTickets
    + (weeklyTickets * futureExtraWeeks)
    + vipChapterPendingTickets;
  const totalDailyTickets =
    selectedNpcTickets
    + dailyChestTickets;
  const totalWeekTickets =
    (selectedNpcTickets * 7)
    + (dailyChestTickets * 7)
    + weeklyTickets
    + weekDoubleDeliveryBonus;
  const totalChapterTickets =
    (selectedNpcPendingToday + (selectedNpcTickets * futureExtraDays))
    + ((dailyChestDone ? 0 : dailyChestTickets) + (dailyChestTickets * futureExtraDays))
    + currentWeekPendingTickets
    + (weeklyTickets * futureExtraWeeks)
    + chapterDoubleDeliveryBonus
    + vipChapterPendingTickets;
  const totalFromZeroTickets =
    (selectedNpcTickets * adjustedQuestDaysValue)
    + (dailyChestTickets * totalChapterDaysValue)
    + (baseWeeklyTickets * adjustedQuestWeeksValue)
    + totalFromZeroDoubleDeliveryBonus
    + vipChapterTickets;
  const dailyChestChapterLeft = (dailyChestDone ? 0 : dailyChestTickets) + (dailyChestTickets * futureExtraDays);
  const dailyChestChapterTotal = dailyChestTickets * totalChapterDaysValue;
  const choresChapterLeft = (currentWeekQuestEligible ? choresPendingTickets : 0) + (choresTickets * futureExtraWeeks);
  const choresChapterTotal = choresTickets * adjustedQuestWeeksValue;
  const bountyChapterLeft = bountyRows.reduce((sum, row) => sum + (row.selected ? (((currentWeekQuestEligible && !row.done) ? row.effectiveReward : 0) + (row.effectiveReward * futureExtraWeeks)) : 0), 0);
  const bountyChapterTotal = bountyRows.reduce((sum, row) => sum + (row.selected ? (row.effectiveReward * adjustedQuestWeeksValue) : 0), 0);
  const poppyChapterLeft = hasPoppyBounties ? (((currentWeekQuestEligible && !poppyBountiesDone) ? poppyBonusWeekly : 0) + (poppyBonusWeekly * futureExtraWeeks)) : 0;
  const poppyChapterTotal = hasPoppyBounties ? (poppyBonusWeekly * adjustedQuestWeeksValue) : 0;
  const totalNpcCostLeft = deliveryRows.reduce((sum, row) => {
    if (!(chapterNpcSelection?.[row.key] ?? true)) return sum;
    const rowChapterLeft = (todayQuestEligible && !row.completed ? row.reward : 0) + (row.reward * futureExtraDays);
    return sum + (Number(row.costTkt || 0) * rowChapterLeft);
  }, 0);
  const totalNpcCostTotal = deliveryRows.reduce((sum, row) => {
    if (!(chapterNpcSelection?.[row.key] ?? true)) return sum;
    const rowChapterTotal = row.reward * adjustedQuestDaysValue;
    return sum + (Number(row.costTkt || 0) * rowChapterTotal);
  }, 0);
  const totalBountyCostLeft = bountyRows.reduce((sum, row) => {
    if (!row.selected || Number(row.effectiveCostTkt || 0) <= 0) return sum;
    const rowChapterLeft = ((currentWeekQuestEligible && !row.done) ? row.effectiveReward : 0) + (row.effectiveReward * futureExtraWeeks);
    return sum + (Number(row.effectiveCostTkt || 0) * rowChapterLeft);
  }, 0);
  const totalBountyCostTotal = bountyRows.reduce((sum, row) => {
    if (!row.selected || Number(row.effectiveCostTkt || 0) <= 0) return sum;
    const rowChapterTotal = row.effectiveReward * adjustedQuestWeeksValue;
    return sum + (Number(row.effectiveCostTkt || 0) * rowChapterTotal);
  }, 0);
  const selectedAverageCostTickets = deliveryRows.reduce((sum, row) => {
    if (!(chapterNpcSelection?.[row.key] ?? true) || Number(row.reward || 0) <= 0) return sum;
    return sum + Number(row.reward || 0);
  }, 0) + bountyRows.reduce((sum, row) => {
    if (!row.selected || row.key !== "Poppy" || Number(row.effectiveReward || 0) <= 0) return sum;
    const appliedBonusReward = row.done ? Number(row.appliedBonusReward || 0) : 0;
    return sum + Number(row.effectiveReward || 0) + appliedBonusReward;
  }, 0);
  const selectedAverageCostTotal = deliveryRows.reduce((sum, row) => {
    if (!(chapterNpcSelection?.[row.key] ?? true) || Number(row.reward || 0) <= 0) return sum;
    return sum + (Number(row.costTkt || 0) * Number(row.reward || 0));
  }, 0) + bountyRows.reduce((sum, row) => {
    if (!row.selected || row.key !== "Poppy" || Number(row.effectiveReward || 0) <= 0) return sum;
    return sum + (Number(row.effectiveCostTkt || 0) * Number(row.effectiveReward || 0));
  }, 0);
  const selectedAverageCostTkt = selectedAverageCostTickets > 0
    ? selectedAverageCostTotal / selectedAverageCostTickets
    : 0;
  useEffect(() => {
    const updateChapterHeaderTop = () => {
      setChapterHeaderStickyTop(stickyBarRef.current?.offsetHeight || 0);
      setChapterHeaderTopRowHeight(chapterHeaderTopRowRef.current?.offsetHeight || 0);
      setChapterHeaderSubRowHeight(chapterHeaderSubRowRef.current?.offsetHeight || 0);
    };
    const raf = requestAnimationFrame(updateChapterHeaderTop);
    window.addEventListener("resize", updateChapterHeaderTop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateChapterHeaderTop);
    };
  }, [chapterCurrentTickets, remainingDaysValue, selectedNpcTickets, weeklyTickets, projectedEndSeasonTickets]);
  const chapterStatusBadge = (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        columnGap: "8px",
        rowGap: "2px",
        margin: "0",
        padding: "4px 8px",
        border: "1px solid rgb(90, 90, 90)",
        borderRadius: "6px",
        background: "rgba(0, 0, 0, 0.28)",
        width: "auto",
        maxWidth: "400px",
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: "12px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "2px" }}>
        <img src={imgtkt} alt="" className="itico" />
      </span>
      <span style={{ fontSize: "12px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "2px" }}>
        Current:
        <input
          type="number"
          min="0"
          name="chapterCurrentTickets"
          value={chapterCurrentTickets ?? 0}
          onChange={handleUIChange}
          style={{ width: "52px", height: "20px" }}
        />
      </span>
      <span style={{ fontSize: "12px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "2px" }}>
        Days left: {frmtNb(remainingDaysValue)}
      </span>
      {/* <span style={{ fontSize: "12px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "2px" }}>
        Delivery left: {frmtNb(selectedNpcPendingToday)}
      </span>
      <span style={{ fontSize: "12px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "2px" }}>
        Chest left: {frmtNb(dailyChestDone ? 0 : dailyChestTickets)}
      </span>
      <span style={{ fontSize: "12px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "2px" }}>
        Weekly left: {frmtNb(currentWeekPendingTickets)}
      </span> */}
      <span style={{ fontSize: "12px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "2px" }}>
        End season: {frmtNb(projectedEndSeasonTickets)}
      </span>
      <span
        style={{
          fontSize: "11px",
          width: "100%",
          color: "rgba(255, 255, 255, 0.82)",
          whiteSpace: "normal",
        }}
      >
        Season start: {seasonStartLabel} | Tickets start: {seasonQuestStartLabel} | Auctions week: {auctionTicketWeekStartLabel}
      </span>
    </div>
  );

  return (
    <>
      <div
        ref={stickyBarRef}
        style={{
          position: "sticky",
          top: "0px",
          left: "0px",
          zIndex: 7,
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "2px 0 4px 0",
          background: "rgb(18, 8, 2)",
        }}
      >
        {chapterStatusBadge}
      </div>
      <table
        className="table chapter-table"
        style={{
          "--chapter-head-top": `${chapterHeaderStickyTop}px`,
          "--chapter-head-row-h": `${chapterHeaderTopRowHeight}px`,
          "--chapter-head-sub-row-h": `${chapterHeaderSubRowHeight}px`,
        }}
      >
        <thead>
          <tr ref={chapterHeaderTopRowRef}>
            <th className="thcenter chapter-check-sticky" rowSpan="2">Take</th>
            <th className="th-icon chapter-icon-sticky" rowSpan="2"> </th>
            <th className="thcenter" rowSpan="2">Source</th>
            <th className="thcenter" rowSpan="2">Done</th>
            <th className="thcenter" rowSpan="2">Daily</th>
            <th className="thcenter">Week</th>
            <th className="thcenter" colSpan="2"><span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>Chapter<img src={imgtkt} alt="" className="itico" /></span></th>
            <th className="thcenter"><img src={costModeIconSrc} alt="" className="itico" />/{imgTKT}</th>
            <th className="thcenter" colSpan="2">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                Cost
                <span className="dlist-icon-only chapter-cost-mode-picker">
                  <DList
                    name="chapterCostMode"
                    options={costModeOptions}
                    value={costMode}
                    onChange={(value) => setUIField("chapterCostMode", value)}
                    listIcon={costModeIconSrc}
                    clearable={false}
                    emitEvent={false}
                    iconOnly
                    menuIconOnly
                    //menuMinWidth={42}
                  />
                </span>
                <button
                  type="button"
                  className="button small-btn"
                  onClick={handleCostHelpClick}
                  title="Cost info"
                  style={{ marginLeft: 2 }}
                >
                  <img src="./icon/nft/na.png" alt="?" className="itico" />
                </button>
              </span>
            </th>
          </tr>
          <tr ref={chapterHeaderSubRowRef}>
            <th className="thcenter">
              <DList
                name="chapterBountyRewardType"
                options={bountyRewardTypeOptions}
                value={bountyRewardType}
                onChange={(value) => setUIField("chapterBountyRewardType", value)}
                clearable={false}
                emitEvent={false}
                menuMinWidth={0}
              />
            </th>
            <th className="thcenter">Left</th>
            <th className="thcenter">Total</th>
            <th className="thcenter">
              <DList
                name="chapterCostType"
                options={costTypeOptions}
                value={costType}
                onChange={(value) => setUIField("chapterCostType", value)}
                clearable={false}
                emitEvent={false}
                width="auto"
              />
            </th>
            <th className="thcenter">Left</th>
            <th className="thcenter">Total</th>
          </tr>
          <tr className="chapter-total-row">
            <th className="thcenter chapter-check-sticky"> </th>
            <th className="th-icon chapter-total-icon chapter-icon-sticky">{imgTKT}</th>
            <th className="thcenter">Total</th>
            <th className="thcenter"></th>
            <th className="thcenter">{frmtNb(totalDailyTickets)}</th>
            <th className="thcenter">{frmtNb(totalWeekTickets)}</th>
            <th className="thcenter">{frmtNb(totalChapterTickets)}</th>
            <th className="thcenter">{frmtNb(totalFromZeroTickets)}</th>
            <th className="thcenter">{selectedAverageCostTickets > 0 ? frmtNb(selectedAverageCostTkt) : ""}</th>
            <th className="thcenter">{(totalNpcCostLeft + totalBountyCostLeft) > 0 ? frmtNb(totalNpcCostLeft + totalBountyCostLeft) : ""}</th>
            <th className="thcenter">{(totalNpcCostTotal + totalBountyCostTotal) > 0 ? frmtNb(totalNpcCostTotal + totalBountyCostTotal) : ""}</th>
          </tr>
        </thead>
        <tbody>
          {deliveryRows.map((row) => {
            const isChecked = chapterNpcSelection?.[row.key] ?? true;
            const chapterTickets = (todayQuestEligible && !row.completed ? row.reward : 0) + (row.reward * futureExtraDays);
            const zeroTickets = row.reward * adjustedQuestDaysValue;
            return (
              <tr key={row.key} style={isChecked ? undefined : { opacity: 0.45 }}>
                <td className="tdcenter chapter-check-sticky">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      setUIField("chapterNpcSelection", (prev) => ({
                        ...(prev || {}),
                        [row.key]: !!e.target.checked,
                      }));
                    }}
                    style={{ width: "16px", height: "16px" }}
                  />
                </td>
                <td id="iccolumn" className="chapter-icon-sticky"><img src={row.icon} alt="" className="itico" /></td>
                <td className="tditem">{row.name}</td>
                <td className="tdcenter">{row.completed ? imgDone : imgCancel}</td>
                <td className="tdcenter">{frmtNb(row.reward)}</td>
                <td className="tdcenter">{frmtNb(row.reward * 7)}</td>
                <td className="tdcenter">{frmtNb(chapterTickets)}</td>
                <td className="tdcenter">{frmtNb(zeroTickets)}</td>
                <td className="tdcenter">
                  {isCustomCostType ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.overrideRaw}
                      placeholder={Number.isFinite(row.baseCostTkt) ? String(frmtNb(row.baseCostTkt)) : ""}
                      onChange={(e) => {
                        setUIField("chapterNpcCostOverride", (prev) => ({
                          ...(prev || {}),
                          [row.key]: e.target.value,
                        }));
                      }}
                      style={{ width: "58px", height: "18px" }}
                    />
                  ) : frmtNb(row.costTkt)}
                </td>
                <td className="tdcenter">{frmtNb(row.costTkt * chapterTickets)}</td>
                <td className="tdcenter">{frmtNb(row.costTkt * zeroTickets)}</td>
              </tr>
            );
          })}
          <tr>
            <td className="tdcenter chapter-check-sticky"> </td>
            <td id="iccolumn" className="chapter-icon-sticky"><img src="./icon/ui/synced.gif" alt="" className="itico" /></td>
            <td className="tditem">Daily Chest</td>
            <td className="tdcenter">{dailyChestDone ? imgDone : imgCancel}</td>
            <td className="tdcenter">{frmtNb(dailyChestTickets)}</td>
            <td className="tdcenter">{frmtNb(dailyChestTickets * 7)}</td>
            <td className="tdcenter">{frmtNb(dailyChestChapterLeft)}</td>
            <td className="tdcenter">{frmtNb(dailyChestChapterTotal)}</td>
            <td className="tdcenter"></td>
            <td className="tdcenter"></td>
            <td className="tdcenter"></td>
          </tr>
          <tr>
            <td className="tdcenter chapter-check-sticky"> </td>
            <td id="iccolumn" className="chapter-icon-sticky"><img src="./icon/ui/delivery_board.png" alt="" className="itico" /></td>
            <td className="tditem">Delivery daily</td>
            <td className="tdcenter"></td>
            <td className="tdcenter">{frmtNb(selectedNpcTickets)}</td>
            <td className="tdcenter">{frmtNb(selectedNpcTickets * 7)}</td>
            <td className="tdcenter">{frmtNb(selectedNpcPendingToday + (selectedNpcTickets * futureExtraDays))}</td>
            <td className="tdcenter">{frmtNb(selectedNpcTickets * adjustedQuestDaysValue)}</td>
            <td className="tdcenter"></td>
            <td className="tdcenter"></td>
            <td className="tdcenter"></td>
          </tr>
          <tr>
            <td className="tdcenter chapter-check-sticky"> </td>
            <td id="iccolumn" className="chapter-icon-sticky"><img src="./icon/ui/doubledelivery.webp" alt="" className="itico" /></td>
            <td className="tditem">Double delivery</td>
            <td className="tdcenter">{doubleDeliveryDoneThisWeek || (isDoubleDeliveryActive && selectedNpcDoubleBonusPending === 0) ? imgDone : imgCancel}</td>
            <td className="tdcenter"></td>
            <td className="tdcenter">{frmtNb(weekDoubleDeliveryBonus)}</td>
            <td className="tdcenter">{frmtNb(chapterDoubleDeliveryBonus)}</td>
            <td className="tdcenter">{frmtNb(totalFromZeroDoubleDeliveryBonus)}</td>
            <td className="tdcenter"></td>
            <td className="tdcenter"></td>
            <td className="tdcenter"></td>
          </tr>
          <tr>
            <td className="tdcenter chapter-check-sticky"> </td>
            <td id="iccolumn" className="chapter-icon-sticky"><img src="./icon/ui/chores.webp" alt="" className="itico" /></td>
            <td className="tditem">Chores</td>
            <td className="tdcenter">{choresTotalCount > 0 ? `${choresCompletedCount}/${choresTotalCount}` : "-"}</td>
            <td className="tdcenter"></td>
            <td className="tdcenter">{frmtNb(choresTickets)}</td>
            <td className="tdcenter">{frmtNb(choresChapterLeft)}</td>
            <td className="tdcenter">{frmtNb(choresChapterTotal)}</td>
            <td className="tdcenter"></td>
            <td className="tdcenter"></td>
            <td className="tdcenter"></td>
          </tr>
          {bountyRows.map((row) => (
            <tr key={row.key} style={row.selected ? undefined : { opacity: 0.45 }}>
              <td className="tdcenter chapter-check-sticky">
                <input
                  type="checkbox"
                  checked={!!row.selected}
                  onChange={(e) => {
                    setUIField("chapterBountySelection", (prev) => ({
                      ...(prev || {}),
                      [row.key]: !!e.target.checked,
                    }));
                  }}
                  style={{ width: "16px", height: "16px" }}
                />
              </td>
              <td id="iccolumn" className="chapter-icon-sticky"><img src={row.icon} alt="" className="itico" /></td>
              <td className="tditem">{row.label}</td>
              <td className="tdcenter">
                {row.key === "Poppy" && !row.done
                  ? (poppyBountiesTotalCount > 0 ? `${poppyBountiesCompletedCount}/${poppyBountiesTotalCount}` : "-")
                  : (row.done ? imgDone : imgCancel)}
              </td>
              <td className="tdcenter"></td>
              <td className="tdcenter">
                {isCustomBountyRewardType ? (
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={row.overrideRaw}
                    placeholder={Number.isFinite(row.baseReward) ? String(frmtNb(row.baseReward)) : ""}
                    onChange={(e) => {
                      setUIField("chapterBountyOverride", (prev) => ({
                        ...(prev || {}),
                        [row.key]: e.target.value,
                      }));
                    }}
                    style={{ width: "44px", height: "18px" }}
                  />
                ) : frmtNb(row.effectiveReward)}
              </td>
              <td className="tdcenter">{frmtNb(((currentWeekQuestEligible && !row.done) ? row.effectiveReward : 0) + (row.effectiveReward * futureExtraWeeks))}</td>
              <td className="tdcenter">{frmtNb(row.effectiveReward * adjustedQuestWeeksValue)}</td>
              <td className="tdcenter">
                {row.key === "Poppy" && isCustomCostType ? (
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.costOverrideRaw}
                    placeholder={Number.isFinite(row.baseCostTkt) ? String(frmtNb(row.baseCostTkt)) : ""}
                onChange={(e) => {
                      setUIField("chapterBountyCostOverride", (prev) => ({
                        ...(prev || {}),
                        [row.key]: e.target.value,
                      }));
                    }}
                    style={{ width: "58px", height: "18px" }}
                  />
                ) : (row.selected && row.effectiveDisplayCostTkt > 0 ? frmtNb(row.effectiveDisplayCostTkt) : "")}
              </td>
              <td className="tdcenter">{row.selected && row.effectiveCostTkt > 0 ? frmtNb(row.effectiveCostTkt * (((currentWeekQuestEligible && !row.done) ? row.effectiveReward : 0) + (row.effectiveReward * futureExtraWeeks))) : ""}</td>
              <td className="tdcenter">{row.selected && row.effectiveCostTkt > 0 ? frmtNb(row.effectiveCostTkt * (row.effectiveReward * adjustedQuestWeeksValue)) : ""}</td>
            </tr>
          ))}
          {poppyBonusWeekly > 0 ? (
            <tr>
              <td className="tdcenter chapter-check-sticky"> </td>
              <td id="iccolumn" className="chapter-icon-sticky">{imgTKT}</td>
              <td className="tditem">Poppy bonus</td>
              <td className="tdcenter">{poppyBountiesDone ? imgDone : imgCancel}</td>
              <td className="tdcenter"></td>
              <td className="tdcenter">{frmtNb(poppyBonusWeekly)}</td>
              <td className="tdcenter">{frmtNb(poppyChapterLeft)}</td>
              <td className="tdcenter">{frmtNb(poppyChapterTotal)}</td>
              <td className="tdcenter"></td>
              <td className="tdcenter"></td>
              <td className="tdcenter"></td>
            </tr>
          ) : null}
          <tr>
            <td className="tdcenter chapter-check-sticky">
              <input
                type="checkbox"
                checked={!!chapterVipDone}
                onChange={(e) => {
                  setUIField("chapterVipDone", !!e.target.checked);
                }}
                style={{ width: "16px", height: "16px" }}
              />
            </td>
            <td id="iccolumn" className="chapter-icon-sticky"><img src="./icon/ui/chaptertrack.webp" alt="" className="itico" /></td>
            <td className="tditem">VIP Chapter points</td>
            <td className="tdcenter">{chapterVipDone ? imgDone : imgCancel}</td>
            <td className="tdcenter"></td>
            <td className="tdcenter"></td>
            <td className="tdcenter">{frmtNb(vipChapterPendingTickets)}</td>
            <td className="tdcenter">{frmtNb(vipChapterTickets)}</td>
            <td className="tdcenter"></td>
            <td className="tdcenter"></td>
            <td className="tdcenter"></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}








