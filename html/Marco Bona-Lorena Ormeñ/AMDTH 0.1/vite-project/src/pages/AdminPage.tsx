import React, { useState } from "react";
import { useAppData } from "../contexts/AppDataContext";
import type { Animal, Product } from "../contexts/AppDataContext";

export default function AdminPage() {
  const ctx = useAppData();
  const [isAnimalsView, setIsAnimalsView] = useState(true);
  const [editItem, setEditItem] = useState<Animal | Product | null>(null);

  const handleSave = (payload: any) => {
    if (isAnimalsView) {
      const animal = payload as Animal;
      if (editItem) ctx.updateAnimal(animal);
      else ctx.addAnimal({ ...animal, id: Date.now() });
    } else {
      const product = payload as Product;
      if (editItem) ctx.updateProduct(product);
      else ctx.addProduct({ ...product, id: Date.now() });
    }
    setEditItem(null);
  };

  const handleDelete = (id: number) => {
    if (isAnimalsView) ctx.deleteAnimal(id);
    else ctx.deleteProduct(id);
  };

  const handleEdit = (item: Animal | Product) => setEditItem(item);

  const handleCancel = () => setEditItem(null);

  return (
    <div className="admin-page">
      <h1>Panel de administración</h1>

      {/* Selector de vista */}
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          className="admin-btn"
          style={{
            marginRight: 8,
            opacity: isAnimalsView ? 1 : 0.6,
          }}
          onClick={() => setIsAnimalsView(true)}
        >
          Animales
        </button>
        <button
          className="admin-btn"
          style={{
            opacity: !isAnimalsView ? 1 : 0.6,
          }}
          onClick={() => setIsAnimalsView(false)}
        >
          Productos
        </button>
      </div>

      {/* Lista de items */}
      <div className="admin-section">
        <h2>{isAnimalsView ? "Animales" : "Productos"}</h2>
        <ul className="admin-list">
          {isAnimalsView
            ? ctx.animals.map((a) => (
                <li key={a.id}>
                  <div>
                    <strong>{a.nombre}</strong> —{" "}
                    <span
                      className={
                        a.estado === "Disponible"
                          ? "estado-disponible"
                          : "estado-adoptado"
                      }
                    >
                      {a.estado}
                    </span>
                  </div>
                  <div>
                    <button
                      className="admin-btn"
                      onClick={() => handleEdit(a)}
                    >
                      Editar
                    </button>
                    <button
                      className="admin-btn"
                      onClick={() => handleDelete(a.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))
            : ctx.products.map((p) => (
                <li key={p.id}>
                  <div>
                    <strong>{p.nombre}</strong> — ${p.precio}
                  </div>
                  <div>
                    <button
                      className="admin-btn"
                      onClick={() => handleEdit(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="admin-btn"
                      onClick={() => handleDelete(p.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
        </ul>

        <button
          className="admin-btn btn-nuevo"
          onClick={() =>
            setEditItem(
              isAnimalsView
                ? ({
                    id: 0,
                    nombre: "",
                    especie: "",
                    raza: "",
                    edad: "",
                    descripcion: "",
                    imagen: "",
                    estado: "Disponible",
                  } as Animal)
                : ({
                    id: 0,
                    nombre: "",
                    categoria: "",
                    descripcion: "",
                    precio: 0,
                    imagen: "",
                  } as Product)
            )
          }
        >
          + Agregar nuevo {isAnimalsView ? "animal" : "producto"}
        </button>
      </div>

      {/* Formulario de edición / creación */}
      {editItem && (
        <div className="admin-section" style={{ maxWidth: 500, margin: "0 auto" }}>
          <h3>
            {editItem.id ? "Editar" : "Agregar nuevo"}{" "}
            {isAnimalsView ? "animal" : "producto"}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave(editItem);
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              background: "#fff",
              padding: "1rem",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {isAnimalsView ? (
              <>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={(editItem as Animal).nombre}
                  onChange={(e) =>
                    setEditItem({ ...(editItem as Animal), nombre: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Especie"
                  value={(editItem as Animal).especie}
                  onChange={(e) =>
                    setEditItem({ ...(editItem as Animal), especie: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Raza"
                  value={(editItem as Animal).raza}
                  onChange={(e) =>
                    setEditItem({ ...(editItem as Animal), raza: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Edad"
                  value={(editItem as Animal).edad}
                  onChange={(e) =>
                    setEditItem({ ...(editItem as Animal), edad: e.target.value })
                  }
                />
                <select
                  value={(editItem as Animal).estado}
                  onChange={(e) =>
                    setEditItem({
                      ...(editItem as Animal),
                      estado: e.target.value as "Disponible" | "Adoptado",
                    })
                  }
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Adoptado">Adoptado</option>
                </select>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={(editItem as Product).nombre}
                  onChange={(e) =>
                    setEditItem({ ...(editItem as Product), nombre: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Categoría"
                  value={(editItem as Product).categoria}
                  onChange={(e) =>
                    setEditItem({
                      ...(editItem as Product),
                      categoria: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={(editItem as Product).precio}
                  onChange={(e) =>
                    setEditItem({
                      ...(editItem as Product),
                      precio: parseFloat(e.target.value),
                    })
                  }
                />
              </>
            )}
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
              <button type="submit" className="admin-btn">
                Guardar
              </button>
              <button type="button" className="admin-btn" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
