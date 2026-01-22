export interface Profile {
  id: string,
  username: string;
  avatar_url?: string;
  coins: number;
}

export type RoomStatus = 'waiting' | 'full' | 'playing' | 'finished' | 'closed';

export interface Room {
  id: string;
  created_at: string;
  player_one: Profile | null;
  player_two: Profile | null;
  current_question_id: string | null;
  status: RoomStatus;
  p1_ready: boolean;
  p2_ready: boolean;

}

export interface LobbyState {
  
  rooms: Room[];
  activeRoom: Room | null;
  isLoading: boolean;
  error: string | null;
}

