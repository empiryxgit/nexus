import { useOpportunityStore } from '../../stores/opportunityStore';
import { OPPORTUNITY_CATEGORIES } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { Search, Users, Eye, Handshake, Zap, Star, ArrowUpRight } from 'lucide-react';

export default function OpportunityList() {
  const { getFilteredOpportunities, filter, setFilter } = useOpportunityStore();
  const filtered = getFilteredOpportunities();

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 2 }}>Discover Opportunities</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Browse and respond to ecosystem opportunities</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-5)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input className="input" placeholder="Search..." value={filter.search} onChange={e => setFilter('search', e.target.value)}
            style={{ paddingLeft: 30, width: '100%' }} id="opp-search" />
        </div>
        <select className="input select" value={filter.category} onChange={e => setFilter('category', e.target.value)} style={{ width: 180 }} id="opp-category-filter">
          <option value="all">All Categories</option>
          {OPPORTUNITY_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select className="input select" value={filter.status} onChange={e => setFilter('status', e.target.value)} style={{ width: 120 }} id="opp-status-filter">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
        {filtered.length} result{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-4)' }}>
        {filtered.map(opp => (
          <Link key={opp.id} to={`/opportunities/${opp.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card card-interactive" style={{ padding: 'var(--space-5)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-info badge-dot">{opp.stage}</span>
                <span className={`badge badge-${opp.creatorType}`}>{opp.creatorType}</span>
                {opp.featured && <span className="badge badge-brand"><Star size={10} /> Featured</span>}
                {opp.boosted && <span className="badge badge-warning"><Zap size={10} /> Boosted</span>}
              </div>

              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', marginBottom: 4, lineHeight: 'var(--leading-tight)' }}>{opp.title}</h3>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 8 }}>by {opp.creatorName}</div>

              <p style={{
                fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                marginBottom: 'var(--space-3)', flex: 1,
              }}>{opp.description}</p>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
                {opp.tags.slice(0, 4).map(t => <span key={t} className="tag">{t}</span>)}
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', paddingTop: 8, borderTop: '1px solid var(--border-default)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Users size={11} /> {opp.matchCount}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={11} /> {opp.interestCount}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Handshake size={11} /> {opp.introductionCount}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state" style={{ padding: 'var(--space-16)' }}>
          <div className="empty-state-icon"><Search size={20} /></div>
          <p className="empty-state-title">No opportunities found</p>
          <p className="empty-state-desc">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
