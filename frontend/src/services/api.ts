import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

// Configuración base axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si el token expiró o es inválido (401)
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ==================== AUTH ====================

export const authService = {
    // Registro de usuario
    register: async (name: string, email: string, password: string, passwordConfirmation: string) => {
        const response = await api.post('/register', {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        });
        return response.data;
    },

    // Login
    login: async (email: string, password: string) => {
        const response = await api.post('/login', { email, password });
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await api.post('/logout');
        return response.data;
    },

    // Obtener usuario autenticado
    me: async () => {
        const response = await api.get('/me');
        return response.data;
    },
};

// ==================== PROJECTS ====================

export const projectService = {
    // Listar todos los proyectos
    getAll: async () => {
        const response = await api.get('/projects');
        return response.data;
    },

    // Obtener un proyecto por ID
    getById: async (id: number | string) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    // Crear proyecto
    create: async (name: string, description?: string) => {
        const response = await api.post('/projects', { name, description });
        return response.data;
    },

    // Actualizar proyecto
    update: async (id: number | string, name: string, description?: string) => {
        const response = await api.put(`/projects/${id}`, { name, description });
        return response.data;
    },

    // Eliminar proyecto
    delete: async (id: number | string) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    },
};

// ==================== TASKS ====================

export const taskService = {
    // Listar todas las tareas (con filtros opcionales)
    getAll: async (filters = {}) => {
        const response = await api.get('/tasks', { params: filters });
        return response.data;
    },

    // Obtener una tarea por ID
    getById: async (id: number | string) => {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    // Crear tarea
    create: async (taskData: any) => {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },

    // Actualizar tarea
    update: async (id: number | string, taskData: any) => {
        const response = await api.put(`/tasks/${id}`, taskData);
        return response.data;
    },

    // Eliminar tarea
    delete: async (id: number | string) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    },
};

export default api;
