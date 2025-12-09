# Sistema Multi-Tenant Frontend

Frontend React para sistema multi-tenant de cafeterías, restaurantes y negocios similares.

## Características

- **Multi-tenant completo**: Filtrado por `business_id` en todas las operaciones
- **Autenticación JWT**: Login, registro y refresh automático de tokens
- **Arquitectura modular**: Organización por features/módulos
- **React Query**: Manejo eficiente de caché y estados
- **Zustand**: Estado global ligero
- **CSS Puro**: Sin frameworks CSS, estilos profesionales personalizados
- **Protección de rutas**: Sistema completo de autenticación y autorización

## Estructura del Proyecto

```
src/
├── pages/              # Páginas por módulo
│   ├── auth/
│   ├── users/
│   ├── inventory/
│   └── dashboard/
├── components/         # Componentes reutilizables por módulo
│   ├── auth/
│   ├── users/
│   └── inventory/
├── services/           # Servicios API por módulo
│   ├── auth/
│   ├── users/
│   └── inventory/
├── hooks/              # Hooks personalizados
│   ├── auth/
│   ├── users/
│   └── inventory/
├── routes/             # Configuración de rutas
├── layout/             # Layouts principales
├── store/              # Zustand stores
└── utils/              # Utilidades (axios, etc.)
```

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Editar `.env` con la URL de tu backend:
```
VITE_API_URL=http://localhost:8000
```

## Desarrollo

Iniciar servidor de desarrollo:
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

## Build

Generar build de producción:
```bash
npm run build
```

## Conexión con Backend

El frontend espera que el backend esté corriendo en `http://localhost:8000` por defecto.

### Endpoints utilizados:

- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `POST /auth/refresh` - Refresh de token
- `GET /users/me` - Usuario actual
- `GET /users` - Lista de usuarios
- `GET /inventory` - Lista de inventario

## Funcionalidades Implementadas

### Autenticación
- ✅ Login con email y contraseña
- ✅ Registro de nuevos negocios
- ✅ Refresh automático de tokens
- ✅ Logout
- ✅ Persistencia de sesión en localStorage

### Usuarios
- ✅ Listado de usuarios del negocio
- ✅ Vista de tabla responsiva
- ⏳ Crear, editar y eliminar usuarios (UI lista)

### Inventario
- ✅ Listado de productos
- ✅ Vista de cards responsiva
- ⏳ CRUD completo de productos (UI lista)

### Dashboard
- ✅ Página principal con estadísticas
- ✅ Información del usuario y negocio

## Próximos Módulos

- 📦 Punto de Venta (POS)
- 📊 Reportes y estadísticas
- 👥 Gestión de empleados
- 🧾 Facturación
- 🍽️ Cocina/Barra
- 💰 Contabilidad

## Tecnologías Principales

- **React 18** - Framework principal
- **Vite** - Build tool
- **React Router v6** - Enrutamiento
- **React Query (TanStack)** - Data fetching y caché
- **Zustand** - Estado global
- **Axios** - Cliente HTTP
- **CSS Puro** - Estilos personalizados

## Seguridad

- JWT almacenado en localStorage
- Refresh automático de tokens expirados
- Interceptores Axios para manejo de autenticación
- Rutas protegidas por autenticación
- Filtrado automático por business_id en backend

## Soporte

Para problemas o consultas, contactar al equipo de desarrollo.
