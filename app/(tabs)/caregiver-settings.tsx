import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSQLiteContext } from 'expo-sqlite';

import { BigButton } from '../../components/BigButton';
import { RoutineItem } from '../../components/RoutineItem';
import { ScreenContainer } from '../../components/ScreenContainer';
import { colors, radius, spacing, typography } from '../../constants/theme';
import {
  addMemory,
  getAppDataSnapshot,
  saveProfile,
  updateReminder,
} from '../../lib/database';
import { rescheduleReminderNotifications } from '../../lib/notifications';
import { useAppStore } from '../../stores/useAppStore';
import type { ReminderItem } from '../../types';

export default function CaregiverSettingsScreen() {
  const db = useSQLiteContext();
  const profile = useAppStore((state) => state.profile);
  const reminders = useAppStore((state) => state.reminders);
  const hydrate = useAppStore((state) => state.hydrate);

  const [name, setName] = useState(profile.name);
  const [personName, setPersonName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [reminderDrafts, setReminderDrafts] = useState<Record<number, { hour: string; minute: string }>>(
    {},
  );

  useEffect(() => {
    setReminderDrafts(
      Object.fromEntries(
        reminders.map((reminder) => [
          reminder.id,
          {
            hour: String(reminder.hour).padStart(2, '0'),
            minute: String(reminder.minute).padStart(2, '0'),
          },
        ]),
      ),
    );
  }, [reminders]);

  async function refreshState() {
    const snapshot = await getAppDataSnapshot(db);
    hydrate(snapshot);
    await rescheduleReminderNotifications(snapshot.reminders);
  }

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissao necessária', 'Precisamos da galeria para escolher uma foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
      aspect: [4, 4],
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function handleSaveProfile() {
    if (!name.trim()) {
      Alert.alert('Nome vazio', 'Digite o nome da pessoa assistida.');
      return;
    }

    setIsSaving(true);
    await saveProfile(db, name.trim());
    await refreshState();
    setIsSaving(false);
    Alert.alert('Tudo pronto', 'O nome foi salvo com carinho.');
  }

  async function handleAddMemory() {
    if (!imageUri || !personName.trim() || !relationship.trim()) {
      Alert.alert('Falta um detalhe', 'Escolha a foto e preencha nome e parentesco.');
      return;
    }

    setIsSaving(true);
    await addMemory(db, {
      imageUri,
      personName: personName.trim(),
      relationship: relationship.trim(),
    });
    await refreshState();
    setPersonName('');
    setRelationship('');
    setImageUri('');
    setIsSaving(false);
    Alert.alert('Memoria adicionada', 'A nova foto ja esta no app.');
  }

  async function handleToggleReminder(reminder: ReminderItem, enabled: boolean) {
    await updateReminder(db, { ...reminder, enabled });
    await refreshState();
  }

  async function handleSaveReminderTime(reminder: ReminderItem) {
    const draft = reminderDrafts[reminder.id];
    const hour = Number(draft?.hour);
    const minute = Number(draft?.minute);

    if (Number.isNaN(hour) || Number.isNaN(minute) || hour > 23 || minute > 59 || hour < 0 || minute < 0) {
      Alert.alert('Horario invalido', 'Use um horario entre 00:00 e 23:59.');
      return;
    }

    await updateReminder(db, { ...reminder, hour, minute });
    await refreshState();
    Alert.alert('Horario salvo', 'O lembrete foi atualizado.');
  }

  return (
    <ScreenContainer>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pessoa assistida</Text>
        <Text style={styles.helperText}>Use um nome carinhoso para a saudacao inicial.</Text>
        <TextInput
          onChangeText={setName}
          placeholder="Nome da pessoa"
          placeholderTextColor="#88A294"
          style={styles.input}
          value={name}
        />
        <BigButton
          icon="save"
          onPress={handleSaveProfile}
          subtitle={isSaving ? 'Salvando...' : 'Atualiza a saudacao da tela inicial.'}
          title="Salvar nome"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adicionar familiar</Text>
        <Text style={styles.helperText}>Cadastre uma foto, o nome e o parentesco.</Text>

        <Pressable onPress={handlePickImage} style={styles.photoPicker}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <Text style={styles.photoPickerText}>Escolher foto</Text>
          )}
        </Pressable>

        <TextInput
          onChangeText={setPersonName}
          placeholder="Nome da pessoa"
          placeholderTextColor="#88A294"
          style={styles.input}
          value={personName}
        />
        <TextInput
          onChangeText={setRelationship}
          placeholder="Parentesco"
          placeholderTextColor="#88A294"
          style={styles.input}
          value={relationship}
        />
        <BigButton
          icon="images"
          onPress={handleAddMemory}
          subtitle="A foto vai aparecer nas memorias e no jogo."
          title="Salvar memoria"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lembretes diarios</Text>
        <Text style={styles.helperText}>Ligue ou desligue os lembretes mais importantes.</Text>

        {reminders.map((reminder) => (
          <View key={reminder.id} style={styles.reminderWrap}>
            <RoutineItem
              reminder={reminder}
              onToggle={(enabled) => handleToggleReminder(reminder, enabled)}
            />
            <View style={styles.timeEditor}>
              <Text style={styles.timeText}>Horario</Text>
              <TextInput
                keyboardType="number-pad"
                maxLength={2}
                onChangeText={(value) =>
                  setReminderDrafts((current) => ({
                    ...current,
                    [reminder.id]: { ...current[reminder.id], hour: value.replace(/[^0-9]/g, '') },
                  }))
                }
                style={styles.timeInput}
                value={reminderDrafts[reminder.id]?.hour ?? ''}
              />
              <Text style={styles.timeSeparator}>:</Text>
              <TextInput
                keyboardType="number-pad"
                maxLength={2}
                onChangeText={(value) =>
                  setReminderDrafts((current) => ({
                    ...current,
                    [reminder.id]: {
                      ...current[reminder.id],
                      minute: value.replace(/[^0-9]/g, ''),
                    },
                  }))
                }
                style={styles.timeInput}
                value={reminderDrafts[reminder.id]?.minute ?? ''}
              />
              <Pressable
                onPress={() => handleSaveReminderTime(reminder)}
                style={({ pressed }) => [styles.saveTimeButton, pressed && { opacity: 0.88 }]}
              >
                <Text style={styles.saveTimeButtonText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.title,
    fontWeight: '800',
    color: colors.text,
  },
  helperText: {
    fontSize: typography.body,
    color: colors.textSoft,
    lineHeight: 25,
  },
  input: {
    minHeight: 60,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: typography.body,
    color: colors.text,
  },
  photoPicker: {
    minHeight: 200,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoPickerText: {
    fontSize: typography.subtitle,
    color: colors.primaryStrong,
    fontWeight: '800',
  },
  previewImage: {
    width: '100%',
    height: 220,
  },
  reminderWrap: {
    gap: 8,
  },
  timeEditor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.xs,
  },
  timeText: {
    fontSize: typography.small,
    color: colors.textSoft,
    minWidth: 56,
  },
  timeInput: {
    width: 54,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  timeSeparator: {
    fontSize: typography.subtitle,
    fontWeight: '800',
    color: colors.text,
  },
  saveTimeButton: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  saveTimeButtonText: {
    fontSize: typography.small,
    fontWeight: '800',
    color: colors.primaryStrong,
  },
});
