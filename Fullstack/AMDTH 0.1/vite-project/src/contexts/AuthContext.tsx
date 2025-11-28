// src/contexts/AuthContext.tsx - VERSIÓN ACTUALIZADA
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, type User } from "../services/authService";

interface AuthContextValue {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, telefono: string, password: string) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Cargar sesión desde localStorage al montar
  useEffect(() => {
    const loadSession = () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error al cargar sesión:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  // ✅ Login con microservicio
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ 
        email, 
        contrasena: password 
      });

      if (response.success) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  // ✅ Registro con microservicio
  const register = async (
    name: string,
    email: string,
    telefono: string,
    password: string
  ): Promise<boolean> => {
    try {
      const newUser = await authService.register({
        nombre: name,
        email,
        telefono,
        contrasena: password
      });

      if (newUser) {
        // Auto-login después del registro
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en registro:", error);
      return false;
    }
  };

  // ✅ Logout
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Loading screen mientras se carga la sesión
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(to bottom, #d1c4e9, #bbdefb)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid #7e57c2",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p style={{ color: "#4a148c", fontWeight: 600 }}>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        user,
        login,
        logout,
        register,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Agregar animación al CSS global (si no existe)
if (typeof document !== 'undefined') {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  if (!document.head.querySelector('style[data-spin-animation]')) {
    style.setAttribute('data-spin-animation', 'true');
    document.head.appendChild(style);
  }
}