import { supabase } from '@/supabase/supabaseClient';

interface Clase {
  id: string;
  materia_id: string;
  profesor_id: string;
  curso: string;
  materia: { nombre: string } | null;
  profesor: { especialidad: string } | null;
}

interface Nota {
  id: string;
  materia_id: string;
  tarea1: number | null;
  tarea2: number | null;
  tarea3: number | null;
  tarea4: number | null;
  examen: number | null;
  nota_final: number | null;
  materia: { nombre: string } | null;
}

interface Asistencia {
  id: string;
  materia_id: string;
  fecha: string;
  estado: 'presente' | 'ausente' | 'licencia';
  materia: { nombre: string } | null;
}

interface Tarea {
  id: string;
  materia_id: string;
  profesor_id: string;
  titulo: string;
  descripcion: string | null;
  fecha_entrega: string | null;
  archivo_url: string | null;
  materia: { nombre: string } | null;
}

interface Examen {
  id: string;
  materia_id: string;
  profesor_id: string;
  titulo: string;
  descripcion: string | null;
  fecha_examen: string | null;
  materia: { nombre: string } | null;
}

export const getStudentClasses = async (userId: string): Promise<Clase[]> => {
  const { data: estudiante, error: estudianteError } = await supabase
    .from('estudiantes')
    .select('curso')
    .eq('user_id', userId)
    .single();

  if (estudianteError) {
    throw new Error(`Error al obtener datos del estudiante: ${estudianteError.message}`);
  }

  if (!estudiante?.curso) {
    return [];
  }

  const { data, error } = await supabase
    .from('clases')
    .select(`
      id,
      materia_id,
      profesor_id,
      curso,
      materia:materias (nombre),
      profesor:profesores (especialidad)
    `)
    .eq('curso', estudiante.curso);

  if (error) {
    throw new Error(`Error al obtener clases: ${error.message}`);
  }

  return (data as Clase[]) || [];
};

export const getStudentGrades = async (userId: string): Promise<Nota[]> => {
  const { data: estudiante, error: estudianteError } = await supabase
    .from('estudiantes')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (estudianteError) {
    throw new Error(`Error al obtener datos del estudiante: ${estudianteError.message}`);
  }

  const { data, error } = await supabase
    .from('notas')
    .select(`
      id,
      materia_id,
      tarea1,
      tarea2,
      tarea3,
      tarea4,
      examen,
      nota_final,
      materia:materias (nombre)
    `)
    .eq('estudiante_id', estudiante.id);

  if (error) {
    throw new Error(`Error al obtener notas: ${error.message}`);
  }

  return (data as Nota[]) || [];
};

export const getStudentAttendance = async (userId: string): Promise<Asistencia[]> => {
  const { data: estudiante, error: estudianteError } = await supabase
    .from('estudiantes')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (estudianteError) {
    throw new Error(`Error al obtener datos del estudiante: ${estudianteError.message}`);
  }

  const { data, error } = await supabase
    .from('asistencias')
    .select(`
      id,
      materia_id,
      fecha,
      estado,
      materia:materias (nombre)
    `)
    .eq('estudiante_id', estudiante.id);

  if (error) {
    throw new Error(`Error al obtener asistencias: ${error.message}`);
  }

  return (data as Asistencia[]) || [];
};

export const getStudentTasks = async (userId: string): Promise<Tarea[]> => {
  const { data: estudiante, error: estudianteError } = await supabase
    .from('estudiantes')
    .select('curso')
    .eq('user_id', userId)
    .single();

  if (estudianteError) {
    throw new Error(`Error al obtener datos del estudiante: ${estudianteError.message}`);
  }

  const { data: clases, error: clasesError } = await supabase
    .from('clases')
    .select('materia_id')
    .eq('curso', estudiante.curso);

  if (clasesError) {
    throw new Error(`Error al obtener clases: ${clasesError.message}`);
  }

  const materiaIds = clases.map((clase) => clase.materia_id);

  if (materiaIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('tareas')
    .select(`
      id,
      materia_id,
      profesor_id,
      titulo,
      descripcion,
      fecha_entrega,
      archivo_url,
      materia:materias (nombre)
    `)
    .in('materia_id', materiaIds);

  if (error) {
    throw new Error(`Error al obtener tareas: ${error.message}`);
  }

  return (data as Tarea[]) || [];
};

export const getStudentExams = async (userId: string): Promise<Examen[]> => {
  const { data: estudiante, error: estudianteError } = await supabase
    .from('estudiantes')
    .select('curso')
    .eq('user_id', userId)
    .single();

  if (estudianteError) {
    throw new Error(`Error al obtener datos del estudiante: ${estudianteError.message}`);
  }

  const { data: clases, error: clasesError } = await supabase
    .from('clases')
    .select('materia_id')
    .eq('curso', estudiante.curso);

  if (clasesError) {
    throw new Error(`Error al obtener clases: ${clasesError.message}`);
  }

  const materiaIds = clases.map((clase) => clase.materia_id);

  if (materiaIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('examenes')
    .select(`
      id,
      materia_id,
      profesor_id,
      titulo,
      descripcion,
      fecha_examen,
      materia:materias (nombre)
    `)
    .in('materia_id', materiaIds);

  if (error) {
    throw new Error(`Error al obtener exámenes: ${error.message}`);
  }

  return (data as Examen[]) || [];
};