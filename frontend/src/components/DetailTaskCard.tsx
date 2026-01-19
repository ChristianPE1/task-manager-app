import {Link} from "react-router";
import {type Project} from "../types/projects";

interface DetailTaskCardProps {
    project: Project;
}

export default function DetailTaskCard({ project }: DetailTaskCardProps) {
    
    const getStatusColor = (status: string) => {
        switch(status.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'in_progress': return 'bg-blue-100 text-blue-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch(priority.toLowerCase()) {
            case 'high': return 'text-red-600 bg-red-50 border border-red-200';
            case 'medium': return 'text-orange-600 bg-orange-50 border border-orange-200';
            case 'low': return 'text-green-600 bg-green-50 border border-green-200';
            default: return 'text-gray-600 bg-gray-50 border border-gray-200';
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Tareas del Proyecto</h2>
                    <p className="text-gray-500 text-sm mt-1">Lista de tareas asociadas a este proyecto</p>
                </div>
                <Link
                    to="/tasks"
                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                    Ver Tablero Completo
                </Link>
            </div>
            {project.tasks && project.tasks.length > 0 ? (
                <div className="space-y-3">
                    {project.tasks.map((task) => (
                        <div key={task.id} className="group border border-gray-100 rounded-xl p-4 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200 bg-white">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{task.title}</h3>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(task.status)}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center mt-3">
                                <span className={`text-xs px-2 py-1 rounded font-medium ${getPriorityColor(task.priority)}`}>
                                    {task.priority} Priority
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No hay tareas en este proyecto</p>
                    <Link to="/tasks" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">
                        Crear una tarea nueva
                    </Link>
                </div>
            )}
        </div>
    );
}