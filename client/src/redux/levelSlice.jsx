import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Асинхронное действие для получения уровня
export const fetchLevel = createAsyncThunk(
  'level/fetchLevel',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/game/level/${userId}`);
      return response.data.level;
    } catch (error) {
      return rejectWithValue({
        status: error.status,
        code: error.code,
        message: error.message,
        details: error.details
      });
    }
  }
);

const levelSlice = createSlice({
  name: 'level',
  initialState: {
    level: 0,  // Начальный уровень по умолчанию
    status: 'idle',
    error: null,
  },
  reducers: {
    setLevel: (state, action) => {
      state.level = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLevel.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLevel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.level = action.payload;
      })
      .addCase(fetchLevel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;

        console.error('Level fetch error:', {
          status: action.payload.status,
          message: action.payload.message
        });
      });
  }
});

export const { setLevel } = levelSlice.actions;

export default levelSlice.reducer;