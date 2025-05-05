// src/modules/director/pages/Clases.tsx
import ClaseForm from '../components/ClaseForm';
import ClaseItem from '../components/ClaseItem';
import { useEffect, useState } from 'react';
import { getClases } from '../services/clasesService';

interface Clase {
  id: string;
  materia_id: string;
  profesor_id: string;
  curso: string;
  materia: { nombre: string };
  profesor: { especialidad: string };
}

export default function Clases() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClases();
      setClases(data);
    } catch (err) {
      setError('Error al cargar las clases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClases();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Clases</h1>
      <ClaseForm onCreated={fetchClases} />
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {loading ? (
        <p className="mt-4">Cargando clases...</p>
      ) : (
        <div className="mt-6 space-y-2">
          {clases.length === 0 ? (
            <p>No hay clases registradas</p>
          ) : (
            clases.map((clase) => (
              <ClaseItem key={clase.id} clase={clase} onUpdated={fetchClases} />
            ))
          )}
        </div>
      )}
    </div>
  );
}