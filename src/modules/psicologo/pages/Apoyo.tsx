import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/store/authContext';
import HistorialForm from '../components/HistorialForm';
import { getSupportSessions } from '../services/psicologoService';

interface HistorialApoyo {
  id: string;
  estudiante_id: string;
  fecha: string;
  observaciones: string;
  estudiante: { nombre: string; apellido: string } | null;
}

export default function Apoyo() {
  const { user } = useContext(AuthContext);
  const [sesiones, setSesiones] = useState<HistorialApoyo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSupportSessions(user.id);
      setSesiones(data);
    } catch (err) {
      setError('Error al cargar las sesiones de apoyo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  if (!user || user.rol !== 'psicologo') {
    return <p className="p-6 text-red-500">Acceso denegado. Solo para psicólogos.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sesiones de Apoyo</h1>
      <HistorialForm onCreated={fetchSessions} />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Cargando sesiones...</p>
      ) : (
        <div className="mt-6 space-y-2">
          {sesiones.length === 0 ? (
            <p>No hay sesiones de apoyo registradas</p>
          ) : (
            <ul className="space-y-2">
              {sesiones.map((sesion) => (
                <li key={sesion.id} className="bg-white border rounded p-4 shadow">
                  <p className="font-bold">
                    {sesion.estudiante?.nombre} {sesion.estudiante?.apellido}
                  </p>
                  <p className="text-sm text-gray-600">Fecha: {new Date(sesion.fecha).toLocaleDateString()}</p>
                  <p className="text-gray-700 mt-2">{sesion.observaciones}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}