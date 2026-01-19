import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { projectService } from '../services/api';
import { type Project } from '../types/projects';
import DetailTaskCard from '../components/DetailTaskCard';


export default function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadProject();
    }, [id]);

    const loadProject = async () => {
        try {
            const data = await projectService.getById(Number(id));
            setProject(data.data);
            setName(data.data.name);
            setDescription(data.data.description || '');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar proyecto');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await projectService.update(Number(id), name, description);
            setEditing(false);
            loadProject();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al actualizar proyecto');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Cargando...</div>;
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
                <p className="text-xl font-medium">Proyecto no encontrado</p>
                <button onClick={() => navigate('/projects')} className="mt-4 text-indigo-600 hover:underline">
                    Volver a proyectos
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 w-full animate-fade-in-up">
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-6 flex lg:flex-row flex-col gap-4 justify-between items-start lg:items-center">
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => navigate('/projects')}
                            className="text-gray-500 hover:text-indigo-600 flex items-center gap-1 text-sm font-medium transition-colors mb-2 w-fit"
                        >
                            ← Volver a Proyectos
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">ACTIVO</span>
                            <span>•</span>
                            <span>Creado por {project.owner.name}</span>
                        </div>
                    </div>
                    {!editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 hover:text-indigo-600 transition-all flex items-center gap-2"
                        >
                            Editar Proyecto
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm">
                        {error}
                    </div>
                )}

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    {editing ? (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Proyecto</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    rows={4}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                                >
                                    {submitting ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="prose max-w-none">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sobre este proyecto</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {project.description || <span className="italic text-gray-400">No hay descripción disponible para este proyecto.</span>}
                            </p>
                        </div>
                    )}
                </div>

                <DetailTaskCard project={project} />
            </div>
        </div>
    );
}
