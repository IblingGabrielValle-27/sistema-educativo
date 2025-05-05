// src/modules/director/components/ClaseItem.tsx
import { deleteClase } from '../services/clasesService';

interface Clase {
  id: string;
  materia_id: string;
  profesor_id: string;
  curso: string;
  materia?: { nombre: string };
  profesor?: { especialidad: string };
}

interface Props {
  clase: Clase;
  onUpdated: () => void;
}

export default function ClaseItem({ clase, onUpdated }: Props) {
  const handleDelete = async () => {
    if (confirm(`¿Eliminar clase para el curso "${clase.curso}"?`)) {
      try {
        await deleteClase(clase.id);
        onUpdated();
      } catch (err) {
        alert('Error al eliminar la clase');
      }
    }
  };

  return (
    <div className="bg-white border rounded p-4 shadow flex justify-between items-center">
      <div>
        <p className="font-bold">{clase.materia?.nombre || 'Sin materia'}</p>
        <p className="text-sm text-gray-600">Curso: {clase.curso}</p>
        <p className="text-sm text-gray-600">
          Profesor: {clase.profesor?.especialidad || 'Sin asignar'}
        </p>
      </div>
      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
      >
        Eliminar
      </button>
    </div>
  );
}