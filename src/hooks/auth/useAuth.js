import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth/authService';
import useAuthStore from '../../store/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.clear();
      setUser(data.user);
      navigate('/');
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData) => authService.register(userData),
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      console.error('Register error:', error);
    },
  });

  // Get current user query
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated,
    retry: false,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: () => {
      clearUser();
    },
  });

  const login = (credentials) => {
    return loginMutation.mutate(credentials);
  };

  const register = (userData) => {
    return registerMutation.mutate(userData);
  };

  const logout = () => {
    queryClient.clear();
    clearUser();
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending || isLoading,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
