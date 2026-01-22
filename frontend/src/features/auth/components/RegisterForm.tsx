import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { registerUser, clearMessages } from '../authSlice'; // Załóżmy, że dodałeś ten thunk
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useAppDispatch();
  const { isLoading, error, successMessage } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const onSubmit = (data: any) => {
    dispatch(registerUser({ email: data.email, pass: data.password, username: data.username }));
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
        {successMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg animate-fade-in font-bold z-50">
          ✅ {successMessage}
        </div>
      )}


    <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Nick gracza</label>
        <input 
          {...register("username", { 
            required: "Nick jest wymagany",
            minLength: { value: 3, message: "Nick musi mieć minimum 3 znaki" },
            maxLength: { value: 20, message: "Nick może mieć maksymalnie 20 znaków" },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: "Nick może zawierać tylko litery, cyfry i podkreślnik"
            }
          })}
          className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition"
          placeholder="Twój unikalny nick"
        />
        {errors.username && (
          <span className="text-red-500 text-xs mt-1 block">
            {errors.username.message as string}
          </span>
        )}
      </div>
     
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
        <input 
          {...register("email", { required: "Email jest wymagany" })}
          className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition"
          placeholder="twoj@email.com"
        />
        {errors.email && <span className="text-red-500 text-xs">{errors.email.message as string}</span>}
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Hasło</label>
        <input 
          type="password"
          {...register("password", { required: "Hasło jest wymagane", minLength: { value: 6, message: "Min. 6 znaków" } })}
          className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition"
          placeholder="••••••••"
        />
        {errors.password && <span className="text-red-500 text-xs">{errors.password.message as string}</span>}
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      <button 
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
      >
        {isLoading ? "TWORZENIE KONTA..." : "ZAREJESTRUJ SIĘ"}
      </button>
    </form>
  );
};