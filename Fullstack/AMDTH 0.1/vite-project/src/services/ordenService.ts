// src/services/ordenService.ts
import { MICROSERVICES, apiRequest } from './api.config';

export interface ItemOrden {
  id?: number;
  ordenId?: number;
  productoId: number;
  productoNombre: string;
  productoPrecio: number;
  cantidad: number;
  imageUrl?: string;
}

export interface Orden {
  id?: number;
  usuarioId: number;
  total: number;
  createdAt?: string;
  status?: 'Completada' | 'Cancelada' | 'Pendiente';
}

export interface DetallesOrden {
  orden: Orden;
  items: ItemOrden[];
  cantidadItems: number;
}

export const ordenService = {
  // Obtener órdenes de un usuario
  async getOrdenesPorUsuario(usuarioId: number): Promise<Orden[]> {
    return await apiRequest(`${MICROSERVICES.ORDEN}/usuario/${usuarioId}`);
  },

  // Obtener items de una orden
  async getItemsDeOrden(ordenId: number): Promise<ItemOrden[]> {
    return await apiRequest(`${MICROSERVICES.ORDEN}/${ordenId}/items`);
  },

  // Crear una nueva orden (checkout)
  async crearOrden(
    usuarioId: number, 
    total: number, 
    items: ItemOrden[]
  ): Promise<Orden> {
    return await apiRequest(`${MICROSERVICES.ORDEN}`, {
      method: 'POST',
      body: JSON.stringify({
        usuarioId,
        total,
        items
      }),
    });
  },

  // Obtener una orden por ID
  async getOrdenPorId(ordenId: number): Promise<Orden> {
    return await apiRequest(`${MICROSERVICES.ORDEN}/${ordenId}`);
  },

  // Obtener detalles completos de una orden
  async getDetallesOrden(ordenId: number): Promise<DetallesOrden> {
    return await apiRequest(`${MICROSERVICES.ORDEN}/${ordenId}/detalles`);
  },

  // Obtener todas las órdenes (admin)
  async getTodasLasOrdenes(): Promise<Orden[]> {
    return await apiRequest(`${MICROSERVICES.ORDEN}`);
  },

  // Cancelar una orden
  async cancelarOrden(ordenId: number): Promise<Orden> {
    return await apiRequest(`${MICROSERVICES.ORDEN}/${ordenId}/cancelar`, {
      method: 'PUT',
    });
  }
};