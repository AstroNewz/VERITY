// Verity Brand Guard - Extension Popup Logic
document.addEventListener("DOMContentLoaded", async () => {
  const draftInput = document.getElementById("draft-input");
  const checkBtn = document.getElementById("check-btn");
  const sampleBtn = document.getElementById("sample-btn");
  const pageBtn = document.getElementById("page-btn");
  const apiStatus = document.getElementById("api-status");
  const apiTargetSelect = document.getElementById("api-target");
  const resultsContainer = document.getElementById("results-container");
  const findingsList = document.getElementById("findings-list");
  const findingsCount = document.getElementById("findings-count");

  // Load saved API endpoint
  let apiBase = "https://verity-api.onrender.com";
  try {
    const stored = await chrome.storage.local.get(["verityApiUrl"]);
    if (stored.verityApiUrl) {
      apiBase = stored.verityApiUrl;
      apiTargetSelect.value = apiBase;
    }
  } catch (_) {}

  apiTargetSelect.addEventListener("change", (e) => {
    apiBase = e.target.value;
    chrome.storage.local.set({ verityApiUrl: apiBase });
    checkHealth();
  });

  // Health check
  async function checkHealth() {
    apiStatus.textContent = "Checking...";
    apiStatus.style.background = "#FFE500";
    try {
      const res = await fetch(`${apiBase}/`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        apiStatus.textContent = "API Ready";
        apiStatus.style.background = "#00FF66";
      } else {
        throw new Error();
      }
    } catch (_) {
      apiStatus.textContent = "Local Fallback";
      apiStatus.style.background = "#FFE500";
    }
  }
  checkHealth();

  // Try reading active selection on tab
  async function grabSelection() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => window.getSelection()?.toString() || ""
        });
        const text = results[0]?.result;
        if (text && text.trim()) {
          draftInput.value = text.trim();
        }
      }
    } catch (e) {
      console.log("Could not grab selection automatically:", e);
    }
  }
  grabSelection();

  // Preset sample button
  sampleBtn.addEventListener("click", () => {
    draftInput.value = "NovaFest 2026 is CHEAP and #1 in India with over 10,000 attendees! Do not mention Project Falcon yet!";
    runCheck();
  });

  // Grab button
  pageBtn.addEventListener("click", () => {
    grabSelection();
  });

  // Run Check
  checkBtn.addEventListener("click", runCheck);

  async function runCheck() {
    const text = draftInput.value.trim();
    if (!text) {
      alert("Please paste or select text to analyze.");
      return;
    }

    checkBtn.textContent = "CITING RULES...";
    checkBtn.disabled = true;

    try {
      let findings = [];
      try {
        // Step 1: Create submission
        const createRes = await fetch(`${apiBase}/api/v1/submissions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Browser Extension Inspection",
            original_text: text,
            input_type: "text"
          }),
          signal: AbortSignal.timeout(6000)
        });
        if (!createRes.ok) throw new Error("Create submission failed");
        const sub = await createRes.json();

        // Step 2: Analyze
        const analyzeRes = await fetch(`${apiBase}/api/v1/submissions/${sub.id}/analyze`, {
          method: "POST",
          signal: AbortSignal.timeout(8000)
        });
        if (!analyzeRes.ok) throw new Error("Analyze failed");
        const analyzed = await analyzeRes.json();
        findings = analyzed.findings || [];
      } catch (networkErr) {
        // Fallback local deterministic checks if API is cold / offline
        console.warn("Using deterministic fallback checks:", networkErr);
        findings = runLocalFallbackChecks(text);
      }

      renderFindings(findings, text);
    } catch (err) {
      alert("Error inspecting text: " + err.message);
    } finally {
      checkBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><span>Run Verity Check</span>';
      checkBtn.disabled = false;
    }
  }

  function renderFindings(findings, currentText) {
    resultsContainer.style.display = "block";
    findingsCount.textContent = findings.length;
    findingsList.innerHTML = "";

    if (findings.length === 0) {
      findingsList.innerHTML = `
        <div class="finding-item finding-safe">
          <div style="font-weight:800; display:flex; align-items:center; gap:4px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>100% Brand Compliant</span>
          </div>
          <div style="font-size:10px; color:#333; margin-top:2px;">
            Zero rule violations or unverified claims detected.
          </div>
        </div>
      `;
      return;
    }

    findings.forEach((f) => {
      const item = document.createElement("div");
      const isCritical = f.severity === "critical";
      item.className = `finding-item ${isCritical ? "finding-critical" : "finding-warning"}`;

      item.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
          <span class="pill">${f.rule_id || "RULE"}</span>
          <span style="font-size:9px; font-weight:800; color:${isCritical ? "#FF3366" : "#666"}; text-transform:uppercase;">
            ${f.severity || "warning"}
          </span>
        </div>
        <div style="font-weight:700; margin-bottom:2px;">${escapeHtml(f.original_phrase ? `"${f.original_phrase}"` : f.message)}</div>
        <div style="font-size:10px; color:#444;">${escapeHtml(f.explanation || f.message)}</div>
        <div style="font-size:9px; color:#666; margin-top:2px; font-family:monospace;">
          Source: ${escapeHtml(f.source_cited || "Brand Constitution v1.0")}
        </div>
        ${
          f.suggested_fix
            ? `<button class="fix-btn" data-old="${encodeURIComponent(f.original_phrase || "")}" data-new="${encodeURIComponent(f.suggested_fix)}">
                Fix: Replace with "${escapeHtml(f.suggested_fix)}"
               </button>`
            : ""
        }
      `;

      findingsList.appendChild(item);
    });

    // Wire up 1-click fix buttons
    document.querySelectorAll(".fix-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const oldPhrase = decodeURIComponent(e.target.dataset.old);
        const newPhrase = decodeURIComponent(e.target.dataset.new);
        if (oldPhrase && newPhrase) {
          draftInput.value = draftInput.value.replace(new RegExp(escapeRegExp(oldPhrase), "i"), newPhrase);
          navigator.clipboard.writeText(draftInput.value);
          btn.textContent = "Applied & Copied!";
          btn.style.background = "#FFE500";
        }
      });
    });
  }

  function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function runLocalFallbackChecks(text) {
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
    if (/NovaFest\s*2026/i.test(text) && !/Nova\s+Fest\s+2026/.test(text)) {
      list.push({
        rule_id: "N-1",
        severity: "warning",
        original_phrase: "NovaFest",
        suggested_fix: "Nova Fest",
        message: "Official Brand Casing: Brand name must be formatted as 'Nova Fest'.",
        source_cited: "Constitution §1: Naming Standard"
      });
    }
    return list;
  }
});
