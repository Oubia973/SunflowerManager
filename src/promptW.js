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
    box.style.width = "min(520px, 92vw)";
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
    messageEl.textContent = String(message || "");
    messageEl.style.lineHeight = "1.35";
    messageEl.style.marginBottom = "12px";

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
    box.style.width = "min(520px, 92vw)";
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
    box.style.width = "min(560px, 92vw)";
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
    messageEl.textContent = String(message || "");
    messageEl.style.lineHeight = "1.35";
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
      button.textContent = choice.label;
      button.className = choice.primary ? "graph-mode-btn is-active" : "graph-mode-btn";
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
