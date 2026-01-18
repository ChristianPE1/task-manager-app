import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { projectService } from '../services/api';

interface Project {
    id: number;
    name: string;
    description: string;
    owner: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
}

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
        return <div className="text-center py-10">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 w-300">
            {/* Header */}
            <div className="max-w-7xl h-screen mx-auto px-4 pt-24 pb-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Create Project Button */}
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {showForm ? 'Cancelar' : 'Nuevo Proyecto'}
                </button>

                {/* Create Form */}
                {showForm && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-bold mb-4">Crear Proyecto</h2>
                        <form onSubmit={handleSubmit}>
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
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
                            >
                                {submitting ? 'Creando...' : 'Crear'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Projects List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.length === 0 ? (
                        <p className="text-gray-500">No hay proyectos aún</p>
                    ) : (
                        projects.map((project) => (
                            <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                                <p className="text-gray-600 mb-4">{project.description || 'Sin descripción'}</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Creado por: {project.owner.name}
                                </p>
                                <div className="flex gap-2">
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Ver
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
