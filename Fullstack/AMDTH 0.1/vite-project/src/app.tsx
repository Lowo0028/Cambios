// src/app.tsx - VERSIÓN ACTUALIZADA
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/layouts";
import Inicio from "./pages/inicio";
import Tienda from "./components/tiendacomponents/tienda";
import Adopcion from "./components/adopcioncomponents/adopcion";
import CarritoPage from "./pages/carritoPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useCarritoReal } from "./hooks/UseCarritoReal.ts"; 
import { AppDataProvider } from "./contexts/AppDataContext";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Carrito from "./pages/carritoPage";

function AppRoutes() {
  
  const {
    carrito,
    total,
    loading,
    agregarAlCarrito,
    incrementar,
    decrementar,
    eliminarDelCarrito,
    limpiarCarrito,
    finalizarCompra,
  } = useCarritoReal();

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas con Layout */}
      <Route
        path="/"
        element={
          <Layout>
            <Inicio />
          </Layout>
        }
      />

      <Route
        path="/tienda"
        element={
          <Layout>
            <Tienda agregarAlCarrito={agregarAlCarrito} />
          </Layout>
        }
      />

      <Route
        path="/adopcion"
        element={
          <Layout>
            <Adopcion />
          </Layout>
        }
      />

      <Route
        path="/carrito"
        element={
          <Layout>
            <Carrito
              carrito={carrito}
              incrementar={incrementar}
              decrementar={decrementar}
              eliminarDelCarrito={eliminarDelCarrito}
              limpiarCarrito={limpiarCarrito}
              total={total}
            />
          </Layout>
        }
      />

      {/* Ruta protegida solo para administradores */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <Layout>
              <AdminPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Ruta 404 */}
      <Route
        path="*"
        element={
          <Layout>
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                minHeight: "60vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
              <h2 style={{ color: "#666", marginBottom: "2rem" }}>
                Página no encontrada
              </h2>
              <a
                href="/"
                style={{
                  background: "linear-gradient(90deg, #7e57c2, #64b5f6)",
                  color: "white",
                  textDecoration: "none",
                  padding: "1rem 2rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                }}
              >
                Volver al inicio
              </a>
            </div>
          </Layout>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          <FavoritesProvider>
            <AppRoutes />
          </FavoritesProvider>
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}