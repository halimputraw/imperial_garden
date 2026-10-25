import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, View, Platform, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { useOnboardingStore } from '@/store/onboarding-store';
import { Colors, MaxContentWidth } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isComplete = useOnboardingStore((s) => s.isComplete);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // If onboarding not complete and not already on onboarding screen
    if (!isComplete && segments[0] !== 'onboarding') {
      router.replace('/onboarding');
    }
  }, [isComplete, segments]);

    return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {/* On web, keep the app phone-sized and centred on wide screens */}
      <View style={styles.page}>
        <View style={styles.phone}>
          <AppTabs />
        </View>
      </View>
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? Colors.surfaceDark : Colors.background,
  },
  phone: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    maxWidth: Platform.OS === 'web' ? MaxContentWidth : undefined,
    overflow: 'hidden',
  },
});