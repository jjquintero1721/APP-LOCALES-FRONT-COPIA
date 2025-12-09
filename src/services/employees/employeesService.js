import axiosClient from '../../utils/axiosClient';

const employeesService = {
  // Obtener todos los empleados del negocio
  getEmployees: async (skip = 0, limit = 100) => {
    const response = await axiosClient.get(`/employees?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Obtener empleado por ID
  getEmployeeById: async (employeeId) => {
    const response = await axiosClient.get(`/employees/${employeeId}`);
    return response.data;
  },

  // Crear nuevo empleado
  createEmployee: async (employeeData) => {
    const response = await axiosClient.post('/employees', employeeData);
    return response.data;
  },

  // Actualizar empleado
  updateEmployee: async (employeeId, employeeData) => {
    const response = await axiosClient.put(`/employees/${employeeId}`, employeeData);
    return response.data;
  },

  // Desactivar empleado (primera fase de eliminación)
  deactivateEmployee: async (employeeId) => {
    const response = await axiosClient.delete(`/employees/${employeeId}`);
    return response.data;
  },

  // Eliminar empleado permanentemente (solo OWNER)
  deleteEmployeePermanently: async (employeeId) => {
    const response = await axiosClient.delete(`/employees/${employeeId}/permanent`);
    return response.data;
  },
};

export default employeesService;
