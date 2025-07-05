import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { currentUser, mockConversations } from '../../data/mockData';
import { ChatState, Conversation, Message } from '../../types/chat';

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
          id: `msg-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
        };
        
        conversation.messages.push(newMessage);
        conversation.lastMessage = newMessage;
        conversation.lastActivity = new Date();
        
        // Update unread count if message is from other user
        if (message.senderId !== currentUser.id) {
          conversation.unreadCount += 1;
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
      }
    },
    
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      const conversation = state.conversations.find(conv => conv.id === conversationId);
      
      if (conversation) {
        conversation.isFavorite = !conversation.isFavorite;
        
        if (conversation.isFavorite) {
          state.favorites.push(conversationId);
        } else {
          state.favorites = state.favorites.filter(id => id !== conversationId);
        }
      }
    },
    
    setTyping: (state, action: PayloadAction<{ conversationId: string; isTyping: boolean }>) => {
      const { conversationId, isTyping } = action.payload;
      const conversation = state.conversations.find(conv => conv.id === conversationId);
      
      if (conversation) {
        conversation.isTyping = isTyping;
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
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