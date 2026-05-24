import { StyleSheet, Switch, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../constants/theme';
import { formatTime } from '../lib/date';
import type { ReminderItem } from '../types';

type RoutineItemProps = {
  reminder: ReminderItem;
  onToggle?: (enabled: boolean) => void;
};

export function RoutineItem({ reminder, onToggle }: RoutineItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{reminder.title}</Text>
        <Text style={styles.subtitle}>
          {formatTime(reminder.hour, reminder.minute)} • {reminder.period}
        </Text>
      </View>

      {onToggle ? (
        <Switch
          accessibilityLabel={`Ativar lembrete ${reminder.title}`}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: '#A9D6B3' }}
          thumbColor={reminder.enabled ? colors.primaryStrong : '#FFFFFF'}
          value={reminder.enabled}
        />
      ) : (
        <View style={[styles.badge, reminder.enabled ? styles.enabled : styles.paused]}>
          <Text style={styles.badgeText}>{reminder.enabled ? 'Ativo' : 'Pausado'}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    minHeight: 88,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: typography.body,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.small,
    color: colors.textSoft,
  },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  enabled: {
    backgroundColor: '#DFF1E3',
  },
  paused: {
    backgroundColor: '#ECEFED',
  },
  badgeText: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.primaryStrong,
  },
});
