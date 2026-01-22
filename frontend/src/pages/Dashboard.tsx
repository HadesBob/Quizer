import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logoutUser, clearMessages } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Pobieramy dane z Reduxa
  const { profile, user, successMessage } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => dispatch(clearMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    }
  };

  return (
    <>
    {profile?.username}
    {user.id}
    <button onClick={handleLogout} className='bg-cyan-900 p-3 border-r-4'>Wyloguj</button>
    </>
  )
    
};