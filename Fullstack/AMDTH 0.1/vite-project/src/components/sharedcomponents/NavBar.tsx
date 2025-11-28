import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function NavBar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <h1>A milímetros de tu hogar</h1>
      <nav>
        <Link to="/">Inicio</Link> {" | "}
        <Link to="/tienda">Tienda</Link> {" | "}
        <Link to="/adopcion">Adopción</Link> {" | "}
        <Link to="/carrito">Carrito</Link>
        
        {isAuthenticated && (
          <>
            {isAdmin && (
              <>
                {" | "}
                <Link to="/admin" style={{ fontWeight: "bold" }}>
                  Panel Admin
                </Link>
              </>
            )}
          </>
        )}
      </nav>

      <div
        style={{
          marginTop: "0.8rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: "0.9rem" }}>
              👤 Hola, <strong>{user?.name}</strong>
              {isAdmin && (
                <span
                  style={{
                    marginLeft: "0.5rem",
                    background: "#ffd54f",
                    color: "#000",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  ADMIN
                </span>
              )}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1px solid white",
                color: "white",
                padding: "4px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1px solid white",
                color: "white",
                padding: "4px 12px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  );
}