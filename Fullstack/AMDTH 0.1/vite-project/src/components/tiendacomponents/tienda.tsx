// src/components/tiendacomponents/tienda.tsx - VERSIÓN ACTUALIZADA
import React, { useEffect, useState } from "react";
import { productosService, type Producto } from "../../services/productosService";
import "../../assets/css/style.css";

interface TiendaProps {
  agregarAlCarrito: (producto: Producto) => void;
}

export default function Tienda({ agregarAlCarrito }: TiendaProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar productos desde el microservicio
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        const data = await productosService.getAll();
        setProductos(data);
      } catch (err: any) {
        console.error("Error al cargar productos:", err);
        setError("Error al cargar los productos. Verifica que el microservicio esté funcionando.");
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  const handleAgregar = async (producto: Producto) => {
    try {
      await agregarAlCarrito(producto);
      alert(`${producto.nombre} agregado al carrito 🛒`);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      alert("Error al agregar al carrito");
    }
  };

  if (loading) {
    return (
      <section className="tienda">
        <h2>🛍️ Tienda de Productos</h2>
        <div style={{ textAlign: "center", padding: "4rem" }}>
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
          <p>Cargando productos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="tienda">
        <h2>🛍️ Tienda de Productos</h2>
        <div
          style={{
            textAlign: "center",
            padding: "4rem",
            background: "#ffebee",
            borderRadius: "10px",
            margin: "2rem auto",
            maxWidth: "600px",
          }}
        >
          <p style={{ color: "#c62828", fontWeight: 600 }}>{error}</p>
          <p style={{ color: "#666", marginTop: "1rem", fontSize: "0.9rem" }}>
            Asegúrate de que el microservicio de Catálogo esté corriendo en el puerto 8091
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="tienda">
      <h2>🛍️ Tienda de Productos</h2>

      <div className="productos-container">
        {productos.map((p) => (
          <div key={p.id} className="producto-card">
            <img 
              src={productosService.getImageUrl(p.id)} 
              alt={p.nombre} 
              className="producto-imagen"
              onError={(e) => {
                // Imagen por defecto si falla la carga
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/180?text=Sin+imagen";
              }}
            />
            <h3>{p.nombre}</h3>
            <p>
              <strong>Categoría:</strong> {p.categoria}
            </p>
            <p>{p.descripcion}</p>
            <p className="precio">${p.precio.toLocaleString("es-CL")}</p>
            <button
              className="btn-adoptar"
              onClick={() => handleAgregar(p)}
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>

      {productos.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", color: "#666" }}>
          <p>No hay productos disponibles en este momento</p>
        </div>
      )}
    </section>
  );
}