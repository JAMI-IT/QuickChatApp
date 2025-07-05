import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, UserPreferences } from '../types/chat';

const STORAGE_KEYS = {
  CONVERSATIONS: 'chat_conversations',
  FAVORITES: 'chat_favorites',
  USER_PREFERENCES: 'user_preferences',
};

export const StorageService = {
  // Conversations
  async saveConversations(conversations: Conversation[]): Promise<void> {
    try {
      const serializedConversations = conversations.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        })),
        lastMessage: conv.lastMessage ? {
          ...conv.lastMessage,
          timestamp: conv.lastMessage.timestamp.toISOString(),
        } : undefined,
        lastActivity: conv.lastActivity.toISOString(),
        participants: conv.participants.map(p => ({
          ...p,
          lastSeen: p.lastSeen ? p.lastSeen.toISOString() : undefined,
        })),
      }));
      
      await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(serializedConversations));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  },

  async loadConversations(): Promise<Conversation[] | null> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      return parsed.map((conv: any) => ({
        ...conv,
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
        lastMessage: conv.lastMessage ? {
          ...conv.lastMessage,
          timestamp: new Date(conv.lastMessage.timestamp),
        } : undefined,
        lastActivity: new Date(conv.lastActivity),
        participants: conv.participants.map((p: any) => ({
          ...p,
          lastSeen: p.lastSeen ? new Date(p.lastSeen) : undefined,
        })),
      }));
    } catch (error) {
      console.error('Error loading conversations:', error);
      return null;
    }
  },

  // Favorites
  async saveFavorites(favorites: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  },

  async loadFavorites(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  },

  // User Preferences
  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  },

  async loadUserPreferences(): Promise<UserPreferences | null> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return null;
    }
  },

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CONVERSATIONS,
        STORAGE_KEYS.FAVORITES,
        STORAGE_KEYS.USER_PREFERENCES,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
}; 