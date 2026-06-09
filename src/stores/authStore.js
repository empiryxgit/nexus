import { create } from 'zustand';
import { demoUsers, startupProfiles, investorProfiles, partnerProfiles } from '../data/mockData';

const getProfileById = (id) => {
  return [...startupProfiles, ...investorProfiles, ...partnerProfiles].find(p => p.id === id);
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isOnboarding: false,

  login: (userId) => {
    const demoUser = demoUsers.find(u => u.id === userId);
    if (demoUser) {
      const profile = getProfileById(demoUser.profileId);
      set({
        user: { ...demoUser, profile },
        isAuthenticated: true,
        isOnboarding: false,
      });
    }
  },

  loginAs: (type) => {
    const demoUser = demoUsers.find(u => u.type === type);
    if (demoUser) {
      const profile = getProfileById(demoUser.profileId);
      set({
        user: { ...demoUser, profile },
        isAuthenticated: true,
        isOnboarding: false,
      });
    }
  },

  startOnboarding: (type) => {
    set({
      user: { type, id: 'new_user', name: '', email: '' },
      isAuthenticated: false,
      isOnboarding: true,
    });
  },

  completeOnboarding: (profileData) => {
    const { user } = get();
    const demoUser = demoUsers.find(u => u.type === user.type) || demoUsers[0];
    const profile = getProfileById(demoUser.profileId);
    set({
      user: { ...demoUser, profile: { ...profile, ...profileData } },
      isAuthenticated: true,
      isOnboarding: false,
    });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, isOnboarding: false });
  },

  updateProfile: (updates) => {
    const { user } = get();
    if (user) {
      set({
        user: {
          ...user,
          profile: { ...user.profile, ...updates },
        },
      });
    }
  },
}));
