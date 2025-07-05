import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { currentUser, mockConversations } from '../../data/mockData';
import { ChatState, Conversation, Message } from '../../types/chat';
import { StorageService } from '../../utils/storage';

// Async thunks for storage operations
export const loadConversationsFromStorage = createAsyncThunk(
  'chat/loadConversationsFromStorage',
  async () => {
    const stored = await StorageService.loadConversations();
    const favorites = await StorageService.loadFavorites();
    return { conversations: stored || mockConversations, favorites };
  }
);

export const saveConversationsToStorage = createAsyncThunk(
  'chat/saveConversationsToStorage',
  async (conversations: Conversation[]) => {
    await StorageService.saveConversations(conversations);
    return conversations;
  }
);

const initialState: ChatState = {
  conversations: mockConversations,
  currentConversation: null,
  favorites: mockConversations.filter(conv => conv.isFavorite).map(conv => conv.id),
  user: currentUser,
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },
    
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Omit<Message, 'id' | 'timestamp'> }>) => {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(conv => conv.id === conversationId);
      
      if (conversation) {
        const newMessage: Message = {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };
        
        conversation.messages.push(newMessage);
        conversation.lastMessage = newMessage;
        conversation.lastActivity = new Date();
        
        // Update unread count if message is from other user
        if (message.senderId !== currentUser.id) {
          conversation.unreadCount += 1;
        }
        
        // Update current conversation if it's the same one
        if (state.currentConversation?.id === conversationId) {
          state.currentConversation = conversation;
        }
      }
    },
    
    markAsRead: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      const conversation = state.conversations.find(conv => conv.id === conversationId);
      
      if (conversation) {
        conversation.unreadCount = 0;
        conversation.messages.forEach(msg => {
          if (msg.receiverId === currentUser.id) {
            msg.isRead = true;
          }
        });
        
        // Update current conversation if it's the same one
        if (state.currentConversation?.id === conversationId) {
          state.currentConversation = conversation;
        }
      }
    },
    
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      const conversation = state.conversations.find(conv => conv.id === conversationId);
      
      if (conversation) {
        conversation.isFavorite = !conversation.isFavorite;
        
        if (conversation.isFavorite) {
          if (!state.favorites.includes(conversationId)) {
            state.favorites.push(conversationId);
          }
        } else {
          state.favorites = state.favorites.filter(id => id !== conversationId);
        }
        
        // Save favorites to storage
        StorageService.saveFavorites(state.favorites);
      }
    },
    
    setTyping: (state, action: PayloadAction<{ conversationId: string; isTyping: boolean }>) => {
      const { conversationId, isTyping } = action.payload;
      const conversation = state.conversations.find(conv => conv.id === conversationId);
      
      if (conversation) {
        conversation.isTyping = isTyping;
        
        // Update current conversation if it's the same one
        if (state.currentConversation?.id === conversationId) {
          state.currentConversation = conversation;
        }
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadConversationsFromStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadConversationsFromStorage.fulfilled, (state, action) => {
        state.conversations = action.payload.conversations;
        state.favorites = action.payload.favorites;
        state.isLoading = false;
      })
      .addCase(loadConversationsFromStorage.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to load conversations';
        state.isLoading = false;
      })
      .addCase(saveConversationsToStorage.fulfilled, (state, action) => {
        // Conversations are already updated in state
      });
  },
});

export const {
  setCurrentConversation,
  addMessage,
  markAsRead,
  toggleFavorite,
  setTyping,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer; 