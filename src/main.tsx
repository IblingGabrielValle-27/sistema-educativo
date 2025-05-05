import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AppRouter from '@/router/AppRouter';
import { AuthProvider } from '@/store/authContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>,
)
