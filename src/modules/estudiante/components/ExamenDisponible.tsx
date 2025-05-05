import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/store/authContext';
import { getStudentExams } from '../services/estudianteService';

interface Examen {
  id: string;
  materia_id: string;
  profesor_id: string;
  titulo: string;
  descripcion: string | null;
  fecha_examen: string | null;
  materia: { nombre: string } | null;
}

export default function ExamenDisponible() {
  const { user } = useContext(AuthContext);
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchExams = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStudentExams(user.id);
        setExamenes(data);
      } catch (err) {
        setError('Error al cargar los exámenes');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [user]);

  if (!user || user.rol !== 'estudiante') {
    return <p className="p-6 text-red-500">Acceso denegado. Solo para estudiantes.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Exámenes Disponibles</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Cargando exámenes...</p>
      ) : (
        <div className="space-y-4">
          {examenes.length === 0 ? (
            <p>No hay exámenes programados</p>
          ) : (
            <ul className="space-y-2">
              {examenes.map((examen) => (
                <li
                  key={examen.id}
                  className="bg-white border rounded p-4 shadow"
                >
                  <p className="font-bold">{examen.titulo}</p>
                  <p className="text-sm text-gray-600">Materia: {examen.materia?.nombre || 'Sin materia'}</p>
                  <p className="text-sm text-gray-600">
                    Fecha: {examen.fecha_examen ? new Date(examen.fecha_examen).toLocaleDateString() : 'No especificada'}
                  </p>
                  {examen.descripcion && (
                    <p className="text-gray-700 mt-2">{examen.descripcion}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}