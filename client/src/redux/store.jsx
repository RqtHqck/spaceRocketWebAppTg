import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './coinsSlice';
import levelReducer from './levelSlice';


const store = configureStore({
  reducer: {
    coins: coinsReducer,
    level: levelReducer
  },
});

export default store;
