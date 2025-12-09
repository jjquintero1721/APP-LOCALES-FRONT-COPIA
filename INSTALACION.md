# 🚀 Guía de Instalación Completa

## ✅ Proyecto Frontend Multi-Tenant Creado Exitosamente

**Total de archivos generados: 30 archivos + 4 documentos**

---

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener:

- ✅ Node.js 18 o superior
- ✅ npm o yarn
- ✅ Backend corriendo en `http://localhost:8000`
- ✅ PostgreSQL configurado en el backend

---

## 🔧 Instalación

### Paso 1: Instalar Dependencias

```bash
npm install
```

Esto instalará:
- React 18.3.1
- React Router DOM 6.26.2
- React Query (TanStack) 5.56.2
- Zustand 5.0.0
- Axios 1.7.7
- Vite 5.4.2

### Paso 2: Configurar Variables de Entorno

El archivo `.env` ya está creado con:

```env
VITE_API_URL=http://localhost:8000
```

Si tu backend está en otra URL, modifica este archivo.

### Paso 3: Verificar Backend

Asegúrate que el backend esté corriendo:

```bash
curl http://localhost:8000/health
```

Si no responde, inicia el backend:

```bash
cd ../APP-LOCALES-COPIA
docker-compose up
```

### Paso 4: Iniciar Frontend

```bash
npm run dev
```

El servidor de desarrollo iniciará en: **http://localhost:3000**

---

## 🧪 Verificación de Instalación

### 1. Abre el navegador

Navega a: `http://localhost:3000`

Deberías ver la página de **Login**.

### 2. Prueba el Registro

1. Click en "Regístrate aquí"
2. Completa el formulario:
   ```
   Negocio: Mi Cafetería
   Nombre: Admin Test
   Email: admin@test.com
   Password: test123
   ```
3. Click en "Registrar"
4. Deberías ser redirigido a `/login`

### 3. Prueba el Login

1. Ingresa las credenciales del paso anterior
2. Click en "Ingresar"
3. Deberías ver el **Dashboard** con tu nombre

### 4. Verifica localStorage

Abre DevTools (F12) → Application → Local Storage

Debes ver:
```
✅ access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
✅ refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
✅ user: '{"id":1,"email":"admin@test.com","business_id":3}'
```

### 5. Prueba la Navegación

Click en el sidebar:
- ✅ Dashboard → `/`
- ✅ Usuarios → `/users`
- ✅ Inventario → `/inventory`

### 6. Prueba el Logout

Click en "Salir" en el sidebar inferior.

Deberías ser redirigido a `/login` y localStorage debe estar vacío.

---

## 📁 Estructura del Proyecto Creado

```
app-locales-front/
├── src/
│   ├── components/        → Componentes reutilizables
│   │   ├── auth/         → LoginForm, RegisterForm
│   │   └── users/        → UsersTable
│   ├── hooks/            → Hooks personalizados
│   │   ├── auth/         → useAuth
│   │   ├── users/        → useUsers
│   │   └── inventory/    → useInventory
│   ├── layout/           → MainLayout (sidebar)
│   ├── pages/            → Páginas completas
│   │   ├── auth/         → LoginPage, RegisterPage
│   │   ├── dashboard/    → DashboardPage
│   │   ├── users/        → UsersPage
│   │   └── inventory/    → InventoryPage
│   ├── routes/           → Configuración de rutas
│   ├── services/         → Servicios API
│   │   ├── auth/         → authService
│   │   ├── users/        → usersService
│   │   └── inventory/    → inventoryService
│   ├── store/            → Zustand stores
│   ├── utils/            → axiosClient + interceptores
│   ├── App.jsx           → App principal
│   ├── main.jsx          → Entry point
│   └── index.css         → Estilos globales
│
├── .env                  → Variables de entorno
├── .env.example          → Template
├── vite.config.js        → Config de Vite
├── package.json          → Dependencias
│
└── Documentación/
    ├── README.md                 → Info general
    ├── QUICK_START.md            → Inicio rápido
    ├── FLUJO_COMPLETO.md         → Docs técnicas
    ├── ESTRUCTURA_PROYECTO.md    → Estructura detallada
    └── INSTALACION.md            → Este archivo
```

---

## 🔥 Funcionalidades Implementadas

### ✅ Autenticación Completa
- Login con email/password
- Registro de nuevos negocios
- JWT con refresh automático
- Logout
- Persistencia en localStorage
- Protección de rutas

### ✅ UI/UX Profesional
- Layout responsive con sidebar
- Navegación fluida
- Estados de loading
- Manejo de errores
- CSS puro (sin Tailwind)
- Mobile-first design

