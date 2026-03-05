import React, { useEffect, useState } from "react";
import DList from "../dlist.jsx";

export default function AdminTooltipContent({
    value,
    onAdminFetch = null,
}) {
    const [adminSectionError, setAdminSectionError] = useState({});
    const [adminDaysRange, setAdminDaysRange] = useState("30");
    const [adminViewOverride, setAdminViewOverride] = useState(null);
    const [adminCategoryGroupsOpen, setAdminCategoryGroupsOpen] = useState({});

    useEffect(() => {
        setAdminSectionError({});
        setAdminViewOverride(null);
        setAdminCategoryGroupsOpen({});
    }, [value]);

    const payload = (value && typeof value === "object") ? value : {};
    const viewRaw = adminViewOverride || payload?.view;
    const view = (viewRaw && typeof viewRaw === "object") ? viewRaw : {};
    const lines = Array.isArray(view?.lines) ? view.lines : [];
    const categories = Array.isArray(view?.categories) ? view.categories : [];
    const adminRangeOptions = [
        { value: "1", label: "1 day" },
        { value: "3", label: "3 days" },
        { value: "7", label: "7 days" },
        { value: "14", label: "14 days" },
        { value: "30", label: "30 days" },
        { value: "90", label: "90 days" },
        { value: "180", label: "180 days" },
    ];

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

    return (
        <>
            <div><b>{String(view?.title || "Admin")}</b></div>
            <div className="horizontal" style={{ gap: 6, height: "auto", marginTop: 4 }}>
                <DList
                    name="adminDaysRange"
                    title="Range"
                    options={adminRangeOptions}
                    value={String(adminDaysRange)}
                    onChange={(e) => {
                        const nextVal = String(e?.target?.value || "30");
                        setAdminDaysRange(nextVal);
                        loadSummary(nextVal);
                    }}
                    height={22}
                />
            </div>
            {String(view?.error || "") ? <div style={{ color: "#ff8e8e" }}>{String(view.error)}</div> : null}
            {String(adminSectionError?.__summary__ || "") ? <div style={{ color: "#ff8e8e" }}>{String(adminSectionError.__summary__)}</div> : null}
            {categories.length > 0 ? categories.map((cat, catIdx) => {
                const title = String(cat?.title || `Category ${catIdx + 1}`);
                const catLines = Array.isArray(cat?.lines) ? cat.lines : [];
                const catGroups = Array.isArray(cat?.groups) ? cat.groups : [];
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
        </>
    );
}
