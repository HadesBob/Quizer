import { useEffect } from 'react';
import { useAppDispatch, useAppSelector, type RootState } from '../../../app/store';
import { fetchRoomsAction, createRoomAction, joinRoomAction } from '../lobby.thunks';
import { initLobbyRealtime } from '../lobby.realtime';
import { useNavigate } from 'react-router-dom';


export const Lobby = () => {
  const dispatch = useAppDispatch();
  const { rooms, isLoading, error, activeRoom } = useAppSelector((state) => state.lobby);
  const user = useAppSelector((state: any) => state.auth.user);
  const profile = useAppSelector((state: any) => state.auth.profile);
  const navigate = useNavigate();
  
  
  useEffect(() => {
   
    dispatch(fetchRoomsAction());

    const channel = initLobbyRealtime(dispatch);

    return () => {
      channel.unsubscribe();
    };
  }, [dispatch]);

  const handleCreateRoom = async () => {
  try {
    
    const newRoom = await dispatch(createRoomAction(user.id)).unwrap();
    
    if(newRoom){
        navigate(`/room/${newRoom.id}`);
    }
    
  } catch (err) {
    console.error("Błąd tworzenia pokoju:", err);
  }
};

  const handleJoinRoom = async (roomId: string, userId: string) => {
    
        try {

            const room = await dispatch(joinRoomAction({ roomId, userId })).unwrap();       
            navigate(`/room/${room.id}`);
           } 
        catch (error) {           
            alert(error);
        }
        };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lobby Quizowe</h1>
       <h3 className="text-2xl font-bold mb-4">Witaj: {user?.email} { profile?.username}</h3>
      {error && <p className="text-red-500">{error}</p>}
      
      <button 
        onClick={handleCreateRoom}
        className="bg-indigo-600 text-white px-4 py-2 rounded mb-6"
      >
        Stwórz nowy pokój
      </button>

      <div className="grid gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="border p-4 rounded flex justify-between">
            <div>
              <p className="font-bold">Pokój: {room.id.slice(0, 5)}</p>
              <p className="text-sm">Gracze: {room.player_one?.username} vs {room.player_two?.username}</p>
            </div>
            {room.status === 'waiting' && room.player_one !== user?.id && (
              <button 
                onClick={() => handleJoinRoom(room.id, user.id) }
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Dołącz
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};