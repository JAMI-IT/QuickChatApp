import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import preferencesReducer from './slices/preferencesSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    preferences: preferencesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['chat.conversations', 'chat.currentConversation'],
        ignoredActionPaths: ['payload.timestamp', 'payload.lastActivity', 'payload.messages', 'payload.lastMessage'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 