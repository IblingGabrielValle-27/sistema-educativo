// src/modules/director/services/clasesService.ts
import { supabase } from '@/supabase/supabaseClient';

interface Clase {
  id: string;
  materia_id: string;
  profesor_id: string;
  curso: string;
  materia: { nombre: string };
  profesor: { especialidad: string };
}

export const getClases = async (): Promise<Clase[]> => {
  const { data, error } = await supabase
    .from('clases')
    .select(`
      id,
      materia_id,
      profesor_id,
      curso,
      materia:materias (nombre),
      profesor:profesores (especialidad)
    `);
  if (error) throw new Error(`Error al obtener clases: ${error.message}`);
  return data || [];
};

export const createClase = async (nuevaClase: { materia_id: string; profesor_id: string; curso: string }) => {
  const { data, error } = await supabase.from('clases').insert([nuevaClase]).select();
  if (error) throw new Error(`Error al crear clase: ${error.message}`);
  return data;
};

export const deleteClase = async (id: string) => {
  const { error } = await supabase.from('clases').delete().eq('id', id);
  if (error) throw new Error(`Error al eliminar clase: ${error.message}`);
};