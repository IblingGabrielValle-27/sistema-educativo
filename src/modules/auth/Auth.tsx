import { useState, useContext, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/store/authContext';
import { supabase } from '@/supabase/supabaseClient';

interface User {
  id: string;
  nombre: string;
  apellido: string;
  rol: 'director' | 'profesor' | 'estudiante' | 'psicologo';
  email: string;
}

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rol, setRol] = useState<User['rol']>('estudiante');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password || !nombre || !apellido || !rol) {
      setErrorMsg('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nombre, apellido, rol },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Insert into users table
        const { error: userError } = await supabase.from('users').insert([
          {
            id: data.user.id,
            nombre,
            apellido,
            rol,
            email,
          },
        ]);

        if (userError) throw userError;

        // Insert into role-specific table
        const roleTable = {
          director: 'directores',
          profesor: 'profesores',
          estudiante: 'estudiantes',
          psicologo: 'psicologos',
        }[rol];

        const { error: roleError } = await supabase.from(roleTable).insert([
          {
            user_id: data.user.id,
          },
        ]);

        if (roleError) throw roleError;

        setUser({ id: data.user.id, nombre, apellido, rol, email });
        navigate('/dashboard');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Correo y contraseña son obligatorios');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, nombre, apellido, rol, email')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        if (userData) {
          setUser(userData as User);
          navigate('/dashboard');
        } else {
          throw new Error('Perfil de usuario no encontrado');
        }
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
        </h1>
        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
          <div>
            <label className="block font-medium">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="tu@correo.com"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="block font-medium">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>
          {isSignUp && (
            <>
              <div>
                <label className="block font-medium">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="Tu nombre"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Apellido</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="Tu apellido"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Rol</label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value as User['rol'])}
                  className="w-full border p-2 rounded"
                  disabled={loading}
                  required
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="profesor">Profesor</option>
                  <option value="psicologo">Psicólogo</option>
                  <option value="director">Director</option>
                </select>
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Procesando...' : isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="mt-4 text-center">
          {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:underline ml-1"
            disabled={loading}
          >
            {isSignUp ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </div>
  );
}