import React, { createContext, useContext, useEffect, useState } from "react";
import { animals as animalsMock } from "../data/animales.mocks";
import { products as productsMock } from "../data/productos.mock";

export type Animal = typeof animalsMock[number];
export type Product = typeof productsMock[number];

interface AppDataContextValue {
  animals: Animal[];
  products: Product[];
  setAnimals: (a: Animal[]) => void;
  setProducts: (p: Product[]) => void;
  addAnimal: (a: Animal) => void;
  updateAnimal: (a: Animal) => void;
  deleteAnimal: (id: number) => void;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: number) => void;
  selectedAnimalId: number | null;
  setSelectedAnimalId: (id: number | null) => void;
  isAdminMode: boolean;
  toggleAdminMode: () => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
};

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Datos iniciales (con persistencia localStorage) ---
  const [animals, setAnimals] = useState<Animal[]>(() => {
    try {
      const stored = localStorage.getItem("amdth_animals");
      return stored ? JSON.parse(stored) : animalsMock;
    } catch {
      return animalsMock;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem("amdth_products");
      return stored ? JSON.parse(stored) : productsMock;
    } catch {
      return productsMock;
    }
  });

  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem("amdth_admin") === "true";
  });

  // --- Sincronización con localStorage ---
  useEffect(() => {
    localStorage.setItem("amdth_animals", JSON.stringify(animals));
  }, [animals]);

  useEffect(() => {
    localStorage.setItem("amdth_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("amdth_admin", String(isAdminMode));
  }, [isAdminMode]);

  // --- CRUD de animales ---
  const addAnimal = (a: Animal) => {
    setAnimals(prev => [...prev, { ...a, id: Date.now() }]);
  };

  const updateAnimal = (a: Animal) => {
    setAnimals(prev => prev.map(x => (x.id === a.id ? a : x)));
  };

  const deleteAnimal = (id: number) => {
    setAnimals(prev => prev.filter(x => x.id !== id));
  };

  // --- CRUD de productos ---
  const addProduct = (p: Product) => {
    setProducts(prev => [...prev, { ...p, id: Date.now() }]);
  };

  const updateProduct = (p: Product) => {
    setProducts(prev => prev.map(x => (x.id === p.id ? p : x)));
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(x => x.id !== id));
  };

  // --- Alternar modo admin ---
  const toggleAdminMode = () => setIsAdminMode(prev => !prev);

  return (
    <AppDataContext.Provider
      value={{
        animals,
        products,
        setAnimals,
        setProducts,
        addAnimal,
        updateAnimal,
        deleteAnimal,
        addProduct,
        updateProduct,
        deleteProduct,
        selectedAnimalId,
        setSelectedAnimalId,
        isAdminMode,
        toggleAdminMode,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};
