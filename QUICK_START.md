# 🚀 Quick Start - Frontend Multi-Tenant

## Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. El archivo .env ya está configurado con:
# VITE_API_URL=http://localhost:8000

# 3. Iniciar desarrollo
npm run dev
```

Abre: [http://localhost:3000](http://localhost:3000)

---

## ✅ Checklist de Prerequisitos

- ✅ Node.js 18+ instalado
- ✅ Backend corriendo en `http://localhost:8000`
- ✅ PostgreSQL con base de datos multi-tenant configurada

---

## 🔥 Prueba Rápida (3 minutos)

### 1. Registro (30 segundos)
```
URL: http://localhost:3000/register

Datos de prueba:
- Negocio: "Mi Cafetería Test"
- Nombre: "Admin Test"
- Email: "admin@test.com"
- Password: "test123"

Click: "Registrar"
```

### 2. Login (15 segundos)
```
URL: http://localhost:3000/login

Email: admin@test.com
Password: test123

Click: "Ingresar"
```

### 3. Explorar Dashboard (1 minuto)
```
✅ Debes ver:
- Sidebar con navegación
- Tu nombre en la parte superior
- Business ID
- Estadísticas (vacías por ahora)

✅ Prueba navegar:
- /users → Ver usuarios
- /inventory → Ver inventario
```

### 4. Verificar localStorage (30 segundos)
```
Abre DevTools (F12) → Application → Local Storage

Debes ver:
✅ access_token
✅ refresh_token
✅ user (con business_id)
```

---

## 📂 Estructura Rápida

```
src/
├── pages/         → Páginas (LoginPage, UsersPage, etc.)
├── components/    → Componentes reutilizables
├── services/      → API calls (authService, usersService)
├── hooks/         → React hooks personalizados
├── routes/        → Configuración de rutas
├── layout/        → MainLayout con sidebar
├── store/         → Zustand (estado global)
└── utils/         → axiosClient (con interceptores)
```

---

## 🔧 Scripts Disponibles

```bash
npm run dev      # Desarrollo (localhost:3000)
npm run build    # Build de producción
npm run preview  # Preview del build
```

---

## 🐛 Troubleshooting Rápido

### Error: "Network Error"
```bash
# Verifica que el backend esté corriendo
curl http://localhost:8000/health

# Si no responde, inicia el backend:
cd ../backend
docker-compose up
```

### Error: "Cannot find module"
```bash
# Reinstala dependencias
rm -rf node_modules
npm install
```

### Error: "401 Unauthorized" constante
```bash
# Limpia localStorage
1. Abre DevTools (F12)
2. Application → Local Storage
3. Click derecho → Clear
4. Recarga la página
```

---

## 🎯 Endpoints del Backend

El frontend consume estos endpoints:

```
POST   /auth/register      → Registro
POST   /auth/login         → Login
POST   /auth/refresh       → Refresh token
GET    /users/me           → Usuario actual
GET    /users              → Lista usuarios
GET    /inventory          → Lista inventario
```

---

## 🔐 Flujo de Autenticación

```
1. Usuario ingresa credenciales
2. Frontend llama a /auth/login
3. Backend devuelve JWT + refresh_token
4. Frontend guarda en localStorage
5. Cada request incluye: Authorization: Bearer {token}
6. Si token expira → refresh automático
7. Si refresh falla → logout y redirige a /login
```

---

## 📱 Características Implementadas

✅ Login/Register con validación
✅ Refresh automático de tokens
✅ Protección de rutas
✅ Sidebar con navegación
✅ Dashboard con info del usuario
✅ Listado de usuarios (con React Query)
✅ Listado de inventario
✅ CSS puro responsivo
✅ Manejo de errores
✅ Loading states

---

## 📚 Documentación Completa

Para más detalles, ver:
- [FLUJO_COMPLETO.md](FLUJO_COMPLETO.md) - Documentación técnica detallada
- [README.md](README.md) - Información general del proyecto

---

## 💡 Tips

1. **DevTools es tu amigo**: Usa F12 → Network para ver requests
2. **React Query DevTools**: Instala la extensión para debug
3. **localStorage**: Revisa tokens guardados en Application tab
4. **Console**: Todos los errores de API se logean en consola

---

## ✅ Siguiente Paso

Una vez que todo funcione:
1. Lee [FLUJO_COMPLETO.md](FLUJO_COMPLETO.md)
2. Explora los archivos en `src/`
3. Comienza a añadir features personalizados

**¡Listo para desarrollar! 🚀**
