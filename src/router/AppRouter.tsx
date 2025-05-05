import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/store/authContext';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import Auth from '@/modules/auth/Auth';

import Clases from '@/modules/director/pages/Clases';
import Usuarios from '@/modules/director/pages/Usuarios';

import Notas from '@/modules/profesor/pages/Notas';
import Asistencia from '@/modules/profesor/pages/Asistencia';

import MisMaterias from '@/modules/estudiante/pages/MisMaterias';
import MiHistorial from '@/modules/estudiante/pages/MiHistorial';

import Test from '@/modules/psicologo/pages/Test';
import Resultados from '@/modules/psicologo/pages/Resultados';
import Apoyo from '@/modules/psicologo/pages/Apoyo';
import Reportes from '@/modules/psicologo/pages/reportes';

import LayoutDirector from '@/layouts/LayoutDirector';
import LayoutProfesor from '@/layouts/LayoutProfesor';
import LayoutEstudiante from '@/layouts/LayoutEstudiante';
import LayoutPsicologo from '@/layouts/LayoutPsicologo';

// ProtectedRoute component to enforce role-based access
function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Redirect to login if no user is authenticated
    return <Navigate to="/auth" replace />;
  }

  if (allowedRole !== 'any' && user.rol !== allowedRole) {
    // Redirect to dashboard if user role doesn't match
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        {/* General Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="any">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Director Routes */}
        <Route
          element={
            <ProtectedRoute allowedRole="director">
              <LayoutDirector />
            </ProtectedRoute>
          }
        >
          <Route path="/director/clases" element={<Clases />} />
          <Route path="/director/usuarios" element={<Usuarios />} />
        </Route>

        {/* Professor Routes */}
        <Route
          element={
            <ProtectedRoute allowedRole="profesor">
              <LayoutProfesor />
            </ProtectedRoute>
          }
        >
          <Route path="/profesor/notas" element={<Notas />} />
          <Route path="/profesor/asistencia" element={<Asistencia />} />
        </Route>

        {/* Student Routes */}
        <Route
          element={
            <ProtectedRoute allowedRole="estudiante">
              <LayoutEstudiante />
            </ProtectedRoute>
          }
        >
          <Route path="/estudiante/materias" element={<MisMaterias />} />
          <Route path="/estudiante/historial" element={<MiHistorial />} />
        </Route>

        {/* Psychologist Routes */}
        <Route
          element={
            <ProtectedRoute allowedRole="psicologo">
              <LayoutPsicologo />
            </ProtectedRoute>
          }
        >
          <Route path="/psicologo/test" element={<Test />} />
          <Route path="/psicologo/resultados" element={<Resultados />} />
          <Route path="/psicologo/apoyo" element={<Apoyo />} />
          <Route path="/psicologo/reportes" element={<Reportes />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;