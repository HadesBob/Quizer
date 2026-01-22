import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '../components/layout/RootLayout';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { LoginForm } from '../features/auth/components/LoginForm';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import { Lobby } from '../features/lobby/components/Lobby';
import { Dashboard } from '../pages/Dashboard';
import { HomePage } from '../pages/HomePage';
import { Room } from '../features/lobby/components/Room';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // Wspólny element (np. Navbar)
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    
      {
        path: '/login',
        element: <LoginForm />,
      },
      {
        path: '/register',
        element: <RegisterForm />,
      },
      {
        path: '/lobby',
        element: (
          <ProtectedRoute>
            <Lobby />
          </ProtectedRoute>
        ),
      },
      {
        path: 'room/:roomId',
        element: <Room />,
        // Tutaj można dodać loader, który sprawdzi czy pokój istnieje przed wejściem
      },
     
      
      {
  path: 'dashboard',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
},
    ],
  },
]);