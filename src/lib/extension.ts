const FULL_VIEW_HASH = "#full";

const runtime = () => (typeof chrome !== "undefined" ? chrome.runtime : undefined);

/** True when running inside an installed extension (chrome-extension:// or moz-extension://). */
export const isExtension = () => Boolean(runtime()?.id);

/** The toolbar popup loads index.html; the full-tab view loads index.html#full. */
export const isPopup = () => isExtension() && window.location.hash !== FULL_VIEW_HASH;

/** Opens the app in a regular browser tab, which has more room for image sampling. */
export const openFullView = () => {
  const url = runtime()?.getURL(`index.html${FULL_VIEW_HASH}`);
  if (!url) return;
  if (typeof chrome !== "undefined" && chrome.tabs) {
    chrome.tabs.create({ url });
  } else {
    window.open(url, "_blank", "noopener");
  }
  window.close();
};
