import { supabase } from '@/supabase/supabaseClient';

interface Clase {
  id: string;
  materia_id: string;
  curso: string;
  materia: { nombre: string } | null;
}

interface Estudiante {
  id: string;
  user_id: string;
  nombre: string;
  apellido: string;
}

interface Nota {
  id: string;
  estudiante_id: string;
  tarea1: number | null;
  tarea2: number | null;
  tarea3: number | null;
  tarea4: number | null;
  examen: number | null;
  nota_final: number | null;
}

interface Asistencia {
  id: string;
  estudiante_id: string;
  fecha: string;
  estado: 'presente' | 'ausente' | 'licencia';
}

interface Tarea {
  id: string;
  materia_id: string;
  titulo: string;
  descripcion: string | null;
  fecha_entrega: string | null;
  archivo_url: string | null;
  materia: { nombre: string } | null;
}

interface Examen {
  id: string;
  materia_id: string;
  titulo: string;
  descripcion: string | null;
  fecha_examen: string | null;
  materia: { nombre: string } | null;
}

export const getProfessorClasses = async (userId: string): Promise<Clase[]> => {
  const { data: profesor, error: profesorError } = await supabase
    .from('profesores')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (profesorError) {
    throw new Error(`Error al obtener datos del profesor: ${profesorError.message}`);
  }

  const { data, error } = await supabase
    .from('clases')
    .select(`
      id,
      materia_id,
      curso,
      materia:materias (nombre)
    `)
    .eq('profesor_id', profesor.id);

  if (error) {
    throw new Error(`Error al obtener clases: ${error.message}`);
  }

  return (data as Clase[]) || [];
};

export const getStudentsByClass = async (claseId: string): Promise<Estudiante[]> => {
  const { data: clase, error: claseError } = await supabase
    .from('clases')
    .select('curso')
    .eq('id', claseId)
    .single();

  if (claseError) {
    throw new Error(`Error al obtener datos de la clase: ${claseError.message}`);
  }

  const { data, error } = await supabase
    .from('estudiantes')
    .select(`
      id,
      user_id,
      users (nombre, apellido)
    `)
    .eq('curso', clase.curso);

  if (error) {
    throw new Error(`Error al obtener estudiantes: ${error.message}`);
  }

  return data.map((estudiante) => ({
    id: estudiante.id,
    user_id: estudiante.user_id,
    nombre: estudiante.users?.nombre || '',
    apellido: estudiante.users?.apellido || '',
  })) || [];
};

