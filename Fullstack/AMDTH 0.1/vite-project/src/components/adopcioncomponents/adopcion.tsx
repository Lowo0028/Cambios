import React, { useState, useEffect } from "react";
import { useAppData } from "../../contexts/AppDataContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useAuth } from "../../contexts/AuthContext";
import "../../assets/css/style.css";

export default function Adopcion() {
  const { animals } = useAppData();
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<"todos" | "disponibles" | "favoritos">("todos");
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  // ✅ useEffect: Scroll al top cuando cambia el filtro
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filtro]);

  const animalesFiltrados = animals.filter((animal) => {
    if (filtro === "disponibles") return animal.estado === "Disponible";
    if (filtro === "favoritos") return isFavorite(animal.id);
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnimal === null) {
      alert("Por favor selecciona un animal antes de enviar el formulario.");
      return;
    }

    const animal = animals.find((a) => a.id === selectedAnimal);
    alert(
      `Solicitud enviada correctamente 🐾\n\nAnimal: ${animal?.nombre}\nNombre: ${formData.nombre}\nCorreo: ${formData.email}`
    );
    
    setFormData({ nombre: "", email: "", mensaje: "" });
    setSelectedAnimal(null);
  };

  const handleClose = () => setSelectedAnimal(null);

  const handleFavoriteClick = (e: React.MouseEvent, animalId: number) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para agregar favoritos");
      return;
    }
    toggleFavorite(animalId);
  };

  return (
    <section className="adopcion">
      <h2>Adopta un Amigo 🐕</h2>

      {/* Filtros */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button
          onClick={() => setFiltro("todos")}
          style={{
            padding: "0.6rem 1.2rem",
            margin: "0 0.5rem",
            background: filtro === "todos" ? "#7e57c2" : "#e0e0e0",
            color: filtro === "todos" ? "white" : "#333",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Todos ({animals.length})
        </button>
        <button
          onClick={() => setFiltro("disponibles")}
          style={{
            padding: "0.6rem 1.2rem",
            margin: "0 0.5rem",
            background: filtro === "disponibles" ? "#7e57c2" : "#e0e0e0",
            color: filtro === "disponibles" ? "white" : "#333",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Disponibles ({animals.filter((a) => a.estado === "Disponible").length})
        </button>
        {isAuthenticated && (
          <button
            onClick={() => setFiltro("favoritos")}
            style={{
              padding: "0.6rem 1.2rem",
              margin: "0 0.5rem",
              background: filtro === "favoritos" ? "#7e57c2" : "#e0e0e0",
              color: filtro === "favoritos" ? "white" : "#333",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ❤️ Favoritos ({animals.filter((a) => isFavorite(a.id)).length})
          </button>
        )}
      </div>

      <div className="animales-container">
        {animalesFiltrados.length === 0 ? (
          <p style={{ textAlign: "center", width: "100%", color: "#666" }}>
            No hay animales en esta categoría
          </p>
        ) : (
          animalesFiltrados.map((animal) => (
            <div
              key={animal.id}
              className={`animal-card ${
                animal.estado === "Adoptado" ? "no-disponible" : ""
              }`}
              onClick={() =>
                animal.estado === "Disponible"
                  ? setSelectedAnimal(animal.id)
                  : null
              }
              style={{ position: "relative" }}
            >
              {/* Botón de favorito */}
              {isAuthenticated && (
                <button
                  onClick={(e) => handleFavoriteClick(e, animal.id)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    transition: "transform 0.2s",
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {isFavorite(animal.id) ? "❤️" : "🤍"}
                </button>
              )}

              <img src={animal.imagen} alt={animal.nombre} />
              <h3>{animal.nombre}</h3>
              <p>
                {animal.especie} • {animal.raza}
              </p>
              <p className="descripcion">{animal.descripcion}</p>
              <p
                className={`estado ${
                  animal.estado === "Disponible" ? "disponible" : "adoptado"
                }`}
              >
                {animal.estado}
              </p>
            </div>
          ))
        )}
      </div>

      {selectedAnimal !== null && (
        <div className="modal-adopcion">
          <div className="modal-contenido">
            <button className="btn-cerrar" onClick={handleClose}>
              ✖
            </button>

            {(() => {
              const animal = animals.find((a) => a.id === selectedAnimal);
              if (!animal) return null;
              return (
                <>
                  <img
                    src={animal.imagen}
                    alt={animal.nombre}
                    className="imagen-modal"
                  />
                  <h2>{animal.nombre}</h2>
                  <p>
                    <strong>Especie:</strong> {animal.especie}
                  </p>
                  <p>
                    <strong>Raza:</strong> {animal.raza}
                  </p>
                  <p>
                    <strong>Edad:</strong> {animal.edad}
                  </p>
                  <p className="descripcion">{animal.descripcion}</p>
                </>
              );
            })()}

            <form className="form-adopcion" onSubmit={handleSubmit}>
              <h3>Formulario de Adopción</h3>

              <label>
                Nombre:
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </label>

              <label>
                Correo electrónico:
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </label>

              <label>
                Mensaje:
                <textarea
                  value={formData.mensaje}
                  onChange={(e) =>
                    setFormData({ ...formData, mensaje: e.target.value })
                  }
                  placeholder="Cuéntanos por qué deseas adoptar"
                />
              </label>

              <button type="submit">Enviar Solicitud</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}