import { AuthProvider } from '@/store/authContext';
import AppRouter from '@/router/AppRouter';
import '@/index.css';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;