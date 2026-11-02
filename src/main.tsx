import React from "react";
import ReactDOM from "react-dom/client";

import App from "./app/App";
import { AppProviders } from "./app/providers";

import "./styles/tokens.css";
import "./styles/typography.css";
import "./styles/globals.css";
import "./styles/animations.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);