import { createBrowserRouter } from 'react-router-dom';
import publicRoutes from './publicRoutes';
import privateRoutes from './privateRoutes';

const router = createBrowserRouter([...privateRoutes, ...publicRoutes]);

export default router;
