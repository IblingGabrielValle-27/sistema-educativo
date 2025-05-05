import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/store/authContext';
import ExamenForm from '../components/ExamenForm';
import { getProfessorExams } from '../services/profesorService';

interface Examen {
  id: string;
  materia_id: string;
  titulo: string;
  descripcion: string | null;
  fecha_examen: string | null;
  materia: { nombre: string } | null;
}

export default function Examenes() {
  const { user } = useContext(AuthContext);
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getProfessorExams(user.id);
      setExamenes(data);
    } catch (err) {
      setError('Error al cargar los exámenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [user]);

  if (!user || user.rol !== 'profesor') {
    return <p className="p-6 text-red-500">Acceso denegado. Solo para profesores.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Exámenes</h1>
      <ExamenForm onCreated={fetchExams} />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Cargando exámenes...</p>
      ) : (
        <div className="mt-6 space-y-2">
          {examenes.length === 0 ? (
            <p>No hay exámenes creados</p>
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