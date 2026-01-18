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
        return <div className="text-center py-10">Proyecto no encontrado</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow mb-6">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/projects')}
                            className="text-blue-500 hover:underline"
                        >
                            ← Volver
                        </button>
                        <h1 className="text-2xl font-bold">{project.name}</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    {editing ? (
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Nombre</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    {submitting ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <p className="text-gray-700 mb-4">{project.description || 'Sin descripción'}</p>
                            <p className="text-sm text-gray-500 mb-4">
                                Creado por: {project.owner.name} ({project.owner.email})
                            </p>
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Editar
                            </button>
                        </>
                    )}
                </div>

                <DetailTaskCard project={project} />
            </div>
        </div>
    );
}
