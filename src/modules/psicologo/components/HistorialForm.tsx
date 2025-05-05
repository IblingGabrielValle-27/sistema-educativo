import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/store/authContext';
import { createSupportSession, getStudents } from '../services/psicologoService';

interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
}

interface Props {
  onCreated: () => void;
}

export default function HistorialForm({ onCreated }: Props) {
  const { user } = useContext(AuthContext);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [estudianteId, setEstudianteId] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setEstudiantes(data);
        if (data.length > 0) setEstudianteId(data[0].id);
      } catch (err) {
        setError('Error al cargar los estudiantes');
      }
    };

    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estudianteId || !observaciones) {
      setError('El estudiante y las observaciones son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createSupportSession({
        psicologo_id: user!.id,
        estudiante_id: estudianteId,
        fecha,
        observaciones,
      });
      setFecha(new Date().toISOString().split('T')[0]);
      setObservaciones('');
      setEstudianteId(estudiantes[0]?.id || '');
      onCreated();
    } catch (err) {
      setError('Error al registrar la sesión de apoyo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold">Registrar Sesión de Apoyo</h2>
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
        <label className="block font-medium">Observaciones</label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Detalles de la sesión"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Registrando...' : 'Registrar Sesión'}
      </button>
    </form>
  );
}