### ✅ Data Management
- React Query configurado
- Cache automático (5 min)
- Mutations para CRUD
- Invalidación inteligente
- Estados optimistas

### ✅ Estado Global
- Zustand para auth
- Sincronización con localStorage
- Store escalable

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia en localhost:3000

# Producción
npm run build        # Build optimizado
npm run preview      # Preview del build

# Linting
npm run lint         # ESLint
```

---

## 🔗 Integración con Backend

### Endpoints Consumidos

```
POST   /auth/register      → Registro de usuarios
POST   /auth/login         → Autenticación
POST   /auth/refresh       → Refresh de token
GET    /users/me           → Usuario actual
GET    /users              → Lista de usuarios
POST   /users              → Crear usuario
PUT    /users/:id          → Actualizar usuario
DELETE /users/:id          → Eliminar usuario
GET    /inventory          → Lista de inventario
POST   /inventory          → Crear item
PUT    /inventory/:id      → Actualizar item
DELETE /inventory/:id      → Eliminar item
```

### Autenticación Automática

Cada request incluye automáticamente:
```
Authorization: Bearer {access_token}
```

Si el token expira, el sistema:
1. Detecta error 401
2. Llama a `/auth/refresh`
3. Obtiene nuevo token
4. Reintenta el request original
5. Todo sin intervención del usuario

---

## 🐛 Troubleshooting

### Problema: "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Problema: "Network Error"

Verifica que el backend esté corriendo:
```bash
curl http://localhost:8000/health
```

### Problema: "401 Unauthorized" constante

Limpia localStorage:
```javascript
// En DevTools Console
localStorage.clear()
location.reload()
```

### Problema: Puerto 3000 ocupado

Cambia el puerto en `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3001  // Cambia aquí
  }
})
```

---

## 📚 Próximos Pasos

### 1. Lee la Documentación
- 📄 [QUICK_START.md](QUICK_START.md) - Para empezar rápido
- 📄 [FLUJO_COMPLETO.md](FLUJO_COMPLETO.md) - Documentación técnica detallada
- 📄 [ESTRUCTURA_PROYECTO.md](ESTRUCTURA_PROYECTO.md) - Arquitectura completa

### 2. Explora el Código
Empieza por estos archivos clave:
- [src/App.jsx](src/App.jsx) - Setup de React Query
- [src/routes/index.jsx](src/routes/index.jsx) - Configuración de rutas
- [src/utils/axiosClient.js](src/utils/axiosClient.js) - Interceptores
- [src/hooks/auth/useAuth.js](src/hooks/auth/useAuth.js) - Hook de auth

### 3. Añade Nuevas Features
El proyecto está listo para agregar:
- Modales de creación/edición
- Sistema de notificaciones
- Módulo POS
- Reportes con gráficos
- Y mucho más...

---

## ✅ Checklist de Verificación

Antes de empezar a desarrollar, verifica:

- ✅ `npm install` completado sin errores
- ✅ Backend corriendo en puerto 8000
- ✅ `.env` configurado correctamente
- ✅ `npm run dev` inicia sin problemas
- ✅ Login funcional
- ✅ Registro funcional
- ✅ localStorage guarda tokens
- ✅ Navegación entre páginas funciona
- ✅ Logout funciona

---

## 💡 Tips Importantes

1. **DevTools**: Usa F12 → Network para ver todos los requests
2. **React Query**: Instala React Query DevTools para debugging
3. **localStorage**: Revisa tokens en Application → Local Storage
4. **Console**: Todos los errores se muestran en la consola
5. **Hot Reload**: Vite recarga automáticamente los cambios

---

## 🎯 Arquitectura Multi-Tenant

Este frontend está diseñado para:

- ✅ Cada negocio tiene sus propios datos
- ✅ El JWT incluye `business_id`
- ✅ El backend filtra automáticamente por `business_id`
- ✅ No hay cross-contamination entre negocios
- ✅ Escalable a SaaS

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la consola del navegador (F12)
2. Verifica los logs del backend
3. Lee [FLUJO_COMPLETO.md](FLUJO_COMPLETO.md)
4. Revisa que el backend esté respondiendo correctamente

---

## 🎉 Conclusión

**¡Frontend Multi-Tenant completamente funcional!**

- ✅ 30 archivos de código
- ✅ 4 documentos completos
- ✅ Autenticación JWT
- ✅ Refresh automático
- ✅ Multi-tenant por business_id
- ✅ CSS puro profesional
- ✅ Arquitectura escalable
- ✅ Listo para producción

**¡Listo para desarrollar! 🚀**
