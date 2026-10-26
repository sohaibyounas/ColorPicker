# Spectrum Scoop Extension

Spectrum Scoop is a Manifest V3 browser extension for picking colors from any page (EyeDropper API) or from an uploaded image, then copying HEX, RGB and HSL values. It requests **no permissions**.

- The toolbar popup is a compact 380px layout. Use the ↗ button to open the same app in a full tab, where images get more room and the layout switches to two columns on wide screens.
- The active color, recent colors and last image are saved locally, so nothing is lost when the popup closes.

## Develop

```sh
npm install
npm run dev        # http://localhost:8080 (full-tab layout)
npm run lint
npm run typecheck
```

## Build and load in Chrome / Edge

```sh
npm run build
```

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `dist/` folder.
4. Pin Spectrum Scoop and open it from the toolbar.

After code changes, run `npm run build` again and click the reload icon on the extension card.

## Load in Firefox

```sh
npm run package:firefox
```

Open `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on** → pick `dist/manifest.json`. Firefox doesn't support the EyeDropper API, so only image sampling is available there.

## Create store packages

```sh
npm run package:extension   # release/spectrum-scoop-extension.zip (Chrome Web Store / Edge Add-ons)
npm run package:firefox     # release/spectrum-scoop-firefox.zip + .xpi (Mozilla Add-ons)
```

Firefox release builds must be signed by Mozilla before regular users can install them. Before publishing to Firefox, change `browser_specific_settings.gecko.id` in `scripts/manifest.firefox.json` to an ID you own.

## Project layout

```
public/            manifest.json + icons (copied into dist/)
scripts/           packaging scripts and the Firefox manifest
src/App.tsx        layout (popup vs full tab)
src/components/    color UI: active color, formats, image sampler, history
src/lib/           color math, storage, clipboard, extension helpers
```
