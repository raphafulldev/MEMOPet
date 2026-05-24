import { Image, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../constants/theme';
import type { MemoryItem } from '../types';

type MemoryCardProps = {
  memory: MemoryItem;
};

export function MemoryCard({ memory }: MemoryCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: memory.imageUri }} style={styles.image} />
      <View style={styles.textWrap}>
        <Text style={styles.name}>{memory.personName}</Text>
        <Text style={styles.relationship}>{memory.relationship}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: colors.accentSoft,
  },
  textWrap: {
    padding: spacing.lg,
    gap: 4,
  },
  name: {
    fontSize: typography.subtitle,
    fontWeight: '800',
    color: colors.text,
  },
  relationship: {
    fontSize: typography.body,
    color: colors.textSoft,
  },
});
