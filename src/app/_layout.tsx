import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { useOnboardingStore } from '@/store/onboarding-store';

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
      <AppTabs />
    </ThemeProvider>
  );
}