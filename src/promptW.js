export function promptPass() {
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
    box.style.width = "min(380px, 92vw)";
    box.style.background = "#151515";
    box.style.border = "1px solid rgba(255,255,255,0.25)";
    box.style.borderRadius = "8px";
    box.style.padding = "12px";
    box.style.color = "#fff";

    const title = document.createElement("div");
    title.textContent = "Password";
    title.style.fontWeight = "700";
    title.style.marginBottom = "8px";

    const input = document.createElement("input");
    input.type = "password";
    input.autocomplete = "current-password";
    input.placeholder = "Password";
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
    okBtn.textContent = "Valid";
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
      if (e.key === "Enter") cleanup(input.value);
    };

    document.addEventListener("keydown", onKeyDown);
    cancelBtn.addEventListener("click", () => cleanup(null));
    okBtn.addEventListener("click", () => cleanup(input.value));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cleanup(null);
    });
    input.focus();
  });
}

function copyToClipboardText(value) {
  const text = String(value || "");
  if (!text) return Promise.resolve(false);
  if (navigator?.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
  }
  return fallbackCopy(text);
}

function fallbackCopy(text) {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    textarea.remove();
    return Promise.resolve(success);
  } catch {
    return Promise.resolve(false);
  }
}

function appendPromptMessageContent(container, message) {
  const messageText = String(message || "");
  const lines = messageText.split("\n");
  const tokenRegex = /(https?:\/\/[^\s]+)/g;

  lines.forEach((line, lineIndex) => {
    if (line.startsWith("addresscopy:")) {
      const valueToCopy = line.slice("addresscopy:".length).trim();
      const rowEl = document.createElement("div");
      rowEl.style.display = "inline-flex";
      rowEl.style.alignItems = "center";
      rowEl.style.gap = "8px";
      rowEl.style.wordBreak = "break-all";

      const valueEl = document.createElement("span");
      valueEl.textContent = valueToCopy;
      rowEl.appendChild(valueEl);

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "button small-btn";
      copyBtn.title = "Copy address";
      copyBtn.style.flex = "0 0 auto";

      const copyImg = document.createElement("img");
      copyImg.src = "./icon/ui/copy.webp";
      copyImg.alt = "Copy";
      copyImg.className = "itico";
      copyBtn.appendChild(copyImg);

      const statusEl = document.createElement("span");
      statusEl.style.fontSize = "12px";
      statusEl.style.color = "rgba(255,255,255,0.75)";
      statusEl.style.minWidth = "72px";

      copyBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        const copied = await copyToClipboardText(valueToCopy);
        copyBtn.title = copied ? "Address copied" : "Copy failed";
        statusEl.textContent = copied ? "Copied" : "Copy failed";
        setTimeout(() => {
          copyBtn.title = "Copy address";
          statusEl.textContent = "";
        }, 1500);
      });

      rowEl.appendChild(copyBtn);
      rowEl.appendChild(statusEl);
      if (lineIndex < lines.length - 1) {
        rowEl.style.marginBottom = "4px";
      }
      container.appendChild(rowEl);
      return;
    }

    const lineEl = document.createElement("div");
    lineEl.style.wordBreak = "break-word";
    let lastIndex = 0;
    let matched = false;

    line.replace(tokenRegex, (token, offset) => {
      matched = true;
      if (offset > lastIndex) {
        lineEl.appendChild(document.createTextNode(line.slice(lastIndex, offset)));
      }
      const linkEl = document.createElement("a");
      linkEl.href = token;
      linkEl.textContent = token;
      linkEl.target = "_blank";
      linkEl.rel = "noreferrer noopener";
      linkEl.style.color = "#7db7ff";
      linkEl.style.textDecoration = "underline";
      lineEl.appendChild(linkEl);
      lastIndex = offset + token.length;
      return token;
    });

    if (lastIndex < line.length) {
      lineEl.appendChild(document.createTextNode(line.slice(lastIndex)));
    }
    if (!matched && line.length === 0) {
      lineEl.innerHTML = "&nbsp;";
    }
    if (lineIndex < lines.length - 1) {
      lineEl.style.marginBottom = "4px";
    }
    container.appendChild(lineEl);
  });
}

