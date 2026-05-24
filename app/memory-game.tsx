import { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import { BigButton } from '../components/BigButton';
import { RewardAnimation } from '../components/RewardAnimation';
import { ScreenContainer } from '../components/ScreenContainer';
import { colors, radius, spacing, typography } from '../constants/theme';
import { updatePetStatus } from '../lib/database';
import { useAppStore } from '../stores/useAppStore';
import type { MemoryItem } from '../types';

export default function MemoryGameScreen() {
  const db = useSQLiteContext();
  const memories = useAppStore((state) => state.memories);
  const rewardPet = useAppStore((state) => state.rewardPet);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);

  const currentMemory = memories[round % Math.max(memories.length, 1)];

  const options = useMemo(() => {
    if (!currentMemory) {
      return [];
    }

    const others = memories
      .filter((memory) => memory.id !== currentMemory.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, memories.length > 2 ? 2 : 1);

    return [currentMemory, ...others].sort(() => Math.random() - 0.5);
  }, [currentMemory, memories, round]);

  useEffect(() => {
    setFeedback(null);
  }, [round]);

  if (memories.length < 2 || !currentMemory) {
    return (
      <ScreenContainer>
        <Text style={styles.emptyTitle}>
          Adicione pelo menos duas memorias no modo cuidador para jogar com 2 ou 3 alternativas.
        </Text>
      </ScreenContainer>
    );
  }

  async function handleAnswer(option: MemoryItem) {
    if (option.id === currentMemory.id) {
      const nextStatus = rewardPet('quiz');
      setFeedback('Muito bem! O pet ficou feliz.');
      setShowReward(true);
      await updatePetStatus(db, nextStatus);
      setTimeout(() => setShowReward(false), 900);
      return;
    }

    setFeedback('Tudo bem, vamos tentar juntos.');
  }

  function handleNextRound() {
    if (memories.length < 2) {
      Alert.alert('Mais memorias ajudam', 'Cadastre outra foto para o jogo ficar melhor.');
      return;
    }

    setRound((value) => value + 1);
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Quem é essa pessoa?</Text>
        <Text style={styles.subtitle}>Olhe a foto com calma e escolha uma alternativa.</Text>
      </View>

      <View style={styles.card}>
        <Image source={{ uri: currentMemory.imageUri }} style={styles.image} />
      </View>

      <View style={styles.optionsWrap}>
        {options.map((option) => (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            onPress={() => handleAnswer(option)}
            style={({ pressed }) => [styles.optionButton, pressed && styles.optionPressed]}
          >
            <Text style={styles.optionTitle}>{option.personName}</Text>
            <Text style={styles.optionSubtitle}>{option.relationship}</Text>
          </Pressable>
        ))}
      </View>

      <RewardAnimation visible={showReward} />

      {feedback ? (
        <View
          style={[
            styles.feedbackCard,
            feedback.includes('Muito bem') ? styles.successCard : styles.softCard,
          ]}
        >
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : null}

      <BigButton
        icon="arrow-forward"
        onPress={handleNextRound}
        subtitle="Ir para outra foto."
        title="Próxima foto"
        variant="secondary"
      />
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: colors.accentSoft,
  },
  optionsWrap: {
    gap: spacing.md,
  },
  optionButton: {
    minHeight: 82,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    gap: 4,
  },
  optionPressed: {
    opacity: 0.88,
  },
  optionTitle: {
    fontSize: typography.subtitle,
    fontWeight: '800',
    color: colors.text,
  },
  optionSubtitle: {
    fontSize: typography.small,
    color: colors.textSoft,
  },
  feedbackCard: {
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  successCard: {
    backgroundColor: '#E1F4E5',
  },
  softCard: {
    backgroundColor: colors.accentSoft,
  },
  feedbackText: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
  },
  emptyTitle: {
    fontSize: typography.subtitle,
    color: colors.text,
    fontWeight: '800',
    lineHeight: 30,
  },
});
