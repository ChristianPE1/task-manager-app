import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { taskService, projectService } from '../services/api';

interface Task {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'done' | 'overdue';
    priority: 'low' | 'medium' | 'high';
    due_date: string;
    project: {
        id: number;
        name: string;
    };
    assignee: {
        id: number;
        name: string;
        email: string;
    };
}

interface Project {
    id: number;
    name: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    
    // Filters
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [filterProjectId, setFilterProjectId] = useState('');
    
    // Form states
    const [projectId, setProjectId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        loadProjects();
        loadTasks();
    }, [filterStatus, filterPriority, filterProjectId]);

    const loadTasks = async () => {
        try {
            const filters: any = {};
            if (filterStatus) filters.status = filterStatus;
            if (filterPriority) filters.priority = filterPriority;
            if (filterProjectId) filters.project_id = filterProjectId;
            
            const data = await taskService.getAll(filters);
            setTasks(data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar tareas');
        } finally {
            setLoading(false);
        }
    };

    const loadProjects = async () => {
        try {
            const data = await projectService.getAll();
            setProjects(data.data);
        } catch (err: any) {
            console.error('Error al cargar proyectos');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await taskService.create({
                project_id: Number(projectId),
                title,
                description,
                status,
                priority,
                due_date: dueDate,
                assigned_to: currentUser.id,
            });
            
            // Reset form
            setTitle('');
            setDescription('');
            setStatus('pending');
            setPriority('medium');
            setDueDate('');
            setProjectId('');
            setShowForm(false);
            
            loadTasks();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear tarea');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

        try {
            await taskService.delete(id);
            loadTasks();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al eliminar tarea');
        }
    };



    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'done': return 'bg-green-100 text-green-800';
            case 'overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="text-center py-10">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 w-300">
            {/* Header */}
            

            <div className="max-w-7xl h-screen mx-auto px-4 pt-24 pb-8 bg-slate-50  ">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <h2 className="font-bold mb-3">Filtros</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Estado</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="">Todos</option>
                                <option value="pending">Pendiente</option>
                                <option value="in_progress">En Progreso</option>
                                <option value="done">Completada</option>
                                <option value="overdue">Atrasada</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Prioridad</label>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="">Todas</option>
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Proyecto</label>
                            <select
                                value={filterProjectId}
                                onChange={(e) => setFilterProjectId(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="">Todos</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Create Task Button */}
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {showForm ? 'Cancelar' : 'Nueva Tarea'}
                </button>

                {/* Create Form */}
                {showForm && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-bold mb-4">Crear Tarea</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Proyecto</label>
                                    <select
                                        value={projectId}
                                        onChange={(e) => setProjectId(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        required
                                    >
                                        <option value="">Selecciona un proyecto</option>
                                        {projects.map((project) => (
                                            <option key={project.id} value={project.id}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Título</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 mb-2">Descripción</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Estado</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        <option value="pending">Pendiente</option>
                                        <option value="in_progress">En Progreso</option>
                                        <option value="done">Completada</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Prioridad</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        <option value="low">Baja</option>
                                        <option value="medium">Media</option>
                                        <option value="high">Alta</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Fecha de Entrega</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
                            >
                                {submitting ? 'Creando...' : 'Crear'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Tasks List */}
                <div className="space-y-4">
                    {tasks.length === 0 ? (
                        <p className="text-gray-500">No hay tareas</p>
                    ) : (
                        tasks.map((task) => (
                            <div key={task.id} className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{task.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Proyecto: {task.project.name}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/tasks/${task.id}`}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Ver
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-3">{task.description || 'Sin descripción'}</p>
                                <div className="flex gap-2 mb-2">
                                    <span className={`px-3 py-1 rounded text-sm ${getStatusColor(task.status)}`}>
                                        {task.status}
                                    </span>
                                    <span className={`px-3 py-1 rounded text-sm ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Vence: {new Date(task.due_date).toLocaleDateString('es-ES')}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Asignado a: {task.assignee.name}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
