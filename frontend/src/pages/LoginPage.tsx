import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { authService } from '../services/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await authService.login(email, password);
            
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));

            navigate('/projects');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Error al iniciar sesión';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bienvenido de nuevo</h1>
                    <p className="text-gray-500 mt-2">Ingresa tus credenciales para continuar</p>
                </div>
                
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="ejemplo@correo.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                </form>

                <p className="text-center mt-8 text-gray-600 text-sm">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">Regístrate ahora</Link>
                </p>
            </div>
        </div>
    );
}
