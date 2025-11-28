// src/components/carrito/carrito.tsx - VERSIÓN ACTUALIZADA
import React from "react";
import "../../assets/css/style.css";
import { type ItemCarrito } from "../../services/carritoService";

interface CarritoProps {
  carrito: ItemCarrito[];
  incrementar: (itemId: number) => void;
  decrementar: (itemId: number) => void;
  eliminarDelCarrito: (itemId: number) => void;
  total: number;
  finalizarCompra: () => void;
  loading?: boolean;
}

export default function Carrito({
  carrito,
  incrementar,
  decrementar,
  eliminarDelCarrito,
  total,
  finalizarCompra,
  loading = false
}: CarritoProps) {
  if (carrito.length === 0) return null;

  const handleFinalizarCompra = async () => {
    try {
      await finalizarCompra();
      alert("¡Compra realizada con éxito! 🥳");
    } catch (error) {
      alert("Error al finalizar la compra. Intenta nuevamente.");
      console.error(error);
    }
  };

  return (
    <div className="carrito" style={{ marginTop: "3rem" }}>
      <h3>🧺 Carrito de Compras</h3>

      {loading && (
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <p>Cargando carrito...</p>
        </div>
      )}

      <ul>
        {carrito.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.productoNombre}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <strong>{item.productoNombre}</strong>
              <br />
              ${item.productoPrecio.toLocaleString("es-CL")} x {item.cantidad} ={" "}
              <strong>
                ${(item.productoPrecio * item.cantidad).toLocaleString("es-CL")}
              </strong>
            </div>

            <div>
              <button
                onClick={() => decrementar(item.id!)}
                className="btn-restar"
                disabled={loading}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginRight: "5px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                -
              </button>
              <button
                onClick={() => incrementar(item.id!)}
                className="btn-sumar"
                disabled={loading}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginRight: "10px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                +
              </button>

              <button
                onClick={() => eliminarDelCarrito(item.id!)}
                disabled={loading}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#d32f2f",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                ✖
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p>
        <strong>Total:</strong> ${total.toLocaleString("es-CL")}
      </p>

      <button
        className="btn-adoptar"
        onClick={handleFinalizarCompra}
        disabled={loading}
        style={{
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Procesando..." : "Finalizar compra"}
      </button>
    </div>
  );
}