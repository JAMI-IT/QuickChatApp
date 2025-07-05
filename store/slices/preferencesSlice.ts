import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultUserPreferences } from '../../data/mockData';
import { UserPreferences } from '../../types/chat';

const initialState: UserPreferences = defaultUserPreferences;

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    
    setNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications = action.payload;
    },
    
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },
    
    setFontSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      state.fontSize = action.payload;
    },
    
    resetPreferences: (state) => {
      Object.assign(state, defaultUserPreferences);
    },
  },
});

export const {
  setTheme,
  setNotifications,
  setSoundEnabled,
  setFontSize,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer; 