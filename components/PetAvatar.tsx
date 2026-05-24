import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '../constants/theme';
import type { PetStatus } from '../types';

type PetAvatarProps = {
  petStatus: PetStatus;
};

export function PetAvatar({ petStatus }: PetAvatarProps) {
  return (
    <View style={styles.card}>
      <View style={styles.petBubble}>
        <Text style={styles.petEmoji}>🐶</Text>
        <View style={styles.faceRow}>
          <Text style={styles.face}>◕‿◕</Text>
        </View>
      </View>

      <View style={styles.captionWrap}>
        <Text style={styles.title}>Seu MemoPet está com você</Text>
        <Text style={styles.subtitle}>Carinho e rotina deixam o pet ainda mais feliz.</Text>
      </View>

      <View style={styles.statsRow}>
        <StatusPill icon="heart" label={`${petStatus.happiness}% alegria`} />
        <StatusPill icon="restaurant" label={`${petStatus.hunger}% energia`} />
        <StatusPill icon="sparkles" label={`${petStatus.hearts} estrelas`} />
      </View>
    </View>
  );
}

function StatusPill({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.pill}>
      <Ionicons color={colors.primaryStrong} name={icon} size={18} />
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: '#F6DEBF',
  },
  petBubble: {
    alignSelf: 'center',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FFFDF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B88355',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  petEmoji: {
    fontSize: 72,
  },
  faceRow: {
    marginTop: 6,
  },
  face: {
    fontSize: 22,
    color: colors.primaryStrong,
  },
  captionWrap: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: typography.subtitle,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.small,
    lineHeight: 23,
    color: colors.textSoft,
    textAlign: 'center',
  },
  statsRow: {
    gap: spacing.sm,
  },
  pill: {
    minHeight: 52,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pillText: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '700',
  },
});
