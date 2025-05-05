import { useEffect, useState } from 'react';
import { getStudentsByClass, getGradesByClass, updateGrade } from '../services/profesorService';

interface Estudiante {
  id: string;
  user_id: string;
  nombre: string;
  apellido: string;
}

interface Nota {
  id: string;
  estudiante_id: string;
  tarea1: number | null;
  tarea2: number | null;
  tarea3: number | null;
  tarea4: number | null;
  examen: number | null;
  nota_final: number | null;
}

interface Props {
  claseId: string;
  materiaId: string;
}

export default function NotasTabla({ claseId, materiaId }: Props) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentsData, gradesData] = await Promise.all([
        getStudentsByClass(claseId),
        getGradesByClass(materiaId, claseId),
      ]);
      setEstudiantes(studentsData);
      setNotas(gradesData);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [claseId, materiaId]);

  const handleGradeChange = async (
    estudianteId: string,
    field: keyof Nota,
    value: string
  ) => {
    const nota = notas.find((n) => n.estudiante_id === estudianteId) || {
      id: '',
      estudiante_id: estudianteId,
      tarea1: null,
      tarea2: null,
      tarea3: null,
      tarea4: null,
      examen: null,
      nota_final: null,
    };

    const newValue = value ? parseFloat(value) : null;
    const updatedNota = { ...nota, [field]: newValue };

    try {
      const updated = await updateGrade(materiaId, estudianteId, updatedNota);
      if (nota.id) {
        setNotas(notas.map((n) => (n.id === updated.id ? updated : n)));
      } else {
        setNotas([...notas, updated]);
      }
    } catch (err) {
      setError('Error al actualizar la nota');
    }
  };

  return (
    <div className="overflow-x-auto">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Cargando notas...</p>
      ) : (
        <table className="w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Estudiante</th>
              <th className="p-2 text-left">Tarea 1</th>
              <th className="p-2 text-left">Tarea 2</th>
              <th className="p-2 text-left">Tarea 3</th>
              <th className="p-2 text-left">Tarea 4</th>
              <th className="p-2 text-left">Examen</th>
              <th className="p-2 text-left">Nota Final</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((estudiante) => {
              const nota = notas.find((n) => n.estudiante_id === estudiante.id);
              return (
                <tr key={estudiante.id}>
                  <td className="p-2">{`${estudiante.nombre} ${estudiante.apellido}`}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={nota?.tarea1 ?? ''}
                      onChange={(e) => handleGradeChange(estudiante.id, 'tarea1', e.target.value)}
                      className="border p-1 w-16 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={nota?.tarea2 ?? ''}
                      onChange={(e) => handleGradeChange(estudiante.id, 'tarea2', e.target.value)}
                      className="border p-1 w-16 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={nota?.tarea3 ?? ''}
                      onChange={(e) => handleGradeChange(estudiante.id, 'tarea3', e.target.value)}
                      className="border p-1 w-16 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={nota?.tarea4 ?? ''}
                      onChange={(e) => handleGradeChange(estudiante.id, 'tarea4', e.target.value)}
                      className="border p-1 w-16 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={nota?.examen ?? ''}
                      onChange={(e) => handleGradeChange(estudiante.id, 'examen', e.target.value)}
                      className="border p-1 w-16 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={nota?.nota_final ?? ''}
                      onChange={(e) => handleGradeChange(estudiante.id, 'nota_final', e.target.value)}
                      className="border p-1 w-16 rounded"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}