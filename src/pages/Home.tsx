import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/store/authContext';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenido al Sistema Escolar</h1>
        <p className="text-lg text-gray-600 mb-8">
          Una plataforma integral para la gestión de clases, notas, asistencias, y apoyo psicológico en tu institución educativa.
        </p>
        {user ? (
          <div className="space-y-4">
            <p className="text-gray-700">Hola, {user.nombre} ({user.rol})</p>
            <Link
              to="/dashboard"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Ir al Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mr-4"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}