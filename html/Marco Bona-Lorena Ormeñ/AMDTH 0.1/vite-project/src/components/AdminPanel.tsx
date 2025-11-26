import React, { useState } from "react";
import { useAppData } from "../contexts/AppDataContext";
import type { Animal, Product } from "../contexts/AppDataContext";
export default function AdminPanel() {
  const ctx = useAppData();
  const [view, setView] = useState<"animals" | "products">("animals");
  const [editItem, setEditItem] = useState<Animal | Product | null>(null);

  const isAnimalsView = view === "animals";
  const items = isAnimalsView ? ctx.animals : ctx.products;

  const handleDelete = (id: number) => {
    if (isAnimalsView) ctx.deleteAnimal(id);
    else ctx.deleteProduct(id);
  };

  const handleEdit = (item: Animal | Product) => {
    setEditItem(item);
  };

  const handleSave = (payload: any) => {
    if (isAnimalsView) {
      if ((payload as Animal).id) ctx.updateAnimal(payload);
      else ctx.addAnimal(payload);
    } else {
      if ((payload as Product).id) ctx.updateProduct(payload);
      else ctx.addProduct(payload);
    }
    setEditItem(null);
  };

  const handleCancel = () => setEditItem(null);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "400px",
        height: "100vh",
        background: "#fff",
        boxShadow: "-3px 0 10px rgba(0,0,0,0.2)",
        padding: "20px",
        overflowY: "auto",
        zIndex: 9998,
      }}
    >
      <h2 style={{ marginTop: 0 }}>Panel de Administración</h2>

      {/* Botones de cambio de vista */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button
          onClick={() => setView("animals")}
          style={{
            flex: 1,
            padding: "8px",
            background: isAnimalsView ? "#333" : "#eee",
            color: isAnimalsView ? "#fff" : "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Animales
        </button>
        <button
          onClick={() => setView("products")}
          style={{
            flex: 1,
            padding: "8px",
            background: !isAnimalsView ? "#333" : "#eee",
            color: !isAnimalsView ? "#fff" : "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Productos
        </button>
      </div>

      {/* Formulario de edición/agregado */}
      {editItem ? (
        <AdminForm
          key={editItem ? (editItem as any).id : "new"}
          item={editItem}
          onSave={handleSave}
          onCancel={handleCancel}
          isAnimal={isAnimalsView}
        />
      ) : (
        <>
          <button
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
            style={{
              padding: "8px 12px",
              marginBottom: "12px",
              border: "none",
              borderRadius: "4px",
              background: "#008cba",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            + Nuevo {isAnimalsView ? "Animal" : "Producto"}
          </button>

          {/* Lista de items */}
          {items.length === 0 ? (
            <p>No hay {isAnimalsView ? "animales" : "productos"} registrados.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {items.map((item: any) => (
                <li
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "6px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{item.nombre}</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        padding: "4px 8px",
                        background: "#f0ad4e",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        padding: "4px 8px",
                        background: "#d9534f",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

/* --- Formulario interno para agregar/editar --- */
function AdminForm({
  item,
  onSave,
  onCancel,
  isAnimal,
}: {
  item: Animal | Product;
  onSave: (payload: any) => void;
  onCancel: () => void;
  isAnimal: boolean;
}) {
  const [form, setForm] = useState<any>(item);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(form)
        .filter((k) => k !== "id")
        .map((key) => (
          <div key={key} style={{ marginBottom: "8px" }}>
            <label style={{ display: "block", fontSize: "0.85em" }}>
              {key.toUpperCase()}
            </label>
            <input
              name={key}
              value={(form as any)[key]}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "6px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
        ))}

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="submit"
          style={{
            flex: 1,
            background: "#5cb85c",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px",
            cursor: "pointer",
          }}
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            background: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
