import { Link } from "react-router";
import { authService } from '../services/api';
import { useNavigate } from 'react-router';

export default function NavBar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error('Error al cerrar sesión');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };


    return (
        <nav role="navigation" aria-label="Navegación Principal" className="w-full sticky top-0 z-50 pt-4 px-4 flex justify-center">
            <div className="w-full max-w-5xl bg-white/80 backdrop-blur-md border border-white/20 shadow-lg shadow-indigo-500/10 rounded-2xl px-6 py-3 flex flex-row justify-between items-center transition-all duration-300">
                <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-indigo-600 tracking-tight hover:opacity-80 transition-opacity">Task Manager</Link>
                <div className="flex flex-row items-center gap-x-6">
                    <ul className="flex flex-row gap-x-1">
                        <li><Link to="/projects" className="px-4 py-2 rounded-lg text-gray-600 font-medium hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200">Proyectos</Link></li>
                        <li><Link to="/tasks" className="px-4 py-2 rounded-lg text-gray-600 font-medium hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200">Tareas</Link></li>
                    </ul>
                    <button
                        onClick={handleLogout}
                        aria-label="Cerrar sesión"
                        className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-medium shadow-md shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                    >Cerrar sesión</button>
                </div>
            </div>
        </nav>
    );
}