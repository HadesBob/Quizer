// features/lobby/lobby.slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { LobbyState } from './lobby.types'
import { fetchRoomsAction, createRoomAction, joinRoomAction, fetchActiveRoomAction, leaveRoomAction } from './lobby.thunks';

const initialState: LobbyState = {
  rooms: [],
  activeRoom: null,
  isLoading: false,
  error: null,
};

const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {
    // OBSŁUGA REALTIME
    upsertRoom: (state, action: PayloadAction<any>) => {
      const index = state.rooms.findIndex(r => r.id === action.payload.id);
      if (index === -1) {
        state.rooms.unshift(action.payload); // Nowy pokój na górę
      } else {
        state.rooms[index] = action.payload; // Aktualizacja istniejącego
      }
    
      if (state.activeRoom?.id === action.payload.id) {
        state.activeRoom = action.payload;
      }
    },
    removeRoom: (state, action: PayloadAction<string>) => {
      state.rooms = state.rooms.filter(r => r.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    clearActiveRoom: (state) => {
      state.activeRoom = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH ROOMS
      .addCase(fetchRoomsAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRoomsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRoomsAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createRoomAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRoomAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeRoom = action.payload;
      })
      .addCase(createRoomAction.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // JOIN ROOM
      .addCase(joinRoomAction.fulfilled, (state, action) => {
        state.activeRoom = action.payload;
      })
      .addCase(joinRoomAction.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchActiveRoomAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchActiveRoomAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeRoom = action.payload; 

        const index = state.rooms.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        } else {
          state.rooms.push(action.payload);
        }
      })
      .addCase(fetchActiveRoomAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(leaveRoomAction.fulfilled, (state) => {
        state.activeRoom = null; 
      })
      .addCase(leaveRoomAction.rejected, (state) => {
        state.activeRoom = null;
      });
      ;
      },
    });

export const { upsertRoom, removeRoom, clearError, clearActiveRoom } = lobbySlice.actions;
export default lobbySlice.reducer;