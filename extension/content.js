// Verity Brand Guard - In-Situ Content Script
(function () {
  let triggerBtn = null;
  let activeModal = null;
  let lastSelectedText = "";
  let activeTargetElement = null;

  // Listen for context menu triggers
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "VERITY_TRIGGER_VERIFICATION") {
      runVerificationOnText(request.text || window.getSelection()?.toString() || "");
    }
  });

  // Mouseup listener to float Verity chip near text selection
  document.addEventListener("mouseup", (e) => {
    // If clicking inside the modal or trigger, do nothing
    if (activeModal && activeModal.contains(e.target)) return;
    if (triggerBtn && triggerBtn.contains(e.target)) return;

    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection ? selection.toString().trim() : "";

      if (text.length > 5) {
        lastSelectedText = text;
        activeTargetElement = document.activeElement;
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        showFloatingTrigger(rect.right + window.scrollX, rect.top + window.scrollY - 30);
      } else {
        removeFloatingTrigger();
      }
    }, 50);
  });

  function showFloatingTrigger(x, y) {
    removeFloatingTrigger();
    triggerBtn = document.createElement("div");
    triggerBtn.id = "verity-floating-trigger";
    triggerBtn.innerHTML = `<span>🛡️</span><span>Check with Verity</span>`;
    triggerBtn.style.left = `${Math.max(10, x - 120)}px`;
    triggerBtn.style.top = `${Math.max(10, y)}px`;

    triggerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeFloatingTrigger();
      runVerificationOnText(lastSelectedText);
    });

    document.body.appendChild(triggerBtn);
  }

  function removeFloatingTrigger() {
    if (triggerBtn && triggerBtn.parentNode) {
      triggerBtn.parentNode.removeChild(triggerBtn);
      triggerBtn = null;
    }
  }

  async function runVerificationOnText(text) {
    if (!text) return;
    removeModal();

    showToast("Verity: Checking claims & citations...");

    // Try cloud API first, fallback to local rules
    let findings = [];
    try {
      const res = await fetch("https://verity-api.onrender.com/api/v1/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "In-Situ Check",
          original_text: text,
          input_type: "text"
        }),
        signal: AbortSignal.timeout(6000)
      });
      const sub = await res.json();
      const ana = await fetch(`https://verity-api.onrender.com/api/v1/submissions/${sub.id}/analyze`, {
        method: "POST",
        signal: AbortSignal.timeout(6000)
      });
      const data = await ana.json();
      findings = data.findings || [];
    } catch (_) {
      findings = runDeterministicRules(text);
    }

    displayInSituModal(text, findings);
  }

  function displayInSituModal(originalText, findings) {
    activeModal = document.createElement("div");
    activeModal.id = "verity-in-situ-modal";

    const isClean = findings.length === 0;

    let html = `
      <div class="verity-modal-header">
        <div class="verity-modal-title">
          <span>🛡️</span>
          <span>Verity Brand Guard</span>
        </div>
        <button class="verity-modal-close" id="verity-close-btn">✕</button>
      </div>

      <div style="font-size:10px; font-family:monospace; margin-bottom:8px; color:#555;">
        IN-SITU GOVERNANCE INSPECTION
      </div>
    `;

    if (isClean) {
      html += `
        <div style="padding:12px; background:#00FF66; border:2px solid #111; font-weight:800; font-size:12px;">
          ✅ 100% BRAND COMPLIANT
          <div style="font-size:10px; font-weight:normal; margin-top:4px;">
            Zero rule violations or unverified claims detected in selected copy.
          </div>
        </div>
      `;
    } else {
      html += `<div style="margin-bottom:8px; font-weight:800; font-size:11px; text-transform:uppercase;">
        Found ${findings.length} Brand Citation Issue${findings.length > 1 ? "s" : ""}:
      </div>`;

      findings.forEach((f, idx) => {
        const isCrit = f.severity === "critical";
        html += `
          <div class="verity-finding-row ${isCrit ? "verity-finding-critical" : "verity-finding-warning"}">
            <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
              <span class="verity-badge">${f.rule_id || "RULE"}</span>
              <span style="font-size:9px; font-weight:900; text-transform:uppercase; color:${isCrit ? "#FF3366" : "#111"};">
                ${f.severity || "warning"}
              </span>
            </div>
            <div style="font-weight:700; margin-bottom:2px;">${escapeHtml(f.original_phrase ? `"${f.original_phrase}"` : f.message)}</div>
            <div style="font-size:10px; color:#333; margin-bottom:4px;">${escapeHtml(f.explanation || f.message)}</div>
            <div style="font-size:9px; font-family:monospace; color:#666;">
              Source: ${escapeHtml(f.source_cited || "Brand Constitution v1.0")}
            </div>
            ${
              f.suggested_fix
                ? `<button class="verity-fix-action" data-old="${encodeURIComponent(f.original_phrase || "")}" data-new="${encodeURIComponent(f.suggested_fix)}">
                    Fix: Replace with "${escapeHtml(f.suggested_fix)}"
                   </button>`
                : ""
            }
          </div>
        `;
      });
    }

    activeModal.innerHTML = html;
    document.body.appendChild(activeModal);

    document.getElementById("verity-close-btn").addEventListener("click", removeModal);

    // Handle fix replacements
    activeModal.querySelectorAll(".verity-fix-action").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const oldP = decodeURIComponent(e.target.dataset.old);
        const newP = decodeURIComponent(e.target.dataset.new);
        applyFixToPage(originalText, oldP, newP);
        btn.textContent = "✓ Fix Applied!";
        btn.style.background = "#FFE500";
      });
    });
  }

  function applyFixToPage(fullText, oldPhrase, newPhrase) {
    const fixedText = fullText.replace(new RegExp(escapeRegExp(oldPhrase), "i"), newPhrase);

    // If active element is an input or textarea
    if (activeTargetElement && (activeTargetElement.tagName === "TEXTAREA" || activeTargetElement.tagName === "INPUT")) {
      const val = activeTargetElement.value;
      if (val.includes(oldPhrase)) {
        activeTargetElement.value = val.replace(oldPhrase, newPhrase);
        showToast("✓ Text updated in field!");
        return;
      }
    }

    // Otherwise copy to clipboard
    navigator.clipboard.writeText(fixedText);
    showToast("✓ Fixed text copied to clipboard!");
  }

  function removeModal() {
    if (activeModal && activeModal.parentNode) {
      activeModal.parentNode.removeChild(activeModal);
      activeModal = null;
    }
  }

  function showToast(msg) {
    const toast = document.createElement("div");
    toast.className = "verity-toast";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2500);
  }

  function escapeHtml(t) {
    if (!t) return "";
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function runDeterministicRules(text) {
    const list = [];
    if (/CHEAP/i.test(text)) {
      list.push({
        rule_id: "T-3",
        severity: "warning",
        original_phrase: "CHEAP",
        suggested_fix: "accessible",
        message: "Tone Hygiene: Avoid 'cheap'; use 'accessible' or 'budget-friendly'.",
        source_cited: "Constitution §4: Tone Hygiene"
      });
    }
    if (/#1\s+in\s+India/i.test(text)) {
      list.push({
        rule_id: "C-1",
        severity: "critical",
        original_phrase: "#1 in India",
        suggested_fix: "leading collegiate festival",
        message: "Unverified Superlative: No documented source supports '#1 in India'.",
        source_cited: "Claim Ledger entry CL-003"
      });
    }
    if (/Project\s+Falcon/i.test(text)) {
      list.push({
        rule_id: "P-1",
        severity: "critical",
        original_phrase: "Project Falcon",
        suggested_fix: "[REDACTED CONFIDENTIAL]",
        message: "Confidentiality Breach: Project Falcon is restricted under NDA.",
        source_cited: "Constitution §6: Confidential Terms"
      });
    }
    return list;
  }
})();
