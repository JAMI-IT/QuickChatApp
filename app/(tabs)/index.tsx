import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadConversationsFromStorage, markAsRead, saveConversationsToStorage, toggleFavorite } from '@/store/slices/chatSlice';
import { Conversation } from '@/types/chat';

export default function ChatsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { conversations, favorites, isLoading } = useAppSelector(state => state.chat);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  // Load conversations from storage on component mount
  useEffect(() => {
    dispatch(loadConversationsFromStorage());
  }, [dispatch]);

  // Save conversations to storage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      dispatch(saveConversationsToStorage(conversations));
    }
  }, [conversations, dispatch]);

  const filteredConversations = conversations
    .filter(conv => {
      const matchesSearch = conv.participants.some(participant =>
        participant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesFavorites = showFavoritesOnly ? conv.isFavorite : true;
      return matchesSearch && matchesFavorites;
    })
    .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());

  const handleConversationPress = (conversation: Conversation) => {
    if (conversation.unreadCount > 0) {
      dispatch(markAsRead(conversation.id));
    }
    router.push(`/chat/${conversation.id}`);
  };

  const handleFavoritePress = (conversationId: string) => {
    dispatch(toggleFavorite(conversationId));
  };

  const formatLastMessage = (conversation: Conversation) => {
    if (!conversation.lastMessage) return 'No messages';
    
    const message = conversation.lastMessage;
    const isCurrentUser = message.senderId === 'current-user';
    const prefix = isCurrentUser ? 'You: ' : '';
    
    return `${prefix}${message.text}`;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const otherParticipant = item.participants.find(p => p.id !== 'current-user');
    
    return (
      <TouchableOpacity
        style={[styles.conversationItem, { borderBottomColor: iconColor + '30' }]}
        onPress={() => handleConversationPress(item)}
      >
        <Image
          source={{ uri: otherParticipant?.avatar }}
          style={styles.avatar}
          placeholder="https://via.placeholder.com/50"
        />
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.participantName, { color: textColor }]}>
              {otherParticipant?.name}
            </Text>
            <View style={styles.rightHeader}>
              <Text style={[styles.timeText, { color: iconColor }]}>
                {formatTime(item.lastActivity)}
              </Text>
              {item.unreadCount > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: tintColor }]}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.messageRow}>
            <Text 
              style={[styles.lastMessage, { color: iconColor }]} 
              numberOfLines={1}
            >
              {formatLastMessage(item)}
            </Text>
            <View style={styles.indicators}>
              {item.isTyping && (
                <Text style={[styles.typingText, { color: tintColor }]}>
                  typing...
                </Text>
              )}
              {otherParticipant?.isOnline && (
                <View style={styles.onlineIndicator} />
              )}
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleFavoritePress(item.id)}
        >
          <Ionicons
            name={item.isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={item.isFavorite ? '#ff4757' : iconColor}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ActivityIndicator size="large" color={tintColor} style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Chats</Text>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: showFavoritesOnly ? tintColor : 'transparent' }]}
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <Ionicons
            name="heart"
            size={24}
            color={showFavoritesOnly ? '#fff' : iconColor}
          />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: iconColor + '10' }]}>
        <Ionicons name="search" size={20} color={iconColor} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search conversations..."
          placeholderTextColor={iconColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={filteredConversations}
        keyExtractor={item => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: iconColor }]}>
              {showFavoritesOnly ? 'No favorite conversations' : 'No conversations found'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginRight: 6,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2ecc71',
  },
  favoriteButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
