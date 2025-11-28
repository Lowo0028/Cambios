// src/services/api.config.ts
//eureka:
export const API_BASE_URL = 'http://localhost:8761'; 

export const MICROSERVICES = {
  AUTH: 'http://localhost:8090/auth',           // usuarios-service
  CATALOGO: 'http://localhost:8091/productos',  // catalogo-service
  CARRITO: 'http://localhost:8092/carrito',     // carrito-service
  ANIMALES: 'http://localhost:8093/animales',   // animales-service
  FORMULARIO: 'http://localhost:8094/formularios', // formulario-service
  ORDEN: 'http://localhost:8095/ordenes'        // orden-service
};

// Configuración de headers
export const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Función helper para hacer peticiones
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};