import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { loginUser, clearMessages } from '../authSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const LoginForm = () => {
    const { register, handleSubmit } = useForm();
    const dispatch = useAppDispatch();
    const { isLoading, successMessage, error } = useAppSelector(state => state.auth);
    const navigate = useNavigate();
    const onSubmit = (data: any) => {
    dispatch(loginUser({ email: data.email, pass: data.password }));
  };

  useEffect(() => {
    if (successMessage) {
      // Jeśli mamy sukces, czekamy chwilę na pokazanie toastu i przekierowujemy
      const timer = setTimeout(() => {
        dispatch(clearMessages());
        navigate('/dashboard');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate, dispatch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">

{/* ZIELONY TOAST (Sukces) */}
      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg animate-fade-in font-bold z-50">
          ✅ {successMessage}
        </div>
      )}

      {/* CZERWONY TOAST (Błąd) */}
      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 font-bold">
          ⚠️ {error}
        </div>
      )}

      <input 
        {...register("email")}
        className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition"
        placeholder="Email"
      />
      <input 
        type="password"
        {...register("password")}
        className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition"
        placeholder="Hasło"
      />

      {error && (
      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-4 border border-red-200">
        {error}
      </div>
    )}
      <button 
        disabled={isLoading}
        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition shadow-lg"
      >
        {isLoading ? "LOGOWANIE..." : "ZALOGUJ SIĘ"}
      </button>
    </form>
  );
};