// src/layouts/LayoutDirector.tsx
import { Outlet, Link } from 'react-router-dom';

export default function LayoutDirector() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Panel Director</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/director/clases" className="hover:underline">Gestión de Clases</Link>
          <Link to="/director/usuarios" className="hover:underline">Gestión de Usuarios</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
