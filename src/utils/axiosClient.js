import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log('API URL:', API_URL);

// Crear instancia de Axios
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor de request - Añade el token a cada petición
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response - Maneja refresh automático
axiosClient.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('Response error:', {
      status: error.response?.status,
      url: originalRequest?.url,
      data: error.response?.data,
      message: error.message
    });

    // Si el error es 401 y no hemos intentado refresh aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          console.error('No refresh token available');
          throw new Error('No refresh token');
        }

        console.log('Attempting token refresh...');

        // Intentar refrescar el token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        console.log('Token refresh successful');

        const { access_token, refresh_token: new_refresh_token } = response.data;

        // Guardar nuevos tokens
        localStorage.setItem('access_token', access_token);
        
        if (new_refresh_token) {
          localStorage.setItem('refresh_token', new_refresh_token);
        }

        // Actualizar header del request original
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Reintentar request original con nuevo token
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Si falla el refresh, limpiar storage y redirigir a login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Solo redirigir si no estamos ya en login/register
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Si el error es de red
    if (error.message === 'Network Error') {
      console.error('Network error - Backend might be down');
      error.message = 'No se puede conectar al servidor. Verifica que el backend esté corriendo.';
    }

    // Si es timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      error.message = 'La solicitud tardó demasiado tiempo. Intenta nuevamente.';
    }

    return Promise.reject(error);
  }
);

export default axiosClient;