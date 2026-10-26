import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { isPopup } from "./lib/extension";
import "./index.css";

// The popup's size is driven by its content, so it gets a fixed width via CSS.
document.documentElement.dataset.view = isPopup() ? "popup" : "full";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
