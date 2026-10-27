# Verity Brand Guard — Native Figma Plugin

> **Round 3 Feature Delivery**: Directly inspect and sanitize marketing frames, artboards, and UI text layers inside Figma and FigJam.

---

## ⚡ 60-Second Setup for Judges (Figma Desktop App)

1. Open the **Figma Desktop App**.
2. Click the Figma main menu icon in the top left, or right-click any canvas.
3. Go to:
   ```text
   Plugins > Development > Import plugin from manifest...
   ```
4. Select the `manifest.json` file inside the `figma-plugin/` directory:
   ```text
   Verity_CodeAxis/figma-plugin/manifest.json
   ```
5. Click **Open**. The plugin **"Verity Brand Guard"** is now installed in your development plugins!

---

## 🚀 How to Test & Demo

1. Right click on the Figma canvas and select:
   ```text
   Plugins > Development > Verity Brand Guard
   ```
2. Select any frame, card, or text layer on your canvas (or click the **"Demo"** button inside the plugin window).
3. Click **"🔍 Scan Selected Text Layers"**.
4. Verity inspects every text node against the Brand Constitution and Claim Ledger.
5. Click **"Apply to Layer"** on any finding — watch the text on the Figma canvas update in real-time with font preservation!