export const getGradesByClass = async (materiaId: string, claseId: string): Promise<Nota[]> => {
  const { data: clase, error: claseError } = await supabase
    .from('clases')
    .select('curso')
    .eq('id', claseId)
    .single();

  if (claseError) {
    throw new Error(`Error al obtener datos de la clase: ${claseError.message}`);
  }

  const { data: estudiantes, error: estudiantesError } = await supabase
    .from('estudiantes')
    .select('id')
    .eq('curso', clase.curso);

  if (estudiantesError) {
    throw new Error(`Error al obtener estudiantes: ${estudiantesError.message}`);
  }

  const estudianteIds = estudiantes.map((e) => e.id);

  if (estudianteIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('notas')
    .select(`
      id,
      estudiante_id,
      tarea1,
      tarea2,
      tarea3,
      tarea4,
      examen,
      nota_final
    `)
    .eq('materia_id', materiaId)
    .in('estudiante_id', estudianteIds);

  if (error) {
    throw new Error(`Error al obtener notas: ${error.message}`);
  }

  return (data as Nota[]) || [];
};

export const updateGrade = async (materiaId: string, estudianteId: string, nota: Partial<Nota>): Promise<Nota> => {
  const existingNota = await supabase
    .from('notas')
    .select('id')
    .eq('materia_id', materiaId)
    .eq('estudiante_id', estudianteId)
    .single();

  if (existingNota.error) {
    // Create new grade
    const { data, error } = await supabase
      .from('notas')
      .insert({
        materia_id: materiaId,
        estudiante_id: estudianteId,
        tarea1: nota.tarea1,
        tarea2: nota.tarea2,
        tarea3: nota.tarea3,
        tarea4: nota.tarea4,
        examen: nota.examen,
        nota_final: nota.nota_final,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear nota: ${error.message}`);
    }

    return data as Nota;
  }

  // Update existing grade
  const { data, error } = await supabase
    .from('notas')
    .update({
      tarea1: nota.tarea1,
      tarea2: nota.tarea2,
      tarea3: nota.tarea3,
      tarea4: nota.tarea4,
      examen: nota.examen,
      nota_final: nota.nota_final,
    })
    .eq('id', existingNota.data.id)
    .select()
    .single();

  if (error) {
 residuals
    throw new Error(`Error al actualizar nota: ${error.message}`);
  }

  return data as Nota;
};

export const getAttendanceByClass = async (materiaId: string, claseId: string, fecha: string): Promise<Asistencia[]> => {
  const { data: clase, error: claseError } = await supabase
    .from('clases')
    .select('curso')
    .eq('id', claseId)
    .single();

  if (claseError) {
    throw new Error(`Error al obtener datos de la clase: ${claseError.message}`);
  }

  const { data: estudiantes, error: estudiantesError } = await supabase
    .from('estudiantes')
    .select('id')
    .eq('curso', clase.curso);

  if (estudiantesError) {
    throw new Error(`Error al obtener estudiantes: ${estudiantesError.message}`);
  }

  const estudianteIds = estudiantes.map((e) => e.id);

  if (estudianteIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('asistencias')
    .select(`
      id,
      estudiante_id,
      fecha,
      estado
    `)
    .eq('materia_id', materiaId)
    .in('estudiante_id', estudianteIds)
    .eq('fecha', fecha);

  if (error) {
    throw new Error(`Error al obtener asistencias: ${error.message}`);
  }

  return (data as Asistencia[]) || [];
};

export const updateAttendance = async (
  materiaId: string,
  estudianteId: string,
  fecha: string,
  asistencia: Partial<Asistencia>
): Promise<Asistencia> => {
  const existingAsistencia = await supabase
    .from('asistencias')
    .select('id')
    .eq('materia_id', materiaId)
    .eq('estudiante_id', estudianteId)
    .eq('fecha', fecha)
    .single();

  if (existingAsistencia.error) {
    // Create new attendance record
    const { data, error } = await supabase
      .from('asistencias')
      .insert({
        materia_id: materiaId,
        estudiante_id: estudianteId,
        fecha,
        estado: asistencia.estado,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear asistencia: ${error.message}`);
    }

    return data as Asistencia;
  }

  // Update existing attendance record
  const { data, error } = await supabase
    .from('asistencias')
    .update({ estado: asistencia.estado })
    .eq('id', existingAsistencia.data.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar asistencia: ${error.message}`);
  }

  return data as Asistencia;
};

export const getProfessorTasks = async (userId: string): Promise<Tarea[]> => {
  const { data: profesor, error: profesorError } = await supabase
    .from('profesores')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (profesorError) {
    throw new Error(`Error al obtener datos del profesor: ${profesorError.message}`);
  }

  const { data, error } = await supabase
    .from('tareas')
    .select(`
      id,
      materia_id,
      titulo,
      descripcion,
      fecha_entrega,
      archivo_url,
      materia:materias (nombre)
    `)
    .eq('profesor_id', profesor.id);

  if (error) {
    throw new Error(`Error al obtener tareas: ${error.message}`);
  }

  return (data as Tarea[]) || [];
};

export const createTask = async (tarea: {
  profesor_id: string;
  materia_id: string;
  titulo: string;
  descripcion: string | null;
  fecha_entrega: string | null;
  archivo_url: string | null;
}) => {
  const { data, error } = await supabase.from('tareas').insert([tarea]).select();
  if (error) {
    throw new Error(`Error al crear tarea: ${error.message}`);
  }
  return data;
};

export const getProfessorExams = async (userId: string): Promise<Examen[]> => {
  const { data: profesor, error: profesorError } = await supabase
    .from('profesores')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (profesorError) {
    throw new Error(`Error al obtener datos del profesor: ${profesorError.message}`);
  }

  const { data, error } = await supabase
    .from('examenes')
    .select(`
      id,
      materia_id,
      titulo,
      descripcion,
      fecha_examen,
      materia:materias (nombre)
    `)
    .eq('profesor_id', profesor.id);

  if (error) {
    throw new Error(`Error al obtener exámenes: ${error.message}`);
  }

  return (data as Examen[]) || [];
};

export const createExam = async (examen: {
  profesor_id: string;
  materia_id: string;
  titulo: string;
  descripcion: string | null;
  fecha_examen: string | null;
}) => {
  const { data, error } = await supabase.from('examenes').insert([examen]).select();
  if (error) {
    throw new Error(`Error al crear examen: ${error.message}`);
  }
  return data;
};