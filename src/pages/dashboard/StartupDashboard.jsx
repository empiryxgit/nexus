import { useAuthStore } from '../../stores/authStore';
import { useCreditStore } from '../../stores/creditStore';
import { useOpportunityStore } from '../../stores/opportunityStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { investorProfiles } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { Coins, Target, Users, Handshake, Plus, MessageSquare, ArrowUpRight, Clock, Zap, Star, Eye, ChevronRight } from 'lucide-react';

export default function StartupDashboard() {
  const { user } = useAuthStore();
  const totalCredits = useCreditStore(s => s.totalCredits());
  const { opportunities } = useOpportunityStore();
  const { notifications } = useNotificationStore();

  const myOpps = opportunities.filter(o => o.creatorId === user?.profileId);
  const activeOpps = myOpps.filter(o => o.status === 'active');
  const totalMatches = myOpps.reduce((s, o) => s + o.matchCount, 0);
  const totalIntros = myOpps.reduce((s, o) => s + o.introductionCount, 0);

  const stats = [
    { label: 'Credits', value: totalCredits, icon: Coins },
    { label: 'Active Opportunities', value: activeOpps.length, icon: Target },
    { label: 'Matches', value: totalMatches, icon: Users },
    { label: 'Introductions', value: totalIntros, icon: Handshake },
  ];

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 2 }}>
          Welcome back, {user?.profile?.name || 'Founder'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          {user?.profile?.tagline || 'Your startup dashboard'}
        </p>
      </div>

      {/* Stats */}
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

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-6)' }}>
        <Link to="/opportunities/create" className="btn btn-primary"><Plus size={14} /> Create Opportunity</Link>
        <button className="btn btn-secondary"><MessageSquare size={14} /> Talk to Nexi</button>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: 'var(--space-6)' }}>
        {/* Active Opportunities */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)' }}>Active Opportunities</h2>
            <Link to="/opportunities" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 2 }}>View All <ChevronRight size={12} /></Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {activeOpps.length === 0 ? (
              <div className="card empty-state">
                <p className="empty-state-title">No active opportunities</p>
                <p className="empty-state-desc">Create your first opportunity to start connecting.</p>
                <Link to="/opportunities/create" className="btn btn-primary" style={{ marginTop: 'var(--space-3)' }}><Plus size={14} /> Create</Link>
              </div>
            ) : (
              activeOpps.map(opp => (
                <Link key={opp.id} to={`/opportunities/${opp.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card card-interactive" style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span className={`badge badge-${opp.stage === 'connected' ? 'success' : 'info'} badge-dot`}>{opp.stage}</span>
                          {opp.boosted && <span className="badge badge-warning"><Zap size={10} /> Boosted</span>}
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>{opp.title}</div>
                      </div>
                      <ArrowUpRight size={14} color="var(--text-muted)" />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Users size={11} /> {opp.matchCount}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={11} /> {opp.interestCount}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Handshake size={11} /> {opp.introductionCount}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Recent Matches */}
          <div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>Recent Matches</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {investorProfiles.slice(0, 3).map(inv => (
                <div key={inv.id} className="card" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="avatar avatar-investor">{inv.initials}</div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }} className="truncate">{inv.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }} className="truncate">{inv.firm}</div>
                  </div>
                  <span className="badge badge-investor" style={{ fontSize: '10px' }}>{inv.investorType}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {notifications.slice(0, 4).map(n => (
                <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border-default)' }}>
                  <div style={{ width: 5, height: 5, borderRadius: 'var(--radius-full)', background: n.read ? 'var(--text-muted)' : 'var(--blue)', marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)' }}>{n.title}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}><Clock size={10} /> Recently</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
