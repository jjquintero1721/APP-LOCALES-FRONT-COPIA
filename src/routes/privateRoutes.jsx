import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layout/MainLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import UsersPage from '../pages/users/UsersPage';
import InventoryPage from '../pages/inventory/InventoryPage';

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
      {
        path: 'inventory',
        element: <InventoryPage />,
      },
    ],
  },
];

export default privateRoutes;
