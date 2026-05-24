import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primaryStrong,
        headerTitleStyle: { fontWeight: '800' },
        tabBarStyle: {
          backgroundColor: '#FDFDFB',
          paddingTop: 8,
          height: 72,
        },
        tabBarActiveTintColor: colors.primaryStrong,
        tabBarInactiveTintColor: '#87A28F',
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '700',
          marginBottom: 6,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            index: focused ? 'home' : 'home-outline',
            memories: focused ? 'images' : 'images-outline',
            routine: focused ? 'calendar' : 'calendar-outline',
            'caregiver-settings': focused ? 'settings' : 'settings-outline',
          };

          return <Ionicons color={color} name={iconMap[route.name]} size={size} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', headerTitle: 'MemoPet' }} />
      <Tabs.Screen name="memories" options={{ title: 'Memórias', headerTitle: 'Memórias' }} />
      <Tabs.Screen name="routine" options={{ title: 'Rotina', headerTitle: 'Rotina' }} />
      <Tabs.Screen
        name="caregiver-settings"
        options={{ title: 'Cuidador', headerTitle: 'Modo cuidador' }}
      />
    </Tabs>
  );
}
