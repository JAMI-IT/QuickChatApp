import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addMessage, setCurrentConversation, setTyping } from '@/store/slices/chatSlice';
import { Message } from '@/types/chat';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { conversations, currentConversation, user } = useAppSelector(state => state.chat);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const conversation = conversations.find(conv => conv.id === id);
  const otherParticipant = conversation?.participants.find(p => p.id !== user?.id);

  useEffect(() => {
    if (conversation) {
      dispatch(setCurrentConversation(conversation));
    }
    
    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      dispatch(setCurrentConversation(null));
    };
  }, [conversation, dispatch]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (flatListRef.current && conversation?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversation?.messages.length]);

  const sendMessage = () => {
    if (message.trim() && conversation && user) {
      dispatch(addMessage({
        conversationId: conversation.id,
        message: {
          text: message.trim(),
          senderId: user.id,
          receiverId: otherParticipant?.id || '',
          isRead: false,
          type: 'text',
        },
      }));
      setMessage('');
      setIsTyping(false);
      
      // Simulate typing indicator for other user
      simulateTyping();
    }
  };

  const simulateTyping = () => {
    if (conversation) {
      dispatch(setTyping({ conversationId: conversation.id, isTyping: true }));
      
      // Simulate response after 2-3 seconds
      setTimeout(() => {
        dispatch(setTyping({ conversationId: conversation.id, isTyping: false }));
        
        // Add a simulated response
        dispatch(addMessage({
          conversationId: conversation.id,
          message: {
            text: getRandomResponse(),
            senderId: otherParticipant?.id || '',
            receiverId: user?.id || '',
            isRead: false,
            type: 'text',
          },
        }));
      }, 2000 + Math.random() * 1000);
    }
  };

  const getRandomResponse = () => {
    const responses = [
      "That's interesting! 🤔",
      "I agree with you on that",
      "Thanks for sharing!",
      "Absolutely! 💯",
      "I see what you mean",
      "That makes sense",
      "Great point!",
      "I'll think about that",
      "Sounds good to me 👍",
      "Let's discuss this more later",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isCurrentUser = item.senderId === user?.id;
    const isLastMessage = index === conversation?.messages.length! - 1;
    const prevMessage = index > 0 ? conversation?.messages[index - 1] : null;
    const showAvatar = !isCurrentUser && (!prevMessage || prevMessage.senderId !== item.senderId);
    
    return (
      <Animated.View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.messageContainerRight : styles.messageContainerLeft,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {showAvatar && (
          <Image
            source={{ uri: otherParticipant?.avatar }}
            style={styles.messageAvatar}
            placeholder="https://via.placeholder.com/30"
          />
        )}
        
        <View style={[
          styles.messageBubble,
          isCurrentUser 
            ? [styles.messageBubbleRight, { backgroundColor: tintColor }]
            : [styles.messageBubbleLeft, { backgroundColor: iconColor + '20' }],
          !showAvatar && !isCurrentUser && styles.messageBubbleNoAvatar,
        ]}>
          <Text style={[
            styles.messageText,
            { color: isCurrentUser ? '#fff' : textColor }
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            { color: isCurrentUser ? '#fff' : iconColor }
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderTypingIndicator = () => {
    if (!conversation?.isTyping) return null;
    
    return (
      <View style={styles.typingContainer}>
        <Image
          source={{ uri: otherParticipant?.avatar }}
          style={styles.typingAvatar}
          placeholder="https://via.placeholder.com/30"
        />
        <View style={[styles.typingBubble, { backgroundColor: iconColor + '20' }]}>
          <View style={styles.typingDots}>
            <View style={[styles.typingDot, { backgroundColor: iconColor }]} />
            <View style={[styles.typingDot, { backgroundColor: iconColor }]} />
            <View style={[styles.typingDot, { backgroundColor: iconColor }]} />
          </View>
        </View>
      </View>
    );
  };

  if (!conversation) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.errorText, { color: textColor }]}>
          Conversation not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: iconColor + '20' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={iconColor} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Image
            source={{ uri: otherParticipant?.avatar }}
            style={styles.headerAvatar}
            placeholder="https://via.placeholder.com/35"
          />
          <View style={styles.headerText}>
            <Text style={[styles.headerName, { color: textColor }]}>
              {otherParticipant?.name}
            </Text>
            <Text style={[styles.headerStatus, { color: iconColor }]}>
              {otherParticipant?.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity>
          <Ionicons name="call" size={24} color={iconColor} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={conversation.messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
        ListFooterComponent={renderTypingIndicator}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.inputContainer, { borderTopColor: iconColor + '20' }]}
      >
        <TextInput
          style={[
            styles.textInput,
            { 
              backgroundColor: iconColor + '10',
              color: textColor,
            }
          ]}
          placeholder="Type a message..."
          placeholderTextColor={iconColor}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: message.trim() ? tintColor : iconColor + '30' }
          ]}
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={message.trim() ? '#fff' : iconColor}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  headerAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  messageContainerRight: {
    justifyContent: 'flex-end',
  },
  messageContainerLeft: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    marginBottom: 4,
  },
  messageBubbleRight: {
    borderBottomRightRadius: 4,
  },
  messageBubbleLeft: {
    borderBottomLeftRadius: 4,
  },
  messageBubbleNoAvatar: {
    marginLeft: 38,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  typingAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 4,
  },
  typingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
    opacity: 0.6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
}); 