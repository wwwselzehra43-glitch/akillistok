import React from 'react';
import { create } from 'zustand';

interface UserStore {
  userId: string | null;
  userEmail: string | null;
  householdId: string | null;
  setUser: (id: string, email: string, householdId: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userId: null,
  userEmail: null,
  householdId: null,
  setUser: (id, email, householdId) =>
    set({ userId: id, userEmail: email, householdId }),
  clearUser: () =>
    set({ userId: null, userEmail: null, householdId: null }),
}));

interface NotificationStore {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
  }>;
  addNotification: (
    title: string,
    message: string,
    type: 'info' | 'warning' | 'error' | 'success'
  ) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (title, message, type) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Date.now().toString(),
          title,
          message,
          type,
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
