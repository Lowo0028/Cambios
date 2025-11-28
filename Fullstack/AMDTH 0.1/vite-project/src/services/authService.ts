// src/services/authService.ts
import { MICROSERVICES, apiRequest } from './api.config';

export interface LoginRequest {
  email: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  telefono: string;
  contrasena: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  isAdmin: boolean;
}

export const authService = {
  // Login
  async login(data: LoginRequest): Promise<{ success: boolean; message: string }> {
    const response = await apiRequest(`${MICROSERVICES.AUTH}/login`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success) {
      // Obtener datos completos del usuario
      const user = await this.getUserByEmail(data.email);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }

    return response;
  },

  // Registro
  async register(data: RegisterRequest): Promise<User> {
    return await apiRequest(`${MICROSERVICES.AUTH}/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Obtener usuario por email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await apiRequest(`${MICROSERVICES.AUTH}/usuario/correo/${email}`);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  },

  // Obtener usuario por ID
  async getUserById(id: number): Promise<User | null> {
    try {
      return await apiRequest(`${MICROSERVICES.AUTH}/usuarios/${id}`);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  },

  // Obtener usuario actual
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },

  // Verificar si es admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.isAdmin || false;
  }
};