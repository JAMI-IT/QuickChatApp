export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'file';
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  isGroup: boolean;
  name?: string;
  avatar?: string;
  unreadCount: number;
  isFavorite: boolean;
  isTyping: boolean;
  lastActivity: Date;
}

export interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  favorites: string[];
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  soundEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface AppState {
  chat: ChatState;
  preferences: UserPreferences;
} 