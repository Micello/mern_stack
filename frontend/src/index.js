import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";

import App2 from "./App2";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App2 />
  </StrictMode>
);