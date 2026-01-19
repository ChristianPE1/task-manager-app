import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { projectService } from '../services/api';
import { type Project } from '../types/projects';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    
    // Form states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await projectService.getAll();
            setProjects(data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar proyectos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await projectService.create(name, description);
            setName('');
            setDescription('');
            setShowForm(false);
            loadProjects();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear proyecto');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

        try {
            await projectService.delete(id);
            loadProjects();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al eliminar proyecto');
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
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Mis Proyectos</h1>
                    <p className="text-gray-500 mt-1">Gestiona y organiza tus proyectos activos</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg cursor-pointer shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all duration-200"
                >
                    {showForm ? 'Cancelar' : '+ Nuevo Proyecto'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm">
                    {error}
                </div>
            )}

            {/* Create Form */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showForm ? 'max-h-125] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
                <div className="bg-slate-300/30 p-6 rounded-2xl shadow-lg border border-gray-500/50">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Crear Nuevo Proyecto</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Proyecto</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="Ej: Rediseño de Sitio Web"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                rows={3}
                                placeholder="Describe brevemente el objetivo del proyecto..."
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-indigo-600 cursor-pointer text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
                            >
                                {submitting ? 'Creando...' : 'Crear Proyecto'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Projects List */}
            {projects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <p className="text-gray-400 text-lg">No tienes proyectos creados aún</p>
                    <button onClick={() => setShowForm(true)} className="mt-4 text-indigo-600 cursor-pointer font-medium hover:underline">
                        Crear tu primer proyecto
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
                            <div className="h-2 bg-indigo-500 w-full"></div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1" title={project.name}>
                                        {project.name}
                                    </h3>
                                </div>
                                <p className="text-gray-600 mb-6 text-sm flex-1 line-clamp-3">
                                    {project.description || 'Sin descripción disponible.'}
                                </p>
                                
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                            {project.owner && project.owner.name ? project.owner.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <span className="text-xs text-gray-500 truncate max-w-[100px]">{project.owner?.name}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/projects/${project.id}`}
                                            className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Ver Detalles
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="text-red-500 bg-red-50 cursor-pointer hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
