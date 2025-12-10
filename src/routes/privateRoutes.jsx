import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layout/MainLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import UsersPage from '../pages/users/UsersPage';
import SuppliersPage from '../pages/suppliers/SuppliersPage';
import InventoryPage from '../pages/inventory/InventoryPage';
import RelationshipsPage from '../pages/business/RelationshipsPage';
import TransfersPage from '../pages/inventory/TransfersPage';
import ProductsPage from '../pages/products/ProductsPage';
import ModifiersPage from '../pages/modifiers/ModifiersPage';

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
        path: 'suppliers',
        element: <SuppliersPage />,
      },
      {
        path: 'inventory',
        element: <InventoryPage />,
      },
      {
        path: 'relationships',
        element: <RelationshipsPage />,
      },
      {
        path: 'transfers',
        element: <TransfersPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'modifiers',
        element: <ModifiersPage />,
      },
    ],
  },
];

export default privateRoutes;
