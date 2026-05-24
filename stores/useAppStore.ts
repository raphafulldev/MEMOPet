import { create } from 'zustand';

import type { AppDataSnapshot, MemoryItem, PetStatus, ReminderItem, UserProfile } from '../types';

type AppState = {
  isReady: boolean;
  profile: UserProfile;
  memories: MemoryItem[];
  reminders: ReminderItem[];
  petStatus: PetStatus;
  hydrate: (payload: AppDataSnapshot) => void;
  setProfile: (profile: UserProfile) => void;
  setMemories: (memories: MemoryItem[]) => void;
  setReminders: (reminders: ReminderItem[]) => void;
  rewardPet: (mode: 'pet' | 'feed' | 'quiz') => PetStatus;
};

const initialPetStatus: PetStatus = {
  id: 1,
  hearts: 0,
  hunger: 70,
  happiness: 70,
  lastInteraction: new Date().toISOString(),
};

export const useAppStore = create<AppState>((set, get) => ({
  isReady: false,
  profile: {
    id: 1,
    name: 'Dona Maria',
  },
  memories: [],
  reminders: [],
  petStatus: initialPetStatus,
  hydrate: (payload) =>
    set({
      ...payload,
      isReady: true,
    }),
  setProfile: (profile) => set({ profile }),
  setMemories: (memories) => set({ memories }),
  setReminders: (reminders) => set({ reminders }),
  rewardPet: (mode) => {
    const current = get().petStatus;
    const boost = mode === 'quiz' ? 10 : 6;
    const nextStatus = {
      ...current,
      hearts: current.hearts + 1,
      hunger: Math.min(100, current.hunger + (mode === 'feed' ? 12 : 2)),
      happiness: Math.min(100, current.happiness + boost),
      lastInteraction: new Date().toISOString(),
    };

    set({ petStatus: nextStatus });
    return nextStatus;
  },
}));
