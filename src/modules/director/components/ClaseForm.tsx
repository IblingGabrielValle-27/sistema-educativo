// src/modules/director/components/ClaseForm.tsx
import { useState, useEffect } from 'react';
import { createClase } from '../services/clasesService';
import { supabase } from '@/supabase/supabaseClient';

interface Props {
  onCreated: () => void;
}

interface Materia {
  id: string;
  nombre: string;
}

interface Profesor {
  id: string;
  user_id: string;
  especialidad: string;
}

export default function ClaseForm({ onCreated }: Props) {
  const [materiaId, setMateriaId] = useState('');
  const [profesorId, setProfesorId] = useState('');
  const [curso, setCurso] = useState('');
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch materias and profesores for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      const [materiasRes, profesoresRes] = await Promise.all([
        supabase.from('materias').select('id, nombre'),
        supabase.from('profesores').select('id, user_id, especialidad'),
      ]);

      if (materiasRes.error) {
        setError('Error al cargar materias');
        return;
      }
      if (profesoresRes.error) {
        setError('Error al cargar profesores');
        return;
      }

      setMaterias(materiasRes.data || []);
      setProfesores(profesoresRes.data || []);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materiaId || !profesorId || !curso) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createClase({ materia_id: materiaId, profesor_id: profesorId, curso });
      setMateriaId('');
      setProfesorId('');
      setCurso('');
      onCreated();
    } catch (err) {
      setError('Error al crear la clase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold">Crear Nueva Clase</h2>
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
          {materias.map((materia) => (
            <option key={materia.id} value={materia.id}>
              {materia.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium">Profesor</label>
        <select
          value={profesorId}
          onChange={(e) => setProfesorId(e.target.value)}
          className="border p-2 w-full rounded"
          disabled={loading}
        >
          <option value="">Seleccione un profesor</option>
          {profesores.map((profesor) => (
            <option key={profesor.id} value={profesor.id}>
              {profesor.especialidad || 'Profesor'}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium">Curso</label>
        <input
          type="text"
          placeholder="Ej: 1º A"
          className="border p-2 w-full rounded"
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Creando...' : 'Crear Clase'}
      </button>
    </form>
  );
}