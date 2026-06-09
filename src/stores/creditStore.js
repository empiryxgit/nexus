import { create } from 'zustand';
import { sampleTransactions, CREDIT_ACTIONS, CREDIT_PACKS } from '../data/mockData';

export const useCreditStore = create((set, get) => ({
  subscriptionCredits: 220,
  purchasedCredits: 30,
  transactions: [...sampleTransactions],

  totalCredits: () => {
    const { subscriptionCredits, purchasedCredits } = get();
    return subscriptionCredits + purchasedCredits;
  },

  canAfford: (actionId) => {
    const cost = CREDIT_ACTIONS[actionId]?.cost || 0;
    return get().totalCredits() >= cost;
  },

  spendCredits: (actionId, description) => {
    const { subscriptionCredits, purchasedCredits, transactions } = get();
    const cost = CREDIT_ACTIONS[actionId]?.cost || 0;
    const total = subscriptionCredits + purchasedCredits;

    if (total < cost) return false;

    let newSubCredits = subscriptionCredits;
    let newPurchCredits = purchasedCredits;

    // Use subscription credits first
    if (newSubCredits >= cost) {
      newSubCredits -= cost;
    } else {
      const remaining = cost - newSubCredits;
      newSubCredits = 0;
      newPurchCredits -= remaining;
    }

    const newTransaction = {
      id: `t${Date.now()}`,
      action: actionId,
      amount: -cost,
      balance: newSubCredits + newPurchCredits,
      description: description || CREDIT_ACTIONS[actionId]?.label,
      date: new Date().toISOString(),
    };

    set({
      subscriptionCredits: newSubCredits,
      purchasedCredits: newPurchCredits,
      transactions: [newTransaction, ...transactions],
    });

    return true;
  },

  purchasePack: (packId) => {
    const pack = CREDIT_PACKS.find(p => p.id === packId);
    if (!pack) return false;

    const { purchasedCredits, subscriptionCredits, transactions } = get();
    const newPurchCredits = purchasedCredits + pack.credits;

    const newTransaction = {
      id: `t${Date.now()}`,
      action: 'credit_purchase',
      amount: pack.credits,
      balance: subscriptionCredits + newPurchCredits,
      description: `Purchased ${pack.name} (${pack.credits} credits)`,
      date: new Date().toISOString(),
    };

    set({
      purchasedCredits: newPurchCredits,
      transactions: [newTransaction, ...transactions],
    });

    return true;
  },

  setCredits: (sub, purch) => {
    set({ subscriptionCredits: sub, purchasedCredits: purch });
  },
}));
