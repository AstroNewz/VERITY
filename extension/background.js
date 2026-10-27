// Verity Brand Guard - Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "verity-verify-selection",
    title: "🛡️ Verify with Verity Brand Guard",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "verity-verify-selection" && tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      action: "VERITY_TRIGGER_VERIFICATION",
      text: info.selectionText
    });
  }
});
