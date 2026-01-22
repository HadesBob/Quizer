import { useAppSelector } from '../app/hooks';



export const LobbyPage = () => {
 
  const { profile, user } = useAppSelector(state => state.auth);

  const userId = user.id
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dostępne pokoje</h1>
       <p>{ userId}</p>

       <>
        {profile?.username}
       </>
    </div>
  );
};

