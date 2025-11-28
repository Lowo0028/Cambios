// src/services/formularioService.ts
import { MICROSERVICES, apiRequest } from './api.config';

export interface FormularioAdopcion {
  id?: number;
  usuarioId: number;
  animalId: number;
  direccion: string;
  tipoVivienda: string;
  tieneMallasVentanas: boolean;
  viveEnDepartamento: boolean;
  tieneOtrosAnimales: boolean;
  motivoAdopcion: string;
  estado?: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  comentariosAdmin?: string;
  fechaCreacion?: string;
  fechaRevision?: string;
}

export const formularioService = {
  // Obtener todos los formularios (solo admin)
  async getAll(emailAdmin: string): Promise<FormularioAdopcion[]> {
    return await apiRequest(`${MICROSERVICES.FORMULARIO}?emailAdmin=${emailAdmin}`);
  },

  // Obtener formulario por ID
  async getById(id: number): Promise<FormularioAdopcion> {
    return await apiRequest(`${MICROSERVICES.FORMULARIO}/${id}`);
  },

  // Obtener formularios de un usuario
  async getByUsuario(usuarioId: number): Promise<FormularioAdopcion[]> {
    return await apiRequest(`${MICROSERVICES.FORMULARIO}/usuario/${usuarioId}`);
  },

  // Obtener formularios de un animal
  async getByAnimal(animalId: number): Promise<FormularioAdopcion[]> {
    return await apiRequest(`${MICROSERVICES.FORMULARIO}/animal/${animalId}`);
  },

  // Obtener formularios por estado (solo admin)
  async getByEstado(estado: string, emailAdmin: string): Promise<FormularioAdopcion[]> {
    return await apiRequest(`${MICROSERVICES.FORMULARIO}/estado/${estado}?emailAdmin=${emailAdmin}`);
  },

  // Crear formulario de adopción
  async crear(
    usuarioId: number, 
    animalId: number, 
    formularioData: {
      direccion: string;
      tipoVivienda: string;
      tieneMallasVentanas: boolean;
      viveEnDepartamento: boolean;
      tieneOtrosAnimales: boolean;
      motivoAdopcion: string;
    }
  ): Promise<FormularioAdopcion> {
    return await apiRequest(`${MICROSERVICES.FORMULARIO}/adoptar/${usuarioId}/${animalId}`, {
      method: 'POST',
      body: JSON.stringify(formularioData),
    });
  },

  // Aprobar formulario (solo admin)
  async aprobar(id: number, emailAdmin: string, comentarios: string = ''): Promise<FormularioAdopcion> {
    return await apiRequest(`${MICROSERVICES.FORMULARIO}/${id}/aprobar`, {
      method: 'PUT',
      body: JSON.stringify({ emailAdmin, comentarios }),
    });
  },

  // Rechazar formulario (solo admin)
  async rechazar(id: number, emailAdmin: string, comentarios: string = ''): Promise<FormularioAdopcion> {
    return await apiRequest(`${MICROSERVICES.FORMULARIO}/${id}/rechazar`, {
      method: 'PUT',
      body: JSON.stringify({ emailAdmin, comentarios }),
    });
  },

  // Eliminar formulario (solo admin)
  async eliminar(id: number, emailAdmin: string): Promise<void> {
    return await apiRequest(`${MICROSERVICES.FORMULARIO}/${id}?emailAdmin=${emailAdmin}`, {
      method: 'DELETE',
    });
  }
};