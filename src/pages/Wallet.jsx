import { useState } from 'react';
import { useCreditStore } from '../stores/creditStore';
import { CREDIT_ACTIONS, CREDIT_PACKS } from '../data/mockData';
import { Coins, Clock, ShoppingCart, ArrowUpRight, ArrowDownRight, Check, Package } from 'lucide-react';

export default function Wallet() {
  const { subscriptionCredits, purchasedCredits, transactions, purchasePack, totalCredits } = useCreditStore();
  const total = totalCredits();
  const [toast, setToast] = useState(null);

  const handlePurchase = (packId) => {
    purchasePack(packId);
    const pack = CREDIT_PACKS.find(p => p.id === packId);
    setToast(`${pack.name} purchased! ${pack.credits} credits added.`);
    setTimeout(() => setToast(null), 3000);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div>
      {toast && <div className="toast toast-success"><Check size={14} color="var(--green)" /><span>{toast}</span></div>}

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 2 }}>Credit Wallet</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Manage your ecosystem credits</p>
      </div>

      {/* Balance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <div className="card" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>Total Balance</div>
          <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--weight-bold)' }}>{total}</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Coins size={14} color="var(--text-muted)" />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Subscription</span>
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 4 }}>{subscriptionCredits}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            <Clock size={11} /> Refreshes monthly · 90-day expiry
          </div>
          <div className="progress-bar" style={{ marginTop: 8 }}><div className="progress-fill" style={{ width: `${Math.min((subscriptionCredits / 250) * 100, 100)}%` }} /></div>
        </div>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <ShoppingCart size={14} color="var(--text-muted)" />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Purchased</span>
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 4 }}>{purchasedCredits}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Never expire</div>
        </div>
      </div>

      {/* Credit Actions */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>Credit Actions</h2>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Action</th><th>Cost</th></tr></thead>
            <tbody>
              {Object.entries(CREDIT_ACTIONS).map(([key, action]) => (
                <tr key={key}><td>{action.label}</td><td><span className="credit-cost">⬡ {action.cost}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buy Packs */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>Buy Credit Packs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
          {CREDIT_PACKS.map(pack => (
            <div key={pack.id} className="card" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', marginBottom: 2 }}>{pack.name}</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', marginBottom: 2 }}>{pack.credits}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>credits</div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 2 }}>${pack.price}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>${(pack.price / pack.credits).toFixed(2)}/credit</div>
              <button className="btn btn-secondary w-full" onClick={() => handlePurchase(pack.id)} id={`buy-${pack.id}`}>Purchase</button>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>Transactions</h2>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Balance</th></tr></thead>
            <tbody>
              {transactions.slice(0, 10).map(tx => (
                <tr key={tx.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(tx.date)}</td>
                  <td>{tx.description}</td>
                  <td><span style={{ display: 'flex', alignItems: 'center', gap: 3, color: tx.amount > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 'var(--weight-medium)' }}>
                    {tx.amount > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{tx.amount > 0 ? '+' : ''}{tx.amount}
                  </span></td>
                  <td style={{ fontWeight: 'var(--weight-medium)' }}>{tx.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
