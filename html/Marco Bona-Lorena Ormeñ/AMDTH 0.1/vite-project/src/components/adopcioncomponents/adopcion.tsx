import React, { useState } from "react";
import { animals } from "../../data/animales.mocks";
import "../../assets/css/style.css"; // asegúrate de importar tus estilos globales

export default function Adopcion() {
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnimal === null) {
      alert("Por favor selecciona un animal antes de enviar el formulario.");
      return;
    }
    alert(
      `Solicitud enviada correctamente 🐾\n\nAnimal: ${
        animals.find((a) => a.id === selectedAnimal)?.nombre
      }\nNombre: ${formData.nombre}\nCorreo: ${formData.email}`
    );
    setFormData({ nombre: "", email: "", mensaje: "" });
    setSelectedAnimal(null);
  };

  const handleClose = () => setSelectedAnimal(null);

  return (
    <section className="adopcion">
      <h2>Adopta un Amigo 🐕</h2>

      <div className="animales-container">
        {animals.map((animal) => (
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
          >
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
        ))}
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
