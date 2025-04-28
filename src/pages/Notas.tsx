import LayoutProfesor from "../layouts/LayoutProfesor";

const estudiantes = [
  { nombre: "Juan Pérez" },
  { nombre: "María López" },
  { nombre: "Carlos Rojas" },
];

export default function Notas() {
  return (
    <LayoutProfesor>
      <h1 className="text-2xl font-bold mb-4">Gestión de Notas</h1>
      <div className="overflow-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto text-center border">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-2 border">Estudiante</th>
              <th className="p-2 border">Tarea 1</th>
              <th className="p-2 border">Tarea 2</th>
              <th className="p-2 border">Tarea 3</th>
              <th className="p-2 border">Tarea 4</th>
              <th className="p-2 border">Examen</th>
              <th className="p-2 border">Nota Final</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((est, idx) => (
              <tr key={idx} className="border">
                <td className="p-2 border">{est.nombre}</td>
                {[...Array(5)].map((_, i) => (
                  <td key={i} className="p-2 border">
                    <input
                      type="number"
                      className="w-16 text-center border rounded"
                      min="0"
                      max="100"
                    />
                  </td>
                ))}
                <td className="p-2 border">--</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LayoutProfesor>
  );
}
