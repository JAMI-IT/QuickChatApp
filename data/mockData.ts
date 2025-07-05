import { Conversation, Message, User } from '../types/chat';

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isOnline: true,
  },
  {
    id: 'user2',
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: 'user3',
    name: 'Carol Williams',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isOnline: true,
  },
  {
    id: 'user4',
    name: 'David Brown',
    avatar: 'https://i.pravatar.cc/150?img=4',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 'user5',
    name: 'Emma Davis',
    avatar: 'https://i.pravatar.cc/150?img=5',
    isOnline: true,
  },
  {
    id: 'current-user',
    name: 'You',
    avatar: 'https://i.pravatar.cc/150?img=6',
    isOnline: true,
  },
];

export const currentUser = mockUsers.find(user => user.id === 'current-user')!;

const generateMessages = (user1: User, user2: User): Message[] => {
  const messages: Message[] = [];
  const now = new Date();
  
  // Generate conversation history
  const conversations = [
    { sender: user1, text: "Hey! How are you doing?", time: -60000 * 120 },
    { sender: user2, text: "I'm doing great! Just working on some projects. How about you?", time: -60000 * 115 },
    { sender: user1, text: "Same here! Working on a new React Native app", time: -60000 * 110 },
    { sender: user2, text: "That sounds exciting! What kind of app?", time: -60000 * 105 },
    { sender: user1, text: "It's a chat application with some cool features", time: -60000 * 100 },
    { sender: user2, text: "Nice! I'd love to see it when it's ready", time: -60000 * 95 },
    { sender: user1, text: "Definitely! I'll share it with you soon", time: -60000 * 90 },
    { sender: user2, text: "Looking forward to it! 😊", time: -60000 * 10 },
  ];

  conversations.forEach((conv, index) => {
    messages.push({
      id: `msg-${user1.id}-${user2.id}-${index}`,
      text: conv.text,
      senderId: conv.sender.id,
      receiverId: conv.sender.id === user1.id ? user2.id : user1.id,
      timestamp: new Date(now.getTime() + conv.time),
      isRead: true,
      type: 'text',
    });
  });

  return messages;
};

export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participants: [currentUser, mockUsers[0]],
    messages: generateMessages(currentUser, mockUsers[0]),
    isGroup: false,
    unreadCount: 0,
    isFavorite: true,
    isTyping: false,
    lastActivity: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
  },
  {
    id: 'conv2',
    participants: [currentUser, mockUsers[1]],
    messages: generateMessages(currentUser, mockUsers[1]),
    isGroup: false,
    unreadCount: 2,
    isFavorite: false,
    isTyping: false,
    lastActivity: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: 'conv3',
    participants: [currentUser, mockUsers[2]],
    messages: generateMessages(currentUser, mockUsers[2]),
    isGroup: false,
    unreadCount: 0,
    isFavorite: true,
    isTyping: true,
    lastActivity: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: 'conv4',
    participants: [currentUser, mockUsers[3]],
    messages: generateMessages(currentUser, mockUsers[3]),
    isGroup: false,
    unreadCount: 1,
    isFavorite: false,
    isTyping: false,
    lastActivity: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
  },
  {
    id: 'conv5',
    participants: [currentUser, mockUsers[4]],
    messages: generateMessages(currentUser, mockUsers[4]),
    isGroup: false,
    unreadCount: 0,
    isFavorite: false,
    isTyping: false,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
];

// Add lastMessage to each conversation
mockConversations.forEach(conv => {
  if (conv.messages.length > 0) {
    conv.lastMessage = conv.messages[conv.messages.length - 1];
  }
});

export const defaultUserPreferences = {
  theme: 'system' as const,
  notifications: true,
  soundEnabled: true,
  fontSize: 'medium' as const,
}; 