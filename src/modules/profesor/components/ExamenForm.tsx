import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/store/authContext';
import { createExam, getProfessorClasses } from '../services/profesorService';

interface Clase {
  id: string;
  materia_id: string;
  curso: string;
  materia: { nombre: string } | null;
}

interface Props {
  onCreated: () => void;
}

export default function ExamenForm({ onCreated }: Props) {
  const { user } = useContext(AuthContext);
  const [clases, setClases] = useState<Clase[]>([]);
  const [materiaId, setMateriaId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaExamen, setFechaExamen] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchClasses = async () => {
      try {
        const data = await getProfessorClasses(user.id);
        setClases(data);
        if (data.length > 0) setMateriaId(data[0].materia_id);
      } catch (err) {
        setError('Error al cargar las clases');
      }
    };

    fetchClasses();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materiaId || !titulo) {
      setError('La materia y el título son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createExam({
        profesor_id: user!.id,
        materia_id: materiaId,
        titulo,
        descripcion: descripcion || null,
        fecha_examen: fechaExamen || null,
      });
      setTitulo('');
      setDescripcion('');
      setFechaExamen('');
      onCreated();
    } catch (err) {
      setError('Error al crear el examen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold">Crear Nuevo Examen</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block font-medium">Materia</label>
        <select
          value={materiaId}
          onChange={(e) => setMateriaId(e.target.value)}
          className="border p-2 w-full rounded"
          disabled={loading}
        >
          <option value="">Seleccione una materia</option>
          {clases.map((clase) => (
            <option key={clase.id} value={clase.materia_id}>
              {clase.materia?.nombre || 'Sin materia'} - {clase.curso}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Título del examen"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-medium">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Descripción del examen"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-medium">Fecha del Examen</label>
        <input
          type="date"
          value={fechaExamen}
          onChange={(e) => setFechaExamen(e.target.value)}
          className="border p-2 w-full rounded"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Creando...' : 'Crear Examen'}
      </button>
    </form>
  );
}