import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layout/MainLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import UsersPage from '../pages/users/UsersPage';

const privateRoutes = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },

    ],
  },
];

export default privateRoutes;
