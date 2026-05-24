import type { SQLiteDatabase } from 'expo-sqlite';

import type { AppDataSnapshot, MemoryItem, PetStatus, ReminderItem, UserProfile } from '../types';

const DEFAULT_PROFILE_NAME = 'Dona Maria';

function createMockMemoryImage(background: string, label: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <rect width="512" height="512" rx="48" fill="${background}" />
      <circle cx="256" cy="194" r="88" fill="#FFF7EF" />
      <rect x="116" y="302" width="280" height="132" rx="66" fill="#FFF7EF" />
      <text x="256" y="470" text-anchor="middle" font-family="Arial" font-size="36" font-weight="700" fill="#2B4A3B">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const defaultReminders = [
  { title: 'Beber água', period: 'Manhã', hour: 9, minute: 0 },
  { title: 'Tomar remédio', period: 'Manhã', hour: 10, minute: 0 },
  { title: 'Fazer refeição', period: 'Almoço', hour: 12, minute: 30 },
  { title: 'Caminhar um pouco', period: 'Tarde', hour: 16, minute: 0 },
  { title: 'Descansar', period: 'Noite', hour: 20, minute: 0 },
];

const defaultMemories = [
  {
    imageUri: createMockMemoryImage('#F8D9C8', 'Ana'),
    personName: 'Ana',
    relationship: 'Filha',
  },
  {
    imageUri: createMockMemoryImage('#D4E8D0', 'Paulo'),
    personName: 'Paulo',
    relationship: 'Filho',
  },
  {
    imageUri: createMockMemoryImage('#D6E6F8', 'Lia'),
    personName: 'Lia',
    relationship: 'Neta',
  },
];

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS user_profile (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_uri TEXT NOT NULL,
      person_name TEXT NOT NULL,
      relationship TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      period TEXT NOT NULL,
      hour INTEGER NOT NULL,
      minute INTEGER NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS pet_status (
      id INTEGER PRIMARY KEY NOT NULL,
      hearts INTEGER NOT NULL DEFAULT 0,
      hunger INTEGER NOT NULL DEFAULT 70,
      happiness INTEGER NOT NULL DEFAULT 70,
      last_interaction TEXT NOT NULL
    );
  `);

  await seedInitialData(db);
}

async function seedInitialData(db: SQLiteDatabase) {
  const profileCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM user_profile');
  const memoriesCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM memories');
  const remindersCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM reminders');
  const petCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM pet_status');

  if (!profileCount?.count) {
    await db.runAsync('INSERT INTO user_profile (id, name) VALUES (1, ?)', DEFAULT_PROFILE_NAME);
  }

  if (!memoriesCount?.count) {
    for (const memory of defaultMemories) {
      await db.runAsync(
        'INSERT INTO memories (image_uri, person_name, relationship) VALUES (?, ?, ?)',
        memory.imageUri,
        memory.personName,
        memory.relationship,
      );
    }
  }

  if (!remindersCount?.count) {
    for (const reminder of defaultReminders) {
      await db.runAsync(
        'INSERT INTO reminders (title, period, hour, minute, enabled) VALUES (?, ?, ?, ?, 1)',
        reminder.title,
        reminder.period,
        reminder.hour,
        reminder.minute,
      );
    }
  }

  if (!petCount?.count) {
    await db.runAsync(
      'INSERT INTO pet_status (id, hearts, hunger, happiness, last_interaction) VALUES (1, 1, 70, 80, ?)',
      new Date().toISOString(),
    );
  }
}

export async function getAppDataSnapshot(db: SQLiteDatabase): Promise<AppDataSnapshot> {
  const profile =
    (await db.getFirstAsync<UserProfile>('SELECT id, name FROM user_profile WHERE id = 1')) ?? {
      id: 1,
      name: DEFAULT_PROFILE_NAME,
    };

  const memories = await db.getAllAsync<MemoryItem>(
    'SELECT id, image_uri as imageUri, person_name as personName, relationship FROM memories ORDER BY id DESC',
  );

  const remindersRaw = await db.getAllAsync<{
    id: number;
    title: string;
    period: string;
    hour: number;
    minute: number;
    enabled: number;
  }>(
    'SELECT id, title, period, hour, minute, enabled FROM reminders ORDER BY hour, minute',
  );

  const petStatus =
    (await db.getFirstAsync<PetStatus>(
      'SELECT id, hearts, hunger, happiness, last_interaction as lastInteraction FROM pet_status WHERE id = 1',
    )) ?? {
      id: 1,
      hearts: 0,
      hunger: 70,
      happiness: 70,
      lastInteraction: new Date().toISOString(),
    };

  return {
    profile,
    memories,
    reminders: remindersRaw.map((reminder) => ({
      ...reminder,
      enabled: Boolean(reminder.enabled),
    })),
    petStatus,
  };
}

export async function saveProfile(db: SQLiteDatabase, name: string) {
  await db.runAsync(
    'INSERT INTO user_profile (id, name) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name',
    name,
  );
}

export async function addMemory(
  db: SQLiteDatabase,
  input: Omit<MemoryItem, 'id'>,
) {
  await db.runAsync(
    'INSERT INTO memories (image_uri, person_name, relationship) VALUES (?, ?, ?)',
    input.imageUri,
    input.personName,
    input.relationship,
  );
}

export async function updateReminder(db: SQLiteDatabase, reminder: ReminderItem) {
  await db.runAsync(
    'UPDATE reminders SET title = ?, period = ?, hour = ?, minute = ?, enabled = ? WHERE id = ?',
    reminder.title,
    reminder.period,
    reminder.hour,
    reminder.minute,
    reminder.enabled ? 1 : 0,
    reminder.id,
  );
}

export async function updatePetStatus(db: SQLiteDatabase, petStatus: PetStatus) {
  await db.runAsync(
    'UPDATE pet_status SET hearts = ?, hunger = ?, happiness = ?, last_interaction = ? WHERE id = 1',
    petStatus.hearts,
    petStatus.hunger,
    petStatus.happiness,
    petStatus.lastInteraction,
  );
}
