import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface FavoritesContextValue {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  return ctx;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);

  // ✅ useEffect: Cargar favoritos desde localStorage al montar o cambiar usuario
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    try {
      const key = `amdth_favorites_${user.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    }
  }, [user]);

  // ✅ useEffect: Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    if (!user) return;

    try {
      const key = `amdth_favorites_${user.id}`;
      localStorage.setItem(key, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error al guardar favoritos:", error);
    }
  }, [favorites, user]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((fav) => fav !== id)
        : [...prev, id]
    );
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};