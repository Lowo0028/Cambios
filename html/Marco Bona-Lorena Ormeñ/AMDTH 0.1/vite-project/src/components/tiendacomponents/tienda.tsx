import React from "react";
import { products } from "../../data/productos.mock";
import "../../assets/css/style.css";

interface Product {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

interface TiendaProps {
  agregarAlCarrito: (producto: Product) => void;
}

export default function Tienda({ agregarAlCarrito }: TiendaProps) {
  return (
    <section className="tienda">
      <h2>🛍️ Tienda de Productos</h2>

      <div className="productos-container">
        {products.map((p) => (
          <div key={p.id} className="producto-card">
            <img src={p.imagen} alt={p.nombre} className="producto-imagen" />
            <h3>{p.nombre}</h3>
            <p>
              <strong>Categoría:</strong> {p.categoria}
            </p>
            <p>{p.descripcion}</p>
            <p className="precio">${p.precio.toLocaleString("es-CL")}</p>
            <button
              className="btn-adoptar"
              onClick={() => agregarAlCarrito(p)}
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
