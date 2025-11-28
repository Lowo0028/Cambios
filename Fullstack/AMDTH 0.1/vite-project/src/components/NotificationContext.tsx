import React, { createContext, useContext, useState, useEffect } from "react";

interface Notification {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface NotificationContextValue {
  showNotification: (message: string, type?: Notification["type"]) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification debe usarse dentro de NotificationProvider");
  return ctx;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: Notification["type"] = "success") => {
    const id = Date.now();
    const newNotification: Notification = { id, message, type };
    
    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remover después de 3 segundos
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Contenedor de notificaciones */}
      <div
        style={{
          position: "fixed",
          top: "80px",
          right: "20px",
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {notifications.map((notification) => (
          <NotificationToast key={notification.id} notification={notification} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

function NotificationToast({ notification }: { notification: Notification }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const colors = {
    success: { bg: "#4caf50", icon: "✓" },
    error: { bg: "#f44336", icon: "✖" },
    warning: { bg: "#ff9800", icon: "⚠" },
    info: { bg: "#2196f3", icon: "ℹ" },
  };

  const color = colors[notification.type];

  return (
    <div
      style={{
        background: color.bg,
        color: "white",
        padding: "12px 20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        minWidth: "250px",
        maxWidth: "400px",
        transform: isVisible ? "translateX(0)" : "translateX(400px)",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.3s ease-in-out",
      }}
    >
      <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{color.icon}</span>
      <span style={{ flex: 1, fontSize: "0.95rem" }}>{notification.message}</span>
    </div>
  );
}