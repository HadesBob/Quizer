import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { useEffect } from 'react';
import { initLobbyRealtime } from '../lobby.realtime';
import { fetchActiveRoomAction, leaveRoomAction, toggleReadyAction } from '../lobby.thunks';
import { useBlocker } from 'react-router';

export const Room = () => {
  const { roomId } = useParams();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const isLoading = useAppSelector(state => state.lobby.isLoading);
  const room = useAppSelector(state => state.lobby.activeRoom);

  const isPlayerOne = room?.player_one?.id === user?.id;
  const isPlayerTwo = room?.player_two?.id === user?.id;
    
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    const isLeavingRoom = currentLocation.pathname !== nextLocation.pathname;
        return isLeavingRoom &&  room !== null;
  });

  const myReadyStatus = isPlayerOne ? room?.p1_ready : room?.p2_ready;

///////////////////////////////////
  useEffect(() => {

    if (roomId && (!room || room.id !== roomId)) {
       
        dispatch(fetchActiveRoomAction(roomId));
    }
    const channel = initLobbyRealtime(dispatch);
    return () => {
      channel.unsubscribe();
    };
    
  }, [dispatch, roomId]);

///////////////////////////////////

  if (isLoading) return <div>Synchronizacja danych...</div>;
  if (!room) return <div>Nie znaleziono pokoju.</div>;

  


  const handleLeave = async () => {
    if (!roomId || !user?.id) return;

    const confirmed = window.confirm("Czy na pewno chcesz opuścić pokój?");
    if (confirmed) {
      try {
        // 1. Wywołujemy akcję Redux (czyści bazę i stan lokalny)
        await dispatch(leaveRoomAction({ roomId, userId: user.id })).unwrap();
        
        // 2. Jeśli blocker jest aktywny, pozwalamy mu przejść dalej
        if (blocker.state === "blocked") {
          blocker.proceed();
        } else {
          navigate("/lobby");
        }
      } catch (error) {
        console.error("Błąd podczas opuszczania pokoju:", error);
      }
    } else {
      // Jeśli użytkownik kliknął "Anuluj" w confirmie, a blocker był aktywny
      if (blocker.state === "blocked") {
        blocker.reset();
      }
    }
  };

  
  const handleReadyClick = () => {
    if (roomId && user?.id) {
      dispatch(toggleReadyAction({ roomId, userId: user.id }));
    }
  };

  return (
    <div className="room-container flex flex-col items-center gap-10">
        <button 
        onClick={handleLeave}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg m-4"
      >
        OPUŚĆ POKÓJ
      </button>
      <div className="flex gap-10">
        {/* Gracz 1 */}
        <div className={`p-4 rounded ${room?.p1_ready ? 'bg-green-500' : 'bg-gray-700'}`}>
          {room?.player_one?.username} {room?.p1_ready ? '✅' : '⏳'}
        </div>

        <div className="text-white">VS</div>

        {/* Gracz 2 */}
        <div className={`p-4 rounded ${room?.p2_ready ? 'bg-green-500' : 'bg-gray-700'}`}>
          {room?.player_two?.username || "Oczekiwanie..."} 
          {room?.player_two && (room?.p2_ready ? '✅' : '⏳')}
        </div>
      </div>

      {/* Przycisk dla zalogowanego gracza */}
      <button 
        onClick={handleReadyClick}
        className={`px-8 py-4 rounded-full font-bold transition ${
          myReadyStatus ? 'bg-red-500' : 'bg-green-500'
        }`}
      >
        {myReadyStatus ? 'COFNIJ GOTOWOŚĆ' : 'JESTEM GOTOWY'}
      </button>

      {/* Automatyczny start lub przycisk dla Hosta gdy obaj gotowi */}
      {isPlayerOne && room?.p1_ready && room?.p2_ready && (
        <button className="bg-amber-500 p-4 animate-bounce">START GRY!</button>
      )}
    </div>
  );
};
 
