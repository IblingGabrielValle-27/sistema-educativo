import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/store/authContext';
import AsistenciaTabla from '../components/AsistenciaTabla';
import { getProfessorClasses } from '../services/profesorService';

interface Clase {
  id: string;
  materia_id: string;
  curso: string;
  materia: { nombre: string } | null;
}

export default function Asistencia() {
  const { user } = useContext(AuthContext);
  const [clases, setClases] = useState<Clase[]>([]);
  const [selectedClase, setSelectedClase] = useState<Clase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProfessorClasses(user.id);
        setClases(data);
        if (data.length > 0) setSelectedClase(data[0]);
      } catch (err) {
        setError('Error al cargar las clases');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user]);

  if (!user || user.rol !== 'profesor') {
    return <p className="p-6 text-red-500">Acceso denegado. Solo para profesores.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Asistencia</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Cargando clases...</p>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Seleccionar Clase</label>
            <select
              value={selectedClase?.id || ''}
              onChange={(e) => {
                const clase = clases.find((c) => c.id === e.target.value);
                setSelectedClase(clase || null);
              }}
              className="w-full max-w-xs border px-3 py-2 rounded"
            >
              {clases.map((clase) => (
                <option key={clase.id} value={clase.id}>
                  {clase.materia?.nombre || 'Sin materia'} - {clase.curso}
                </option>
              ))}
            </select>
          </div>
          {selectedClase ? (
            <AsistenciaTabla claseId={selectedClase.id} materiaId={selectedClase.materia_id} />
          ) : (
            <p>No hay clases disponibles</p>
          )}
        </div>
      )}
    </div>
  );
}