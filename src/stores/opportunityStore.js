import { create } from 'zustand';
import { opportunities as seedOpportunities, startupProfiles, investorProfiles, partnerProfiles, OPPORTUNITY_CATEGORIES } from '../data/mockData';

const allProfiles = [...startupProfiles, ...investorProfiles, ...partnerProfiles];

export const useOpportunityStore = create((set, get) => ({
  opportunities: [...seedOpportunities],
  filter: {
    category: 'all',
    status: 'all',
    search: '',
  },

  getOpportunity: (id) => {
    return get().opportunities.find(o => o.id === id);
  },

  getOpportunitiesByCreator: (creatorId) => {
    return get().opportunities.filter(o => o.creatorId === creatorId);
  },

  getFilteredOpportunities: () => {
    const { opportunities, filter } = get();
    let filtered = [...opportunities];

    if (filter.category !== 'all') {
      filtered = filtered.filter(o => o.category === filter.category);
    }
    if (filter.status !== 'all') {
      filtered = filtered.filter(o => o.status === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      filtered = filtered.filter(o =>
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Featured first, then by date
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.boosted && !b.boosted) return -1;
      if (!a.boosted && b.boosted) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return filtered;
  },

  setFilter: (key, value) => {
    set(state => ({
      filter: { ...state.filter, [key]: value },
    }));
  },

  createOpportunity: (data) => {
    const newOpp = {
      id: `opp_${Date.now()}`,
      stage: 'opportunity',
      status: 'active',
      featured: false,
      boosted: false,
      matchCount: 0,
      interestCount: 0,
      introductionCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      interestedParties: [],
      ...data,
    };

    set(state => ({
      opportunities: [newOpp, ...state.opportunities],
    }));

    // Simulate matching after a delay
    setTimeout(() => {
      set(state => ({
        opportunities: state.opportunities.map(o =>
          o.id === newOpp.id
            ? { ...o, stage: 'matching', matchCount: Math.floor(Math.random() * 5) + 1 }
            : o
        ),
      }));
    }, 2000);

    return newOpp;
  },

  expressInterest: (opportunityId, userId) => {
    set(state => ({
      opportunities: state.opportunities.map(o =>
        o.id === opportunityId
          ? {
              ...o,
              interestCount: o.interestCount + 1,
              interestedParties: [...o.interestedParties, userId],
              stage: o.stage === 'notification' || o.stage === 'matching' ? 'interest' : o.stage,
            }
          : o
      ),
    }));
  },

  boostOpportunity: (opportunityId) => {
    set(state => ({
      opportunities: state.opportunities.map(o =>
        o.id === opportunityId ? { ...o, boosted: true } : o
      ),
    }));
  },

  featureOpportunity: (opportunityId) => {
    set(state => ({
      opportunities: state.opportunities.map(o =>
        o.id === opportunityId ? { ...o, featured: true } : o
      ),
    }));
  },

  requestIntroduction: (opportunityId) => {
    set(state => ({
      opportunities: state.opportunities.map(o =>
        o.id === opportunityId
          ? { ...o, introductionCount: o.introductionCount + 1, stage: 'review' }
          : o
      ),
    }));
  },

  getMatchedProfiles: (opportunityId) => {
    const opp = get().getOpportunity(opportunityId);
    if (!opp) return [];
    return opp.interestedParties
      .map(id => allProfiles.find(p => p.id === id))
      .filter(Boolean);
  },

  getActiveCount: (creatorId) => {
    return get().opportunities.filter(o => o.creatorId === creatorId && o.status === 'active').length;
  },

  getCategories: () => OPPORTUNITY_CATEGORIES,
}));
