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
        <nav role="navigation" aria-label="Navegación Principal"
            className="absolute w-300 mx-auto px-4 py-4 flex flex-row justify-between items-center rounded-b-2xl bg-sky-200/50 shadow-md shadow-gray-400/50"
        >
            <Link to="/" className="rounded-xl px-4 py-1 hover:bg-slate-200/50">Inicio</Link>
            <ul className="flex flex-row gap-x-4 ">
                <li className="rounded-xl px-4 py-1 hover:bg-slate-200/50"><Link to="/projects">Proyectos</Link></li>
                <li className="rounded-xl px-4 py-1 hover:bg-slate-200/50"><Link to="/tasks">Tareas</Link></li>
            </ul>
            <button
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 cursor-pointer"
            >Cerrar sesión</button>
        </nav>
    );
}