export type UserProfile = {
  id: number;
  name: string;
};

export type MemoryItem = {
  id: number;
  imageUri: string;
  personName: string;
  relationship: string;
};

export type ReminderItem = {
  id: number;
  title: string;
  period: string;
  hour: number;
  minute: number;
  enabled: boolean;
};

export type PetStatus = {
  id: number;
  hearts: number;
  hunger: number;
  happiness: number;
  lastInteraction: string;
};

export type AppDataSnapshot = {
  profile: UserProfile;
  memories: MemoryItem[];
  reminders: ReminderItem[];
  petStatus: PetStatus;
};
