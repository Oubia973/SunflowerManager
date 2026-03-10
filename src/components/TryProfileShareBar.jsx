import React, { useEffect, useMemo, useRef, useState } from "react";
import DList from "../dlist.jsx";
import {
  buildTryProfilePayload,
  buildImpactedItemsPayload,
  buildTryProfileShareUrl,
  createShortTryProfileShareUrl,
  readTryProfiles,
  getTryProfilesUsageBytes,
  TRY_PROFILE_STORAGE_LIMIT_BYTES,
  saveTryProfile,
  deleteTryProfile,
  parseTryProfileFromTextAsync,
} from "../tryProfileShare";

const TRY_ACTIVE_PROFILE_ID_KEY = "SFLManTryActiveProfileId";
const TRY_SHARE_SCOPE_DEFAULT = ["nodes", "buy", "collectibles", "wearables", "craft", "buds", "skills", "shrines"];
const SHARE_SCOPE_ALLOWED = new Set(["nodes", "buy", "collectibles", "wearables", "craft", "buds", "skills", "shrines"]);
const normalizeShareScope = (raw) => {
  const arr = Array.isArray(raw) ? raw : [];
  const migrated = arr.map((v) => {
    const key = String(v || "");
    if (key === "nft") return "collectibles";
    if (key === "wearable") return "wearables";
    return key;
  });
  const out = migrated.filter((v) => SHARE_SCOPE_ALLOWED.has(v));
  return out.length > 0 ? out : [...TRY_SHARE_SCOPE_DEFAULT];
};

function showImportChoiceDialog(currentName) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.55)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "99999";

    const box = document.createElement("div");
    box.style.width = "min(430px, 92vw)";
    box.style.background = "#151515";
    box.style.border = "1px solid rgba(255,255,255,0.25)";
    box.style.borderRadius = "8px";
    box.style.padding = "12px";
    box.style.color = "#fff";

    const title = document.createElement("div");
    title.textContent = "Import Profile";
    title.style.fontWeight = "700";
    title.style.marginBottom = "8px";

    const txt = document.createElement("div");
    txt.textContent = `A profile is selected: "${String(currentName || "")}".`;
    txt.style.marginBottom = "10px";

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.justifyContent = "flex-end";
    actions.style.gap = "8px";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "graph-mode-btn";

    const newBtn = document.createElement("button");
    newBtn.textContent = "Create New";
    newBtn.className = "graph-mode-btn";

    const overwriteBtn = document.createElement("button");
    overwriteBtn.textContent = "Overwrite Current";
    overwriteBtn.className = "graph-mode-btn is-active";

    actions.appendChild(cancelBtn);
    actions.appendChild(newBtn);
    actions.appendChild(overwriteBtn);
    box.appendChild(title);
    box.appendChild(txt);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const cleanup = (value) => {
      document.removeEventListener("keydown", onKeyDown);
      overlay.remove();
      resolve(value);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") cleanup(null);
    };
    document.addEventListener("keydown", onKeyDown);
    cancelBtn.addEventListener("click", () => cleanup(null));
    newBtn.addEventListener("click", () => cleanup("new"));
    overwriteBtn.addEventListener("click", () => cleanup("overwrite"));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cleanup(null);
    });
  });
}

function showProfileNameDialog(defaultName) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.55)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "99999";

    const box = document.createElement("div");
    box.style.width = "min(430px, 92vw)";
    box.style.background = "#151515";
    box.style.border = "1px solid rgba(255,255,255,0.25)";
    box.style.borderRadius = "8px";
    box.style.padding = "12px";
    box.style.color = "#fff";

    const title = document.createElement("div");
    title.textContent = "New Profile Name";
    title.style.fontWeight = "700";
    title.style.marginBottom = "8px";

    const input = document.createElement("input");
    input.type = "text";
    input.value = String(defaultName || "");
    input.placeholder = "Profile name";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    input.style.padding = "7px 8px";
    input.style.marginBottom = "10px";
    input.style.background = "#0f0f0f";
    input.style.color = "#fff";
    input.style.border = "1px solid rgba(255,255,255,0.22)";
    input.style.borderRadius = "6px";

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.justifyContent = "flex-end";
    actions.style.gap = "8px";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "graph-mode-btn";
    const okBtn = document.createElement("button");
    okBtn.textContent = "Confirm";
    okBtn.className = "graph-mode-btn is-active";

    actions.appendChild(cancelBtn);
    actions.appendChild(okBtn);
    box.appendChild(title);
    box.appendChild(input);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const cleanup = (value) => {
      document.removeEventListener("keydown", onKeyDown);
      overlay.remove();
      resolve(value);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") cleanup(null);
      if (e.key === "Enter") cleanup(String(input.value || "").trim());
    };
    document.addEventListener("keydown", onKeyDown);
    cancelBtn.addEventListener("click", () => cleanup(null));
    okBtn.addEventListener("click", () => cleanup(String(input.value || "").trim()));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cleanup(null);
    });
    input.focus();
    input.select();
  });
}

