import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/store/authContext';
import { getTestResults, getSupportSessions } from '../services/psicologoService';

interface ResultadoTest {
  id: string;
  estudiante_id: string;
  fecha: string;
  tipo_test: string;
  resultados: string;
  estudiante: { nombre: string; apellido: string } | null;
}

interface HistorialApoyo {
  id: string;
  estudiante_id: string;
  fecha: string;
  observaciones: string;
  estudiante: { nombre: string; apellido: string } | null;
}

export default function Reportes() {
  const { user } = useContext(AuthContext);
  const [resultados, setResultados] = useState<ResultadoTest[]>([]);
  const [sesiones, setSesiones] = useState<HistorialApoyo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resultsData, sessionsData] = await Promise.all([
          getTestResults(user.id),
          getSupportSessions(user.id),
        ]);
        setResultados(resultsData);
        setSesiones(sessionsData);
      } catch (err) {
        setError('Error al cargar los datos para reportes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user || user.rol !== 'psicologo') {
    return <p className="p-6 text-red-500">Acceso denegado. Solo para psicólogos.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reportes Psicológicos</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Resumen de Tests Psicológicos</h2>
            {resultados.length === 0 ? (
              <p>No hay resultados de tests registrados</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Estudiante</th>
                      <th className="p-2 text-left">Fecha</th>
                      <th className="p-2 text-left">Tipo de Test</th>
                      <th className="p-2 text-left">Resultados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((resultado) => (
                      <tr key={resultado.id}>
                        <td className="p-2">
                          {resultado.estudiante?.nombre} {resultado.estudiante?.apellido}
                        </td>
                        <td className="p-2">{new Date(resultado.fecha).toLocaleDateString()}</td>
                        <td className="p-2">{resultado.tipo_test}</td>
                        <td className="p-2">{resultado.resultados}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Resumen de Sesiones de Apoyo</h2>
            {sesiones.length === 0 ? (
              <p>No hay sesiones de apoyo registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Estudiante</th>
                      <th className="p-2 text-left">Fecha</th>
                      <th className="p-2 text-left">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sesiones.map((sesion) => (
                      <tr key={sesion.id}>
                        <td className="p-2">
                          {sesion.estudiante?.nombre} {sesion.estudiante?.apellido}
                        </td>
                        <td className="p-2">{new Date(sesion.fecha).toLocaleDateString()}</td>
                        <td className="p-2">{sesion.observaciones}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}