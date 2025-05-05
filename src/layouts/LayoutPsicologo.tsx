import { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/store/authContext';
import { supabase } from '@/supabase/supabaseClient';

export default function LayoutPsicologo() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/auth');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Panel del Psicólogo</h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 p-4">
            <li>
              <NavLink
                to="/psicologo/test"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-blue-700'}`
                }
              >
                Tests Psicológicos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/psicologo/resultados"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-blue-700'}`
                }
              >
                Resultados
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/psicologo/apoyo"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-blue-700'}`
                }
              >
                Sesiones de Apoyo
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/psicologo/reportes"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-blue-700'}`
                }
              >
                Reportes
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Bienvenido, {user?.nombre || 'Psicólogo'}
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cerrar Sesión
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}