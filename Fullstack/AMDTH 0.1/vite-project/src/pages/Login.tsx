// src/pages/Login.tsx - VERSIÓN ACTUALIZADA
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError("Credenciales incorrectas. Intenta nuevamente.");
      }
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #d1c4e9, #bbdefb)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          padding: "3rem",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ color: "#4a148c", fontSize: "1.8rem", marginBottom: "0.5rem" }}>
            Bienvenido 🐾
          </h1>
          <p style={{ color: "#666" }}>Inicia sesión para continuar</p>
        </div>

        {error && (
          <div
            style={{
              background: "#ffebee",
              color: "#c62828",
              padding: "0.8rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                color: "#444",
                marginBottom: "0.5rem",
              }}
            >
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@correo.com"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.8rem",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "border-color 0.3s",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                color: "#444",
                marginBottom: "0.5rem",
              }}
            >
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.8rem",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "border-color 0.3s",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading
                ? "#ccc"
                : "linear-gradient(90deg, #7e57c2, #64b5f6)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "1rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s",
            }}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
            padding: "1rem",
            background: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem" }}>
            <strong>Usuario de prueba del microservicio:</strong>
          </p>
          <p style={{ fontSize: "0.8rem", color: "#777" }}>
            👨‍💼 Admin: admin@amilimetros.cl / Admin123!
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#666" }}>
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            style={{
              color: "#7e57c2",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}