import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFontSize, setNotifications, setSoundEnabled, setTheme } from '@/store/slices/preferencesSlice';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.chat);
  const preferences = useAppSelector(state => state.preferences);
  const systemColorScheme = useColorScheme();
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  // Load preferences from AsyncStorage on component mount
  useEffect(() => {
    loadPreferencesFromStorage();
  }, []);

  // Save preferences to AsyncStorage whenever they change
  useEffect(() => {
    savePreferencesToStorage();
  }, [preferences]);

  const loadPreferencesFromStorage = async () => {
    try {
      const storedPreferences = await AsyncStorage.getItem('userPreferences');
      if (storedPreferences) {
        const parsedPreferences = JSON.parse(storedPreferences);
        dispatch(setTheme(parsedPreferences.theme));
        dispatch(setNotifications(parsedPreferences.notifications));
        dispatch(setSoundEnabled(parsedPreferences.soundEnabled));
        dispatch(setFontSize(parsedPreferences.fontSize));
      }
    } catch (error) {
      console.error('Error loading preferences from storage:', error);
    }
  };

  const savePreferencesToStorage = async () => {
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences to storage:', error);
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    dispatch(setTheme(theme));
  };

  const handleNotificationsToggle = (value: boolean) => {
    dispatch(setNotifications(value));
  };

  const handleSoundToggle = (value: boolean) => {
    dispatch(setSoundEnabled(value));
  };

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    dispatch(setFontSize(size));
  };

  const showAbout = () => {
    Alert.alert(
      'About QuickChat',
      'QuickChat v1.0.0\n\nA beautiful and simple chat application built with React Native and Expo.',
      [{ text: 'OK' }]
    );
  };

  const clearData = () => {
    Alert.alert(
      'Clear Data',
      'Are you sure you want to clear all app data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['chatFavorites', 'userPreferences']);
              Alert.alert('Success', 'App data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear app data.');
            }
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string,
    rightComponent: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: iconColor + '20' }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color={iconColor} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: textColor }]}>{title}</Text>
          <Text style={[styles.settingDescription, { color: iconColor }]}>{description}</Text>
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Profile</Text>
        </View>

        {/* User Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: iconColor + '10' }]}>
          <Image
            source={{ uri: user?.avatar }}
            style={styles.profileAvatar}
            placeholder="https://via.placeholder.com/80"
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: textColor }]}>{user?.name}</Text>
            <Text style={[styles.profileStatus, { color: iconColor }]}>
              {user?.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Appearance</Text>
          
          {renderSettingItem(
            'moon',
            'Theme',
            'Choose your preferred theme',
            <View style={styles.themeButtons}>
              {['light', 'dark', 'system'].map((theme) => (
                <TouchableOpacity
                  key={theme}
                  style={[
                    styles.themeButton,
                    { 
                      backgroundColor: preferences.theme === theme ? tintColor : 'transparent',
                      borderColor: iconColor + '30',
                    }
                  ]}
                  onPress={() => handleThemeChange(theme as any)}
                >
                  <Text style={[
                    styles.themeButtonText,
                    { color: preferences.theme === theme ? '#fff' : iconColor }
                  ]}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {renderSettingItem(
            'text',
            'Font Size',
            'Adjust text size',
            <View style={styles.themeButtons}>
              {['small', 'medium', 'large'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.themeButton,
                    { 
                      backgroundColor: preferences.fontSize === size ? tintColor : 'transparent',
                      borderColor: iconColor + '30',
                    }
                  ]}
                  onPress={() => handleFontSizeChange(size as any)}
                >
                  <Text style={[
                    styles.themeButtonText,
                    { color: preferences.fontSize === size ? '#fff' : iconColor }
                  ]}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Notifications</Text>
          
          {renderSettingItem(
            'notifications',
            'Push Notifications',
            'Receive notifications for new messages',
            <Switch
              value={preferences.notifications}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: iconColor + '30', true: tintColor + '80' }}
              thumbColor={preferences.notifications ? tintColor : '#f4f3f4'}
            />
          )}

          {renderSettingItem(
            'volume-high',
            'Sound',
            'Play sound for notifications',
            <Switch
              value={preferences.soundEnabled}
              onValueChange={handleSoundToggle}
              trackColor={{ false: iconColor + '30', true: tintColor + '80' }}
              thumbColor={preferences.soundEnabled ? tintColor : '#f4f3f4'}
            />
          )}
        </View>

        {/* Other Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Other</Text>
          
          {renderSettingItem(
            'information-circle',
            'About',
            'App information and version',
            <Ionicons name="chevron-forward" size={20} color={iconColor} />,
            showAbout
          )}

          {renderSettingItem(
            'trash',
            'Clear Data',
            'Clear all app data and reset preferences',
            <Ionicons name="chevron-forward" size={20} color={iconColor} />,
            clearData
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 16,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 