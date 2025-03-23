import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Асинхронное действие для получения монет
export const fetchCoins = createAsyncThunk(
  'coins/fetchCoins',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/${userId}/coins`);
      return response.data.coins;
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



const coinsSlice = createSlice({
  name: 'coins',
  initialState: {
    coins: 0,
    status: 'idle',  // Статус загрузки (idle, loading, succeeded, failed)
    error: null,
  },
  reducers: {
    setCoins: (state, action) => {
      state.coins = action.payload; // Обновление монет
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Сбрасываем ошибку при новом запросе
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coins = action.payload;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Получаем весь объект ошибки

        // Для дебага можно добавить:
        console.error('Coin fetch error:', {
          status: action.payload.status,
          message: action.payload.message
        });
      });
  }
});

export const { setCoins } = coinsSlice.actions;

export default coinsSlice.reducer;
