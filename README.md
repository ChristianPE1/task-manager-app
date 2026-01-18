# Task Manager

Una aplicación web para gestionar proyectos y tareas, construida con Laravel (backend) y React (frontend).

## Tecnologías

- **Backend**: Laravel 12, PHP 8.2, PostgreSQL, Sanctum para autenticación
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Base de datos**: PostgreSQL
- **API**: API RESTful con respuestas JSON

## Características

- Registro e inicio de sesión de usuarios
- Creación, edición y eliminación de proyectos
- Creación, filtrado y gestión de tareas
- Acceso basado en roles (rol de miembro)
- Interfaz responsiva

## Instalación

### Prerrequisitos
- PHP 8.2+
- Composer
- Node.js 18+
- npm o yarn
- PostgreSQL

## Uso

1. Registra una nueva cuenta o inicia sesión
2. Crea proyectos
3. Agrega tareas a los proyectos
4. Filtra y gestiona tareas

## Endpoints de API

### Autenticación
- `POST /api/v1/register` - Registrar usuario
- `POST /api/v1/login` - Iniciar sesión
- `POST /api/v1/logout` - Cerrar sesión
- `GET /api/v1/me` - Obtener usuario autenticado

### Proyectos
- `GET /api/v1/projects` - Listar proyectos
- `POST /api/v1/projects` - Crear proyecto
- `GET /api/v1/projects/{id}` - Obtener detalles del proyecto
- `PUT /api/v1/projects/{id}` - Actualizar proyecto
- `DELETE /api/v1/projects/{id}` - Eliminar proyecto

### Tareas
- `GET /api/v1/tasks` - Listar tareas (con filtros)
- `POST /api/v1/tasks` - Crear tarea
- `GET /api/v1/tasks/{id}` - Obtener detalles de la tarea
- `PUT /api/v1/tasks/{id}` - Actualizar tarea
- `DELETE /api/v1/tasks/{id}` - Eliminar tarea

## Esquema de Base de Datos

### Usuarios
- id (clave primaria)
- name
- email (único)
- password (hasheado)
- role (por defecto: member)
- timestamps

### Proyectos
- id (clave primaria)
- name
- description
- owner_id (clave foránea a users)
- timestamps

### Tareas
- id (clave primaria)
- title
- description
- status (pending, in_progress, done, overdue)
- priority (low, medium, high)
- due_date
- project_id (clave foránea a projects)
- assigned_to (clave foránea a users)
- timestamps


## Autor

- ChristianPE1

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
