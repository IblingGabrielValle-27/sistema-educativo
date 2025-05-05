import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/store/authContext';
import { getStudentClasses } from '../services/estudianteService';

interface Clase {
  id: string;
  materia_id: string;
  profesor_id: string;
  curso: string;
  materia: { nombre: string } | null;
  profesor: { especialidad: string } | null;
}

export default function MisMaterias() {
  const { user } = useContext(AuthContext);
  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStudentClasses(user.id);
        setClases(data);
      } catch (err) {
        setError('Error al cargar las materias');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user]);

  if (!user || user.rol !== 'estudiante') {
    return <p className="p-6 text-red-500">Acceso denegado. Solo para estudiantes.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Materias</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Cargando materias...</p>
      ) : (
        <div className="space-y-4">
          {clases.length === 0 ? (
            <p>No estás inscrito en ninguna materia</p>
          ) : (
            <ul className="space-y-2">
              {clases.map((clase) => (
                <li
                  key={clase.id}
                  className="bg-white border rounded p-4 shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{clase.materia?.nombre || 'Sin materia'}</p>
                    <p className="text-sm text-gray-600">Curso: {clase.curso}</p>
                    <p className="text-sm text-gray-600">
                      Profesor: {clase.profesor?.especialidad || 'Sin asignar'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}