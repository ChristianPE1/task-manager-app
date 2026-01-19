import { useState, useEffect } from 'react';
import { taskService, projectService } from '../services/api';
import { type Project, type Task} from '../types/projects';


type ProjectSummary = Pick<Project, 'id' | 'name'>;

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
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
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'done': return 'bg-green-100 text-green-700 border-green-200';
            case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return 'text-green-600 bg-green-50 border border-green-200';
            case 'medium': return 'text-orange-600 bg-orange-50 border border-orange-200';
            case 'high': return 'text-red-600 bg-red-50 border border-red-200';
            default: return 'text-gray-600 bg-gray-50 border border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mis Tareas</h1>
                    <p className="text-gray-500 mt-1">Gestiona tus tareas pendientes y completadas</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center cursor-pointer gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all duration-200"
                >
                    {showForm ? 'Cancelar' : '+ Nueva Tarea'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
                    Filtros
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                            <option value="">Todos</option>
                            <option value="pending">Pendiente</option>
                            <option value="in_progress">En Progreso</option>
                            <option value="done">Completada</option>
                            <option value="overdue">Atrasada</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                            <option value="">Todas</option>
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                        <select
                            value={filterProjectId}
                            onChange={(e) => setFilterProjectId(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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

            {/* Create Form */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showForm ? 'max-h-200 opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
                <div className="bg-slate-300/30 p-6 rounded-2xl shadow-lg border border-gray-500/50">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Crear Tarea</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                                <select
                                    value={projectId}
                                    onChange={(e) => setProjectId(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    required
                                    placeholder="Nombre de la tarea"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    rows={3}
                                    placeholder="Detalles de la tarea..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                >
                                    <option value="pending">Pendiente</option>
                                    <option value="in_progress">En Progreso</option>
                                    <option value="done">Completada</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                >
                                    <option value="low">Baja</option>
                                    <option value="medium">Media</option>
                                    <option value="high">Alta</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Entrega</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-indigo-600 cursor-pointer text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-70"
                            >
                                {submitting ? 'Creando...' : 'Crear Tarea'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {tasks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <p className="text-gray-400 text-lg">No se encontraron tareas con estos filtros</p>
                        <button onClick={() => {
                            setFilterStatus('');
                            setFilterPriority('');
                            setFilterProjectId('');
                        }} className="mt-2 text-indigo-600 font-medium hover:underline">
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map((task) => (
                            <div key={task.id} className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide border ${getStatusColor(task.status)}`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                    <div className="relative">
                                        <button onClick={() => handleDelete(task.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                            <span className="text-xl">×</span>
                                        </button>
                                    </div>
                                </div>
                                
                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{task.title}</h3>
                                
                                {task.project && (
                                    <p className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md w-fit mb-3">
                                        {task.project.name}
                                    </p>
                                )}
                                
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{task.description || 'Sin descripción'}</p>
                                
                                <div className="pt-4 border-t border-gray-50 mt-auto space-y-3">
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded font-medium ${getPriorityColor(task.priority)}`}>
                                                {task.priority || 'Normal'}
                                            </span>
                                        </div>
                                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                    </div>
                                    
                                    {task.assignee && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-[10px]">
                                                {task.assignee.name.charAt(0)}
                                            </div>
                                            <span className="truncate">{task.assignee.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