export function promptInput(
  message,
  title = "Input",
  placeholder = "",
  defaultValue = "",
  confirmLabel = "OK",
  cancelLabel = "Cancel"
) {
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
    box.style.width = "auto";
    box.style.maxWidth = "75vw";
    box.style.minWidth = "320px";
    box.style.background = "#151515";
    box.style.border = "1px solid rgba(255,255,255,0.25)";
    box.style.borderRadius = "8px";
    box.style.padding = "12px";
    box.style.color = "#fff";

    const titleEl = document.createElement("div");
    titleEl.textContent = String(title || "Input");
    titleEl.style.fontWeight = "700";
    titleEl.style.marginBottom = "8px";

    const messageEl = document.createElement("div");
    messageEl.textContent = String(message || "");
    messageEl.style.lineHeight = "1.35";
    messageEl.style.whiteSpace = "pre-line";
    messageEl.style.marginBottom = "12px";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = String(placeholder || "");
    input.value = String(defaultValue || "");
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    input.style.padding = "8px";
    input.style.marginBottom = "12px";
    input.style.background = "#0f0f0f";
    input.style.color = "#fff";
    input.style.border = "1px solid rgba(255,255,255,0.22)";
    input.style.borderRadius = "6px";

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.justifyContent = "flex-end";
    actions.style.gap = "8px";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = String(cancelLabel || "Cancel");
    cancelBtn.className = "graph-mode-btn";

    const okBtn = document.createElement("button");
    okBtn.textContent = String(confirmLabel || "OK");
    okBtn.className = "graph-mode-btn is-active";

    actions.appendChild(cancelBtn);
    actions.appendChild(okBtn);
    box.appendChild(titleEl);
    box.appendChild(messageEl);
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
      if (e.key === "Enter") cleanup(input.value);
    };

    document.addEventListener("keydown", onKeyDown);
    cancelBtn.addEventListener("click", () => cleanup(null));
    okBtn.addEventListener("click", () => cleanup(input.value));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cleanup(null);
    });
    input.focus();
    input.select();
  });
}

export function promptInfo(message, title = "Please wait", buttonLabel = "Got it") {
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
    box.style.width = "auto";
    box.style.maxWidth = "75vw";
    box.style.minWidth = "320px";
    box.style.background = "#151515";
    box.style.border = "1px solid rgba(255,255,255,0.25)";
    box.style.borderRadius = "8px";
    box.style.padding = "12px";
    box.style.color = "#fff";

    const titleEl = document.createElement("div");
    titleEl.textContent = String(title || "Please wait");
    titleEl.style.fontWeight = "700";
    titleEl.style.marginBottom = "8px";

    const messageEl = document.createElement("div");
    messageEl.style.lineHeight = "1.35";
    messageEl.style.whiteSpace = "pre-line";
    messageEl.style.wordBreak = "break-word";
    messageEl.style.marginBottom = "12px";
    appendPromptMessageContent(messageEl, message);

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.justifyContent = "flex-end";
    actions.style.gap = "8px";

    const okBtn = document.createElement("button");
    okBtn.textContent = String(buttonLabel || "Got it");
    okBtn.className = "graph-mode-btn is-active";

    actions.appendChild(okBtn);
    box.appendChild(titleEl);
    box.appendChild(messageEl);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const cleanup = () => {
      overlay.remove();
      resolve(true);
    };
    okBtn.addEventListener("click", cleanup);
    okBtn.focus();
  });
}

