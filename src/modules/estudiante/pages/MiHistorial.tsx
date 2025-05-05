import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/store/authContext';
import { getStudentGrades, getStudentAttendance } from '../services/estudianteService';

interface Nota {
  id: string;
  materia_id: string;
  tarea1: number | null;
  tarea2: number | null;
  tarea3: number | null;
  tarea4: number | null;
  examen: number | null;
  nota_final: number | null;
  materia: { nombre: string } | null;
}

interface Asistencia {
  id: string;
  materia_id: string;
  fecha: string;
  estado: 'presente' | 'ausente' | 'licencia';
  materia: { nombre: string } | null;
}

export default function MiHistorial() {
  const { user } = useContext(AuthContext);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [gradesData, attendanceData] = await Promise.all([
          getStudentGrades(user.id),
          getStudentAttendance(user.id),
        ]);
        setNotas(gradesData);
        setAsistencias(attendanceData);
      } catch (err) {
        setError('Error al cargar el historial');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user || user.rol !== 'estudiante') {
    return <p className="p-6 text-red-500">Acceso denegado. Solo para estudiantes.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Historial Académico</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Cargando historial...</p>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Notas</h2>
            {notas.length === 0 ? (
              <p>No hay notas registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Materia</th>
                      <th className="p-2 text-left">Tarea 1</th>
                      <th className="p-2 text-left">Tarea 2</th>
                      <th className="p-2 text-left">Tarea 3</th>
                      <th className="p-2 text-left">Tarea 4</th>
                      <th className="p-2 text-left">Examen</th>
                      <th className="p-2 text-left">Nota Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notas.map((nota) => (
                      <tr key={nota.id}>
                        <td className="p-2">{nota.materia?.nombre || 'Sin materia'}</td>
                        <td className="p-2">{nota.tarea1 ?? '-'}</td>
                        <td className="p-2">{nota.tarea2 ?? '-'}</td>
                        <td className="p-2">{nota.tarea3 ?? '-'}</td>
                        <td className="p-2">{nota.tarea4 ?? '-'}</td>
                        <td className="p-2">{nota.examen ?? '-'}</td>
                        <td className="p-2">{nota.nota_final ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Asistencias</h2>
            {asistencias.length === 0 ? (
              <p>No hay asistencias registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Materia</th>
                      <th className="p-2 text-left">Fecha</th>
                      <th className="p-2 text-left">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asistencias.map((asistencia) => (
                      <tr key={asistencia.id}>
                        <td className="p-2">{asistencia.materia?.nombre || 'Sin materia'}</td>
                        <td className="p-2">{new Date(asistencia.fecha).toLocaleDateString()}</td>
                        <td className="p-2">{asistencia.estado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}