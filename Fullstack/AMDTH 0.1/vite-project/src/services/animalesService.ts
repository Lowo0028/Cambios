// src/services/animalesService.ts
import { MICROSERVICES, apiRequest } from './api.config';

export interface Animal {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: string;
  descripcion: string;
  imagen: string; // URL de la imagen
  isAdoptado: boolean;
}

export const animalesService = {
  // Obtener todos los animales
  async getAll(): Promise<Animal[]> {
    return await apiRequest(`${MICROSERVICES.ANIMALES}`);
  },

  // Obtener animales disponibles
  async getDisponibles(): Promise<Animal[]> {
    return await apiRequest(`${MICROSERVICES.ANIMALES}/disponibles`);
  },

  // Obtener animal por ID
  async getById(id: number): Promise<Animal> {
    return await apiRequest(`${MICROSERVICES.ANIMALES}/${id}`);
  },

  // Obtener imagen de un animal
  getImageUrl(id: number): string {
    return `${MICROSERVICES.ANIMALES}/${id}/imagen`;
  },

  // Buscar animales por nombre
  async buscarPorNombre(nombre: string): Promise<Animal[]> {
    return await apiRequest(`${MICROSERVICES.ANIMALES}/buscar?nombre=${nombre}`);
  },

  // Obtener por especie
  async getPorEspecie(especie: string): Promise<Animal[]> {
    return await apiRequest(`${MICROSERVICES.ANIMALES}/especie/${especie}`);
  },

  // === ADMIN ONLY ===
  
  // Crear animal (solo admin)
  async crear(animal: Partial<Animal>, emailAdmin: string): Promise<Animal> {
    return await apiRequest(`${MICROSERVICES.ANIMALES}`, {
      method: 'POST',
      body: JSON.stringify({ ...animal, emailAdmin }),
    });
  },

  // Actualizar animal (solo admin)
  async actualizar(id: number, animal: Partial<Animal>, emailAdmin: string): Promise<Animal> {
    return await apiRequest(`${MICROSERVICES.ANIMALES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...animal, emailAdmin }),
    });
  },

  // Eliminar animal (solo admin)
  async eliminar(id: number, emailAdmin: string): Promise<void> {
    return await apiRequest(`${MICROSERVICES.ANIMALES}/${id}?emailAdmin=${emailAdmin}`, {
      method: 'DELETE',
    });
  },

  // Marcar como adoptado (solo admin)
  async marcarComoAdoptado(id: number, emailAdmin: string): Promise<void> {
    return await apiRequest(`${MICROSERVICES.ANIMALES}/${id}/adoptar?emailAdmin=${emailAdmin}`, {
      method: 'PUT',
    });
  }
};