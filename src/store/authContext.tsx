import { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/supabase/supabaseClient';

interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'director' | 'profesor' | 'estudiante' | 'psicologo';
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for an existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('id, nombre, apellido, correo, rol')
          .eq('id', session.user.id)
          .single();

        if (!error && userData) {
          setUser({
            id: userData.id,
            nombre: userData.nombre,
            apellido: userData.apellido,
            email: userData.correo,
            rol: userData.rol,
          });
        }
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        supabase
          .from('users')
          .select('id, nombre, apellido, correo, rol')
          .eq('id', session.user.id)
          .single()
          .then(({ data: userData, error }) => {
            if (!error && userData) {
              setUser({
                id: userData.id,
                nombre: userData.nombre,
                apellido: userData.apellido,
                email: userData.correo,
                rol: userData.rol,
              });
            }
          });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};