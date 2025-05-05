/*import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 min-h-screen">
        <Header />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Resumen de Actividades</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow">📚 Clases: 5</div>
            <div className="bg-white rounded-xl p-4 shadow">🧮 Estudiantes: 120</div>
            <div className="bg-white rounded-xl p-4 shadow">📈 Promedios Pendientes: 2</div>
          </div>
        </div>
      </main>
    </div>
  );
}
*/
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/store/authContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p className="p-6 text-red-500">Por favor, inicia sesión para acceder al dashboard.</p>;
  }

  const renderRoleContent = () => {
    switch (user.rol) {
      case 'director':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Panel del Director</h2>
            <p className="text-gray-600">Gestiona las clases y usuarios del sistema.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/director/clases"
                className="block p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Gestionar Clases
              </Link>
              <Link
                to="/director/usuarios"
                className="block p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Gestionar Usuarios
              </Link>
            </div>
          </div>
        );
      case 'profesor':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Panel del Profesor</h2>
            <p className="text-gray-600">Registra notas y asistencia de tus estudiantes.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/profesor/notas"
                className="block p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Registrar Notas
              </Link>
              <Link
                to="/profesor/asistencia"
                className="block p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Registrar Asistencia
              </Link>
            </div>
          </div>
        );
      case 'estudiante':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Panel del Estudiante</h2>
            <p className="text-gray-600">Consulta tus materias y historial académico.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/estudiante/materias"
                className="block p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Mis Materias
              </Link>
              <Link
                to="/estudiante/historial"
                className="block p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Mi Historial
              </Link>
            </div>
          </div>
        );
      case 'psicologo':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Panel del Psicólogo</h2>
            <p className="text-gray-600">Administra tests psicológicos y sesiones de apoyo.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/psicologo/test"
                className="block p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Tests Psicológicos
              </Link>
              <Link
                to="/psicologo/resultados"
                className="block p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Resultados
              </Link>
              <Link
                to="/psicologo/apoyo"
                className="block p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sesiones de Apoyo
              </Link>
              <Link
                to="/psicologo/reportes"
                className="block p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Reportes
              </Link>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Panel de Usuario</h2>
            <p className="text-gray-600">Tu rol no está configurado correctamente. Contacta al administrador.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Bienvenido, {user.nombre || 'Usuario'}</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        {renderRoleContent()}
      </main>
    </div>
  );
}