import { upsertRoom, removeRoom } from './lobby.slice';
import { type AppDispatch } from '../../app/store';
import { api } from '../../core/api';
import { lobbyService } from './lobby.service';


export const initLobbyRealtime = (dispatch: AppDispatch) => {
  // Korzystamy z Twojej metody api.subscribe
  const channel = api.subscribe('rooms', async (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    console.log(`Realtime event: ${eventType}`, payload);

    if (eventType === 'DELETE') {
      // Jeśli pokój usunięto, wyrzucamy go ze stanu po ID
      dispatch(removeRoom(oldRecord.id));
    } else {
      
      try {
        const rooms = await lobbyService.getRooms();
        const updatedRoom = rooms.find((r: any) => r.id === (newRecord as any).id);
        
        if (updatedRoom) {
          dispatch(upsertRoom(updatedRoom));
        }
        
      } catch (error) {
        console.error("Błąd podczas synchronizacji realtime:", error);
      }
    }
  });

  return channel;
};