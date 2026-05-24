import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { BigButton } from '../../components/BigButton';
import { MemoryCard } from '../../components/MemoryCard';
import { ScreenContainer } from '../../components/ScreenContainer';
import { colors, typography } from '../../constants/theme';
import { useAppStore } from '../../stores/useAppStore';

export default function MemoriesScreen() {
  const memories = useAppStore((state) => state.memories);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Pessoas queridas</Text>
        <Text style={styles.subtitle}>Fotos com nome e parentesco para lembrar com calma.</Text>
      </View>

      <BigButton
        icon="help-circle"
        onPress={() => router.push('/memory-game')}
        subtitle="Perguntas com 2 ou 3 alternativas."
        title="Jogar agora"
      />

      {memories.map((memory) => (
        <MemoryCard key={memory.id} memory={memory} />
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
