import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/store/authContext';
import TestForm from '../components/TestForm';
import TestEditForm from '../components/TestEditForm';
import { getTestResults, deleteTestResult } from '../services/psicologoService';

interface ResultadoTest {
  id: string;
  estudiante_id: string;
  fecha: string;
  tipo_test: string;
  resultados: string;
  estudiante: { nombre: string; apellido: string } | null;
}

export default function Test() {
  const { user } = useContext(AuthContext);
  const [resultados, setResultados] = useState<ResultadoTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTest, setEditingTest] = useState<ResultadoTest | null>(null);

  const fetchResults = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTestResults(user.id);
      setResultados(data);
    } catch (err) {
      setError('Error al cargar los resultados de tests');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este resultado?')) return;
    try {
      await deleteTestResult(id);
      fetchResults();
    } catch (err) {
      setError('Error al eliminar el resultado');
    }
  };

  useEffect(() => {
    fetchResults();
  }, [user]);

  if (!user || user.rol !== 'psicologo') {
    return <p className="p-6 text-red-500">Acceso denegado. Solo para psicólogos.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Resultados de Tests Psicológicos</h1>
      {editingTest ? (
        <TestEditForm
          test={editingTest}
          onUpdated={() => {
            setEditingTest(null);
            fetchResults();
          }}
          onCancel={() => setEditingTest(null)}
        />
      ) : (
        <TestForm onCreated={fetchResults} />
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Cargando resultados...</p>
      ) : (
        <div className="mt-6 space-y-2">
          {resultados.length === 0 ? (
            <p>No hay resultados de tests registrados</p>
          ) : (
            <ul className="space-y-2">
              {resultados.map((resultado) => (
                <li key={resultado.id} className="bg-white border rounded p-4 shadow flex justify-between items-center">
                  <div>
                    <p className="font-bold">
                      {resultado.estudiante?.nombre} {resultado.estudiante?.apellido}
                    </p>
                    <p className="text-sm text-gray-600">Fecha: {new Date(resultado.fecha).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Tipo de Test: {resultado.tipo_test}</p>
                    <p className="text-gray-700 mt-2">{resultado.resultados}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingTest(resultado)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(resultado.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
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