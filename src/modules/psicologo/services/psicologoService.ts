import { supabase } from '@/supabase/supabaseClient';

interface ResultadoTest {
  id: string;
  estudiante_id: string;
  fecha: string;
  tipo_test: string;
  resultados: string;
  estudiante: { nombre: string; apellido: string } | null;
}

interface HistorialApoyo {
  id: string;
  estudiante_id: string;
  fecha: string;
  observaciones: string;
  estudiante: { nombre: string; apellido: string } | null;
}

interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
}


export const getTestResults = async (userId: string): Promise<ResultadoTest[]> => {
  const { data: psicologo, error: psicologoError } = await supabase
    .from('psicologos')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (psicologoError) {
    throw new Error(`Error al obtener datos del psicólogo: ${psicologoError.message}`);
  }

  const { data, error } = await supabase
    .from('resultados_test')
    .select(`
      id,
      estudiante_id,
      fecha,
      tipo_test,
      resultados,
      estudiante:estudiantes (
        id,
        user_id,
        users (nombre, apellido)
      )
    `)
    .eq('psicologo_id', psicologo.id);

  if (error) {
    throw new Error(`Error al obtener resultados de tests: ${error.message}`);
  }

  return data.map((item) => ({
    id: item.id,
    estudiante_id: item.estudiante_id,
    fecha: item.fecha,
    tipo_test: item.tipo_test,
    resultados: item.resultados,
    estudiante: item.estudiante?.user
      ? { nombre: item.estudiante.user.nombre, apellido: item.estudiante.users.apellido }
      : null,
  }));
};

export const createTestResult = async (resultado: {
  psicologo_id: string;
  estudiante_id: string;
  fecha: string;
  tipo_test: string;
  resultados: string;
}) => {
  const { data, error } = await supabase.from('resultados_test').insert([resultado]).select();
  if (error) {
    throw new Error(`Error al crear resultado de test: ${error.message}`);
  }
  return data;
};

export const updateTestResult = async (
  id: string,
  resultado: Partial<{
    estudiante_id: string;
    fecha: string;
    tipo_test: string;
    resultados: string;
  }>
) => {
  const { data, error } = await supabase
    .from('resultados_test')
    .update(resultado)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar resultado de test: ${error.message}`);
  }
  return data;
};

export const deleteTestResult = async (id: string) => {
  const { error } = await supabase.from('resultados_test').delete().eq('id', id);
  if (error) {
    throw new Error(`Error al eliminar resultado de test: ${error.message}`);
  }
};

export const getSupportSessions = async (userId: string): Promise<HistorialApoyo[]> => {
  const { data: psicologo, error: psicologoError } = await supabase
    .from('psicologos')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (psicologoError) {
    throw new Error(`Error al obtener datos del psicólogo: ${psicologoError.message}`);
  }

  const { data, error } = await supabase
    .from('historial_apoyo')
    .select(`
      id,
      estudiante_id,
      fecha,
      observaciones,
      estudiante:estudiantes (
        id,
        user_id,
        users (nombre, apellido)
      )
    `)
    .eq('psicologo_id', psicologo.id);

  if (error) {
    throw new Error(`Error al obtener sesiones de apoyo: ${error.message}`);
  }

  return data.map((item) => ({
    id: item.id,
    estudiante_id: item.estudiante_id,
    fecha: item.fecha,
    observaciones: item.observaciones,
    estudiante: item.estudiante?.users
      ? { nombre: item.estudiante.users.nombre, apellido: item.estudiante.users.apellido }
      : null,
  }));
};

export const createSupportSession = async (sesion: {
  psicologo_id: string;
  estudiante_id: string;
  fecha: string;
  observaciones: string;
}) => {
  const { data, error } = await supabase.from('historial_apoyo').insert([sesion]).select();
  if (error) {
    throw new Error(`Error al crear sesión de apoyo: ${error.message}`);
  }
  return data;
};

export const updateSupportSession = async (
  id: string,
  sesion: Partial<{
    estudiante_id: string;
    fecha: string;
    observaciones: string;
  }>
) => {
  const { data, error } = await supabase
    .from('historial_apoyo')
    .update(sesion)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar sesión de apoyo: ${error.message}`);
  }
  return data;
};

export const deleteSupportSession = async (id: string) => {
  const { error } = await supabase.from('historial_apoyo').delete().eq('id', id);
  if (error) {
    throw new Error(`Error al eliminar sesión de apoyo: ${error.message}`);
  }
};

export const getStudents = async (): Promise<Estudiante[]> => {
  const { data, error } = await supabase
    .from('estudiantes')
    .select(`
      id,
      user_id,
      users (nombre, apellido)
    `);

  if (error) {
    throw new Error(`Error al obtener estudiantes: ${error.message}`);
  }

  return data.map((estudiante) => ({
    id: estudiante.id,
    nombre: estudiante.users?.nombre || '',
    apellido: estudiante.users?.apellido || '',
  }));
};