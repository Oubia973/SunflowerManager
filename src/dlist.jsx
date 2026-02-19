import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./dlist.css";

export default function DList({
    options,
    value,
    onChange,
    name,
    title,
    multiple = false,
    placeholder = "Select…",
    width = null,
    height = null,
    listIcon,
    searchable = false,
    closeOnSelect,
    dense = true,
    emitEvent = true,
    clearable = false,
    iconOnly = false,
    menuMinWidth = null,
    className = "",
}) {
    const rootRef = useRef(null);
    const btnRef = useRef(null);
    const inputRef = useRef(null);
    const menuRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const [pos, setPos] = useState(null);

    // Animation duration (keep in sync with CSS transition timing)
    const ANIM_MS = 320;
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open) {
            setMounted(true);
            // Ensure the browser paints the "closed" state before switching to "open"
            requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        } else {
            setVisible(false);
            const t = setTimeout(() => setMounted(false), ANIM_MS);
            return () => clearTimeout(t);
        }
    }, [open]);

    const tupleMode = useMemo(() => isTupleList(options), [options]);
    const effectiveMultiple = tupleMode ? true : multiple;

    const norm = useMemo(() => normalizeOptions(options), [options]);

    const effectiveValue = useMemo(() => {
        if (!tupleMode) return value;
        const tupleSource = isTupleList(value)
            ? value
            : (Array.isArray(options) ? options : []);
        return tupleSource
            .filter((t) => Array.isArray(t) && !!t[1])
            .map((t) => t[0]);
    }, [tupleMode, value, options]);

    const selectedKeySet = useMemo(() => {
        if (effectiveMultiple) return new Set((Array.isArray(effectiveValue) ? effectiveValue : []).map((v) => String(v)));
        return new Set([String(effectiveValue ?? "")]);
    }, [effectiveValue, effectiveMultiple]);

    const selectedOptions = useMemo(() => {
        const map = new Map(norm.map((o) => [o.valueKey, o]));
        const vals = effectiveMultiple ? (Array.isArray(effectiveValue) ? effectiveValue : []) : [effectiveValue];
        return vals.map((v) => map.get(String(v))).filter(Boolean);
    }, [norm, effectiveValue, effectiveMultiple]);

    const filtered = useMemo(() => {
        if (!searchable) return norm;
        const query = q.trim().toLowerCase();
        if (!query) return norm;
        return norm.filter((o) => (o.searchText || "").toLowerCase().includes(query));
    }, [norm, q, searchable]);

    const effectiveCloseOnSelect = closeOnSelect ?? !effectiveMultiple;

    function emit(nextValue) {
        if (!onChange) return;

        if (tupleMode) {
            if (emitEvent) onChange({ target: { name, value: nextValue } });
            else onChange(nextValue);
            return;
        }

        if (emitEvent) onChange({ target: { name, value: nextValue } });
        else onChange(nextValue);
    }

    function computePos() {
        const el = btnRef.current || rootRef.current;
        if (!el) return null;

        const r = el.getBoundingClientRect();

        const GAP = 6;
        const PAD = 8;
        const MAX_LIST = 450;

        const spaceBelow = window.innerHeight - (r.bottom + GAP) - PAD;
        const spaceAbove = (r.top - GAP) - PAD;

        const openDown = spaceBelow >= 180 || spaceBelow >= spaceAbove;
        const maxListH = Math.max(120, Math.min(MAX_LIST, openDown ? spaceBelow : spaceAbove));

        const minWidthPx =
            menuMinWidth == null
                ? 0
                : (typeof menuMinWidth === "number" ? menuMinWidth : Number.parseFloat(String(menuMinWidth)) || 0);
        const popupWidth = Math.max(Math.round(r.width), Math.round(minWidthPx));
        const maxLeft = Math.max(PAD, window.innerWidth - popupWidth - PAD);
        const clampedLeft = Math.min(Math.max(Math.round(r.left), PAD), maxLeft);
        const base = {
            left: clampedLeft,
            width: Math.round(r.width),
            maxListH,
        };

        if (openDown) {
            return { ...base, top: Math.round(r.bottom + GAP) };
        }

        return { ...base, bottom: Math.round(window.innerHeight - r.top + GAP) };
    }


    function openMenu() {
        setPos(computePos());
        setOpen(true);
        if (searchable) setTimeout(() => inputRef.current?.focus(), 0);
    }

    function close() {
        setOpen(false);
        setQ("");
    }

    function toggleMenu() {
        open ? close() : openMenu();
    }

    function pick(opt) {
        if (tupleMode) {
            const updated = toggleTuple(options, opt.value);
            emit(updated);
            if (effectiveCloseOnSelect) close();
            return;
        }

        if (effectiveMultiple) {
            const cur = new Map();
            (Array.isArray(effectiveValue) ? effectiveValue : []).forEach((v) => cur.set(String(v), v));
            if (cur.has(opt.valueKey)) cur.delete(opt.valueKey);
            else cur.set(opt.valueKey, opt.value);
            emit(Array.from(cur.values()));
        } else {
            emit(opt.value);
        }
        if (effectiveCloseOnSelect) close();
    }

    function clearAll(e) {
        e?.preventDefault();
        e?.stopPropagation();
        if (tupleMode) {
            const updated = (Array.isArray(options) ? options : []).map((t) =>
                Array.isArray(t) ? [t[0], 0, ...t.slice(2)] : t
            );
            emit(updated);
            return;
        }
        emit(effectiveMultiple ? [] : "");
    }

    useEffect(() => {
        function onDocDown(e) {
            if (!open) return;
            if (menuRef.current?.contains(e.target)) return;
            if (rootRef.current?.contains(e.target)) return;
            close();
        }
        document.addEventListener("mousedown", onDocDown);
        return () => document.removeEventListener("mousedown", onDocDown);
    }, [open]);

    useEffect(() => {
        function onKey(e) {
            if (!open) return;
            if (e.key === "Escape") close();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onMove = () => setPos(computePos());
        window.addEventListener("scroll", onMove, true);
        window.addEventListener("resize", onMove);
        return () => {
            window.removeEventListener("scroll", onMove, true);
            window.removeEventListener("resize", onMove);
        };
    }, [open]);

    const triggerContent = useMemo(() => {
        if (!selectedOptions.length) return <span className="cd-muted">{placeholder}</span>;
        if (!effectiveMultiple) return <span className="cd-triggerLabel">{selectedOptions[0].label}</span>;
        const n = selectedOptions.length;
        return <span className="cd-triggerLabel">{n} sélection{n > 1 ? "s" : ""}</span>;
    }, [selectedOptions, placeholder, effectiveMultiple]);

    const triggerIcon = useMemo(() => {
        if (listIcon) return renderIcon(listIcon, "cd-ico");
        if (!effectiveMultiple && selectedOptions[0]?.iconSrc)
            return <img className="cd-ico" src={selectedOptions[0].iconSrc} alt="" />;
        if (!effectiveMultiple && selectedOptions[0]?.icon)
            return <span className="cd-icoWrap">{selectedOptions[0].icon}</span>;
        return <span />;
    }, [listIcon, effectiveMultiple, selectedOptions]);

    const hasValue = effectiveMultiple
        ? Array.isArray(effectiveValue) && effectiveValue.length > 0
        : effectiveValue !== undefined && effectiveValue !== null && effectiveValue !== "";

    const rootStyle = useMemo(() => {
        return width != null
            ? { width: typeof width === "number" ? `${width}px` : width }
            : { width: "max-content", display: "inline-block" };
    }, [width]);

    const btnStyle = useMemo(() => {
        if (height == null) return undefined;
        return { height: typeof height === "number" ? `${height}px` : height };
    }, [height]);

    const popStyle = useMemo(() => {
        if (!pos) return undefined;
        const resolvedMinWidth = menuMinWidth != null
            ? (typeof menuMinWidth === "number" ? `${menuMinWidth}px` : menuMinWidth)
            : null;
        const viewportMaxWidth = "calc(100vw - 16px)";

        const base = {
            left: pos.left,
            width: pos.width,
            maxWidth: viewportMaxWidth,
            ...(pos.top != null ? { top: pos.top } : {}),
            ...(pos.bottom != null ? { bottom: pos.bottom } : {}),
            "--cd-list-maxh": `${pos.maxListH ?? 450}px`,
        };

        if (width == null) {
            return { ...base, minWidth: resolvedMinWidth ?? pos.width, width: "max-content" };
        }

        if (resolvedMinWidth) {
            return { ...base, minWidth: resolvedMinWidth };
        }
        return base;
    }, [pos, width, menuMinWidth]);


    const menu =
        mounted && pos
            ? createPortal(
                <div ref={menuRef} className={"cd-pop cd-pop--portal " + (dense ? "cd-dense " : "") + (visible ? "cd-open " : "cd-closed ") + (pos?.bottom != null ? "cd-up" : "cd-down")} style={popStyle}>
                    {searchable && (
                        <div className="cd-searchRow">
                            <input
                                ref={inputRef}
                                className="cd-search"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search…"
                            />
                        </div>
                    )}

                    <div className="cd-list" role="listbox" aria-multiselectable={effectiveMultiple ? "true" : "false"}>
                        {filtered.length === 0 ? (
                            <div className="cd-empty">Aucun résultat</div>
                        ) : (
                            filtered.map((o) => {
                                const isOn = selectedKeySet.has(o.valueKey);
                                return (
                                    <button
                                        key={o.valueKey}
                                        type="button"
                                        className={"cd-item " + (isOn ? "cd-on" : "")}
                                        onClick={() => !o.disabled && pick(o)}
                                        disabled={!!o.disabled}
                                        role="option"
                                        aria-selected={isOn}
                                    >
                                        {effectiveMultiple ? (
                                            <span className={"cd-box " + (isOn ? "cd-boxOn" : "")} aria-hidden="true">
                                                {isOn ? <Check /> : null}
                                            </span>
                                        ) : null}

                                        {o.iconSrc ? (
                                            <img className="cd-ico" src={o.iconSrc} alt="" />
                                        ) : o.icon ? (
                                            <span className="cd-icoWrap">{o.icon}</span>
                                        ) : (
                                            <span />
                                        )}
                                        <span className="cd-label">{o.label}</span>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {effectiveMultiple ? (
                        <div className="cd-footer">
                            <span className="cd-count">
                                {selectedOptions.length} sélection{selectedOptions.length > 1 ? "s" : ""}
                            </span>
                            <button className="cd-done" onClick={close}>
                                OK
                            </button>
                        </div>
                    ) : null}
                </div>,
                document.body
            )
            : null;

    const rootClassName =
        "cd-root " +
        (dense ? "cd-dense" : "") +
        (iconOnly ? " dlist-icon-only" : "") +
        (className ? ` ${className}` : "");

    return (
        <div ref={rootRef} className={rootClassName} style={rootStyle} data-open={open ? "1" : "0"}>
            {title && (
                <div className="cd-title">
                    {title}
                </div>
            )}
            <button ref={btnRef} type="button" className="cd-btn" onClick={toggleMenu} style={btnStyle}>
                <span className="cd-left">
                    {triggerIcon}
                    {!iconOnly ? <span className="cd-text">{triggerContent}</span> : null}
                </span>

                <span className="cd-right">
                    {clearable && hasValue ? (
                        <span className="cd-clear" title="Effacer" role="button" tabIndex={0} onClick={clearAll}>
                            <X />
                        </span>
                    ) : null}
                    <Chevron />
                </span>
            </button>

            {menu}
        </div>
    );
}

function isTupleList(options) {
    if (!Array.isArray(options) || options.length === 0) return false;
    const o = options[0];
    return Array.isArray(o) && o.length >= 2 && (typeof o[0] === "string" || typeof o[0] === "number");
}

function toggleTuple(options, pickedValue) {
    const arr = Array.isArray(options) ? options : [];
    const key = String(pickedValue);
    return arr.map((t) => {
        if (!Array.isArray(t) || t.length < 2) return t;
        const id = t[0];
        if (String(id) !== key) return t;
        const enabled = t[1] ? 0 : 1;
        return [id, enabled, ...t.slice(2)];
    });
}

function normalizeOptions(options) {
    const arr = Array.isArray(options) ? options : [];
    return arr.map((o) => {
        // tuple mode: [id, enabled, label?, iconSrc?]
        if (Array.isArray(o) && o.length >= 2 && (typeof o[0] === "string" || typeof o[0] === "number")) {
            const rawValue = o[0];
            const label = o[2] ?? String(rawValue);
            const iconSrc = typeof o[3] === "string" ? o[3] : null;
            const searchText = typeof label === "string" ? label : String(rawValue);
            return {
                value: rawValue,
                valueKey: String(rawValue),
                label,
                searchText,
                icon: null,
                iconSrc,
                disabled: false,
            };
        }

        if (typeof o === "string" || typeof o === "number") {
            const raw = o;
            return {
                value: raw,
                valueKey: String(raw),
                label: String(raw),
                searchText: String(raw),
                icon: null,
                iconSrc: null,
                disabled: false,
            };
        }

        const rawValue = o.value ?? o.id ?? o.key ?? "";
        const label = o.label ?? o.name ?? String(rawValue);
        const searchText =
            typeof o.searchText === "string"
                ? o.searchText
                : typeof label === "string"
                    ? label
                    : String(rawValue);

        return {
            value: rawValue,
            valueKey: String(rawValue),
            label,
            searchText,
            icon: o.icon ?? null,
            iconSrc: o.iconSrc ?? o.img ?? o.iconURL ?? null,
            disabled: !!o.disabled,
        };
    });
}

function renderIcon(iconOrSrc, className) {
    if (!iconOrSrc) return null;
    if (typeof iconOrSrc === "string") return <img className={className} src={iconOrSrc} alt="" />;
    return <span className="cd-icoWrap">{iconOrSrc}</span>;
}

function Chevron() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function X() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
function Check() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
