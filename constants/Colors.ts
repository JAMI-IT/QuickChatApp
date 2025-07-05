/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2563eb';
const tintColorDark = '#60a5fa';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#e5e7eb',
    surface: '#f9fafb',
    surfaceSecondary: '#f3f4f6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    chatBubbleUser: tintColorLight,
    chatBubbleOther: '#f3f4f6',
    online: '#22c55e',
    offline: '#9ca3af',
    favorite: '#ef4444',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0a0a0a',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#374151',
    surface: '#1f1f1f',
    surfaceSecondary: '#2a2a2a',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#60a5fa',
    chatBubbleUser: tintColorDark,
    chatBubbleOther: '#374151',
    online: '#22c55e',
    offline: '#6b7280',
    favorite: '#ef4444',
  },
};
