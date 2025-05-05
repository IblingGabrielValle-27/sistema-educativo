import { useEffect, useState } from 'react';
import { getStudents, updateTestResult } from '../services/psicologoService';

interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
}

interface Props {
  test: {
    id: string;
    estudiante_id: string;
    fecha: string;
    tipo_test: string;
    resultados: string;
  };
  onUpdated: () => void;
  onCancel: () => void;
}

export default function TestEditForm({ test, onUpdated, onCancel }: Props) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [estudianteId, setEstudianteId] = useState(test.estudiante_id);
  const [fecha, setFecha] = useState(test.fecha.split('T')[0]);
  const [tipoTest, setTipoTest] = useState(test.tipo_test);
  const [resultados, setResultados] = useState(test.resultados);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setEstudiantes(data);
      } catch (err) {
        setError('Error al cargar los estudiantes');
      }
    };

    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estudianteId || !tipoTest || !resultados) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateTestResult(test.id, {
        estudiante_id: estudianteId,
        fecha,
        tipo_test: tipoTest,
        resultados,
      });
      onUpdated();
    } catch (err) {
      setError('Error al actualizar el resultado del test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold">Editar Resultado de Test</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block font-medium">Estudiante</label>
        <select
          value={estudianteId}
          onChange={(e) => setEstudianteId(e.target.value)}
          className="border p-2 w-full rounded"
          disabled={loading}
        >
          <option value="">Seleccione un estudiante</option>
          {estudiantes.map((estudiante) => (
            <option key={estudiante.id} value={estudiante.id}>
              {estudiante.nombre} {estudiante.apellido}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium">Fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border p-2 w-full rounded"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-medium">Tipo de Test</label>
        <input
          type="text"
          value={tipoTest}
          onChange={(e) => setTipoTest(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Ej. Test de Ansiedad"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-medium">Resultados</label>
        <textarea
          value={resultados}
          onChange={(e) => setResultados(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Descripción de los resultados"
          disabled={loading}
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Actualizando...' : 'Actualizar Test'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}