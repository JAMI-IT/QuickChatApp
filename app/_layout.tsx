import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { useColorScheme } from '@/hooks/useColorScheme';
import { store } from '@/store';
import { loadPreferencesFromStorage } from '@/store/slices/preferencesSlice';

function AppContent() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Load preferences on app start
    store.dispatch(loadPreferencesFromStorage());
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="chat/[id]" 
          options={{ 
            headerShown: true, 
            title: 'Chat',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#0a0a0a' : '#ffffff',
            },
            headerTintColor: colorScheme === 'dark' ? '#ECEDEE' : '#11181C',
            headerTitleStyle: {
              fontWeight: '600',
            },
            animation: 'slide_from_right',
            presentation: 'card',
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
