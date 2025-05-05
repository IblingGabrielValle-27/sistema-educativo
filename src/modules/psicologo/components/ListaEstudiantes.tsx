import { useEffect, useState } from 'react';
import { getStudents } from '../services/psicologoService';

interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
}

interface Props {
  onSelect?: (estudianteId: string) => void;
  selectedId?: string;
}

export default function ListaEstudiantes({ onSelect, selectedId }: Props) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStudents();
        setEstudiantes(data);
      } catch (err) {
        setError('Error al cargar los estudiantes');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="space-y-2">
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Cargando estudiantes...</p>
      ) : (
        <ul className="space-y-1">
          {estudiantes.length === 0 ? (
            <p>No hay estudiantes registrados</p>
          ) : (
            estudiantes.map((estudiante) => (
              <li
                key={estudiante.id}
                className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${
                  selectedId === estudiante.id ? 'bg-blue-100' : ''
                }`}
                onClick={() => onSelect && onSelect(estudiante.id)}
              >
                {estudiante.nombre} {estudiante.apellido}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}