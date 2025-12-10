/**
 * Servicio para gestión de Productos/Recetas
 * Maneja todas las operaciones CRUD relacionadas con productos y sus ingredientes
 */
import axiosClient from '../../utils/axiosClient';

const productsService = {
  /**
   * Obtiene todos los productos con filtros
   * @param {number} skip - Registros a omitir
   * @param {number} limit - Límite de registros
   * @param {boolean} activeOnly - Solo productos activos
   * @param {string|null} category - Filtrar por categoría
   * @returns {Promise<Array>} Lista de productos
   */
  getProducts: async (skip = 0, limit = 100, activeOnly = false, category = null) => {
    const params = { skip, limit, active_only: activeOnly };
    if (category) params.category = category;

    const response = await axiosClient.get('/products/', { params });
    return response.data;
  },

  /**
   * Obtiene un producto por ID con todos sus ingredientes
   * @param {number} productId - ID del producto
   * @returns {Promise<Object>} Producto completo
   */
  getProductById: async (productId) => {
    const response = await axiosClient.get(`/products/${productId}`);
    return response.data;
  },

  /**
   * Crea un nuevo producto con ingredientes
   * @param {Object} productData - Datos del producto
   * @returns {Promise<Object>} Producto creado
   */
  createProduct: async (productData) => {
    const response = await axiosClient.post('/products/', productData);
    return response.data;
  },

  /**
   * Actualiza un producto (sin modificar ingredientes)
   * @param {number} productId - ID del producto
   * @param {Object} productData - Datos a actualizar
   * @returns {Promise<Object>} Producto actualizado
   */
  updateProduct: async (productId, productData) => {
    const response = await axiosClient.put(`/products/${productId}`, productData);
    return response.data;
  },

  /**
   * Actualiza solo los ingredientes de un producto
   * IMPORTANTE: Elimina todos los ingredientes anteriores y crea los nuevos
   * @param {number} productId - ID del producto
   * @param {Array} ingredients - Lista de ingredientes
   * @returns {Promise<Object>} Producto actualizado
   */
  updateIngredients: async (productId, ingredients) => {
    const response = await axiosClient.put(`/products/${productId}/ingredients`, {
      ingredients
    });
    return response.data;
  },

  /**
   * Desactiva un producto (soft delete)
   * @param {number} productId - ID del producto
   * @returns {Promise<Object>} Producto desactivado
   */
  deactivateProduct: async (productId) => {
    const response = await axiosClient.delete(`/products/${productId}`);
    return response.data;
  },

  /**
   * Reactiva un producto
   * @param {number} productId - ID del producto
   * @returns {Promise<Object>} Producto reactivado
   */
  activateProduct: async (productId) => {
    const response = await axiosClient.put(`/products/${productId}`, {
      is_active: true
    });
    return response.data;
  },

  /**
   * Obtiene todas las categorías únicas de productos
   * @returns {Promise<Array>} Lista de categorías
   */
  getCategories: async () => {
    const response = await axiosClient.get('/products/', {
      params: { limit: 100 }
    });

    // Extraer categorías únicas del lado del cliente
    const categories = [...new Set(
      response.data
        .map(product => product.category)
        .filter(cat => cat != null)
    )].sort();

    return categories;
  }
};

export default productsService;
