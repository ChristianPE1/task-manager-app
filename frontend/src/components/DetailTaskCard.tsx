import {Link} from "react-router";
import {type Project} from "../types/projects";

interface DetailTaskCardProps {
    project: Project;
}

export default function DetailTaskCard({ project }: DetailTaskCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Tareas del Proyecto</h2>
                <Link
                    to="/tasks"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Ver Todas las Tareas
                </Link>
            </div>
            {project.tasks && project.tasks.length > 0 ? (
                <ul className="space-y-2">
                    {project.tasks.map((task) => (
                        <li key={task.id} className="border-b pb-2">
                            <h3 className="font-bold">{task.title}</h3>
                            <p className="text-sm text-gray-600">
                                Estado: {task.status} | Prioridad: {task.priority}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No hay tareas en este proyecto</p>
            )}
        </div>
    );
}