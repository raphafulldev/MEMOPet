import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { BigButton } from '../../components/BigButton';
import { PetAvatar } from '../../components/PetAvatar';
import { RewardAnimation } from '../../components/RewardAnimation';
import { ScreenContainer } from '../../components/ScreenContainer';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { formatLongDate, getDayPeriod, getGreeting } from '../../lib/date';
import { updatePetStatus } from '../../lib/database';
import { useAppStore } from '../../stores/useAppStore';

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [showReward, setShowReward] = useState(false);
  const profile = useAppStore((state) => state.profile);
  const petStatus = useAppStore((state) => state.petStatus);
  const rewardPet = useAppStore((state) => state.rewardPet);

  const today = new Date();

  async function handlePetReward(mode: 'pet' | 'feed') {
    const nextStatus = rewardPet(mode);
    setShowReward(true);
    await updatePetStatus(db, nextStatus);
    setTimeout(() => setShowReward(false), 900);
  }

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.greeting}>
          {getGreeting(today)}, {profile.name}
        </Text>
        <Text style={styles.dateText}>{formatLongDate(today)}</Text>
        <Text style={styles.periodText}>Agora é um momento de {getDayPeriod(today)}.</Text>
      </View>

      <PetAvatar petStatus={petStatus} />
      <RewardAnimation visible={showReward} />

      <BigButton
        icon="sparkles"
        onPress={() => router.push('/memory-game')}
        subtitle="Um jogo calmo com fotos de quem voce ama."
        title="Vamos lembrar?"
      />

      <View style={styles.actions}>
        <BigButton
          icon="hand-left"
          onPress={() => handlePetReward('pet')}
          subtitle="O MemoPet adora carinho."
          title="Fazer carinho"
          variant="secondary"
        />
        <BigButton
          icon="restaurant"
          onPress={() => handlePetReward('feed')}
          subtitle="Uma recompensa gostosa para o pet."
          title="Dar petisco"
          variant="secondary"
        />
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>Uma tela de cada vez</Text>
        <Text style={styles.tipText}>
          O MemoPet foi pensado para ser simples, acolhedor e sem promessas de tratamento
          medico.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 8,
  },
  greeting: {
    fontSize: typography.hero,
    fontWeight: '800',
    color: colors.text,
  },
  dateText: {
    fontSize: typography.body,
    color: colors.textSoft,
    textTransform: 'capitalize',
  },
  periodText: {
    fontSize: typography.body,
    color: colors.primaryStrong,
    fontWeight: '700',
  },
  actions: {
    gap: spacing.md,
  },
  tipCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: 8,
  },
  tipTitle: {
    fontSize: typography.body,
    fontWeight: '800',
    color: colors.text,
  },
  tipText: {
    fontSize: typography.small,
    lineHeight: 23,
    color: colors.textSoft,
  },
});
