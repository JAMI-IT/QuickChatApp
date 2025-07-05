import { useThemeColor } from '@/hooks/useThemeColor';
import { Message, User } from '@/types/chat';
import { Image } from 'expo-image';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar?: boolean;
  otherUser?: User;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  showAvatar = false,
  otherUser,
}) => {
  const textColor = useThemeColor({}, 'text');
  const chatBubbleUser = useThemeColor({}, 'chatBubbleUser');
  const chatBubbleOther = useThemeColor({}, 'chatBubbleOther');
  const iconColor = useThemeColor({}, 'icon');
  
  const slideAnim = useRef(new Animated.Value(isCurrentUser ? 50 : -50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Animated.View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.messageContainerRight : styles.messageContainerLeft,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      {showAvatar && otherUser && (
        <Image
          source={{ uri: otherUser.avatar }}
          style={styles.messageAvatar}
          placeholder="https://via.placeholder.com/30"
        />
      )}
      
      <View
        style={[
          styles.messageBubble,
          isCurrentUser
            ? [styles.messageBubbleRight, { backgroundColor: chatBubbleUser }]
            : [styles.messageBubbleLeft, { backgroundColor: chatBubbleOther }],
          !showAvatar && !isCurrentUser && styles.messageBubbleNoAvatar,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: isCurrentUser ? '#fff' : textColor },
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            { color: isCurrentUser ? '#fff' : iconColor },
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </Animated.View>
  );
};

interface TypingIndicatorProps {
  user: User;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ user }) => {
  const chatBubbleOther = useThemeColor({}, 'chatBubbleOther');
  const iconColor = useThemeColor({}, 'icon');
  
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot3, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(dot1, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot2, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot3, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animateDots());
    };

    animateDots();
  }, []);

  return (
    <View style={styles.typingContainer}>
      <Image
        source={{ uri: user.avatar }}
        style={styles.typingAvatar}
        placeholder="https://via.placeholder.com/30"
      />
      <View style={[styles.typingBubble, { backgroundColor: chatBubbleOther }]}>
        <View style={styles.typingDots}>
          <Animated.View
            style={[
              styles.typingDot,
              { backgroundColor: iconColor, opacity: dot1 },
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              { backgroundColor: iconColor, opacity: dot2 },
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              { backgroundColor: iconColor, opacity: dot3 },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

interface OnlineStatusProps {
  isOnline: boolean;
  size?: number;
}

export const OnlineStatus: React.FC<OnlineStatusProps> = ({ isOnline, size = 8 }) => {
  const onlineColor = useThemeColor({}, 'online');
  const offlineColor = useThemeColor({}, 'offline');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isOnline) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isOnline]);

  return (
    <Animated.View
      style={[
        styles.onlineStatus,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isOnline ? onlineColor : offlineColor,
          transform: isOnline ? [{ scale: pulseAnim }] : [{ scale: 1 }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 2,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
}); 