import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/store/authContext';
import { getStudentTasks } from '../services/estudianteService';

interface Tarea {
  id: string;
  materia_id: string;
  profesor_id: string;
  titulo: string;
  descripcion: string | null;
  fecha_entrega: string | null;
  archivo_url: string | null;
  materia: { nombre: string } | null;
}

export default function ListaTareas() {
  const { user } = useContext(AuthContext);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStudentTasks(user.id);
        setTareas(data);
      } catch (err) {
        setError('Error al cargar las tareas');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  if (!user || user.rol !== 'estudiante') {
    return <p className="p-6 text-red-500">Acceso denegado. Solo para estudiantes.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Mis Tareas</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Cargando tareas...</p>
      ) : (
        <div className="space-y-4">
          {tareas.length === 0 ? (
            <p>No hay tareas asignadas</p>
          ) : (
            <ul className="space-y-2">
              {tareas.map((tarea) => (
                <li
                  key={tarea.id}
                  className="bg-white border rounded p-4 shadow"
                >
                  <p className="font-bold">{tarea.titulo}</p>
                  <p className="text-sm text-gray-600">Materia: {tarea.materia?.nombre || 'Sin materia'}</p>
                  <p className="text-sm text-gray-600">
                    Fecha de entrega: {tarea.fecha_entrega ? new Date(tarea.fecha_entrega).toLocaleDateString() : 'No especificada'}
                  </p>
                  {tarea.descripcion && (
                    <p className="text-gray-700 mt-2">{tarea.descripcion}</p>
                  )}
                  {tarea.archivo_url && (
                    <a
                      href={tarea.archivo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mt-2 inline-block"
                    >
                      Ver archivo
                    </a>
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