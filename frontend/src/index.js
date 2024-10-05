import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./Briscola.css";

import Briscola from "./Briscola";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Briscola />
  </StrictMode>
);