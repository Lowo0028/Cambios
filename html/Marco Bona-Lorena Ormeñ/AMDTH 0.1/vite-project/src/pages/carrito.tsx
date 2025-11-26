import React from "react";
import Carrito from "../components/carrito/carrito";

interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  cantidad: number;
}

interface CarritoPageProps {
  carrito: ItemCarrito[];
  incrementar: (id: number) => void;
  decrementar: (id: number) => void;
  eliminarDelCarrito: (id: number) => void;
  total: number;
  limpiarCarrito: () => void;
}

export default function CarritoPage({
  carrito,
  incrementar,
  decrementar,
  eliminarDelCarrito,
  total,
  limpiarCarrito,
}: CarritoPageProps) {
  return (
    <section className="carrito-page" style={{ padding: "2rem" }}>
      {carrito.length > 0 ? (
        <Carrito
          carrito={carrito}
          incrementar={incrementar}
          decrementar={decrementar}
          eliminarDelCarrito={eliminarDelCarrito}
          total={total}
          limpiarCarrito={limpiarCarrito}
        />
      ) : (
        <p style={{ textAlign: "center", fontSize: "1.2rem", marginTop: "2rem" }}>
          🛒 Tu carrito está vacío. ¡Agrega productos desde la tienda!
        </p>
      )}
    </section>
  );
}
