import { useState } from "react";

export interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  cantidad: number;
}

export function useCarritoGlobal() {
  const [carritoMap, setCarritoMap] = useState<Record<number, ItemCarrito>>({});

  const agregarAlCarrito = (producto: any) => {
    setCarritoMap((prev) => {
      const existente = prev[producto.id];
      return {
        ...prev,
        [producto.id]: existente
          ? { ...existente, cantidad: existente.cantidad + 1 }
          : {
              id: producto.id,
              nombre: producto.nombre,
              precio: producto.precio,
              imagen: producto.imagen,
              cantidad: 1,
            },
      };
    });
  };

  const incrementar = (id: number) =>
    setCarritoMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], cantidad: prev[id].cantidad + 1 },
    }));

  const decrementar = (id: number) =>
    setCarritoMap((prev) => {
      const item = prev[id];
      if (!item) return prev;
      if (item.cantidad <= 1) {
        const nuevo = { ...prev };
        delete nuevo[id];
        return nuevo;
      }
      return { ...prev, [id]: { ...item, cantidad: item.cantidad - 1 } };
    });

  const eliminarDelCarrito = (id: number) => {
    const nuevo = { ...carritoMap };
    delete nuevo[id];
    setCarritoMap(nuevo);
  };

  const limpiarCarrito = () => setCarritoMap({});

  const carritoArray = Object.values(carritoMap);
  const total = carritoArray.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return {
    carrito: carritoArray,
    total,
    agregarAlCarrito,
    incrementar,
    decrementar,
    eliminarDelCarrito,
    limpiarCarrito,
  };
}