export function promptConfirm(message, title = "Confirm", confirmLabel = "OK", cancelLabel = "Cancel") {
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
    box.style.width = "auto";
    box.style.maxWidth = "75vw";
    box.style.minWidth = "320px";
    box.style.background = "#151515";
    box.style.border = "1px solid rgba(255,255,255,0.25)";
    box.style.borderRadius = "8px";
    box.style.padding = "12px";
    box.style.color = "#fff";

    const titleEl = document.createElement("div");
    titleEl.textContent = String(title || "Confirm");
    titleEl.style.fontWeight = "700";
    titleEl.style.marginBottom = "8px";

    const messageEl = document.createElement("div");
    messageEl.textContent = String(message || "");
    messageEl.style.lineHeight = "1.35";
    messageEl.style.whiteSpace = "pre-line";
    messageEl.style.marginBottom = "12px";

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.justifyContent = "flex-end";
    actions.style.gap = "8px";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = String(cancelLabel || "Cancel");
    cancelBtn.className = "graph-mode-btn";

    const okBtn = document.createElement("button");
    okBtn.textContent = String(confirmLabel || "OK");
    okBtn.className = "graph-mode-btn is-active";

    actions.appendChild(cancelBtn);
    actions.appendChild(okBtn);
    box.appendChild(titleEl);
    box.appendChild(messageEl);
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
    okBtn.addEventListener("click", () => cleanup(true));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cleanup(false);
    });
    okBtn.focus();
  });
}

export function promptChoice(
  message,
  title = "Choose",
  choices = []
) {
  return new Promise((resolve) => {
    const safeChoices = Array.isArray(choices) ? choices.filter(Boolean).slice(0, 3) : [];
    const normalizedChoices = safeChoices.length > 0
      ? safeChoices.map((choice, index) => ({
        value: choice?.value ?? index,
        label: String(choice?.label || `Choice ${index + 1}`),
        primary: choice?.primary === true,
        iconSrc: choice?.iconSrc ? String(choice.iconSrc) : "",
      }))
      : [
        { value: "ok", label: "OK", primary: true },
      ];

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.55)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "99999";

    const box = document.createElement("div");
    box.style.width = "auto";
    box.style.maxWidth = "75vw";
    box.style.minWidth = "320px";
    box.style.background = "#151515";
    box.style.border = "1px solid rgba(255,255,255,0.25)";
    box.style.borderRadius = "8px";
    box.style.padding = "12px";
    box.style.color = "#fff";

    const titleEl = document.createElement("div");
    titleEl.textContent = String(title || "Choose");
    titleEl.style.fontWeight = "700";
    titleEl.style.marginBottom = "8px";

    const messageEl = document.createElement("div");
    appendPromptMessageContent(messageEl, message);
    messageEl.style.lineHeight = "1.35";
    messageEl.style.wordBreak = "break-word";
    messageEl.style.marginBottom = "12px";

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.justifyContent = "flex-end";
    actions.style.gap = "8px";
    actions.style.flexWrap = "wrap";

    let settled = false;
    const cleanup = (value) => {
      if (settled) return;
      settled = true;
      document.removeEventListener("keydown", onKeyDown);
      overlay.remove();
      resolve(value);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") cleanup(null);
      if (e.key === "Enter") {
        const primaryChoice = normalizedChoices.find((choice) => choice.primary) || normalizedChoices[normalizedChoices.length - 1];
        cleanup(primaryChoice?.value ?? null);
      }
    };

    normalizedChoices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.className = choice.primary ? "graph-mode-btn is-active" : "graph-mode-btn";
      if (choice.iconSrc) {
        button.style.display = "inline-flex";
        button.style.alignItems = "center";
        button.style.gap = "6px";
        const icon = document.createElement("img");
        icon.src = choice.iconSrc;
        icon.alt = "";
        icon.style.width = "14px";
        icon.style.height = "14px";
        icon.style.objectFit = "contain";
        button.appendChild(icon);
      }
      const label = document.createElement("span");
      label.textContent = choice.label;
      button.appendChild(label);
      button.addEventListener("click", () => cleanup(choice.value));
      actions.appendChild(button);
      if (index === 0) {
        setTimeout(() => button.focus(), 0);
      }
    });

    box.appendChild(titleEl);
    box.appendChild(messageEl);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    document.addEventListener("keydown", onKeyDown);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cleanup(null);
    });
  });
}
