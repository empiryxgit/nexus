import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCreditStore } from '../../stores/creditStore';
import { useOpportunityStore } from '../../stores/opportunityStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { OPPORTUNITY_CATEGORIES, CREDIT_ACTIONS } from '../../data/mockData';
import { ArrowLeft, ArrowRight, Check, Coins, X } from 'lucide-react';

export default function CreateOpportunity() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [created, setCreated] = useState(false);
  const [newOppId, setNewOppId] = useState(null);

  const { user } = useAuthStore();
  const { spendCredits, canAfford, totalCredits } = useCreditStore();
  const { createOpportunity } = useOpportunityStore();
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  const cost = CREDIT_ACTIONS.create_opportunity.cost;
  const canCreate = canAfford('create_opportunity');
  const addTag = () => { if (tagInput.trim() && !tags.includes(tagInput.trim())) { setTags([...tags, tagInput.trim()]); setTagInput(''); } };
  const canNext = () => { if (step === 0) return !!category; if (step === 1) return title.trim() && description.trim(); return true; };

  const handleCreate = () => {
    if (!canCreate) return;
    spendCredits('create_opportunity', `Created: ${title}`);
    const opp = createOpportunity({
      creatorId: user?.profileId, creatorName: user?.profile?.name || user?.name || 'You',
      creatorType: user?.type || 'startup', category, title, description, tags,
    });
    setNewOppId(opp.id); setCreated(true);
    addNotification({ type: 'opportunity', title: 'Opportunity created', message: `"${title}" is now live.` });
  };

  if (created) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', paddingTop: 'var(--space-16)' }}>
        <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-full)', background: 'var(--bg-green-light)', border: '2px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-5)' }}>
          <Check size={24} color="var(--green)" />
        </div>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>Opportunity Created</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>Nexus is matching you with relevant ecosystem participants.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button onClick={() => navigate(`/opportunities/${newOppId}`)} className="btn btn-primary">View Opportunity</button>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 2 }}>Create Opportunity</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>Describe what you need and let the ecosystem come to you</p>

      {/* Steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
        {['Category', 'Details', 'Confirm'].map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div className={`step-dot ${i < step ? 'step-dot-completed' : i === step ? 'step-dot-active' : ''}`}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            <span className={`step-label ${i === step ? 'step-label-active' : ''}`}>{label}</span>
            {i < 2 && <div className={`step-line ${i < step ? 'step-line-completed' : ''}`} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)' }}>What are you looking for?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
            {OPPORTUNITY_CATEGORIES.map(cat => (
              <div key={cat.id} onClick={() => setCategory(cat.id)} className="card"
                style={{
                  cursor: 'pointer', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
                  borderColor: category === cat.id ? 'var(--blue)' : undefined,
                  background: category === cat.id ? 'var(--bg-blue-light)' : undefined,
                }} id={`create-cat-${cat.id}`}
              >
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
                  {cat.emoji || '📋'}
                </div>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="input-group"><label className="input-label">Title *</label>
            <input className="input" placeholder="e.g. Seeking healthcare AI investors for seed round" value={title} onChange={e => setTitle(e.target.value)} id="create-title" />
          </div>
          <div className="input-group"><label className="input-label">Description *</label>
            <textarea className="input textarea" placeholder="Describe what you're looking for..." value={description} onChange={e => setDescription(e.target.value)} style={{ minHeight: 120 }} id="create-desc" />
          </div>
          <div className="input-group"><label className="input-label">Tags</label>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input className="input" placeholder="Type and press Enter" value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} style={{ flex: 1 }} />
              <button className="btn btn-secondary btn-sm" onClick={addTag}>Add</button>
            </div>
            {tags.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                {tags.map(t => <span key={t} className="tag" style={{ cursor: 'pointer' }} onClick={() => setTags(tags.filter(x => x !== t))}>{t} <X size={10} style={{ marginLeft: 3 }} /></span>)}
              </div>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>Preview</h3>
            <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span className="badge badge-info badge-dot" style={{ marginBottom: 6, display: 'inline-flex' }}>
                {OPPORTUNITY_CATEGORIES.find(c => c.id === category)?.label || category}
              </span>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', marginBottom: 4 }}>{title}</h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 8 }}>{description}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
            </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
            <span style={{ fontSize: 'var(--text-sm)' }}>Cost</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}><Coins size={14} /> {cost} credits</span>
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'right', marginTop: 6 }}>
            Balance: {totalCredits()} credits {!canCreate && <span style={{ color: 'var(--red)' }}>(insufficient)</span>}
          </div>
        </div>
      )}

      {/* Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-6)' }}>
        <button className="btn btn-ghost" onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}>
          <ArrowLeft size={14} /> {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < 2 ? (
          <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canNext()} id="create-next">Continue <ArrowRight size={14} /></button>
        ) : (
          <button className="btn btn-primary" onClick={handleCreate} disabled={!canCreate} id="create-submit"><Coins size={14} /> Create Opportunity</button>
        )}
      </div>
    </div>
  );
}
