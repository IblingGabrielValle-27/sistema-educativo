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
import LayoutProfesor from "../layouts/LayoutProfesor";

export default function Dashboard() {
  return (
    <LayoutProfesor>
      <h1 className="text-2xl font-bold">Bienvenido al Dashboard del Profesor</h1>
      <p className="mt-2 text-gray-600">Selecciona una opción en el menú lateral.</p>
    </LayoutProfesor>
  );
}
