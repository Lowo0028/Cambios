import React from "react";
import { type ItemCarrito } from "../services/carritoService";

export interface CarritoProps {
  carrito: ItemCarrito[];
  incrementar: (id: number) => void;
  decrementar: (id: number) => void;
  eliminarDelCarrito: (id: number) => void;
  limpiarCarrito: () => void;   // 👈 NECESARIO
  total: number;
}

export default function Carrito({
  carrito,
  incrementar,
  decrementar,
  eliminarDelCarrito,
  limpiarCarrito,
  total
}: CarritoProps) {
  return (
    <div className="carrito-container">
      <h2>Carrito de compras</h2>

      {carrito.map((item) => (
        <div key={item.id} className="carrito-item">
          <img src={item.imageUrl} alt={item.productoNombre} />

          <div>
            <h3>{item.productoNombre}</h3>
            <p>${item.productoPrecio}</p>

            <div className="cantidad">
              <button onClick={() => decrementar(item.id)}>-</button>
              <span>{item.cantidad}</span>
              <button onClick={() => incrementar(item.id)}>+</button>
            </div>

            <button onClick={() => eliminarDelCarrito(item.id)}>
              Eliminar
            </button>
          </div>
        </div>
      ))}

      <h3>Total: ${total}</h3>

      <button onClick={limpiarCarrito} style={{ marginTop: "1rem" }}>
        Vaciar carrito
      </button>
    </div>
  );
}
