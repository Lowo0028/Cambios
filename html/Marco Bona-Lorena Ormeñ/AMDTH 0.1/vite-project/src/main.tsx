// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";                      // <- Acción: mayúscula
import "./assets/css/style.css";              // <- Acción: coincide con la nueva ubicación

const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
