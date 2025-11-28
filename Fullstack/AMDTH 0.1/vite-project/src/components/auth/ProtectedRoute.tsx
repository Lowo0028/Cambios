import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "3rem",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            maxWidth: "500px",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚫</div>
          <h2 style={{ color: "#d32f2f", marginBottom: "1rem" }}>
            Acceso Denegado
          </h2>
          <p style={{ color: "#666", marginBottom: "2rem" }}>
            No tienes permisos para acceder a esta página. Solo los
            administradores pueden acceder al panel de administración.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              background: "linear-gradient(90deg, #7e57c2, #64b5f6)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.8rem 2rem",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}