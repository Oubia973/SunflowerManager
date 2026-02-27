import React, { useEffect, useMemo, useRef, useState } from "react";
import DList from "../dlist.jsx";
import { useAppCtx } from "../context/AppCtx";
import { frmtNb } from "../fct.js";

const BASE_COLUMNS = ["rank", "id", "lvl"];

export default function TopListsLazyTable() {
  const {
    data: { dataSetFarm },
    ui: { selectedInv },
    config: { API_URL },
  } = useAppCtx();
  const username = dataSetFarm?.username || "unknown";
  const currentUsername = String(username ?? "").trim().toLowerCase();

  const [categories, setCategories] = useState([]);
  const [categoryItems, setCategoryItems] = useState({});
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingCategoryMap, setLoadingCategoryMap] = useState({});

  const [selectedNames, setSelectedNames] = useState([]);
  const [activeNames, setActiveNames] = useState([]);
  const [searchCooldown, setSearchCooldown] = useState(false);

  const [toplistItems, setToplistItems] = useState({});
  const [loadingToplists, setLoadingToplists] = useState(false);
  const [sortRules, setSortRules] = useState([]);
  const [toolbarHeight, setToolbarHeight] = useState(34);
  const toolbarRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function loadCategories() {
      if (selectedInv !== "toplists") return;
      if (categories.length > 0) return;
      setLoadingCategories(true);
      try {
        const response = await fetch(API_URL + "/getcatalogcategories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        if (!response.ok) {
          if (!cancelled) setCategories([]);
          return;
        }
        const data = await response.json();
        if (!cancelled) {
          const next = Array.isArray(data?.categories) ? data.categories : [];
          setCategories(next);
        }
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    }
    loadCategories();
    return () => {
      cancelled = true;
    };
  }, [selectedInv, categories.length, API_URL]);

  async function loadCategoryItems(category) {
    if (!category || categoryItems[category]) return;
    setLoadingCategoryMap((prev) => ({ ...prev, [category]: true }));
    try {
      const response = await fetch(API_URL + "/getcatalogcategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, username }),
      });
      if (!response.ok) return;
      const data = await response.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      setCategoryItems((prev) => ({ ...prev, [category]: items }));
    } catch {
      // no-op
    } finally {
      setLoadingCategoryMap((prev) => ({ ...prev, [category]: false }));
    }
  }

  const labelByKey = useMemo(() => {
    const map = new Map();
    Object.keys(categoryItems).forEach((cat) => {
      const list = Array.isArray(categoryItems[cat]) ? categoryItems[cat] : [];
      list.forEach((it) => {
        const key = String(it?.key || "");
        if (!key) return;
        map.set(key, String(it?.label || key));
      });
    });
    return map;
  }, [categoryItems]);

  const topOptions = useMemo(() => {
    const out = [];
    categories.forEach((catObj) => {
      const category = String(catObj?.category || "");
      if (!category) return;
      const isExpanded = expandedCategories.includes(category);
      const isLoading = !!loadingCategoryMap[category];
      const prefix = isExpanded ? "[-]" : "[+]";
      const suffix = isLoading ? " (loading...)" : ` (${Number(catObj?.count || 0)})`;
      out.push({ value: `cat::${category}`, label: `${prefix} ${category}${suffix}` });
      if (!isExpanded) return;
      const list = Array.isArray(categoryItems[category]) ? categoryItems[category] : [];
      list.forEach((it) => {
        const key = String(it?.key || "");
        if (!key) return;
        out.push({ value: `item::${key}`, label: `  - ${String(it?.label || key)}` });
      });
    });
    return out;
  }, [categories, expandedCategories, loadingCategoryMap, categoryItems]);

  const dlistValue = useMemo(() => selectedNames.map((name) => `item::${name}`), [selectedNames]);

  async function handleSelectorChange(values) {
    const arr = Array.isArray(values) ? values.map(String) : [];
    const clickedCategories = arr
      .filter((v) => v.startsWith("cat::"))
      .map((v) => v.slice(5))
      .filter(Boolean);
    const uniqueClickedCategories = [...new Set(clickedCategories)];
    const nextExpanded = new Set(expandedCategories);
    const categoriesToLoad = [];

    for (const category of uniqueClickedCategories) {
      if (nextExpanded.has(category)) {
        nextExpanded.delete(category);
      } else {
        nextExpanded.add(category);
        if (!categoryItems[category]) categoriesToLoad.push(category);
      }
    }

    setExpandedCategories(Array.from(nextExpanded));
    for (const category of categoriesToLoad) {
      await loadCategoryItems(category);
    }

    const nextSelected = arr
      .filter((v) => v.startsWith("item::"))
      .map((v) => v.slice(6))
      .filter(Boolean);
    setSelectedNames(nextSelected);
  }

  const activeTopNames = useMemo(() => {
    const set = new Set(selectedNames);
    return (activeNames || []).filter((name) => set.has(name));
  }, [activeNames, selectedNames]);

  useEffect(() => {
    let cancelled = false;
    async function loadToplists() {
      if (selectedInv !== "toplists") return;
      const items = (activeNames || []).filter(Boolean);
      if (!items.length) {
        if (!cancelled) setToplistItems({});
        return;
      }
      setLoadingToplists(true);
      try {
        const response = await fetch(API_URL + "/gettoplistsitems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, username }),
        });
        if (!response.ok) {
          if (!cancelled) setToplistItems({});
          return;
        }
        const data = await response.json();
        if (!cancelled) {
          const next = data?.toplistItems;
          setToplistItems(next && typeof next === "object" ? next : {});
        }
      } catch {
        if (!cancelled) setToplistItems({});
      } finally {
        if (!cancelled) setLoadingToplists(false);
      }
    }
    loadToplists();
    return () => {
      cancelled = true;
    };
  }, [selectedInv, activeNames, API_URL, username]);

  const rows = useMemo(() => {
    const rowById = new Map();
    const orderedIds = [];
    const primaryTop = activeTopNames[0];

    activeTopNames.forEach((topName) => {
      const list = Array.isArray(toplistItems?.[topName]) ? toplistItems[topName] : [];
      list.forEach((entry, idx) => {
        if (!entry || typeof entry !== "object") return;
        const entryId = entry.id != null ? String(entry.id).trim() : "";
        if (!entryId) return;
        const key = entryId.toLowerCase();
        const entryLvl = Number(entry.lvl);

        if (!rowById.has(key)) {
          const base = { rank: "", id: entryId, lvl: "" };
          activeTopNames.forEach((name) => {
            base[name] = "";
          });
          rowById.set(key, base);
          orderedIds.push(key);
        }

        const row = rowById.get(key);
        row[topName] = entry.score ?? "";
        if (Number.isFinite(entryLvl) && entryLvl > Number(row.lvl || 0)) {
          row.lvl = entryLvl;
        }
        if (topName === primaryTop) {
          row.rank = idx + 1;
        }
      });
    });

    return orderedIds.map((key) => rowById.get(key));
  }, [activeTopNames, toplistItems]);

  const columns = useMemo(() => {
    return [
      ...BASE_COLUMNS.map((key) => ({
        key,
        label: key === "id" ? "ID" : key === "lvl" ? "LVL" : "rank",
      })),
      ...activeTopNames.map((topName) => ({ key: topName, label: labelByKey.get(topName) || topName })),
    ];
  }, [activeTopNames, labelByKey]);

  const stickyWidths = useMemo(() => {
    const rankLen = rows.reduce((max, row) => Math.max(max, String(row?.rank ?? "").length), String("rank").length);
    const idLen = rows.reduce((max, row) => Math.max(max, String(row?.id ?? "").length), String("ID").length);
    const lvlLen = rows.reduce((max, row) => Math.max(max, String(row?.lvl ?? "").length), String("LVL").length);

    return {
      rankCh: rankLen,
      idCh: idLen,
      lvlCh: lvlLen,
    };
  }, [rows]);

  const sortedRows = useMemo(() => {
    if (!rows.length || !sortRules.length) return rows;
    const arr = [...rows];
    arr.sort((a, b) => {
      for (const rule of sortRules) {
        const av = a?.[rule.key];
        const bv = b?.[rule.key];
        const cmp = compareValue(av, bv);
        if (cmp !== 0) return rule.dir === "desc" ? -cmp : cmp;
      }
      return 0;
    });
    return arr;
  }, [rows, sortRules]);

  function toggleSort(column) {
    setSortRules((prev) => {
      const current = Array.isArray(prev) ? [...prev] : [];
      const idx = current.findIndex((r) => r.key === column);
      if (idx < 0) return [...current, { key: column, dir: "asc" }];
      if (current[idx].dir === "asc") {
        current[idx] = { ...current[idx], dir: "desc" };
        return current;
      }
      return current.filter((r) => r.key !== column);
    });
  }

  function removeColumn(columnKey) {
    if (BASE_COLUMNS.includes(columnKey)) return;
    setSelectedNames((prev) => (prev || []).filter((name) => name !== columnKey));
    setActiveNames((prev) => (prev || []).filter((name) => name !== columnKey));
    setSortRules((prev) => (prev || []).filter((rule) => rule.key !== columnKey));
  }

  function sortTag(column) {
    const idx = sortRules.findIndex((r) => r.key === column);
    if (idx < 0) return "";
    const dir = sortRules[idx].dir === "desc" ? "v" : "^";
    return `${dir}${idx + 1}`;
  }

  const anyLoadingCategory = Object.values(loadingCategoryMap).some(Boolean);

  useEffect(() => {
    const node = toolbarRef.current;
    if (!node) return;

    const refreshHeight = () => {
      const next = Math.ceil(node.getBoundingClientRect().height || 34);
      setToolbarHeight(next);
    };

    refreshHeight();
    if (typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(() => refreshHeight());
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (selectedInv !== "toplists") return null;

  return (
        <div
      className="toplists-wrap"
      style={{
        "--toplists-toolbar-h": `${toolbarHeight}px`,
        "--toplists-rank-w": `${stickyWidths.rankCh}ch`,
        "--toplists-id-w": `${stickyWidths.idCh}ch`,
        "--toplists-lvl-w": `${stickyWidths.lvlCh}ch`,
      }}
    >
      <div className="toplists-toolbar-row">
        <div ref={toolbarRef} className="toplists-toolbar">
          <DList
            options={topOptions}
            value={dlistValue}
            multiple={true}
            searchable={true}
            closeOnSelect={false}
            emitEvent={false}
            onChange={handleSelectorChange}
            placeholder="Choose category/items"
            menuMinWidth={360}
            height={30}
          />
          <button
            type="button"
            className="button toplists-refresh"
            onClick={() => {
              if (searchCooldown) return;
              setActiveNames([...(selectedNames || [])]);
              setSearchCooldown(true);
              setTimeout(() => setSearchCooldown(false), 6000);
            }}
            title="Refresh lists"
            disabled={searchCooldown}
          >
            <img src="./icon/ui/search.png" alt="" className="itico" />
          </button>
          <button
            type="button"
            className="button toplists-refresh toplists-action-btn"
            onClick={() => {
              setSelectedNames([]);
              setActiveNames([]);
              setToplistItems({});
              setSortRules([]);
            }}
            title="Clear selection"
          >
            Clear
          </button>
          {(loadingCategories || anyLoadingCategory || loadingToplists) ? (
            <img src="./icon/ui/syncing.gif" alt="" className="itico" title="Loading" />
          ) : null}
        </div>
      </div>
      {!categories.length ? (
        <div>No categories available.</div>
      ) : loadingToplists ? (
        <div>Loading...</div>
      ) : (
        <table className="table toplists-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`thcenter toplists-sortable${!BASE_COLUMNS.includes(column.key) ? " toplists-has-remove" : ""}`}
                  onClick={() => toggleSort(column.key)}
                  title="Click to sort"
                >
                  <span className="toplists-col-label">{column.label}</span>
                  {!BASE_COLUMNS.includes(column.key) ? (
                    <button
                      type="button"
                      className="toplists-col-remove"
                      title="Remove column"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeColumn(column.key);
                      }}
                    >
                      x
                    </button>
                  ) : null}
                  <span className="toplists-sort-indicator">{sortTag(column.key)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, i) => (
              <tr key={`${row.rank || i}-${row.id || i}`}>
                {columns.map((column) => (
                  <td
                    key={`${column.key}-${i}`}
                    className={`tdcenter${
                      column.key === "id" &&
                      currentUsername &&
                      String(row?.id ?? "").trim().toLowerCase() === currentUsername
                        ? " toplists-current-farm-id"
                        : ""
                    }`}
                  >
                    {formatCell(row?.[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function compareValue(a, b) {
  if (a === b) return 0;
  const an = Number(a);
  const bn = Number(b);
  const aNum = Number.isFinite(an);
  const bNum = Number.isFinite(bn);
  if (aNum && bNum) return an - bn;
  const as = String(a ?? "").toLowerCase();
  const bs = String(b ?? "").toLowerCase();
  if (as < bs) return -1;
  if (as > bs) return 1;
  return 0;
}

function formatCell(value) {
  const n = Number(value);
  if (Number.isFinite(n) && String(value).trim() !== "") {
    return frmtNb(n);
  }
  return String(value ?? "");
}





