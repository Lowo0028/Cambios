import React, { createContext, useContext, useEffect, useState } from "react";



interface AuthContextValue {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};

// Usuarios de prueba (en producción vendría de un backend)
const MOCK_USERS = [
  {
    id: 1,
    name: "Admin",
    email: "admin@amdth.com",
    password: "admin123",
    role: "admin" as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Usuario Demo",
    email: "usuario@demo.com",
    password: "demo123",
    role: "user" as const,
    createdAt: new Date().toISOString(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ useEffect #1: Cargar sesión desde localStorage al montar
  useEffect(() => {
    const loadSession = () => {
      try {
        const savedUser = localStorage.getItem("amdth_user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error al cargar sesión:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  // ✅ useEffect #2: Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem("amdth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("amdth_user");
    }
  }, [user]);

  // ✅ useEffect #3: Timeout de sesión automático (30 minutos)
  useEffect(() => {
    if (!user) return;

    const timeout = setTimeout(() => {
      alert("Tu sesión ha expirado por inactividad");
      logout();
    }, 30 * 60 * 1000); // 30 minutos

    return () => clearTimeout(timeout);
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simular llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800); // Simular latencia de red
    });
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Verificar si el email ya existe
        if (MOCK_USERS.find((u) => u.email === email)) {
          resolve(false);
          return;
        }

        const newUser: User = {
          id: Date.now(),
          name,
          email,
          role: "user",
          createdAt: new Date().toISOString(),
        };

        setUser(newUser);
        resolve(true);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("amdth_user");
  };

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
        isAdmin: user?.role === "admin",
        user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Agregar animación al CSS global
const style = document.createElement("style");
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);