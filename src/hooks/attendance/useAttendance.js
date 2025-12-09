import { useMutation, useQueryClient } from '@tanstack/react-query';
import attendanceService from '../../services/attendance/attendanceService';
import { toast } from 'react-toastify';

export const useAttendance = () => {
  const queryClient = useQueryClient();

  // Mutation para registrar entrada
  const checkInMutation = useMutation({
    mutationFn: attendanceService.checkIn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      const checkInTime = new Date(data.check_in).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
      toast.success(`Entrada registrada exitosamente a las ${checkInTime}`);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al registrar entrada';
      toast.error(errorMessage);
    },
  });

  // Mutation para registrar salida
  const checkOutMutation = useMutation({
    mutationFn: attendanceService.checkOut,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      const checkOutTime = new Date(data.check_out).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
      toast.success(`Salida registrada exitosamente a las ${checkOutTime}`);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Error al registrar salida';
      toast.error(errorMessage);
    },
  });

  return {
    checkIn: checkInMutation.mutate,
    checkOut: checkOutMutation.mutate,
    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,
  };
};
