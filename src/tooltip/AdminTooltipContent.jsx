import React, { useEffect, useState } from "react";

export default function AdminTooltipContent({
    value,
    onAdminFetch = null,
    onClose = null,
}) {
    const MOBILE_TOKEN_BOOKMARKLET = `javascript:(async()=>{const k='sb_wiz.zpc.ng.sunflower-land.com-/play/';const v=localStorage.getItem(k)||'';try{await navigator.clipboard.writeText(v);alert(v?'Token copie dans le presse-papiers':'Token introuvable');}catch(e){prompt(k,v||'introuvable');}})();`;
    const [adminSectionError, setAdminSectionError] = useState({});
    const [adminDaysRange, setAdminDaysRange] = useState("30");
    const [adminFarmId, setAdminFarmId] = useState("");
    const [adminActivityRange, setAdminActivityRange] = useState("30");
    const [adminActionLoading, setAdminActionLoading] = useState("");
    const [adminActionResult, setAdminActionResult] = useState("");
    const [adminImportProgress, setAdminImportProgress] = useState(null);
    const [adminFarmValidation, setAdminFarmValidation] = useState(null);
    const [adminVipFarmId, setAdminVipFarmId] = useState("");
    const [adminVipValidation, setAdminVipValidation] = useState(null);
    const [adminViewOverride, setAdminViewOverride] = useState(null);
    const [adminCategoryGroupsOpen, setAdminCategoryGroupsOpen] = useState({});
    const [adminTokenDraft, setAdminTokenDraft] = useState("");
    const [adminServerMessage, setAdminServerMessage] = useState("");
    const [adminServerError, setAdminServerError] = useState("");

    useEffect(() => {
        setAdminSectionError({});
        setAdminActionLoading("");
        setAdminActionResult("");
        setAdminImportProgress(null);
        setAdminFarmValidation(null);
        setAdminVipValidation(null);
        setAdminViewOverride(null);
        setAdminCategoryGroupsOpen({});
        setAdminServerMessage("");
        setAdminServerError("");
    }, [value]);

    const payload = (value && typeof value === "object") ? value : {};
    const viewRaw = adminViewOverride || payload?.view;
    const view = (viewRaw && typeof viewRaw === "object") ? viewRaw : {};
    const lines = Array.isArray(view?.lines) ? view.lines : [];
    const categories = Array.isArray(view?.categories) ? view.categories : [];
    const machineIp = String(view?.machineIp || payload?.view?.machineIp || "");
    const serverToken = (view?.serverToken && typeof view.serverToken === "object") ? view.serverToken : {};
    const adminRangeOptions = [
        { value: "1", label: "1 day" },
        { value: "3", label: "3 days" },
        { value: "7", label: "7 days" },
        { value: "14", label: "14 days" },
        { value: "30", label: "30 days" },
        { value: "90", label: "90 days" },
        { value: "180", label: "180 days" },
    ];
    const adminImportRangeOptions = [
        ...adminRangeOptions,
        { value: "season", label: "Season" },
    ];
    const headerActionMessage = String(adminActionResult || adminServerMessage || "");

    const toYmd = (dateObj) => {
        const d = dateObj instanceof Date ? dateObj : new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${dd}`;
    };

    const loadSummary = async (nextDaysRange = adminDaysRange) => {
        if (typeof onAdminFetch !== "function") return;
        const days = Math.max(1, Number(nextDaysRange || 30));
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - (days - 1));
        const usersStart = toYmd(start);
        const usersEnd = toYmd(end);
        try {
            const responseData = await onAdminFetch({
                mode: "summary",
                usersStart,
                usersEnd,
            }, true);
            const nextView = (responseData?.view && typeof responseData.view === "object") ? responseData.view : null;
            if (!nextView) return;
            setAdminViewOverride(nextView);
            setAdminSectionError({});
        } catch (error) {
            setAdminSectionError((prev) => ({ ...prev, __summary__: String(error?.message || "Load failed") }));
        }
    };

    useEffect(() => {
        if (adminActionLoading !== "importactivitygzip") return undefined;
        const farmId = String(adminFarmId || "").trim();
        if (!farmId || typeof onAdminFetch !== "function") return undefined;
        let stopped = false;
        const poll = async () => {
            try {
                const responseData = await onAdminFetch({
                    action: "getactivityimportstatus",
                    farmId,
                }, false);
                if (stopped) return;
                const nextProgress = (responseData?.result && typeof responseData.result === "object") ? responseData.result : null;
                setAdminImportProgress(nextProgress);
                if (!responseData?.running) {
                    setAdminActionLoading("");
                    if (String(nextProgress?.status || "") === "done") {
                        setAdminActionResult(String(nextProgress?.message || "Import termine"));
                        await loadSummary(adminDaysRange);
                    } else if (String(nextProgress?.status || "") === "error") {
                        setAdminSectionError((prev) => ({ ...prev, __actions__: String(nextProgress?.error || nextProgress?.message || "Import failed") }));
                    }
                    return;
                }
                window.setTimeout(poll, 1000);
            } catch (error) {
                if (stopped) return;
                setAdminSectionError((prev) => ({ ...prev, __actions__: String(error?.message || "Progress unavailable") }));
                setAdminActionLoading("");
            }
        };
        const timer = window.setTimeout(poll, 600);
        return () => {
            stopped = true;
            window.clearTimeout(timer);
        };
    }, [adminActionLoading, adminFarmId]);

    const resetAdminFarmValidation = () => {
        setAdminFarmValidation(null);
        setAdminImportProgress(null);
        setAdminActionResult("");
        setAdminSectionError((prev) => ({ ...prev, __actions__: "" }));
    };

    const resetAdminVipValidation = () => {
        setAdminVipValidation(null);
        setAdminActionResult("");
        setAdminSectionError((prev) => ({ ...prev, __vip__: "" }));
    };

    const validateAdminFarm = async () => {
        if (typeof onAdminFetch !== "function") return;
        const farmId = String(adminFarmId || "").trim();
        if (!farmId) {
            setAdminSectionError((prev) => ({ ...prev, __actions__: "Farm ID required" }));
            return;
        }
        setAdminActionLoading("checkactivityfarm");
        setAdminActionResult("");
        setAdminSectionError((prev) => ({ ...prev, __actions__: "" }));
        try {
            const responseData = await onAdminFetch({
                action: "checkactivityfarm",
                farmId,
            }, true);
            const result = (responseData?.result && typeof responseData.result === "object") ? responseData.result : null;
            setAdminFarmValidation({
                farmId,
                checked: true,
                days: Number(result?.days || 0),
                minDate: String(result?.minDate || ""),
                maxDate: String(result?.maxDate || ""),
                existed: !!result?.existed,
            });
            setAdminActionResult(String(responseData?.message || "Farm validated"));
        } catch (error) {
            setAdminFarmValidation(null);
            setAdminSectionError((prev) => ({ ...prev, __actions__: String(error?.message || "Validation failed") }));
        } finally {
            setAdminActionLoading("");
        }
    };

    const runAdminAction = async (action) => {
        if (typeof onAdminFetch !== "function") return;
        const farmId = String(adminFarmId || "").trim();
        if (!farmId) {
            setAdminSectionError((prev) => ({ ...prev, __actions__: "Farm ID required" }));
            return;
        }
        if (!adminFarmValidation?.checked || String(adminFarmValidation?.farmId || "") !== farmId) {
            setAdminSectionError((prev) => ({ ...prev, __actions__: "Validate the farm ID first" }));
            return;
        }
        setAdminActionLoading(action);
        setAdminActionResult("");
        setAdminSectionError((prev) => ({ ...prev, __actions__: "" }));
        try {
            let responseData = null;
            if (action === "importactivitygzip") {
                responseData = await onAdminFetch({
                    action,
                    farmId,
                    range: adminActivityRange,
                }, true);
                const nextProgress = (responseData?.result && typeof responseData.result === "object") ? responseData.result : null;
                setAdminImportProgress(nextProgress);
                setAdminActionResult(String(responseData?.message || "Import started"));
                return;
            } else if (action === "clearactivityfarm") {
                const confirmed = window.confirm(`Delete Activity history for farm ${farmId}?`);
                if (!confirmed) {
                    return;
                }
                responseData = await onAdminFetch({
                    action,
                    farmId,
                }, true);
                setAdminFarmValidation((prev) => prev ? ({
                    ...prev,
                    days: 0,
                    minDate: "",
                    maxDate: "",
                    existed: false,
                }) : prev);
            }
            const message = String(responseData?.message || "Action completed");
            setAdminActionResult(message);
            setAdminImportProgress(null);
            await loadSummary(adminDaysRange);
        } catch (error) {
            setAdminSectionError((prev) => ({ ...prev, __actions__: String(error?.message || "Action failed") }));
        } finally {
            if (action !== "importactivitygzip") {
                setAdminActionLoading("");
            }
        }
    };

    const validateAdminVipFarm = async () => {
        if (typeof onAdminFetch !== "function") return;
        const farmId = String(adminVipFarmId || "").trim();
        if (!farmId) {
            setAdminSectionError((prev) => ({ ...prev, __vip__: "Farm ID required" }));
            return;
        }
        setAdminActionLoading("checkvipfarm");
        setAdminActionResult("");
        setAdminSectionError((prev) => ({ ...prev, __vip__: "" }));
        try {
            const responseData = await onAdminFetch({
                action: "checkvipfarm",
                farmId,
            }, true);
            const result = (responseData?.result && typeof responseData.result === "object") ? responseData.result : null;
            setAdminVipValidation({
                farmId,
                checked: true,
                active: !!result?.active,
                isLifetime: !!result?.isLifetime,
                inAboFile: !!result?.inAboFile,
                hasTempSubscription: !!result?.hasTempSubscription,
                expiresAt: Number(result?.expiresAt || 0),
            });
            setAdminActionResult(String(responseData?.message || "VIP checked"));
        } catch (error) {
            setAdminVipValidation(null);
            setAdminSectionError((prev) => ({ ...prev, __vip__: String(error?.message || "VIP validation failed") }));
        } finally {
            setAdminActionLoading("");
        }
    };

    const runAdminVipAction = async (action) => {
        if (typeof onAdminFetch !== "function") return;
        const farmId = String(adminVipFarmId || "").trim();
        if (!farmId) {
            setAdminSectionError((prev) => ({ ...prev, __vip__: "Farm ID required" }));
            return;
        }
        setAdminActionLoading(action);
        setAdminActionResult("");
        setAdminSectionError((prev) => ({ ...prev, __vip__: "" }));
        try {
            const confirmed = action === "removevipfarm"
                ? window.confirm(`Remove VIP for farm ${farmId}?`)
                : true;
            if (!confirmed) return;
            const responseData = await onAdminFetch({
                action,
                farmId,
            }, true);
            const result = (responseData?.result && typeof responseData.result === "object") ? responseData.result : null;
            setAdminVipValidation({
                farmId,
                checked: true,
                active: !!result?.active,
                isLifetime: !!result?.isLifetime,
                inAboFile: !!result?.inAboFile,
                hasTempSubscription: !!result?.hasTempSubscription,
                expiresAt: Number(result?.expiresAt || 0),
            });
            setAdminActionResult(String(responseData?.message || "VIP action completed"));
        } catch (error) {
            setAdminSectionError((prev) => ({ ...prev, __vip__: String(error?.message || "VIP action failed") }));
        } finally {
            setAdminActionLoading("");
        }
    };

    const updateAdminEnvToken = async () => {
        if (typeof onAdminFetch !== "function") return;
        const token = String(adminTokenDraft || "").trim();
        if (!token) {
            setAdminServerError("Token required");
            return;
        }
        setAdminActionLoading("setenvtoken");
        setAdminActionResult("");
        setAdminServerMessage("");
        setAdminServerError("");
        try {
            const responseData = await onAdminFetch({
                action: "setenvtoken",
                token,
            }, true);
            setAdminServerMessage(String(responseData?.message || "Token updated"));
            setAdminTokenDraft("");
            await loadSummary(adminDaysRange);
        } catch (error) {
            setAdminServerError(String(error?.message || "Token update failed"));
        } finally {
            setAdminActionLoading("");
        }
    };

    const restartAdminServer = async () => {
        if (typeof onAdminFetch !== "function") return;
        const confirmed = window.confirm("Relancer le serveur maintenant ? La connexion admin peut etre interrompue pendant quelques secondes.");
        if (!confirmed) {
            return;
        }
        setAdminActionLoading("restartserver");
        setAdminActionResult("");
        setAdminServerMessage("");
        setAdminServerError("");
        try {
            const responseData = await onAdminFetch({
                action: "restartserver",
            }, true);
            setAdminServerMessage(String(responseData?.message || "Server restart requested"));
        } catch (error) {
            setAdminServerError(String(error?.message || "Server restart failed"));
        } finally {
            setAdminActionLoading("");
        }
    };

    const copyMobileTokenBookmarklet = async () => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(MOBILE_TOKEN_BOOKMARKLET);
                setAdminServerMessage("Bookmarklet mobile copie. Cree un favori sur sunflower-land.com et colle ce script comme URL.");
            } else {
                setAdminServerMessage(`Bookmarklet mobile: ${MOBILE_TOKEN_BOOKMARKLET}`);
            }
            setAdminServerError("");
        } catch (error) {
            setAdminServerError(String(error?.message || "Bookmarklet copy failed"));
        }
    };

    const pasteTokenFromClipboard = async () => {
        try {
            if (!navigator?.clipboard?.readText) {
                throw new Error("Clipboard read unavailable on this browser");
            }
            const txt = String(await navigator.clipboard.readText() || "").trim();
            if (!txt) {
                throw new Error("Clipboard is empty");
            }
            setAdminTokenDraft(txt);
            setAdminServerMessage("Token colle depuis le presse-papiers. Clique ensuite sur Replace token.");
            setAdminServerError("");
        } catch (error) {
            setAdminServerError(String(error?.message || "Clipboard paste failed"));
        }
    };

    return (
        <>
            <div style={{
                position: "sticky",
                top: 0,
                zIndex: 3,
                margin: "-4px -4px 8px -4px",
                padding: "6px 8px 8px 8px",
                background: "rgba(24, 16, 12, 0.96)",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(4px)",
            }}>
                <div className="horizontal" style={{ gap: 8, height: "auto", alignItems: "center", justifyContent: "space-between" }}>
                    <div className="horizontal" style={{ gap: 8, height: "auto", alignItems: "center" }}>
                        <div><b>{String(view?.title || "Admin")}</b></div>
                        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 10, opacity: 0.8 }}>Range</span>
                            <select
                                name="adminDaysRange"
                                value={String(adminDaysRange)}
                                onChange={(e) => {
                                    const nextVal = String(e?.target?.value || "30");
                                    setAdminDaysRange(nextVal);
                                    loadSummary(nextVal);
                                }}
                                style={{ height: 22 }}
                            >
                                {adminRangeOptions.map((option) => (
                                    <option key={String(option.value)} value={String(option.value)}>
                                        {String(option.label)}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <button onClick={() => { if (typeof onClose === "function") onClose(); }} className="button">
                        <img src="./icon/ui/cancel.png" alt="" className="resico" />
                    </button>
                </div>
                <div style={{ minHeight: 18, marginTop: 6, color: "#9ee6a0", fontSize: 12 }}>
                    {headerActionMessage || ""}
                </div>
            </div>
            {String(view?.error || "") ? <div style={{ color: "#ff8e8e" }}>{String(view.error)}</div> : null}
            {String(adminSectionError?.__summary__ || "") ? <div style={{ color: "#ff8e8e" }}>{String(adminSectionError.__summary__)}</div> : null}
            {categories.length > 0 ? categories.map((cat, catIdx) => {
                const title = String(cat?.title || `Category ${catIdx + 1}`);
                const catLines = Array.isArray(cat?.lines) ? cat.lines : [];
                const catGroups = Array.isArray(cat?.groups) ? cat.groups : [];
                const isServerCategory = String(cat?.id || "") === "server";
                return (
                    <div key={`adm-cat-${catIdx}`} style={{
                        marginTop: 8,
                        border: "1px solid rgba(255,255,255,0.22)",
                        borderRadius: 8,
                        padding: "6px 8px",
                        background: "rgba(255,255,255,0.03)",
                    }}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{title}</div>
                        {catLines.length > 0 ? catLines.map((line, idx) => (
                            <div key={`adm-cat-line-${catIdx}-${idx}`}>{String(line || "")}</div>
                        )) : <div>No data</div>}
                        {isServerCategory ? (
                            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "end" }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: 3, flex: "1 1 320px" }}>
                                    <span style={{ fontSize: 10, opacity: 0.8 }}>
                                        Nouveau token
                                        {String(serverToken?.expiresAtLocal || "") ? ` | actuel: ${String(serverToken.expiresAtLocal)}` : ""}
                                    </span>
                                    <input
                                        type="text"
                                        value={adminTokenDraft}
                                        onChange={(e) => setAdminTokenDraft(String(e?.target?.value || ""))}
                                        placeholder="Colle le nouveau TOKEN ici"
                                    />
                                </label>
                                <button
                                    className="graph-tab-btn"
                                    onClick={updateAdminEnvToken}
                                    disabled={adminActionLoading !== ""}
                                >
                                    {adminActionLoading === "setenvtoken" ? "Update..." : "Replace token"}
                                </button>
                                <button
                                    className="graph-tab-btn"
                                    onClick={pasteTokenFromClipboard}
                                    disabled={adminActionLoading !== ""}
                                >
                                    Paste clipboard
                                </button>
                                <button
                                    className="graph-tab-btn"
                                    onClick={copyMobileTokenBookmarklet}
                                    disabled={adminActionLoading !== ""}
                                >
                                    Copy mobile getter
                                </button>
                                <button
                                    className="graph-tab-btn"
                                    onClick={restartAdminServer}
                                    disabled={adminActionLoading !== ""}
                                >
                                    {adminActionLoading === "restartserver" ? "Restart..." : "Restart server"}
                                </button>
                            </div>
                        ) : null}
                        {isServerCategory ? (
                            <div style={{ marginTop: 6, fontSize: 11, opacity: 0.8 }}>
                                Mobile: copie le bookmarklet, ouvre `sunflower-land.com`, lance le favori pour copier le token, reviens ici, puis `Paste clipboard` et `Replace token`.
                            </div>
                        ) : null}
                        {isServerCategory && String(adminServerError || "") ? (
                            <div style={{ color: "#ff8e8e", marginTop: 6 }}>{String(adminServerError)}</div>
                        ) : null}
                        {isServerCategory && String(adminServerMessage || "") ? (
                            <div style={{ color: "#9ee6a0", marginTop: 6 }}>{String(adminServerMessage)}</div>
                        ) : null}
                        {catGroups.length > 0 ? catGroups.map((group, gIdx) => {
                            const gId = `${String(cat?.id || catIdx)}::${String(group?.id || gIdx)}`;
                            const isOpen = !!adminCategoryGroupsOpen[gId];
                            const rows = Array.isArray(group?.rows) ? group.rows : [];
                            return (
                                <div key={`adm-cat-group-${gId}`} style={{ marginTop: 6 }}>
                                    <button
                                        className="graph-tab-btn"
                                        onClick={() => setAdminCategoryGroupsOpen((prev) => ({ ...prev, [gId]: !isOpen }))}
                                    >
                                        {isOpen ? "v" : ">"} {String(group?.title || "Details")} ({rows.length})
                                    </button>
                                    {isOpen ? (
                                        <pre style={{ whiteSpace: "pre-wrap", marginTop: 4, fontSize: 11 }}>
                                            {rows.length > 0 ? rows.map((r) => String(r || "")).join("\n") : "No data"}
                                        </pre>
                                    ) : null}
                                </div>
                            );
                        }) : null}
                    </div>
                );
            }) : lines.map((line, idx) => (
                <div key={`adm-line-${idx}`}>{String(line || "")}</div>
            ))}
            <div style={{
                marginTop: 12,
                padding: "8px 10px",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
            }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Activity / Gzip</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "end" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span>Farm ID</span>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={adminFarmId}
                            onChange={(e) => {
                                setAdminFarmId(String(e?.target?.value || ""));
                                resetAdminFarmValidation();
                            }}
                            style={{ minWidth: 120 }}
                        />
                    </label>
                    <button
                        className="graph-tab-btn"
                        onClick={validateAdminFarm}
                        disabled={adminActionLoading !== ""}
                    >
                        {adminActionLoading === "checkactivityfarm" ? "Check..." : "Validate"}
                    </button>
                    <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 10, opacity: 0.8 }}>Import range</span>
                        <select
                            name="adminActivityRange"
                            value={String(adminActivityRange)}
                            onChange={(e) => setAdminActivityRange(String(e?.target?.value || "30"))}
                            style={{ height: 22 }}
                        >
                            {adminImportRangeOptions.map((option) => (
                                <option key={String(option.value)} value={String(option.value)}>
                                    {String(option.label)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        className="graph-tab-btn"
                        onClick={() => runAdminAction("importactivitygzip")}
                        disabled={adminActionLoading !== "" || !adminFarmValidation?.checked}
                    >
                        {adminActionLoading === "importactivitygzip" ? "Import..." : "Import gzip -> Activity"}
                    </button>
                    <button
                        className="graph-tab-btn"
                        onClick={() => runAdminAction("clearactivityfarm")}
                        disabled={adminActionLoading !== "" || !adminFarmValidation?.checked}
                    >
                        {adminActionLoading === "clearactivityfarm" ? "Delete..." : "Delete Activity"}
                    </button>
                </div>
                <div style={{ marginTop: 6, fontSize: 11, opacity: 0.8 }}>
                    Actions executees sur la Mongo locale du backend Admin ({machineIp || "IP inconnue"}).
                </div>
                {adminFarmValidation?.checked ? (
                    <div style={{ marginTop: 6, fontSize: 12 }}>
                        <div>Validated farm: {String(adminFarmValidation.farmId)}</div>
                        <div>Activity days in DB: {Number(adminFarmValidation.days || 0)}</div>
                        {adminFarmValidation.existed ? (
                            <div>Range in DB: {String(adminFarmValidation.minDate || "-")} -> {String(adminFarmValidation.maxDate || "-")}</div>
                        ) : (
                            <div>No Activity history in DB for this farm.</div>
                        )}
                    </div>
                ) : null}
                {adminImportProgress ? (
                    <div style={{ marginTop: 6, fontSize: 12 }}>
                        <div>
                            Status: {String(adminImportProgress?.status || "-")}
                            {adminImportProgress?.currentDate ? ` | Date: ${String(adminImportProgress.currentDate)}` : ""}
                        </div>
                        <div>
                            Replay range: {String(adminImportProgress?.replayStartDate || "-")} -> {String(adminImportProgress?.endDate || "-")}
                        </div>
                        <div>
                            Store range: {String(adminImportProgress?.startDate || "-")} -> {String(adminImportProgress?.endDate || "-")}
                        </div>
                        <div>
                            Replay: {Number(adminImportProgress?.processedDays || 0)}/{Number(adminImportProgress?.totalDays || 0)}
                            {" "} | stored: {Number(adminImportProgress?.importedDays || 0)}
                            {" "} | missing: {Number(adminImportProgress?.missingDays || 0)}
                        </div>
                        {String(adminImportProgress?.message || "") ? <div>{String(adminImportProgress.message)}</div> : null}
                    </div>
                ) : null}
                {String(adminSectionError?.__actions__ || "") ? <div style={{ color: "#ff8e8e", marginTop: 6 }}>{String(adminSectionError.__actions__)}</div> : null}

            </div>
            <div style={{
                marginTop: 12,
                padding: "8px 10px",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
            }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>VIP</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "end" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span>Farm ID</span>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={adminVipFarmId}
                            onChange={(e) => {
                                setAdminVipFarmId(String(e?.target?.value || ""));
                                resetAdminVipValidation();
                            }}
                            style={{ minWidth: 120 }}
                        />
                    </label>
                    <button
                        className="graph-tab-btn"
                        onClick={validateAdminVipFarm}
                        disabled={adminActionLoading !== ""}
                    >
                        {adminActionLoading === "checkvipfarm" ? "Check..." : "Validate"}
                    </button>
                    <button
                        className="graph-tab-btn"
                        onClick={() => runAdminVipAction("addvip30days")}
                        disabled={adminActionLoading !== ""}
                    >
                        {adminActionLoading === "addvip30days" ? "Add..." : "Add 30 days"}
                    </button>
                    <button
                        className="graph-tab-btn"
                        onClick={() => runAdminVipAction("removevipfarm")}
                        disabled={adminActionLoading !== ""}
                    >
                        {adminActionLoading === "removevipfarm" ? "Delete..." : "Supr VIP"}
                    </button>
                </div>
                {adminVipValidation?.checked ? (
                    <div style={{ marginTop: 6, fontSize: 12 }}>
                        <div>Validated farm: {String(adminVipValidation.farmId)}</div>
                        <div>VIP active: {adminVipValidation.active ? "Yes" : "No"}</div>
                        <div>Lifetime: {adminVipValidation.isLifetime ? "Yes" : "No"}</div>
                        <div>In `abofrm.json`: {adminVipValidation.inAboFile ? "Yes" : "No"}</div>
                        <div>Temp subscription: {adminVipValidation.hasTempSubscription ? "Yes" : "No"}</div>
                        {adminVipValidation.expiresAt > 0 ? (
                            <div>Expires at: {new Date(adminVipValidation.expiresAt).toLocaleString("fr-FR")}</div>
                        ) : null}
                    </div>
                ) : null}
                {String(adminSectionError?.__vip__ || "") ? <div style={{ color: "#ff8e8e", marginTop: 6 }}>{String(adminSectionError.__vip__)}</div> : null}
            </div>
        </>
    );
}

