/**
 * Servicio para gestión de Modificadores y Grupos de Modificadores
 * Incluye endpoints para crear, leer, actualizar y eliminar modificadores
 * así como asignar modificadores a productos
 */
import axiosClient from '../../utils/axiosClient';

// ============= MODIFIER GROUPS =============

/**
 * Obtener todos los grupos de modificadores del negocio
 * @param {number} skip - Número de registros a omitir (paginación)
 * @param {number} limit - Límite de registros (por defecto 100)
 * @param {boolean} activeOnly - Si true, solo devuelve grupos activos
 * @returns {Promise<Array>} Lista de grupos de modificadores
 */
const getModifierGroups = async (skip = 0, limit = 100, activeOnly = false) => {
  const response = await axiosClient.get('/modifiers/groups', {
    params: { skip, limit, active_only: activeOnly },
  });
  return response.data;
};

/**
 * Obtener un grupo de modificadores por ID
 * @param {number} groupId - ID del grupo
 * @returns {Promise<Object>} Grupo de modificadores
 */
const getModifierGroupById = async (groupId) => {
  const response = await axiosClient.get(`/modifiers/groups/${groupId}`);
  return response.data;
};

/**
 * Crear un nuevo grupo de modificadores
 * @param {Object} groupData - Datos del grupo
 * @param {string} groupData.name - Nombre del grupo (requerido)
 * @param {string} groupData.description - Descripción del grupo
 * @param {boolean} groupData.allow_multiple - Si permite seleccionar múltiples modificadores
 * @param {boolean} groupData.is_required - Si es obligatorio seleccionar un modificador
 * @returns {Promise<Object>} Grupo creado
 */
const createModifierGroup = async (groupData) => {
  const response = await axiosClient.post('/modifiers/groups', groupData);
  return response.data;
};

/**
 * Actualizar un grupo de modificadores
 * @param {number} groupId - ID del grupo a actualizar
 * @param {Object} groupData - Datos a actualizar (solo campos presentes se actualizan)
 * @returns {Promise<Object>} Grupo actualizado
 */
const updateModifierGroup = async (groupId, groupData) => {
  const response = await axiosClient.put(`/modifiers/groups/${groupId}`, groupData);
  return response.data;
};

// ============= MODIFIERS =============

/**
 * Obtener todos los modificadores de un grupo
 * @param {number} groupId - ID del grupo
 * @param {boolean} activeOnly - Si true, solo devuelve modificadores activos
 * @returns {Promise<Array>} Lista de modificadores
 */
const getModifiersByGroup = async (groupId, activeOnly = false) => {
  const response = await axiosClient.get(`/modifiers/groups/${groupId}/modifiers`, {
    params: { active_only: activeOnly },
  });
  return response.data;
};

/**
 * Obtener un modificador por ID con todos sus ítems de inventario
 * @param {number} modifierId - ID del modificador
 * @returns {Promise<Object>} Modificador con sus ítems
 */
const getModifierById = async (modifierId) => {
  const response = await axiosClient.get(`/modifiers/${modifierId}`);
  return response.data;
};

/**
 * Crear un nuevo modificador
 * @param {Object} modifierData - Datos del modificador
 * @param {number} modifierData.modifier_group_id - ID del grupo (requerido)
 * @param {string} modifierData.name - Nombre del modificador (requerido)
 * @param {string} modifierData.description - Descripción del modificador
 * @param {number} modifierData.price_extra - Precio adicional (>= 0)
 * @param {Array} modifierData.inventory_items - Array de ítems de inventario (requerido, min 1)
 * @param {number} modifierData.inventory_items[].inventory_item_id - ID del ítem
 * @param {number} modifierData.inventory_items[].quantity - Cantidad (positivo para agregar, negativo para quitar)
 * @returns {Promise<Object>} Modificador creado
 */
const createModifier = async (modifierData) => {
  const response = await axiosClient.post('/modifiers', modifierData);
  return response.data;
};

/**
 * Actualizar un modificador
 * NOTA: No permite actualizar inventory_items (solo campos del modificador)
 * @param {number} modifierId - ID del modificador
 * @param {Object} modifierData - Datos a actualizar
 * @returns {Promise<Object>} Modificador actualizado
 */
const updateModifier = async (modifierId, modifierData) => {
  const response = await axiosClient.put(`/modifiers/${modifierId}`, modifierData);
  return response.data;
};

// ============= PRODUCT MODIFIERS (Compatibilidad) =============

/**
 * Obtener todos los modificadores asignados a un producto
 * @param {number} productId - ID del producto
 * @returns {Promise<Array>} Lista de modificadores asignados
 */
const getProductModifiers = async (productId) => {
  const response = await axiosClient.get(`/modifiers/products/${productId}/modifiers`);
  return response.data;
};

/**
 * Asignar un modificador a un producto
 * VALIDACIÓN CRÍTICA: Todos los ítems del modificador deben existir en los ingredientes del producto
 * @param {number} productId - ID del producto
 * @param {number} modifierId - ID del modificador a asignar
 * @returns {Promise<Object>} Relación producto-modificador creada
 */
const assignModifierToProduct = async (productId, modifierId) => {
  const response = await axiosClient.post(`/modifiers/products/${productId}/modifiers`, {
    modifier_id: modifierId,
  });
  return response.data;
};

/**
 * Desasignar un modificador de un producto
 * @param {number} productId - ID del producto
 * @param {number} modifierId - ID del modificador a desasignar
 * @returns {Promise<void>}
 */
const removeModifierFromProduct = async (productId, modifierId) => {
  await axiosClient.delete(`/modifiers/products/${productId}/modifiers/${modifierId}`);
};

const modifiersService = {
  // Modifier Groups
  getModifierGroups,
  getModifierGroupById,
  createModifierGroup,
  updateModifierGroup,

  // Modifiers
  getModifiersByGroup,
  getModifierById,
  createModifier,
  updateModifier,

  // Product Modifiers
  getProductModifiers,
  assignModifierToProduct,
  removeModifierFromProduct,
};

export default modifiersService;
