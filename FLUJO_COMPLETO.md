# Flujo Completo del Sistema Multi-Tenant Frontend

## 🎯 Resumen General

Este frontend React está diseñado para trabajar con un backend multi-tenant donde cada negocio (cafetería, restaurante, heladería) tiene sus propios datos completamente aislados mediante `business_id`.

---

## 🔐 Flujo de Autenticación

### 1. Registro de Nuevo Negocio

**Flujo:**
```
Usuario → RegisterPage → RegisterForm → authService.register() → Backend
                                                ↓
                                         Crea business_id
                                                ↓
                                         Crea usuario owner
                                                ↓
                                         Redirige a /login
```

**Archivos involucrados:**
- [src/pages/auth/RegisterPage.jsx](src/pages/auth/RegisterPage.jsx)
- [src/components/auth/RegisterForm.jsx](src/components/auth/RegisterForm.jsx)
- [src/services/auth/authService.js](src/services/auth/authService.js)
- [src/hooks/auth/useAuth.js](src/hooks/auth/useAuth.js)

**Datos enviados:**
```json
{
  "email": "usuario@example.com",
  "password": "mipassword",
  "full_name": "Juan Pérez",
  "business_name": "Mi Cafetería"
}
```

**Respuesta del backend:**
```json
{
  "message": "Usuario creado exitosamente",
  "user_id": 1,
  "business_id": 3
}
```

---

### 2. Login

**Flujo:**
```
Usuario → LoginPage → LoginForm → authService.login() → Backend
                                            ↓
                                    Recibe JWT + user
                                            ↓
                                    Guarda en localStorage:
                                    - access_token
                                    - refresh_token
                                    - user (con business_id)
                                            ↓
                                    Actualiza Zustand store
                                            ↓
                                    Redirige a Dashboard (/)
```

**JWT decodificado contiene:**
```json
{
  "user_id": 1,
  "business_id": 3,
  "role": "admin",
  "exp": 1234567890
}
```

**LocalStorage después del login:**
```javascript
localStorage.getItem('access_token')   // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
localStorage.getItem('refresh_token')  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
localStorage.getItem('user')           // '{"id":1,"email":"...","business_id":3}'
```

---

### 3. Refresh Automático de Token

**Flujo:**
```
Request a API → Token expirado (401) → Interceptor Axios detecta error
                                              ↓
                                    Llama a /auth/refresh
                                              ↓
                                    Obtiene nuevo access_token
                                              ↓
                                    Guarda en localStorage
                                              ↓
                                    Reintenta request original
```

**Código en [src/utils/axiosClient.js](src/utils/axiosClient.js:30-56):**
```javascript
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Intentar refresh
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await axios.post('/auth/refresh', { refresh_token: refreshToken });

      // Guardar nuevo token
      localStorage.setItem('access_token', response.data.access_token);

      // Reintentar request
      return axiosClient(originalRequest);
    }
  }
);
```

---

## 🛡️ Protección de Rutas

### Rutas Públicas
Solo accesibles si **NO** estás autenticado:
- `/login` → LoginPage
- `/register` → RegisterPage

Si intentas acceder estando autenticado → Redirige a `/`

### Rutas Privadas
Solo accesibles si **estás autenticado**:
- `/` → Dashboard
- `/users` → Usuarios
- `/inventory` → Inventario

Si intentas acceder sin token → Redirige a `/login`

**Implementación en [src/routes/ProtectedRoute.jsx](src/routes/ProtectedRoute.jsx):**
```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

---

## 📊 React Query (Data Fetching)

### Configuración Global
**[src/App.jsx](src/App.jsx:7-14)**
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,  // No recargar al cambiar de pestaña
      retry: 1,                       // Solo 1 reintento
      staleTime: 5 * 60 * 1000,      // 5 minutos de cache
    },
  },
});
```

### Ejemplo: Hook de Usuarios
**[src/hooks/users/useUsers.js](src/hooks/users/useUsers.js)**

```javascript
export const useUsers = () => {
  const queryClient = useQueryClient();

  // Query para obtener usuarios
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getUsers,
  });

  // Mutation para crear usuario
  const createUserMutation = useMutation({
    mutationFn: usersService.createUser,
    onSuccess: () => {
      // Invalidar cache para recargar lista
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users,
    isLoading,
    createUser: createUserMutation.mutate,
  };
};
```

**Uso en componente:**
```javascript
const UsersPage = () => {
  const { users, isLoading, createUser } = useUsers();

  if (isLoading) return <div>Cargando...</div>;

  return <UsersTable users={users} />;
};
```

---

## 🗄️ Zustand (Estado Global)

### AuthStore
**[src/store/authStore.js](src/store/authStore.js)**

```javascript
const useAuthStore = create((set) => ({
  user: authService.getStoredUser(),           // Usuario del localStorage
  isAuthenticated: authService.isAuthenticated(), // true si hay token

  login: async (credentials) => {
    const data = await authService.login(credentials);
    set({ user: data.user, isAuthenticated: true });
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
```

