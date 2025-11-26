import React from "react";
import "../../assets/css/style.css";

interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  cantidad: number;
}

interface CarritoProps {
  carrito: ItemCarrito[];
  incrementar: (id: number) => void;
  decrementar: (id: number) => void;
  eliminarDelCarrito: (id: number) => void;
  total: number;
  limpiarCarrito: () => void;
}

export default function Carrito({
  carrito,
  incrementar,
  decrementar,
  eliminarDelCarrito,
  total,
  limpiarCarrito,
}: CarritoProps) {
  if (carrito.length === 0) return null;

  return (
    <div className="carrito" style={{ marginTop: "3rem" }}>
      <h3>🧺 Carrito de Compras</h3>

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
            <img
              src={item.imagen}
              alt={item.nombre}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <div style={{ flex: 1 }}>
              <strong>{item.nombre}</strong>
              <br />
              ${item.precio.toLocaleString("es-CL")} x {item.cantidad} ={" "}
              <strong>
                ${(item.precio * item.cantidad).toLocaleString("es-CL")}
              </strong>
            </div>

            <div>
              <button
                onClick={() => decrementar(item.id)}
                className="btn-restar"
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginRight: "5px",
                }}
              >
                -
              </button>
              <button
                onClick={() => incrementar(item.id)}
                className="btn-sumar"
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginRight: "10px",
                }}
              >
                +
              </button>

              <button
                onClick={() => eliminarDelCarrito(item.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#d32f2f",
                  cursor: "pointer",
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
        onClick={() => {
          alert("Compra realizada con éxito 🥳");
          limpiarCarrito();
        }}
      >
        Finalizar compra
      </button>
    </div>
  );
}
