import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/store/authContext';
import { createTask, getProfessorClasses } from '../services/profesorService';

interface Clase {
  id: string;
  materia_id: string;
  curso: string;
  materia: { nombre: string } | null;
}

interface Props {
  onCreated: () => void;
}

export default function TareaForm({ onCreated }: Props) {
  const { user } = useContext(AuthContext);
  const [clases, setClases] = useState<Clase[]>([]);
  const [materiaId, setMateriaId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [archivoUrl, setArchivoUrl] = useState('');
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
      await createTask({
        profesor_id: user!.id,
        materia_id: materiaId,
        titulo,
        descripcion: descripcion || null,
        fecha_entrega: fechaEntrega || null,
        archivo_url: archivoUrl || null,
      });
      setTitulo('');
      setDescripcion('');
      setFechaEntrega('');
      setArchivoUrl('');
      onCreated();
    } catch (err) {
      setError('Error al crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold">Crear Nueva Tarea</h2>
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
          placeholder="Título de la tarea"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-medium">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Descripción de la tarea"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-medium">Fecha de Entrega</label>
        <input
          type="date"
          value={fechaEntrega}
          onChange={(e) => setFechaEntrega(e.target.value)}
          className="border p-2 w-full rounded"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-medium">URL del Archivo</label>
        <input
          type="url"
          value={archivoUrl}
          onChange={(e) => setArchivoUrl(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="https://ejemplo.com/archivo.pdf"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Creando...' : 'Crear Tarea'}
      </button>
    </form>
  );
}