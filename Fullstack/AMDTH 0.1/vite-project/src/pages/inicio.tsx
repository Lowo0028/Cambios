import React, { useState } from "react";
import { animals } from "../data/animales.mocks";
import { products } from "../data/productos.mock";

export default function Inicio() {
  const [busqueda, setBusqueda] = useState("");

  // Filtrar animales y productos según búsqueda
  const animalesFiltrados = animals.filter((a) =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const productosFiltrados = products.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Mostrar solo los primeros 3 resultados combinados
  const resultados = [...animalesFiltrados, ...productosFiltrados].slice(0, 3);

  // navegación por hash (como usa App.tsx)
  const irA = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <div className="inicio">
      <h2>🐾 Bienvenido</h2>

      {/* Buscador */}
      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar animales o productos..."
          className="buscador-input"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Resultados */}
      <div className="animales-container">
        {resultados.map((item) => (
          <div key={item.id} className="animal-card">
            <img
              src={item.imagen}
              alt={item.nombre}
              className="animal-imagen"
            />
            <h3>{item.nombre}</h3>
            <p>{item.descripcion}</p>

            {/* Si el objeto tiene "estado", asumimos que es un animal */}
            {"estado" in item ? (
              <button
                className="btn-adoptar"
                onClick={() => irA("#adopcion")}
              >
                Adoptar
              </button>
            ) : (
              <button
                className="btn-adoptar"
                onClick={() => irA("#tienda")}
              >
                Ver producto
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