function showDeleteProfileDialog(profileName) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.55)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "99999";

    const box = document.createElement("div");
    box.style.width = "min(430px, 92vw)";
    box.style.background = "#151515";
    box.style.border = "1px solid rgba(255,255,255,0.25)";
    box.style.borderRadius = "8px";
    box.style.padding = "12px";
    box.style.color = "#fff";

    const title = document.createElement("div");
    title.textContent = "Delete Profile";
    title.style.fontWeight = "700";
    title.style.marginBottom = "8px";

    const txt = document.createElement("div");
    txt.textContent = `Delete profile "${String(profileName || "")}"?`;
    txt.style.marginBottom = "10px";

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.justifyContent = "flex-end";
    actions.style.gap = "8px";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "graph-mode-btn";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "graph-mode-btn is-active";

    actions.appendChild(cancelBtn);
    actions.appendChild(deleteBtn);
    box.appendChild(title);
    box.appendChild(txt);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const cleanup = (value) => {
      document.removeEventListener("keydown", onKeyDown);
      overlay.remove();
      resolve(value);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") cleanup(false);
      if (e.key === "Enter") cleanup(true);
    };
    document.addEventListener("keydown", onKeyDown);
    cancelBtn.addEventListener("click", () => cleanup(false));
    deleteBtn.addEventListener("click", () => cleanup(true));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cleanup(false);
    });
  });
}

