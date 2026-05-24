import { StyleSheet, Text, View } from 'react-native';

import { RoutineItem } from '../../components/RoutineItem';
import { ScreenContainer } from '../../components/ScreenContainer';
import { colors, typography } from '../../constants/theme';
import { useAppStore } from '../../stores/useAppStore';

export default function RoutineScreen() {
  const reminders = useAppStore((state) => state.reminders);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Rotina do dia</Text>
        <Text style={styles.subtitle}>Lembretes simples para seguir com tranquilidade.</Text>
      </View>

      {reminders.map((reminder) => (
        <RoutineItem key={reminder.id} reminder={reminder} />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSoft,
    lineHeight: 26,
  },
});
