import useLandscape from '@/hooks/use-landscape';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import "../global.css";

export default function RootLayout() {
  const loaded = useLandscape();
  if (!loaded) return null;
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
