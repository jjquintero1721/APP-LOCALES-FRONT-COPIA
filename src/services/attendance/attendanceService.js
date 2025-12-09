import axiosClient from '../../utils/axiosClient';

const attendanceService = {
  // Registrar entrada (check-in)
  checkIn: async () => {
    const response = await axiosClient.post('/attendance/check-in');
    return response.data;
  },

  // Registrar salida (check-out)
  checkOut: async () => {
    const response = await axiosClient.post('/attendance/check-out');
    return response.data;
  },
};

export default attendanceService;
