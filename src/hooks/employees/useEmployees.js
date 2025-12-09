import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import employeesService from '../../services/employees/employeesService';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/authStore';

export const useEmployees = (skip = 0, limit = 100) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Get all employees
  const {
    data: employees,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['employees', skip, limit],
    queryFn: () => employeesService.getEmployees(skip, limit),
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al cargar empleados';
      toast.error(errorMessage);
    },
  });

  // Create employee mutation
  const createEmployeeMutation = useMutation({
    mutationFn: employeesService.createEmployee,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      if (data.temporary_password) {
        toast.success(`Empleado creado. Contraseña temporal: ${data.temporary_password}`, {
          autoClose: 10000,
        });
      } else {
        toast.success('Empleado creado exitosamente');
      }
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al crear empleado';
      toast.error(errorMessage);
    },
  });

  // Update employee mutation
  const updateEmployeeMutation = useMutation({
    mutationFn: ({ employeeId, employeeData }) =>
      employeesService.updateEmployee(employeeId, employeeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Empleado actualizado exitosamente');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al actualizar empleado';
      toast.error(errorMessage);
    },
  });

  // Deactivate employee mutation
  const deactivateEmployeeMutation = useMutation({
    mutationFn: employeesService.deactivateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Empleado desactivado exitosamente');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al desactivar empleado';
      toast.error(errorMessage);
    },
  });

  // Delete employee permanently mutation
  const deleteEmployeePermanentlyMutation = useMutation({
    mutationFn: employeesService.deleteEmployeePermanently,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Empleado eliminado permanentemente');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al eliminar empleado';
      toast.error(errorMessage);
    },
  });

  return {
    employees,
    isLoading,
    error,
    refetch,
    createEmployee: createEmployeeMutation.mutate,
    updateEmployee: updateEmployeeMutation.mutate,
    deactivateEmployee: deactivateEmployeeMutation.mutate,
    deleteEmployeePermanently: deleteEmployeePermanentlyMutation.mutate,
    isCreating: createEmployeeMutation.isPending,
    isUpdating: updateEmployeeMutation.isPending,
    isDeactivating: deactivateEmployeeMutation.isPending,
    isDeleting: deleteEmployeePermanentlyMutation.isPending,
  };
};

export const useEmployee = (employeeId) => {
  const {
    data: employee,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => employeesService.getEmployeeById(employeeId),
    enabled: !!employeeId,
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al cargar empleado';
      toast.error(errorMessage);
    },
  });

  return { employee, isLoading, error };
};
