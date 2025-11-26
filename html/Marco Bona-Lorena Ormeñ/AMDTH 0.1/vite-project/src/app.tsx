// src/app.tsx
import React, { useState, useEffect } from "react";
import Layout from "./components/layouts/layouts";
import Tienda from "./components/tiendacomponents/tienda";
import Adopcion from "./components/adopcioncomponents/adopcion";
import CarritoPage from "./pages/carrito";
import Inicio from "./pages/inicio";
import AdminPage from "./pages/AdminPage"; // 👈 nuevo import
import { useCarritoGlobal } from "./hooks/useCarrito";
import { AppDataProvider, useAppData } from "./contexts/AppDataContext";

// ─────────────────────────────
// Botón para cambiar a vista admin
// ─────────────────────────────
function AdminToggleButton() {
  const ctx = useAppData();

  const handleClick = () => {
    ctx.toggleAdminMode();
    if (!ctx.isAdminMode) {
      window.location.hash = "#admin"; // 👈 Ir a la vista admin
    } else {
      window.location.hash = "#inicio"; // 👈 Volver al inicio
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 12,
        top: 12,
        zIndex: 9999,
      }}
    >
      <button
        onClick={handleClick}
        style={{
          padding: "8px 12px",
          borderRadius: 6,
          background: ctx.isAdminMode ? "#333" : "#eee",
          color: ctx.isAdminMode ? "#fff" : "#000",
          border: "none",
          cursor: "pointer",
        }}
      >
        {ctx.isAdminMode ? "Salir vista admin" : "Vista admin"}
      </button>
    </div>
  );
}

// ─────────────────────────────
// App principal interna
// ─────────────────────────────
function AppInner() {
  const [seccion, setSeccion] = useState(window.location.hash || "#inicio");

  useEffect(() => {
    const onHash = () => setSeccion(window.location.hash || "#inicio");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const {
    carrito,
    total,
    agregarAlCarrito,
    incrementar,
    decrementar,
    eliminarDelCarrito,
    limpiarCarrito,
  } = useCarritoGlobal();

  return (
    <Layout>
      <AdminToggleButton />

      {seccion === "#inicio" && <Inicio />}
      {seccion === "#tienda" && <Tienda agregarAlCarrito={agregarAlCarrito} />}
      {seccion === "#adopcion" && <Adopcion />}
      {seccion === "#carrito" && (
        <CarritoPage
          carrito={carrito}
          incrementar={incrementar}
          decrementar={decrementar}
          eliminarDelCarrito={eliminarDelCarrito}
          total={total}
          limpiarCarrito={limpiarCarrito}
        />
      )}
      {seccion === "#admin" && <AdminPage />} {/* 👈 Nueva vista admin */}
    </Layout>
  );
}

// ─────────────────────────────
// App raíz con contexto global
// ─────────────────────────────
export default function App() {
  return (
    <AppDataProvider>
      <AppInner />
    </AppDataProvider>
  );
}
