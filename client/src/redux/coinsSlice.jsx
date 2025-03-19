import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Асинхронное действие для получения монет
export const fetchCoins = createAsyncThunk(
  'coins/fetchCoins',
  async (userId) => {
    console.log('fetch coins');
    const response = await api.get(`/user/${userId}/coins`);
    return response.data.coins; // Возвращаем количество монет
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
        state.status = 'loading'; // Пока запрос в процессе
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Запрос выполнен успешно
        state.coins = action.payload; // Обновляем монеты
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.status = 'failed'; // Запрос завершился с ошибкой
        state.error = action.error.message;
      });
  },
});

export const { setCoins } = coinsSlice.actions;

export default coinsSlice.reducer;
