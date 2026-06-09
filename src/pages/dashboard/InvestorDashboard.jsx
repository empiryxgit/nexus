import { useAuthStore } from '../../stores/authStore';
import { useOpportunityStore } from '../../stores/opportunityStore';
import { Link } from 'react-router-dom';
import { Inbox, Heart, Link as LinkIcon, Briefcase, ArrowUpRight, ChevronRight, Filter, MessageSquare } from 'lucide-react';

const pipelineStages = [
  { id: 'new', label: 'New' },
  { id: 'interested', label: 'Interested' },
  { id: 'review', label: 'In Review' },
  { id: 'connected', label: 'Connected' },
];

export default function InvestorDashboard() {
  const { user } = useAuthStore();
  const { opportunities } = useOpportunityStore();

  const startupOpps = opportunities.filter(o => o.creatorType === 'startup' && o.status === 'active');
  const interestedOpps = startupOpps.filter(o => o.interestedParties.includes(user?.profileId));

  const stats = [
    { icon: Inbox, label: 'New Opportunities', value: startupOpps.length },
    { icon: Heart, label: 'Expressed Interest', value: interestedOpps.length },
    { icon: LinkIcon, label: 'Introductions', value: 3 },
    { icon: Briefcase, label: 'Portfolio Size', value: user?.profile?.portfolioSize || 24 },
  ];

  const pipelineCounts = {
    new: startupOpps.filter(o => !o.interestedParties.includes(user?.profileId)).length,
    interested: interestedOpps.filter(o => o.stage !== 'review' && o.stage !== 'connected').length,
    review: interestedOpps.filter(o => o.stage === 'review').length,
    connected: opportunities.filter(o => o.stage === 'connected').length,
  };

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 2 }}>Deal Flow</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          {user?.profile?.firm || 'Your Firm'} · {user?.profile?.portfolioSize || 0} portfolio companies
        </p>
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
        <Link to="/opportunities" className="btn btn-primary"><Filter size={14} /> Browse Opportunities</Link>
        <button className="btn btn-secondary"><MessageSquare size={14} /> Ask Nexi</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Pipeline */}
        <div>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>Pipeline</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
            {pipelineStages.map(stage => (
              <div key={stage.id} className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', marginBottom: 2 }}>{pipelineCounts[stage.id]}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{stage.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Incoming */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)' }}>Incoming Opportunities</h2>
            <Link to="/opportunities" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 2 }}>View All <ChevronRight size={12} /></Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {startupOpps.slice(0, 4).map(opp => (
              <Link key={opp.id} to={`/opportunities/${opp.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card card-interactive" style={{ padding: '10px 14px' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>{opp.creatorName}</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', marginBottom: 6 }}>{opp.title}</div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {opp.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
