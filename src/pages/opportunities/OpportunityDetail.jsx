import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCreditStore } from '../../stores/creditStore';
import { useOpportunityStore } from '../../stores/opportunityStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { LIFECYCLE_STAGES, startupProfiles, investorProfiles, partnerProfiles } from '../../data/mockData';
import { ArrowLeft, Users, Eye, Handshake, Zap, Star, Heart, Check, Coins, Calendar, Crown, Shield } from 'lucide-react';

const allProfiles = [...startupProfiles, ...investorProfiles, ...partnerProfiles];

export default function OpportunityDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { spendCredits, canAfford, totalCredits } = useCreditStore();
  const { getOpportunity, expressInterest, boostOpportunity, featureOpportunity, requestIntroduction } = useOpportunityStore();
  const { addNotification } = useNotificationStore();
  const [toast, setToast] = useState(null);

  const opp = getOpportunity(id);
  if (!opp) return (
    <div className="empty-state" style={{ padding: 'var(--space-16)' }}>
      <p className="empty-state-title">Opportunity not found</p>
      <Link to="/opportunities" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Back</Link>
    </div>
  );

  const isCreator = opp.creatorId === user?.profileId;
  const matchedProfiles = opp.interestedParties.map(pid => allProfiles.find(p => p.id === pid)).filter(Boolean);
  const stageIndex = LIFECYCLE_STAGES.findIndex(s => s.id === opp.stage);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handleAction = (actionId, label, storeFn, ...args) => {
    if (!canAfford(actionId)) { showToast('Insufficient credits', 'error'); return; }
    spendCredits(actionId, `${label}: ${opp.title}`);
    storeFn(...args);
    addNotification({ type: 'opportunity', title: label, message: `Action completed for: ${opp.title}` });
    showToast(`${label}! Credits deducted.`);
  };

  return (
    <div>
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? <Check size={14} color="var(--green)" /> : <Shield size={14} color="var(--red)" />}
          <span>{toast.msg}</span>
        </div>
      )}

      <Link to="/opportunities" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
        <ArrowLeft size={14} /> Back to Opportunities
      </Link>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span className={`badge badge-${opp.status === 'active' ? 'success' : 'error'} badge-dot`}>{opp.status}</span>
            {opp.featured && <span className="badge badge-brand"><Star size={10} /> Featured</span>}
            {opp.boosted && <span className="badge badge-warning"><Zap size={10} /> Boosted</span>}
          </div>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 6, lineHeight: 'var(--leading-tight)' }}>{opp.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div className={`avatar avatar-sm avatar-${opp.creatorType}`}>{opp.creatorName[0]}</div>
              {opp.creatorName}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> {opp.createdAt}</span>
          </div>

          {/* Lifecycle */}
          <div style={{ padding: 'var(--space-4)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', overflowX: 'auto', marginBottom: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 500 }}>
              {LIFECYCLE_STAGES.map((stage, i) => (
                <div key={stage.id} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: 56 }}>
                    <div className={`step-dot ${i < stageIndex ? 'step-dot-completed' : i === stageIndex ? 'step-dot-active' : ''}`} style={{ width: 20, height: 20, fontSize: '10px' }}>
                      {i < stageIndex ? <Check size={10} /> : i + 1}
                    </div>
                    <span style={{ fontSize: '10px', color: i === stageIndex ? 'var(--blue)' : 'var(--text-muted)' }}>{stage.label}</span>
                  </div>
                  {i < LIFECYCLE_STAGES.length - 1 && <div className={`step-line ${i < stageIndex ? 'step-line-completed' : ''}`} style={{ minWidth: 10 }} />}
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>{opp.description}</p>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {opp.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>

        {/* Stats + Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
            {[
              { icon: Users, label: 'Matches', value: opp.matchCount },
              { icon: Eye, label: 'Interested', value: opp.interestCount },
              { icon: Handshake, label: 'Intros', value: opp.introductionCount },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                <s.icon size={16} color="var(--text-muted)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)' }}>{s.value}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {!isCreator ? (
                <>
                  <button className="btn btn-primary w-full" onClick={() => handleAction('express_interest', 'Interest expressed', expressInterest, opp.id, user?.profileId)} id="opp-express-interest">
                    <Heart size={14} /> Express Interest <span className="credit-cost" style={{ marginLeft: 'auto' }}><Coins size={11} /> 2</span>
                  </button>
                  <button className="btn btn-secondary w-full" onClick={() => handleAction('request_introduction', 'Introduction requested', requestIntroduction, opp.id)} id="opp-request-intro">
                    <Handshake size={14} /> Request Introduction <span className="credit-cost" style={{ marginLeft: 'auto' }}><Coins size={11} /> 10</span>
                  </button>
                  <button className="btn btn-outline-brand w-full" onClick={() => handleAction('priority_introduction', 'Priority introduction', requestIntroduction, opp.id)} id="opp-priority-intro">
                    <Crown size={14} /> Priority Introduction <span className="credit-cost" style={{ marginLeft: 'auto' }}><Coins size={11} /> 25</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-primary w-full" onClick={() => handleAction('opportunity_boost', 'Opportunity boosted', boostOpportunity, opp.id)} disabled={opp.boosted}>
                    <Zap size={14} /> {opp.boosted ? 'Already Boosted' : 'Boost'} {!opp.boosted && <span className="credit-cost" style={{ marginLeft: 'auto' }}><Coins size={11} /> 25</span>}
                  </button>
                  <button className="btn btn-secondary w-full" onClick={() => handleAction('featured_opportunity', 'Opportunity featured', featureOpportunity, opp.id)} disabled={opp.featured}>
                    <Star size={14} /> {opp.featured ? 'Already Featured' : 'Feature'} {!opp.featured && <span className="credit-cost" style={{ marginLeft: 'auto' }}><Coins size={11} /> 50</span>}
                  </button>
                </>
              )}
            </div>
            <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'center' }}>Balance: {totalCredits()} credits</div>
          </div>
        </div>

        {/* Interested Parties */}
        {matchedProfiles.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)' }}>
              Interested Parties ({matchedProfiles.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {matchedProfiles.map(p => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
                }}>
                  <div className={`avatar avatar-${p.type}`}>{p.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>{p.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{p.firm || p.tagline || p.partnerType || ''}</div>
                  </div>
                  {isCreator && (
                    <button className="btn btn-outline-brand btn-sm" onClick={() => handleAction('request_introduction', 'Introduction requested', requestIntroduction, opp.id)}>
                      <Handshake size={12} /> Intro
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
