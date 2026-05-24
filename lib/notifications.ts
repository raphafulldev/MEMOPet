import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { ReminderItem } from '../types';

let isNotificationHandlerConfigured = false;

export function configureNotifications() {
  if (isNotificationHandlerConfigured) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('daily-reminders', {
      name: 'Lembretes diarios',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  isNotificationHandlerConfigured = true;
}

export async function requestNotificationPermissions() {
  const settings = await Notifications.getPermissionsAsync();

  if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  const updatedSettings = await Notifications.requestPermissionsAsync();
  return updatedSettings.granted;
}

export async function rescheduleReminderNotifications(reminders: ReminderItem[]) {
  const granted = await requestNotificationPermissions();

  if (!granted) {
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const reminder of reminders.filter((item) => item.enabled)) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: `Hora de ${reminder.title.toLowerCase()}. O MemoPet vai com voce.`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        channelId: 'daily-reminders',
        hour: reminder.hour,
        minute: reminder.minute,
      },
    });
  }
}
