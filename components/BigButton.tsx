import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '../constants/theme';

type BigButtonProps = {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export function BigButton({
  title,
  subtitle,
  icon = 'heart',
  onPress,
  variant = 'primary',
}: BigButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          color={isPrimary ? colors.surface : colors.primaryStrong}
          name={icon}
          size={28}
        />
        <View style={styles.textWrap}>
          <Text style={[styles.title, isPrimary ? styles.primaryText : styles.secondaryText]}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[styles.subtitle, isPrimary ? styles.primarySubtext : styles.secondarySubtext]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 84,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: typography.small,
    lineHeight: 22,
  },
  primaryText: {
    color: colors.surface,
  },
  secondaryText: {
    color: colors.primaryStrong,
  },
  primarySubtext: {
    color: '#E8F3EC',
  },
  secondarySubtext: {
    color: colors.textSoft,
  },
});
