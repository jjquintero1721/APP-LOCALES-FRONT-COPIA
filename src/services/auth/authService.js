import axiosClient from '../../utils/axiosClient';

const authService = {
  // Registro de usuario
  register: async (userData) => {
    try {
      const response = await axiosClient.post('/auth/register', userData);
      console.log('Register response:', response.data);
      
      // El backend puede devolver los tokens directamente o requerir un login posterior
      // Verifica si hay tokens en la respuesta
      if (response.data.access_token && response.data.refresh_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        
        // Obtener información del usuario
        const userResponse = await axiosClient.get('/users/me');
        localStorage.setItem('user', JSON.stringify(userResponse.data));
        
        return {
          ...response.data,
          user: userResponse.data
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      const { access_token, refresh_token } = response.data;

      // Guardar tokens
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // Obtener información del usuario
      const userResponse = await axiosClient.get('/users/me');
      const user = userResponse.data;
      
      localStorage.setItem('user', JSON.stringify(user));

      return {
        access_token,
        refresh_token,
        user
      };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Refresh token
  refresh: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axiosClient.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: new_refresh_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      
      // Actualizar refresh token si viene en la respuesta
      if (new_refresh_token) {
        localStorage.setItem('refresh_token', new_refresh_token);
      }

      return response.data;
    } catch (error) {
      console.error('Refresh error:', error.response?.data || error.message);
      // Si falla el refresh, limpiar todo y forzar re-login
      authService.logout();
      throw error;
    }
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    try {
      const response = await axiosClient.get('/users/me');
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Get current user error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Verificar si hay sesión activa
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  // Obtener usuario del localStorage
  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  },

  // Obtener token almacenado
  getStoredToken: () => {
    return localStorage.getItem('access_token');
  },

  // Obtener refresh token almacenado
  getStoredRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },
};

export default authService;