import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

import { colors, typography } from '../constants/theme';
import { getAppDataSnapshot, initializeDatabase } from '../lib/database';
import { configureNotifications, rescheduleReminderNotifications } from '../lib/notifications';
import { useAppStore } from '../stores/useAppStore';

configureNotifications();

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="memopet.db" onInit={initializeDatabase}>
      <AppBootstrap />
    </SQLiteProvider>
  );
}

function AppBootstrap() {
  const db = useSQLiteContext();
  const isReady = useAppStore((state) => state.isReady);
  const hydrate = useAppStore((state) => state.hydrate);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const snapshot = await getAppDataSnapshot(db);

      if (!isMounted) {
        return;
      }

      hydrate(snapshot);
      await rescheduleReminderNotifications(snapshot.reminders);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [db, hydrate]);

  if (!isReady) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingEmoji}>🐾</Text>
        <Text style={styles.loadingTitle}>Preparando o MemoPet</Text>
        <ActivityIndicator color={colors.primaryStrong} size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primaryStrong,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="memory-game" options={{ title: 'Vamos lembrar?' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingEmoji: {
    fontSize: 56,
  },
  loadingTitle: {
    fontSize: typography.subtitle,
    fontWeight: '800',
    color: colors.text,
  },
});
