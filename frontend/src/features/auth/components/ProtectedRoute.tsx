import { useAppSelector } from '../../../app/hooks';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) return <div className="flex justify-center p-20 font-black">ŁADOWANIE SESJI...</div>;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};