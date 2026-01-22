import { api } from '../../core/api';


export const lobbyService = {
  // Pobieranie pokoi za pomocą Twojego RPC
  getRooms: async () => {
    return await api.rpc('get_rooms_with_profiles');
  },

  // Tworzenie pokoju - prosta wrzutka do tabeli
  createRoom: async (userId: string) => {
    return await api.insert('rooms', { 
      player_one: userId, 
      status: 'waiting' 
    });
  },

  // Dołączanie do pokoju za pomocą RPC
  joinRoom: async (roomId: string, userId: string) => {
    return await api.rpc('join_room', { 
      p_room_id: roomId, 
      p_user_id: userId 
    });
  },

  toggleReady: async (roomId: string, userId: string) => {
  const { error } = await api.rpc('toggle_ready', { 
    p_room_id: roomId, 
    p_user_id: userId 
  });
  if (error) throw error;
},
leaveRoom: async (roomId: string, userId: string) => {
    // Korzystamy z Twojego generycznego RPC
    return await api.rpc('leave_room', { 
      p_room_id: roomId, 
      p_user_id: userId 
    });
  }

};