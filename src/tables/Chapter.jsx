import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppCtx } from "../context/AppCtx";
import { frmtNb } from "../fct.js";

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

function getBountyCategory(bountyName, bountyItem, itTable) {
  const itemName = bountyItem?.item || bountyName || "";
  const itemMeta = itTable?.[itemName] || {};
  const animal = String(itemMeta?.animal || "").toLowerCase();
  const lowName = String(itemName).toLowerCase();
  if (animal === "chicken" || lowName === "chicken" || lowName === "chickens") return "Chickens";
  if (animal === "cow" || animal === "sheep" || lowName === "cow" || lowName === "cows" || lowName === "sheep") return "Barn";
  return "Poppy";
}

function getCategoryIcon(category) {
  if (category === "Chickens") return "./icon/res/chkn.png";
  if (category === "Barn") return "./icon/res/cow.webp";
  return "./icon/pnj/poppy.png";
}

function getDeliveryBaseReward(item, isDoubleDeliveryActive) {
  const boostedReward = Number(item?.rewardqty || 0);
  const explicitBaseReward = Number(item?.rewardqtybase);
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
  const chapterHeaderRowRef = useRef(null);
  const [chapterHeaderStickyTop, setChapterHeaderStickyTop] = useState(0);
  const [chapterHeaderRowHeight, setChapterHeaderRowHeight] = useState(0);
  const {
    data: {
      dataSet,
      dataSetFarm,
    },
    ui: {
      chapterNpcSelection,
      chapterCurrentTickets,
      chapterBountySelection,
      chapterBountyReplace,
      chapterBountyOverride,
      chapterVipDone,
    },
    actions: {
      handleUIChange,
      setUIField,
    },
  } = useAppCtx();
  const imgDone = <img src={"./icon/ui/confirm.png"} alt={""} className="itico" title={"Done"} />;
  const imgCancel = <img src={"./icon/ui/cancel.png"} alt={""} className="itico" title={"Not done"} />;

  const orderstable = dataSetFarm?.orderstable || {};
  const itTable = dataSetFarm?.itables?.it || {};
  const tktName = dataSetFarm?.constants?.tktName || dataSet?.tktName || "Tickets";
  const imgtkt = dataSetFarm?.constants?.imgtkt || dataSet?.imgtkt || "./icon/nft/na.png";
  const seasonStartRaw = dataSetFarm?.constants?.dateSeason || "";
  const seasonEndRaw = dataSetFarm?.constants?.dateSeasonEnd || "";
  const calendarDates = dataSetFarm?.frmData?.calendarDates || [];
  const isDoubleDeliveryActive = dataSetFarm?.frmData?.seasonEvent === "doubledelivery";
  const vipChapterTickets = 740;
  const vipChapterPendingTickets = chapterVipDone ? 0 : vipChapterTickets;

  const deliveryRows = useMemo(() => {
    return Object.entries(orderstable?.orders || {})
      .filter(([, item]) => isTicketReward(item, imgtkt, tktName))
      .map(([name, item]) => ({
        key: name,
        name,
        reward: Number(getDeliveryBaseReward(item, isDoubleDeliveryActive) || 0),
        rewardDouble: Number(item?.rewardqty || 0),
        rewardBase: Number(getDeliveryBaseReward(item, false) || 0),
        completed: !!item?.completed,
        icon: getNpcIcon(name),
      }));
  }, [orderstable?.orders, imgtkt, tktName, isDoubleDeliveryActive]);

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
  }, [deliveryRows, setUIField]);

  const choresTickets = useMemo(() => {
    return Object.values(orderstable?.chores || {}).reduce((sum, item) => {
      if (!isTicketReward(item, imgtkt, tktName)) return sum;
      return sum + Number(item?.reward || 0);
    }, 0);
  }, [orderstable?.chores, imgtkt, tktName]);
  const choresDone = useMemo(() => {
    const ticketChores = Object.values(orderstable?.chores || {}).filter((item) => isTicketReward(item, imgtkt, tktName));
    return ticketChores.length > 0 && ticketChores.every((item) => !!item?.completed);
  }, [orderstable?.chores, imgtkt, tktName]);

  const rawBountyRows = useMemo(() => {
    const grouped = {};
    Object.entries(orderstable?.bounties || {}).forEach(([name, item]) => {
      if (!isTicketReward(item, imgtkt, tktName)) return;
      const category = getBountyCategory(name, item, itTable);
      if (!grouped[category]) {
        grouped[category] = { reward: 0, done: true };
      }
      grouped[category].reward += Number(item?.reward || 0);
      grouped[category].done = grouped[category].done && !!item?.completed;
    });
    return ["Chickens", "Barn", "Poppy"]
      .filter((category) => Number(grouped?.[category]?.reward || 0) > 0)
      .map((category) => ({
        key: category,
        label: `Bounty ${category}`,
        reward: Number(grouped?.[category]?.reward || 0),
        done: !!grouped?.[category]?.done,
        icon: getCategoryIcon(category),
      }));
  }, [orderstable?.bounties, imgtkt, tktName, itTable]);
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
  }, [rawBountyRows, setUIField]);
  const bountyRows = useMemo(() => {
    return rawBountyRows.map((row) => {
      const selected = chapterBountySelection?.[row.key] ?? true;
      const useOverride = chapterBountyReplace?.[row.key] ?? false;
      const overrideRaw = String(chapterBountyOverride?.[row.key] ?? "");
      const parsedOverride = Number(overrideRaw);
      const hasOverride = overrideRaw.trim() !== "" && Number.isFinite(parsedOverride) && parsedOverride >= 0;
      const baseReward = Number(row.reward || 0);
      const effectiveReward = useOverride && hasOverride ? parsedOverride : baseReward;
      return {
        ...row,
        selected,
        useOverride,
        overrideRaw,
        baseReward,
        effectiveReward,
      };
    });
  }, [rawBountyRows, chapterBountySelection, chapterBountyReplace, chapterBountyOverride]);
  const hasPoppyBounties = bountyRows.some((row) => row.key === "Poppy" && row.selected);
  const poppyBountiesDone = bountyRows.find((row) => row.key === "Poppy")?.done ?? false;
  const poppyBonusWeekly = hasPoppyBounties ? 50 : 0;
  const dailyChestDone = isToday(dataSet?.dailychest?.chest || dataSetFarm?.frmData?.dailychest?.chest);

  const selectedNpcTickets = deliveryRows.reduce((sum, row) => {
    return sum + ((chapterNpcSelection?.[row.key] ?? true) ? row.reward : 0);
  }, 0);
  const selectedNpcPendingToday = deliveryRows.reduce((sum, row) => {
    if (!(chapterNpcSelection?.[row.key] ?? true) || row.completed) return sum;
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
  const weeklyTickets = choresTickets + bountyRows.reduce((sum, row) => sum + (row.selected ? row.effectiveReward : 0), 0) + poppyBonusWeekly;
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

  const currentTicketsValue = Number(chapterCurrentTickets || 0);
  const remainingDaysValue = Number(autoDaysRemaining || 0);
  const remainingWeeksValue = Math.ceil(Math.max(0, remainingDaysValue) / 7);
  const totalChapterWeeksValue = Math.ceil(Math.max(0, totalChapterDaysValue) / 7);
  const futureExtraDays = Math.max(0, remainingDaysValue - 1);
  const futureExtraWeeks = Math.max(0, remainingWeeksValue - 1);
  const todayStart = startOfDay(new Date());
  const nextWeekBoundary = addDays(todayStart, 7);
  const doubleDeliveryDates = useMemo(() => {
    return (calendarDates || [])
      .filter((entry) => entry?.name === "doubleDelivery" && entry?.date)
      .map((entry) => startOfDay(entry.date))
      .sort((a, b) => a.getTime() - b.getTime());
  }, [calendarDates]);
  const weekDoubleDeliveryCount = doubleDeliveryDates.filter((date) => (
    date.getTime() >= todayStart.getTime()
    && date.getTime() < nextWeekBoundary.getTime()
  )).length;
  const hasCalendarDoubleDeliveryInfo = doubleDeliveryDates.length > 0;
  const hasUpcomingDoubleDeliveryThisWeek = weekDoubleDeliveryCount > 0;
  const doubleDeliveryDoneThisWeek = hasCalendarDoubleDeliveryInfo && !isDoubleDeliveryActive && !hasUpcomingDoubleDeliveryThisWeek;
  const remainingTodayDoubleDeliveryBonus = isDoubleDeliveryActive ? selectedNpcDoubleBonusPending : 0;
  const currentWeekDoubleDeliveryBonus = isDoubleDeliveryActive
    ? selectedNpcDoubleBonusPending
    : (hasUpcomingDoubleDeliveryThisWeek ? selectedNpcDoubleBonusBase : 0);
  const chapterDoubleDeliveryBonus = currentWeekDoubleDeliveryBonus + (selectedNpcDoubleBonusBase * futureExtraWeeks);
  const totalFromZeroDoubleDeliveryBonus = selectedNpcDoubleBonusBase * totalChapterWeeksValue;
  const weekDoubleDeliveryBonus = selectedNpcDoubleBonusBase;
  const currentWeekPendingTickets =
    (choresDone ? 0 : choresTickets)
    + bountyRows.reduce((sum, row) => sum + ((row.selected && !row.done) ? row.effectiveReward : 0), 0)
    + ((hasPoppyBounties && !poppyBountiesDone) ? poppyBonusWeekly : 0);
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
    (selectedNpcTickets * totalChapterDaysValue)
    + (dailyChestTickets * totalChapterDaysValue)
    + (weeklyTickets * totalChapterWeeksValue)
    + totalFromZeroDoubleDeliveryBonus
    + vipChapterTickets;
  useEffect(() => {
    const updateChapterHeaderTop = () => {
      setChapterHeaderStickyTop(stickyBarRef.current?.offsetHeight || 0);
      setChapterHeaderRowHeight(chapterHeaderRowRef.current?.offsetHeight || 0);
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
        maxWidth: "420px",
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
      <span style={{ display: "block", flexBasis: "100%", height: 0 }} />
      <span style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
        {bountyRows.map((row) => (
          <span key={`badge-${row.key}`} style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
            <input
              type="checkbox"
              checked={!!row.useOverride}
              onChange={(e) => {
                setUIField("chapterBountyReplace", (prev) => ({
                  ...(prev || {}),
                  [row.key]: !!e.target.checked,
                }));
              }}
              style={{ width: "14px", height: "14px" }}
            />
            <img src={row.icon} alt="" className="itico" />
            <span>{row.key}</span>
            <input
              type="number"
              min="0"
              value={row.overrideRaw}
              placeholder={String(row.baseReward)}
              onChange={(e) => {
                setUIField("chapterBountyOverride", (prev) => ({
                  ...(prev || {}),
                  [row.key]: e.target.value,
                }));
              }}
              disabled={!row.useOverride}
              style={{ width: "38px", height: "18px" }}
            />
          </span>
        ))}
      </span>
    </div>
  );

  if (!dataSet?.options?.isAbo) {
    return <div>Chapter is reserved to abo farms.</div>;
  }

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
          "--chapter-head-row-h": `${chapterHeaderRowHeight}px`,
        }}
        >
        <thead>
          <tr ref={chapterHeaderRowRef}>
            <th className="thcenter" rowSpan="2">Take</th>
            <th className="th-icon" rowSpan="2"> </th>
            <th className="thcenter" rowSpan="2">Source</th>
            <th className="thcenter" rowSpan="2">Done</th>
            <th className="thcenter" rowSpan="2">Daily</th>
            <th className="thcenter" rowSpan="2">Week</th>
            <th className="thcenter" colSpan="2">Chapter</th>
          </tr>
          <tr>
            <th className="thcenter">Left</th>
            <th className="thcenter">Total</th>
          </tr>
        </thead>
        <tbody>
          {deliveryRows.map((row) => {
            const isChecked = chapterNpcSelection?.[row.key] ?? true;
            const chapterTickets = (row.completed ? 0 : row.reward) + (row.reward * futureExtraDays);
            const zeroTickets = row.reward * totalChapterDaysValue;
            return (
              <tr key={row.key} style={isChecked ? undefined : { opacity: 0.45 }}>
                <td className="tdcenter">
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
                <td id="iccolumn"><img src={row.icon} alt="" className="itico" /></td>
                <td className="tditem">{row.name}</td>
                <td className="tdcenter">{row.completed ? imgDone : imgCancel}</td>
                <td className="tdcenter">{frmtNb(row.reward)}</td>
                <td className="tdcenter">{frmtNb(row.reward * 7)}</td>
                <td className="tdcenter">{frmtNb(chapterTickets)}</td>
                <td className="tdcenter">{frmtNb(zeroTickets)}</td>
              </tr>
            );
          })}
          <tr>
            <td className="tdcenter"> </td>
            <td id="iccolumn"><img src="./icon/ui/synced.gif" alt="" className="itico" /></td>
            <td className="tditem">Daily Chest</td>
            <td className="tdcenter">{dailyChestDone ? imgDone : imgCancel}</td>
            <td className="tdcenter">{frmtNb(dailyChestTickets)}</td>
            <td className="tdcenter">{frmtNb(dailyChestTickets * 7)}</td>
            <td className="tdcenter">{frmtNb((dailyChestDone ? 0 : dailyChestTickets) + (dailyChestTickets * futureExtraDays))}</td>
            <td className="tdcenter">{frmtNb(dailyChestTickets * totalChapterDaysValue)}</td>
          </tr>
          <tr>
            <td className="tdcenter"> </td>
            <td id="iccolumn"><img src="./icon/ui/delivery_board.png" alt="" className="itico" /></td>
            <td className="tditem">Delivery daily</td>
            <td className="tdcenter">-</td>
            <td className="tdcenter">{frmtNb(selectedNpcTickets)}</td>
            <td className="tdcenter">{frmtNb(selectedNpcTickets * 7)}</td>
            <td className="tdcenter">{frmtNb(selectedNpcPendingToday + (selectedNpcTickets * futureExtraDays))}</td>
            <td className="tdcenter">{frmtNb(selectedNpcTickets * totalChapterDaysValue)}</td>
          </tr>
          <tr>
            <td className="tdcenter"> </td>
            <td id="iccolumn"><img src="./icon/ui/doubledelivery.webp" alt="" className="itico" /></td>
            <td className="tditem">Double delivery</td>
            <td className="tdcenter">{doubleDeliveryDoneThisWeek || (isDoubleDeliveryActive && selectedNpcDoubleBonusPending === 0) ? imgDone : imgCancel}</td>
            <td className="tdcenter">-</td>
            <td className="tdcenter">{frmtNb(weekDoubleDeliveryBonus)}</td>
            <td className="tdcenter">{frmtNb(chapterDoubleDeliveryBonus)}</td>
            <td className="tdcenter">{frmtNb(totalFromZeroDoubleDeliveryBonus)}</td>
          </tr>
          <tr>
            <td className="tdcenter"> </td>
            <td id="iccolumn"><img src="./icon/ui/chores.webp" alt="" className="itico" /></td>
            <td className="tditem">Chores</td>
            <td className="tdcenter">{choresDone ? imgDone : imgCancel}</td>
            <td className="tdcenter">-</td>
            <td className="tdcenter">{frmtNb(choresTickets)}</td>
            <td className="tdcenter">{frmtNb((choresDone ? 0 : choresTickets) + (choresTickets * futureExtraWeeks))}</td>
            <td className="tdcenter">{frmtNb(choresTickets * totalChapterWeeksValue)}</td>
          </tr>
          {bountyRows.map((row) => (
            <tr key={row.key} style={row.selected ? undefined : { opacity: 0.45 }}>
              <td className="tdcenter">
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
              <td id="iccolumn"><img src={row.icon} alt="" className="itico" /></td>
              <td className="tditem">{row.label}</td>
              <td className="tdcenter">{row.done ? imgDone : imgCancel}</td>
              <td className="tdcenter">-</td>
              <td className="tdcenter">{frmtNb(row.effectiveReward)}</td>
              <td className="tdcenter">{frmtNb((row.done ? 0 : row.effectiveReward) + (row.effectiveReward * futureExtraWeeks))}</td>
              <td className="tdcenter">{frmtNb(row.effectiveReward * totalChapterWeeksValue)}</td>
            </tr>
          ))}
          {poppyBonusWeekly > 0 ? (
            <tr>
              <td className="tdcenter"> </td>
              <td id="iccolumn"><img src={imgtkt} alt="" className="itico" /></td>
              <td className="tditem">Poppy bonus</td>
              <td className="tdcenter">{poppyBountiesDone ? imgDone : imgCancel}</td>
              <td className="tdcenter">-</td>
              <td className="tdcenter">{frmtNb(poppyBonusWeekly)}</td>
              <td className="tdcenter">{frmtNb((poppyBountiesDone ? 0 : poppyBonusWeekly) + (poppyBonusWeekly * futureExtraWeeks))}</td>
              <td className="tdcenter">{frmtNb(poppyBonusWeekly * totalChapterWeeksValue)}</td>
            </tr>
          ) : null}
          <tr>
            <td className="tdcenter">
              <input
                type="checkbox"
                checked={!!chapterVipDone}
                onChange={(e) => {
                  setUIField("chapterVipDone", !!e.target.checked);
                }}
                style={{ width: "16px", height: "16px" }}
              />
            </td>
            <td id="iccolumn"><img src="./icon/ui/chaptertrack.webp" alt="" className="itico" /></td>
            <td className="tditem">VIP Chapter points</td>
            <td className="tdcenter">{chapterVipDone ? imgDone : imgCancel}</td>
            <td className="tdcenter">-</td>
            <td className="tdcenter">-</td>
            <td className="tdcenter">{frmtNb(vipChapterPendingTickets)}</td>
            <td className="tdcenter">{frmtNb(vipChapterTickets)}</td>
          </tr>
          <tr>
            <td className="tdcenter"> </td>
            <td id="iccolumn"><img src={imgtkt} alt="" className="itico" /></td>
            <td className="tditem"><strong>Total</strong></td>
            <td className="tdcenter">-</td>
            <td className="tdcenter"><strong>{frmtNb(totalDailyTickets)}</strong></td>
            <td className="tdcenter"><strong>{frmtNb(totalWeekTickets)}</strong></td>
            <td className="tdcenter"><strong>{frmtNb(totalChapterTickets)}</strong></td>
            <td className="tdcenter"><strong>{frmtNb(totalFromZeroTickets)}</strong></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}



