import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const success = await register(name, email, password);
      
      if (success) {
        navigate("/");
      } else {
        setError("El correo ya está registrado");
      }
    } catch (err) {
      setError("Error al registrarse. Intenta más tarde.");
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
            Crear cuenta 🐾
          </h1>
          <p style={{ color: "#666" }}>Únete a nuestra comunidad</p>
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
              Nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Tu nombre"
              style={{
                width: "100%",
                padding: "0.8rem",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
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
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@correo.com"
              style={{
                width: "100%",
                padding: "0.8rem",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
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
              placeholder="Mínimo 6 caracteres"
              style={{
                width: "100%",
                padding: "0.8rem",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
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
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repite tu contraseña"
              style={{
                width: "100%",
                padding: "0.8rem",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
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
            }}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#666" }}>
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            style={{
              color: "#7e57c2",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}