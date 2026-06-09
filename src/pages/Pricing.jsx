import { useState } from 'react';
import { MEMBERSHIP_TIERS, CREDIT_PACKS } from '../data/mockData';
import { Check, Coins } from 'lucide-react';

const tabOptions = [
  { id: 'startup', label: 'Startups' },
  { id: 'investor', label: 'Investors' },
  { id: 'partner', label: 'Partners' },
];

export default function Pricing() {
  const [activeTab, setActiveTab] = useState('startup');
  const tiers = MEMBERSHIP_TIERS[activeTab] || [];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>Plans & Pricing</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Explore free. Pay when Nexus creates value.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-8)' }}>
        <div className="tabs" style={{ borderBottom: '1px solid var(--border-default)' }}>
          {tabOptions.map(tab => (
            <button key={tab.id} className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)} id={`pricing-tab-${tab.id}`}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Pricing Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)', marginBottom: 'var(--space-16)' }}>
        {tiers.map((tier, i) => (
          <div key={tier.id} className={`pricing-card ${i === 1 ? 'pricing-card-featured' : ''}`}>
            {i === 1 && <span className="pricing-badge">Popular</span>}
            <div className="pricing-tier">{tier.name}</div>
            <div className="pricing-price">
              <span className="pricing-amount">{tier.price === 0 ? 'Free' : `$${tier.price}`}</span>
              {tier.price > 0 && <span className="pricing-period">/mo</span>}
            </div>
            <div className="pricing-credits"><Coins size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />{tier.monthlyCredits} credits/month</div>
            <ul className="pricing-features">
              {tier.features.map(f => <li key={f} className="pricing-feature"><Check size={14} /> {f}</li>)}
              {tier.restrictions && tier.restrictions.map(r => <li key={r} className="pricing-feature" style={{ color: 'var(--text-muted)' }}>✕ {r}</li>)}
            </ul>
            <button className={`btn ${i === 1 ? 'btn-primary' : 'btn-secondary'} w-full`} id={`select-${tier.id}`}>
              {tier.price === 0 ? 'Get Started Free' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 2 }}>Need More Credits?</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Purchase anytime. They never expire.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        {CREDIT_PACKS.map(pack => (
          <div key={pack.id} className="card" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
            <div style={{ fontWeight: 'var(--weight-semibold)', marginBottom: 2 }}>{pack.name}</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)' }}>{pack.credits}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>credits — ${pack.price}</div>
            <button className="btn btn-secondary w-full">Purchase</button>
          </div>
        ))}
      </div>
    </div>
  );
}
