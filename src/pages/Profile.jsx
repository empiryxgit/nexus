import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useCreditStore } from '../stores/creditStore';
import {
  User, MapPin, Globe, Users, Briefcase,
  Edit3, Save, Coins, Check, Rocket, TrendingUp, Tag,
} from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const { canAfford, spendCredits, totalCredits } = useCreditStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  if (!user?.profile) return null;
  const profile = user.profile;
  const isStartup = user.type === 'startup';
  const isInvestor = user.type === 'investor';
  const isPartner = user.type === 'partner';

  const handleEdit = () => { setFormData({ ...profile }); setIsEditing(true); };
  const handleSave = () => { updateProfile(formData); setIsEditing(false); };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 2 }}>Profile</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Manage your ecosystem profile</p>
        </div>
        <button className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`} onClick={isEditing ? handleSave : handleEdit} id="edit-profile-btn">
          {isEditing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit</>}
        </button>
      </div>

      {/* Header Card */}
      <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div className={`avatar avatar-xl avatar-${user.type}`}>{profile.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isEditing ? (
                <input className="input" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }} />
              ) : (
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>{profile.name || 'Your Name'}</h2>
              )}
              <span className={`badge badge-${user.type}`}>{isStartup ? 'Startup' : isInvestor ? 'Investor' : 'Partner'}</span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>
              {isEditing ? (
                <input className="input" value={formData.tagline || formData.role || ''} onChange={e => setFormData({ ...formData, [isInvestor ? 'role' : 'tagline']: e.target.value })} placeholder="Tagline" style={{ width: '100%' }} />
              ) : (profile.tagline || profile.role || 'Add a tagline')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
          {profile.location && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}><MapPin size={13} /> {profile.location}</div>}
          {profile.website && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}><Globe size={13} /> {profile.website}</div>}
          {profile.teamSize && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}><Users size={13} /> {profile.teamSize} team</div>}
          {profile.firm && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}><Briefcase size={13} /> {profile.firm}</div>}
        </div>

        {profile.tags && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{profile.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>}
      </div>

      {/* Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
        <div className="card">
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>About</h3>
          {isEditing ? (
            <textarea className="input textarea" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', minHeight: 100 }} />
          ) : (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
              {profile.description || 'Add a description.'}
            </p>
          )}
        </div>
        <div className="card">
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {isStartup && <>
              <Row label="Stage" value={profile.stage} />
              <Row label="Industry" value={profile.industry} />
              <Row label="Funding" value={profile.fundingStatus} />
            </>}
            {isInvestor && <>
              <Row label="Type" value={profile.investorType} />
              <Row label="Check Size" value={profile.checkSize} />
              <Row label="Portfolio" value={`${profile.portfolioSize} companies`} />
            </>}
            {isPartner && <>
              <Row label="Type" value={profile.partnerType} />
              <Row label="Clients" value={`${profile.clients}+`} />
              <Row label="Services" value={profile.services?.join(', ')} />
            </>}
          </div>
        </div>
      </div>

      {/* Completeness */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>Profile Completeness</h3>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>85%</span>
        </div>
        <div className="progress-bar" style={{ marginBottom: 'var(--space-3)' }}><div className="progress-fill" style={{ width: '85%' }} /></div>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          {[['Basic Info', true], ['Description', true], ['Tags', true], ['Location', true], ['Team Members', false], ['Industry', true]].map(([label, done]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: done ? 'var(--green)' : 'var(--text-muted)' }}>
              {done ? <Check size={11} /> : <div style={{ width: 11, height: 11, borderRadius: 'var(--radius-full)', border: '1.5px solid var(--text-muted)' }} />}
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border-default)' }}>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>{value || '—'}</span>
    </div>
  );
}
