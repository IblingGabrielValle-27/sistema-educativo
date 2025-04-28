import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { nombre: "Dashboard", ruta: "/" },
    { nombre: "Gestión de Notas", ruta: "/notas" },
    { nombre: "Asistencia", ruta: "/asistencia" },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-xl fixed top-0 left-0">
      <div className="text-center py-6 text-xl font-bold text-blue-600 border-b">
        Sistema Educativo
      </div>
      <nav className="mt-6 flex flex-col">
        {menu.map((item) => (
          <Link
            key={item.ruta}
            to={item.ruta}
            className={`px-6 py-3 text-left text-sm font-medium ${
              location.pathname === item.ruta
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {item.nombre}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

/*import { Home, Book, Users, FileText, MessageCircle } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-blue-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Profesor</h2>
      <nav className="flex flex-col gap-4">
        <a href="#" className="flex items-center gap-2 hover:text-blue-300"><Home size={20} /> Inicio</a>
        <a href="#" className="flex items-center gap-2 hover:text-blue-300"><Book size={20} /> Clases</a>
        <a href="#" className="flex items-center gap-2 hover:text-blue-300"><Users size={20} /> Asistencia</a>
        <a href="#" className="flex items-center gap-2 hover:text-blue-300"><FileText size={20} /> Notas</a>
        <a href="#" className="flex items-center gap-2 hover:text-blue-300"><MessageCircle size={20} /> Psicólogo</a>
      </nav>
    </aside>
  );
}*/
