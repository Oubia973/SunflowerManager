import React, { useCallback, useEffect, useRef, useState } from "react";
import { getOrCreateDeviceId } from "../fct.js";
const imgna = "./icon/nft/na.png";
const imgexchng = "./icon/ui/exchange.png";

export default function HeaderTrades({
  API_URL,
  farmId,
  options,
  currentPage,
  dataSetFarm,
  onTooltip,
  onTradesUpdate,
}) {
  const [ftradesData, setftradesData] = useState(null);
  const stableFarmId = String(farmId || "");
  const deviceIdRef = useRef(getOrCreateDeviceId());
  const lastFarmIdRef = useRef(stableFarmId);
  const tradesSectionHashRef = useRef("");
  const optionsRef = useRef(options || {});
  const farmDataRef = useRef(dataSetFarm || {});
  const onTradesUpdateRef = useRef(onTradesUpdate);
  const currentTradesRef = useRef(null);
  const currentTradesHeaderRef = useRef(null);

  useEffect(() => {
    optionsRef.current = options || {};
  }, [options]);
  useEffect(() => {
    farmDataRef.current = dataSetFarm || {};
  }, [dataSetFarm]);
  useEffect(() => {
    onTradesUpdateRef.current = onTradesUpdate;
  }, [onTradesUpdate]);

  const buildEntriesFromTrades = useCallback((ftrades) => {
    if (!ftrades) return [];
    const sourceFarm = farmDataRef.current || {};
    const sourceItables = sourceFarm?.itables || {};
    const sourceBoostables = sourceFarm?.boostables || {};
    const it = sourceItables?.it || {};
    const fish = sourceItables?.fish || {};
    const flower = sourceItables?.flower || {};
    const nft = sourceBoostables?.nft || {};
    const nftw = sourceBoostables?.nftw || {};
    const entries = Object.values(ftrades).sort(
      (a, b) => Number(Boolean(b?.fulfilledAt)) - Number(Boolean(a?.fulfilledAt))
    );
    return entries.map((entry) => {
      const name = Object.keys(entry?.items || {})[0];
      if (!name) return null;
      return {
        name,
        img: it[name]?.img || fish[name]?.img || flower[name]?.img || nft[name]?.img || nftw[name]?.img || imgna,
        fulfilledAt: entry?.fulfilledAt,
      };
    }).filter(Boolean);
  }, []);

  const renderTrades = useCallback((ftrades, ftradesHeader) => {
    const incomingHeaderEntries = Array.isArray(ftradesHeader)
      ? ftradesHeader.filter((entry) => entry?.name)
      : [];
    const hasIncomingTrades = !!(ftrades && typeof ftrades === "object" && Object.keys(ftrades).length > 0);
    const hasIncomingHeader = incomingHeaderEntries.length > 0;
    if (hasIncomingTrades) {
      currentTradesRef.current = ftrades;
    }
    if (hasIncomingHeader) {
      currentTradesHeaderRef.current = incomingHeaderEntries;
    }
    const headerEntries = hasIncomingHeader ? incomingHeaderEntries : [];
    const cachedHeaderEntries = Array.isArray(currentTradesHeaderRef.current)
      ? currentTradesHeaderRef.current.filter((entry) => entry?.name)
      : [];
    const sourceTrades = hasIncomingTrades ? ftrades : currentTradesRef.current;
    const entries = headerEntries.length > 0
      ? headerEntries
      : (cachedHeaderEntries.length > 0 ? cachedHeaderEntries : buildEntriesFromTrades(sourceTrades));
    if (!entries.length) {
      // Keep previous rendered header when payload is transient/partial.
      return;
    }
    setftradesData(
      <div className="table-container">
        <table className="tabletradesTable">
          <tbody>
            <tr>
              <td>
                <img src={imgexchng} alt="" className="itico" title="Listings" />
              </td>
              {entries.map((entry, index) => (
                <td key={`${entry.name}-${index}`} style={{ textAlign: "center", position: "relative" }}>
                  <img
                    src={entry?.img || imgna}
                    alt=""
                    className="itico"
                    title={entry?.name || ""}
                  />
                  {entry?.fulfilledAt ? (
                    <img
                      src="./icon/ui/confirm.png"
                      alt=""
                      title="Sold"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "15px",
                        height: "15px",
                        zIndex: 1,
                        opacity: 0.6,
                      }}
                    />
                  ) : null}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }, [buildEntriesFromTrades]);

  const getTrades = useCallback(async () => {
    if (!stableFarmId) return;
    try {
      const response = await fetch(API_URL + "/getdatacrypto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          frmid: stableFarmId,
          deviceId: deviceIdRef.current,
          options: optionsRef.current,
          include: ["trades"],
          page: String(currentPage || "home"),
          mode: "nav",
          knownHashes: tradesSectionHashRef.current ? { trades: tradesSectionHashRef.current } : {},
        }),
      });
      if (!response.ok) return;
      const responseData = await response.json();
      const respData = responseData?.allData || {};
      if (respData?.sectionHashes?.trades) {
        tradesSectionHashRef.current = respData.sectionHashes.trades;
      }
      const hasTrades = Object.prototype.hasOwnProperty.call(respData || {}, "ftrades");
      const hasHeader = Object.prototype.hasOwnProperty.call(respData || {}, "ftradesHeader");
      if (!hasTrades && !hasHeader) return;
      if (onTradesUpdateRef.current) {
        onTradesUpdateRef.current({
          ...(hasTrades ? { ftrades: respData.ftrades } : {}),
          ...(hasHeader ? { ftradesHeader: respData.ftradesHeader } : {}),
        });
      }
      renderTrades(respData?.ftrades, respData?.ftradesHeader);
    } catch (error) {
      console.log("getTrades error", error);
    }
  }, [API_URL, stableFarmId, currentPage, renderTrades]);

  useEffect(() => {
    if (lastFarmIdRef.current === stableFarmId) return;
    lastFarmIdRef.current = stableFarmId;
    tradesSectionHashRef.current = "";
    currentTradesRef.current = null;
    currentTradesHeaderRef.current = null;
    setftradesData(null);
  }, [stableFarmId]);

  useEffect(() => {
    const hasTrades = !!(dataSetFarm?.ftrades && typeof dataSetFarm.ftrades === "object" && Object.keys(dataSetFarm.ftrades).length > 0);
    const hasHeader = Array.isArray(dataSetFarm?.ftradesHeader) && dataSetFarm.ftradesHeader.length > 0;
    if (hasTrades || hasHeader) {
      renderTrades(dataSetFarm?.ftrades, dataSetFarm?.ftradesHeader);
    }
  }, [dataSetFarm?.ftrades, dataSetFarm?.ftradesHeader, renderTrades]);

  useEffect(() => {
    if (!stableFarmId) return;
    const hasSeedTrades = Object.prototype.hasOwnProperty.call(farmDataRef.current || {}, "ftrades")
      || Object.prototype.hasOwnProperty.call(farmDataRef.current || {}, "ftradesHeader");
    if (hasSeedTrades) return;
    if (document.visibilityState !== "visible") return;
    getTrades().catch((error) => {
      console.log("Trades preload error", error);
    });
  }, [stableFarmId, getTrades]);

  return (
    <div
      className="tabletrades"
      onClick={(e) => onTooltip?.(e, {
        ftrades: currentTradesRef.current,
        ftradesHeader: currentTradesHeaderRef.current,
      })}
      style={{ margin: "0", padding: "0" }}
    >
      {ftradesData ? ftradesData : ""}
    </div>
  );
}
