import { createAsyncThunk } from '@reduxjs/toolkit';
import { lobbyService } from './lobby.service';
import type { Room } from './lobby.types';


export const fetchRoomsAction = createAsyncThunk(
  'lobby/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      return await lobbyService.getRooms();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


export const createRoomAction = createAsyncThunk<Room, string, { rejectValue: string }>(
  'lobby/createRoom',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await lobbyService.createRoom(userId);
      
      // Supabase rpc/insert czasem zwraca tablicę, musimy wyciągnąć pierwszy element
      const room = Array.isArray(data) ? data[0] : data;

      if (!room || !room.id) {
        return rejectWithValue("Błąd: Serwer nie zwrócił danych pokoju.");
      }

      return room as Room; 
    } catch (error: any) {
      return rejectWithValue(error.message || "Błąd tworzenia pokoju");
    }
  }
);


export const joinRoomAction = createAsyncThunk(
  'lobby/joinRoom',
  async ({ roomId, userId }: { roomId: string; userId: string }, { rejectWithValue }) => {
    try {
      return await lobbyService.joinRoom(roomId, userId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchActiveRoomAction = createAsyncThunk(
  'lobby/fetchActiveRoom',
  async (roomId: string, { rejectWithValue }) => {
    try {
      
      const rooms = await lobbyService.getRooms(); 
      const room = rooms.find((r: any) => r.id === roomId);
      if (!room) throw new Error("Pokój nie istnieje");
      return room;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


export const toggleReadyAction = createAsyncThunk(
  'lobby/toggleReady',
  async ({ roomId, userId }: { roomId: string; userId: string }, { rejectWithValue }) => {
    try {
      await lobbyService.toggleReady(roomId, userId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// src/store/lobby/lobby.thunk.ts
export const leaveRoomAction = createAsyncThunk<void, { roomId: string; userId: string }, { rejectValue: string }>(
  'lobby/leaveRoom',
  async ({ roomId, userId }, { rejectWithValue }) => {
    try {
      await lobbyService.leaveRoom(roomId, userId);
    } catch (error: any) {
      // Nasz Error Middleware automatycznie przechwyci ten błąd i pokaże Toast
      return rejectWithValue(error.message);
    }
  }
);

