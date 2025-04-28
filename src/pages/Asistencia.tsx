import LayoutProfesor from "../layouts/LayoutProfesor";

const estudiantes = ["Juan Pérez", "María López", "Carlos Rojas"];
const fechas = ["2025-04-01", "2025-04-03", "2025-04-05"];

export default function Asistencia() {
  return (
    <LayoutProfesor>
      <h1 className="text-2xl font-bold mb-4">Registro de Asistencia</h1>
      <div className="overflow-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto text-center border">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">Estudiante</th>
              {fechas.map((fecha, idx) => (
                <th key={idx} className="p-2 border">{fecha}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((nombre, idx) => (
              <tr key={idx} className="border">
                <td className="p-2 border">{nombre}</td>
                {fechas.map((_, i) => (
                  <td key={i} className="p-2 border">
                    <select className="border rounded px-2 py-1">
                      <option>Presente</option>
                      <option>Licencia</option>
                      <option>Ausente</option>
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LayoutProfesor>
  );
}
