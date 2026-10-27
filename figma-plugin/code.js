// Verity Brand Guard - Native Figma Plugin Controller
figma.showUI(__html__, { width: 380, height: 540, themeColors: true });

function extractTextNodes(nodes) {
  let result = [];
  for (const node of nodes) {
    if (node.type === "TEXT") {
      result.push({
        id: node.id,
        name: node.name,
        text: node.characters
      });
    } else if ("children" in node) {
      result = result.concat(extractTextNodes(node.children));
    }
  }
  return result;
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === "SCAN_SELECTION") {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify("⚠️ Please select one or more frames or text layers on the canvas.");
      figma.ui.postMessage({ type: "SCAN_RESULT", nodes: [], count: 0 });
      return;
    }

    const textNodes = extractTextNodes(selection);
    if (textNodes.length === 0) {
      figma.notify("⚠️ No text layers found inside current selection.");
      figma.ui.postMessage({ type: "SCAN_RESULT", nodes: [], count: 0 });
      return;
    }

    figma.notify(`🔍 Verity: Scanning ${textNodes.length} text layer(s)...`);
    figma.ui.postMessage({
      type: "SCAN_RESULT",
      nodes: textNodes,
      count: textNodes.length
    });
  }

  if (msg.type === "APPLY_FIX") {
    const { nodeId, newText } = msg;
    const node = figma.getNodeById(nodeId);

    if (!node || node.type !== "TEXT") {
      figma.notify("❌ Could not locate the target text layer.");
      return;
    }

    try {
      if (node.hasMissingFont) {
        figma.notify("⚠️ Cannot edit layer: font is missing on your system.");
        return;
      }

      // In Figma, font must be loaded before updating text
      if (typeof node.fontName === "symbol") {
        figma.notify("⚠️ Layer contains mixed fonts; applying with fallback.");
      } else {
        await figma.loadFontAsync(node.fontName);
      }

      node.characters = newText;
      figma.notify(`✅ Verity: Layer '${node.name}' updated with compliant brand copy!`);
      figma.ui.postMessage({ type: "FIX_SUCCESS", nodeId, newText });
    } catch (err) {
      console.error("Error updating Figma node:", err);
      figma.notify(`❌ Failed to update text layer: ${err.message}`);
    }
  }

  if (msg.type === "CLOSE_PLUGIN") {
    figma.closePlugin();
  }
};
