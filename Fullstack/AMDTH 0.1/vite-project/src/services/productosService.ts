// src/services/productosService.ts
import { MICROSERVICES, apiRequest } from './api.config';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
}

export const productosService = {
  // Obtener todos los productos
  async getAll(): Promise<Producto[]> {
    return await apiRequest(`${MICROSERVICES.CATALOGO}`);
  },

  // Obtener producto por ID
  async getById(id: number): Promise<Producto> {
    return await apiRequest(`${MICROSERVICES.CATALOGO}/${id}`);
  },

  // Obtener imagen de un producto
  getImageUrl(id: number): string {
    return `${MICROSERVICES.CATALOGO}/${id}/imagen`;
  },

  // Buscar productos por nombre
  async buscarPorNombre(nombre: string): Promise<Producto[]> {
    return await apiRequest(`${MICROSERVICES.CATALOGO}/buscar?nombre=${nombre}`);
  },

  // Obtener por categoría
  async getPorCategoria(categoria: string): Promise<Producto[]> {
    return await apiRequest(`${MICROSERVICES.CATALOGO}/categoria/${categoria}`);
  },

  // === ADMIN ONLY ===
  
  // Crear producto (solo admin)
  async crear(producto: Partial<Producto>, emailAdmin: string): Promise<Producto> {
    return await apiRequest(`${MICROSERVICES.CATALOGO}`, {
      method: 'POST',
      body: JSON.stringify({ ...producto, emailAdmin }),
    });
  },

  // Actualizar producto (solo admin)
  async actualizar(id: number, producto: Partial<Producto>, emailAdmin: string): Promise<Producto> {
    return await apiRequest(`${MICROSERVICES.CATALOGO}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...producto, emailAdmin }),
    });
  },

  // Eliminar producto (solo admin)
  async eliminar(id: number, emailAdmin: string): Promise<void> {
    return await apiRequest(`${MICROSERVICES.CATALOGO}/${id}?emailAdmin=${emailAdmin}`, {
      method: 'DELETE',
    });
  }
};