**Uso en componentes:**
```javascript
const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <div>
      <p>Hola, {user?.full_name}</p>
      <button onClick={logout}>Salir</button>
    </div>
  );
};
```

---

## 🌐 Servicios API

### Estructura de un Servicio
**Ejemplo: [src/services/users/usersService.js](src/services/users/usersService.js)**

```javascript
import axiosClient from '../../utils/axiosClient';

const usersService = {
  getUsers: async () => {
    const response = await axiosClient.get('/users');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await axiosClient.post('/users', userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await axiosClient.put(`/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axiosClient.delete(`/users/${userId}`);
    return response.data;
  },
};

export default usersService;
```

**El token se añade automáticamente** por el interceptor de Axios.

---

## 🎨 CSS Puro (Sin Tailwind)

### Estructura de Estilos

1. **Global Styles**: [src/index.css](src/index.css)
   - Reset CSS
   - Variables globales
   - Clases utilitarias
   - Estilos de botones comunes

2. **Component Styles**: Co-localizados con componentes
   - `LoginForm.jsx` → `AuthForm.css`
   - `UsersTable.jsx` → `UsersTable.css`
   - Cada componente tiene su CSS específico

3. **Layout Styles**: [src/layout/MainLayout.css](src/layout/MainLayout.css)
   - Sidebar
   - Navegación
   - Estructura general

### Ejemplo de Estilos
**[src/components/auth/AuthForm.css](src/components/auth/AuthForm.css:1-20)**
```css
.auth-form-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 450px;
}
```

---

## 🚀 Cómo Correr el Proyecto

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar .env
El archivo `.env` ya está creado con:
```
VITE_API_URL=http://localhost:8000
```

### 3. Iniciar Desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 4. Asegúrate que el Backend esté corriendo
```bash
# En el directorio del backend
docker-compose up
```

Backend debe estar en: [http://localhost:8000](http://localhost:8000)

---

## 🧪 Pruebas del Flujo Completo

### Test 1: Registro
1. Ve a [http://localhost:3000/register](http://localhost:3000/register)
2. Completa el formulario:
   - Nombre del negocio: "Mi Cafetería"
   - Nombre: "Juan Pérez"
   - Email: "juan@cafe.com"
   - Contraseña: "password123"
3. Click en "Registrar"
4. ✅ Debes ser redirigido a `/login`

### Test 2: Login
1. Ve a [http://localhost:3000/login](http://localhost:3000/login)
2. Ingresa credenciales del registro anterior
3. Click en "Ingresar"
4. ✅ Debes ver el Dashboard con tu nombre
5. ✅ Revisa localStorage en DevTools:
   - `access_token` presente
   - `refresh_token` presente
   - `user` con tu información

### Test 3: Navegación Protegida
1. Cierra sesión (click en "Salir")
2. Intenta acceder a [http://localhost:3000/users](http://localhost:3000/users)
3. ✅ Debes ser redirigido a `/login`

### Test 4: Refresh Automático
1. Inicia sesión normalmente
2. En DevTools, modifica el `access_token` para que sea inválido
3. Navega a `/users`
4. ✅ El sistema debe:
   - Detectar token inválido
   - Llamar a `/auth/refresh` automáticamente
   - Obtener nuevo token
   - Mostrar la página de usuarios

---

## 📁 Archivos Principales

### Autenticación
- [src/services/auth/authService.js](src/services/auth/authService.js) - Servicio de autenticación
- [src/hooks/auth/useAuth.js](src/hooks/auth/useAuth.js) - Hook de autenticación
- [src/store/authStore.js](src/store/authStore.js) - Estado global de auth
- [src/utils/axiosClient.js](src/utils/axiosClient.js) - Cliente Axios con interceptores

### Rutas
- [src/routes/index.jsx](src/routes/index.jsx) - Router principal
- [src/routes/ProtectedRoute.jsx](src/routes/ProtectedRoute.jsx) - Protección de rutas
- [src/routes/privateRoutes.jsx](src/routes/privateRoutes.jsx) - Rutas privadas
- [src/routes/publicRoutes.jsx](src/routes/publicRoutes.jsx) - Rutas públicas

### Layout
- [src/layout/MainLayout.jsx](src/layout/MainLayout.jsx) - Layout principal con sidebar
- [src/App.jsx](src/App.jsx) - Configuración de React Query y Router
- [src/main.jsx](src/main.jsx) - Punto de entrada

---

## 🔥 Próximos Pasos

1. **Completar CRUDs**: Añadir formularios de creación/edición de usuarios e inventario
2. **Módulo POS**: Implementar punto de venta
3. **Reportes**: Dashboard con gráficos y estadísticas
4. **Empleados**: Gestión completa de empleados
5. **Facturación**: Sistema de facturación
6. **WebSockets**: Para cocina/barra en tiempo real

---

## 📞 Soporte

Para dudas o problemas:
- Revisa [README.md](README.md)
- Consulta la documentación del backend
- Verifica logs del navegador (F12 → Console)
