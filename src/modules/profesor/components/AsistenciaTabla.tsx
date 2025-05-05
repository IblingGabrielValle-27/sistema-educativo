import { useEffect, useState } from 'react';
import { getStudentsByClass, getAttendanceByClass, updateAttendance } from '../services/profesorService';

interface Estudiante {
  id: string;
  user_id: string;
  nombre: string;
  apellido: string;
}

interface Asistencia {
  id: string;
  estudiante_id: string;
  fecha: string;
  estado: 'presente' | 'ausente' | 'licencia';
}

interface Props {
  claseId: string;
  materiaId: string;
}

export default function AsistenciaTabla({ claseId, materiaId }: Props) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentsData, attendanceData] = await Promise.all([
        getStudentsByClass(claseId),
        getAttendanceByClass(materiaId, claseId, fecha),
      ]);
      setEstudiantes(studentsData);
      setAsistencias(attendanceData);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [claseId, materiaId, fecha]);

  const handleAttendanceChange = async (
    estudianteId: string,
    estado: 'presente' | 'ausente' | 'licencia'
  ) => {
    try {
      const asistencia = asistencias.find((a) => a.estudiante_id === estudianteId) || {
        id: '',
        estudiante_id: estudianteId,
        fecha,
        estado: 'presente',
      };

      const updatedAsistencia = { ...asistencia, estado };
      const updated = await updateAttendance(materiaId, estudianteId, fecha, updatedAsistencia);

      if (asistencia.id) {
        setAsistencias(asistencias.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        setAsistencias([...asistencias, updated]);
      }
    } catch (err) {
      setError('Error al actualizar la asistencia');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium">Fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Cargando asistencias...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Estudiante</th>
                <th className="p-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((estudiante) => {
                const asistencia = asistencias.find((a) => a.estudiante_id === estudiante.id);
                return (
                  <tr key={estudiante.id}>
                    <td className="p-2">{`${estudiante.nombre} ${estudiante.apellido}`}</td>
                    <td className="p-2">
                      <select
                        value={asistencia?.estado || 'presente'}
                        onChange={(e) =>
                          handleAttendanceChange(estudiante.id, e.target.value as 'presente' | 'ausente' | 'licencia')
                        }
                        className="border p-1 rounded"
                      >
                        <option value="presente">Presente</option>
                        <option value="ausente">Ausente</option>
                        <option value="licencia">Licencia</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}