function TryProfileShareBar({
  boostables,
  itablesIt,
  onApplyProfile,
  onShowSummary,
  onBuildFullProfilePayload,
  onBuildComputedSharePayload,
  showProfilesPanel = true,
  showSharePanel = true,
  showSummaryPanel = true,
  shareScopeValue = [],
  onShareScopeChange,
}) {
  const [shareScope, setShareScope] = useState(TRY_SHARE_SCOPE_DEFAULT);
  const [shareFeedback, setShareFeedback] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [profileName, setProfileName] = useState("");
  const [importText, setImportText] = useState("");
  const [summaryCompareMode, setSummaryCompareMode] = useState("active");
  const [profilesUsageBytes, setProfilesUsageBytes] = useState(0);
  const [copyOnCooldown, setCopyOnCooldown] = useState(false);
  const copyCooldownTimerRef = useRef(null);

  useEffect(() => {
    const loaded = readTryProfiles();
    setProfiles(loaded);
    setProfilesUsageBytes(getTryProfilesUsageBytes());
    let storedId = "";
    try {
      storedId = String(localStorage.getItem(TRY_ACTIVE_PROFILE_ID_KEY) || "");
    } catch {
      storedId = "";
    }
    const hasStored = storedId && loaded.some((p) => String(p?.id || "") === storedId);
    if (hasStored) {
      setSelectedProfileId(storedId);
    } else if (loaded.length > 0) {
      setSelectedProfileId(String(loaded[0].id || ""));
    }
  }, []);
  useEffect(() => {
    setShareScope(normalizeShareScope(shareScopeValue));
  }, [shareScopeValue]);
  useEffect(() => {
    return () => {
      if (copyCooldownTimerRef.current) {
        clearTimeout(copyCooldownTimerRef.current);
      }
    };
  }, []);
  useEffect(() => {
    try {
      if (selectedProfileId) {
        localStorage.setItem(TRY_ACTIVE_PROFILE_ID_KEY, String(selectedProfileId));
      } else {
        localStorage.removeItem(TRY_ACTIVE_PROFILE_ID_KEY);
      }
    } catch {}
  }, [selectedProfileId]);
  const selectedProfile = useMemo(
    () => profiles.find((p) => String(p?.id || "") === String(selectedProfileId || "")) || null,
    [profiles, selectedProfileId]
  );
  const profileOptions = useMemo(
    () => (
      profiles.length > 0
        ? profiles.map((p) => ({ value: String(p.id || ""), label: String(p.name || "") }))
        : [{ value: "", label: "Profiles" }]
    ),
    [profiles]
  );
  const summaryModeOptions = useMemo(
    () => [
      { value: "active", label: "Vs active" },
      { value: "zero", label: "Vs zero" },
    ],
    []
  );
  const shareScopeOptions = useMemo(
    () => [
      { value: "nodes", label: "Nodes" },
      { value: "buy", label: "Buy" },
      { value: "collectibles", label: "Collectibles" },
      { value: "wearables", label: "Wearables" },
      { value: "craft", label: "Craft" },
      { value: "buds", label: "Buds" },
      { value: "skills", label: "Skills" },
      { value: "shrines", label: "Shrines" },
    ],
    []
  );
  const shareIncludeNodes = Array.isArray(shareScope) && shareScope.includes("nodes");
  const shareIncludeBuy = Array.isArray(shareScope) && shareScope.includes("buy");
  const shareParts = (Array.isArray(shareScope) ? shareScope : []).filter(
    (v) => v === "collectibles" || v === "wearables" || v === "craft" || v === "buds" || v === "skills" || v === "shrines"
  );
  useEffect(() => {
    if (selectedProfile?.name) {
      setProfileName(String(selectedProfile.name));
    }
  }, [selectedProfile]);

  const copyShareLink = async () => {
    if (copyOnCooldown) return;
    setCopyOnCooldown(true);
    if (copyCooldownTimerRef.current) {
      clearTimeout(copyCooldownTimerRef.current);
    }
    copyCooldownTimerRef.current = setTimeout(() => {
      setCopyOnCooldown(false);
      copyCooldownTimerRef.current = null;
    }, 6000);
    try {
      const payload = buildTryProfilePayload(
        boostables || {},
        shareParts,
        shareIncludeNodes,
        itablesIt || {},
        shareIncludeBuy
      );
      if ((shareIncludeNodes || shareIncludeBuy) && typeof onBuildFullProfilePayload === "function") {
        const built = onBuildFullProfilePayload() || {};
        if (built?.fullProfile) payload.fullProfile = built.fullProfile;
      } else {
        delete payload.fullProfile;
      }
      payload.impacts = buildImpactedItemsPayload(itablesIt || {}, payload?.summaryImpactCats || []);
      let finalPayload = payload;
      if (typeof onBuildComputedSharePayload === "function") {
        try {
          const computed = await onBuildComputedSharePayload(payload, "active");
          if (computed && typeof computed === "object") finalPayload = computed;
        } catch (error) {
          console.log("build computed share payload error", error);
        }
      }
      const selectedCount = Object.keys(payload?.tables || {}).length;
      if (selectedCount < 1 && !shareIncludeNodes && !shareIncludeBuy) {
        setShareFeedback("No active boost in selection");
        return;
      }
      const shortUrl = await createShortTryProfileShareUrl(finalPayload);
      const shareUrl = shortUrl || buildTryProfileShareUrl(finalPayload);
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const txt = document.createElement("textarea");
        txt.value = shareUrl;
        document.body.appendChild(txt);
        txt.select();
        document.execCommand("copy");
        document.body.removeChild(txt);
      }
      setShareFeedback("Link copied");
      setTimeout(() => setShareFeedback(""), 2000);
    } catch (error) {
      console.log("copy share link error", error);
      setShareFeedback("Copy failed");
    }
  };
  const saveProfile = () => {
    const payload = (typeof onBuildFullProfilePayload === "function")
      ? (onBuildFullProfilePayload() || {})
      : buildTryProfilePayload(boostables || {}, ["collectibles", "wearables", "craft", "buds", "skills", "shrines"], true, itablesIt || {});
    const fallbackShare = buildTryProfilePayload(boostables || {}, ["collectibles", "wearables", "craft", "buds", "skills", "shrines"], true, itablesIt || {});
    payload.v = payload.v || 1;
    payload.mode = payload.mode || fallbackShare.mode;
    payload.parts = payload.parts || fallbackShare.parts;
    payload.tables = payload.tables || fallbackShare.tables;
    payload.impacts = buildImpactedItemsPayload(itablesIt || {}, payload?.summaryImpactCats || []);
    const result = saveTryProfile(profileName, payload);
    if (!result?.ok) {
      setShareFeedback(result?.error || "Save failed");
      return;
    }
    const nextProfiles = Array.isArray(result?.profiles) ? result.profiles : readTryProfiles();
    setProfiles(nextProfiles);
    setProfilesUsageBytes(getTryProfilesUsageBytes());
    const newId = String(result?.profile?.id || "");
    if (newId) setSelectedProfileId(newId);
    setProfileName(String(result?.profile?.name || profileName || ""));
    setShareFeedback(result?.action === "updated" ? "Profile updated" : "Profile saved");
    setTimeout(() => setShareFeedback(""), 2000);
  };
  const loadProfile = () => {
    if (!selectedProfile || typeof onApplyProfile !== "function") {
      setShareFeedback("Select a profile");
      return;
    }
    onApplyProfile(selectedProfile.payload || {});
    setProfileName(String(selectedProfile?.name || ""));
    setShareFeedback("Profile loaded");
    setTimeout(() => setShareFeedback(""), 2000);
  };
  const removeProfile = async () => {
    if (!selectedProfile) {
      setShareFeedback("Select a profile");
      return;
    }
    const okDelete = await showDeleteProfileDialog(String(selectedProfile?.name || ""));
    if (!okDelete) {
      setShareFeedback("Delete cancelled");
      setTimeout(() => setShareFeedback(""), 2000);
      return;
    }
    const result = deleteTryProfile(selectedProfile.id);
    if (!result?.ok) {
      setShareFeedback(result?.error || "Delete failed");
      return;
    }
    const nextProfiles = Array.isArray(result?.profiles) ? result.profiles : [];
    setProfiles(nextProfiles);
    setProfilesUsageBytes(getTryProfilesUsageBytes());
    setSelectedProfileId(nextProfiles[0]?.id || "");
    setShareFeedback("Profile deleted");
    setTimeout(() => setShareFeedback(""), 2000);
  };
  const importProfile = async () => {
    const parsed = await parseTryProfileFromTextAsync(importText);
    if (!parsed) {
      setShareFeedback("Invalid link");
      return;
    }
    const defaultName = `Import ${new Date().toLocaleString()}`;
    const hasSelected = !!selectedProfile;
    let name = String(profileName || "").trim() || defaultName;
    if (hasSelected) {
      const action = await showImportChoiceDialog(String(selectedProfile?.name || ""));
      if (action === "overwrite") {
        name = String(selectedProfile?.name || "").trim() || name;
      } else if (action === "new") {
        const askedName = await showProfileNameDialog(defaultName);
        if (!askedName) {
          setShareFeedback("Import cancelled");
          return;
        }
        const existingNames = new Set((profiles || []).map((p) => String(p?.name || "").toLowerCase()));
        if (!existingNames.has(askedName.toLowerCase())) {
          name = askedName;
        } else {
          let suffix = 2;
          let next = `${askedName} (${suffix})`;
          while (existingNames.has(next.toLowerCase())) {
            suffix += 1;
            next = `${askedName} (${suffix})`;
          }
          name = next;
        }
      } else {
        setShareFeedback("Import cancelled");
        return;
      }
    }
    const result = saveTryProfile(name, parsed);
    if (!result?.ok) {
      setShareFeedback(result?.error || "Import failed");
      return;
    }
    const nextProfiles = Array.isArray(result?.profiles) ? result.profiles : readTryProfiles();
    setProfiles(nextProfiles);
    setProfilesUsageBytes(getTryProfilesUsageBytes());
    const newId = String(result?.profile?.id || "");
    if (newId) setSelectedProfileId(newId);
    setProfileName(String(result?.profile?.name || ""));
    setShareFeedback("Profile imported");
    setTimeout(() => setShareFeedback(""), 2000);
  };
  const showSummary = async () => {
    if (typeof onShowSummary !== "function") return;
    try {
      const scoped = buildTryProfilePayload(
        boostables || {},
        shareParts,
        shareIncludeNodes,
        itablesIt || {},
        shareIncludeBuy
      );
      const payload = {
        ...(selectedProfile?.payload ? { ...selectedProfile.payload } : {}),
        ...scoped,
      };
      if (shareIncludeNodes || shareIncludeBuy) {
        if (selectedProfile?.payload?.fullProfile) {
          payload.fullProfile = selectedProfile.payload.fullProfile;
        } else if (typeof onBuildFullProfilePayload === "function") {
          const built = onBuildFullProfilePayload() || {};
          if (built?.fullProfile) payload.fullProfile = built.fullProfile;
        }
      } else {
        delete payload.fullProfile;
      }
      payload.profileName = String(selectedProfile?.name || profileName || "").trim();
      await onShowSummary(payload, summaryCompareMode);
    } catch {
      setShareFeedback("Summary failed");
      setTimeout(() => setShareFeedback(""), 2000);
    }
  };
  const frameStyle = {
    display: "flex",
    alignItems: "center",
    gap: 4,
    flexWrap: "nowrap",
    padding: "3px 5px",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 6,
    background: "rgba(255,255,255,0.03)",
    whiteSpace: "nowrap",
  };
  const smallBtnStyle = {
    width: 24,
    height: 24,
    minWidth: 24,
    padding: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const iconStyle = { width: 16, height: 16 };
  const overLimit = profilesUsageBytes >= TRY_PROFILE_STORAGE_LIMIT_BYTES;
  const usagePct = Math.min(100, (profilesUsageBytes / TRY_PROFILE_STORAGE_LIMIT_BYTES) * 100);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {showProfilesPanel ? (
      <div style={frameStyle}>
        <input
          type="text"
          value={profileName}
          onChange={(e) => setProfileName(String(e.target.value || ""))}
          placeholder="Profile name"
          style={{ width: 60, height: 18 }}
        />
        <button class="button" style={smallBtnStyle} onClick={saveProfile} title="Save profile">
          <img src="./icon/ui/save.webp" alt="Save" style={iconStyle} />
        </button>
        {overLimit ? (
          <img
            src="./icon/ui/expression_alerted.png"
            alt="Storage warning"
            title={`Profiles storage limit reached: ${(profilesUsageBytes / (1024 * 1024)).toFixed(2)}MB / 2.00MB`}
            style={{ width: 16, height: 16 }}
          />
        ) : (
          <span
            title={`Profiles storage: ${(profilesUsageBytes / (1024 * 1024)).toFixed(2)}MB / 2.00MB`}
            style={{ fontSize: 10, opacity: 0.75, minWidth: 16, textAlign: "right" }}
          >
            {usagePct.toFixed(0)}%
          </span>
        )}
        <DList
          name="selectedProfileId"
          options={profileOptions}
          value={selectedProfileId}
          onChange={(e) => setSelectedProfileId(String(e?.target?.value || ""))}
          height={22}
          width={112}
        />
        <button class="button" style={smallBtnStyle} onClick={loadProfile} title="Load profile">
          <img src="./icon/ui/confirm.png" alt="Load" style={iconStyle} />
        </button>
        <button class="button" style={smallBtnStyle} onClick={removeProfile} title="Delete profile">
          <img src="./icon/ui/cancel.png" alt="Delete" style={iconStyle} />
        </button>
      </div>
      ) : null}
      {showSummaryPanel ? (
      <div style={frameStyle}>
        <DList
          name="summaryCompareMode"
          options={summaryModeOptions}
          value={summaryCompareMode}
          onChange={(e) => setSummaryCompareMode(String(e?.target?.value || "active"))}
          height={22}
        />
        <button class="button" style={smallBtnStyle} onClick={showSummary} title="Show summary">
          <img src="./icon/ui/search.png" alt="Summary" style={iconStyle} />
        </button>
      </div>
      ) : null}
      {showSharePanel ? (
      <div style={frameStyle}>
        <DList
          name="shareScope"
          options={shareScopeOptions}
          value={shareScope}
          onChange={(e) => {
          const next = Array.isArray(e?.target?.value) ? e.target.value : [];
          const filtered = normalizeShareScope(next);
          setShareScope(filtered);
          if (typeof onShareScopeChange === "function") {
            onShareScopeChange({ target: { name: "tryProfileShareScope", value: filtered } });
            }
          }}
          multiple
          closeOnSelect={false}
          listIcon="./icon/ui/list.webp"
          iconOnly
          height={22}
        />
        <button
          class="button"
          style={{ ...smallBtnStyle, opacity: copyOnCooldown ? 0.55 : 1, pointerEvents: copyOnCooldown ? "none" : "auto" }}
          onClick={copyShareLink}
          disabled={copyOnCooldown}
          title="Copy profile link"
        >
          <img src="./icon/ui/copy.webp" alt="Copy" style={iconStyle} />
        </button>
        <input
          type="text"
          value={importText}
          onChange={(e) => setImportText(String(e.target.value || ""))}
          placeholder="Paste link"
          style={{ width: 60, height: 18 }}
        />
        <button class="button" style={smallBtnStyle} onClick={importProfile} title="Import link as profile">
          <img src="./icon/ui/import.webp" alt="Import" style={iconStyle} />
        </button>
      </div>
      ) : null}
      {shareFeedback ? <span style={{ fontSize: 11, color: "#cdeab8", alignSelf: "center" }}>{shareFeedback}</span> : null}
    </div>
  );
}

export default TryProfileShareBar;
