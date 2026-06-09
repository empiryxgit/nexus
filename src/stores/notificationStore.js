import { create } from 'zustand';
import { sampleNotifications } from '../data/mockData';

export const useNotificationStore = create((set, get) => ({
  notifications: [...sampleNotifications],

  unreadCount: () => {
    return get().notifications.filter(n => !n.read).length;
  },

  markAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
    }));
  },

  addNotification: (notification) => {
    const newNotification = {
      id: `n${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };
    set(state => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },
}));
