import axiosClient from '../../utils/axiosClient';

const usersService = {
  // Obtener todos los usuarios del negocio
  getUsers: async () => {
    const response = await axiosClient.get('/users');
    return response.data;
  },

  // Obtener usuario por ID
  getUserById: async (userId) => {
    const response = await axiosClient.get(`/users/${userId}`);
    return response.data;
  },

  // Crear nuevo usuario
  createUser: async (userData) => {
    const response = await axiosClient.post('/users', userData);
    return response.data;
  },

  // Actualizar usuario
  updateUser: async (userId, userData) => {
    const response = await axiosClient.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Eliminar usuario
  deleteUser: async (userId) => {
    const response = await axiosClient.delete(`/users/${userId}`);
    return response.data;
  },
};

export default usersService;
