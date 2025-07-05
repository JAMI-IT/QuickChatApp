import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultUserPreferences } from '../../data/mockData';
import { UserPreferences } from '../../types/chat';
import { StorageService } from '../../utils/storage';

// Async thunk for loading preferences from storage
export const loadPreferencesFromStorage = createAsyncThunk(
  'preferences/loadPreferencesFromStorage',
  async () => {
    const stored = await StorageService.loadUserPreferences();
    return stored || defaultUserPreferences;
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(loadPreferencesFromStorage.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      });
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