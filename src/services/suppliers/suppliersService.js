import axiosClient from '../../utils/axiosClient';

const suppliersService = {
  // Obtener todos los proveedores del negocio
  getSuppliers: async (skip = 0, limit = 100, activeOnly = false) => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    if (activeOnly) {
      params.append('active_only', 'true');
    }

    const response = await axiosClient.get(`/suppliers?${params.toString()}`);
    return response.data;
  },

  // Obtener proveedor por ID
  getSupplierById: async (supplierId) => {
    const response = await axiosClient.get(`/suppliers/${supplierId}`);
    return response.data;
  },

  // Crear nuevo proveedor
  createSupplier: async (supplierData) => {
    const response = await axiosClient.post('/suppliers', supplierData);
    return response.data;
  },

  // Actualizar proveedor
  updateSupplier: async (supplierId, supplierData) => {
    const response = await axiosClient.put(`/suppliers/${supplierId}`, supplierData);
    return response.data;
  },

  // Desactivar proveedor (soft delete)
  deactivateSupplier: async (supplierId) => {
    const response = await axiosClient.delete(`/suppliers/${supplierId}`);
    return response.data;
  },

  // Eliminar proveedor permanentemente (solo OWNER)
  deleteSupplierPermanently: async (supplierId) => {
    const response = await axiosClient.delete(`/suppliers/${supplierId}/permanent`);
    return response.data;
  },
};

export default suppliersService;
