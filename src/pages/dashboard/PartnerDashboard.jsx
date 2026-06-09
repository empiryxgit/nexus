import { useAuthStore } from '../../stores/authStore';
import { useCreditStore } from '../../stores/creditStore';
import { useOpportunityStore } from '../../stores/opportunityStore';
import { Link } from 'react-router-dom';
import { Users, Handshake, Coins, BarChart3, ChevronRight, Search, Eye, MessageSquare } from 'lucide-react';

export default function PartnerDashboard() {
  const { user } = useAuthStore();
  const totalCredits = useCreditStore(s => s.totalCredits());
  const { opportunities } = useOpportunityStore();

  const partnerCategories = ['seeking_legal', 'seeking_agency', 'seeking_recruiter', 'seeking_accelerator'];
  const leadOpps = opportunities.filter(o => partnerCategories.includes(o.category) && o.status === 'active');

  const stats = [
    { icon: Users, label: 'Lead Pipeline', value: leadOpps.length },
    { icon: Handshake, label: 'Active Engagements', value: 3 },
    { icon: Coins, label: 'Credits', value: totalCredits },
    { icon: BarChart3, label: 'Response Rate', value: '72%' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 2 }}>
            {user?.profile?.name || 'Partner'} Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            {user?.profile?.tagline || 'Manage your leads and engagement'}
          </p>
        </div>
        <span className="badge badge-partner">{user?.profile?.partnerType || 'Partner'}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-2)' }}>
              <s.icon size={16} color="var(--text-muted)" />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-6)' }}>
        <Link to="/profile" className="btn btn-primary">Boost Profile</Link>
        <Link to="/opportunities" className="btn btn-secondary"><Search size={14} /> Browse Opportunities</Link>
        <button className="btn btn-secondary"><MessageSquare size={14} /> Talk to Nexi</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: 'var(--space-6)' }}>
        {/* Lead Pipeline */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)' }}>Lead Pipeline</h2>
            <Link to="/opportunities" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 2 }}>View All <ChevronRight size={12} /></Link>
          </div>
          {leadOpps.length === 0 ? (
            <div className="card empty-state">
              <p className="empty-state-title">No leads yet</p>
              <p className="empty-state-desc">New leads will appear when startups create matching opportunities.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {leadOpps.map(opp => (
                <Link key={opp.id} to={`/opportunities/${opp.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card card-interactive" style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span className="badge badge-info badge-dot">{opp.stage}</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>by {opp.creatorName}</span>
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', marginBottom: 6 }}>{opp.title}</div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          {opp.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
                        </div>
                      </div>
                      <button className="btn btn-outline-brand btn-sm" onClick={e => e.preventDefault()}>Respond</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Visibility */}
        <div>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>Service Visibility</h3>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { icon: Eye, label: 'Profile Views', value: '142' },
                { icon: Search, label: 'Search Appearances', value: '89' },
                { icon: BarChart3, label: 'Partner Ranking', value: '#12' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <item.icon size={14} /> {item.label}
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
