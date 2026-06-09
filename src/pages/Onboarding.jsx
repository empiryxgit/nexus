import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useCreditStore } from '../stores/creditStore';
import { MEMBERSHIP_TIERS } from '../data/mockData';
import {
  Rocket, TrendingUp, Building2, Check, ArrowLeft,
  ArrowRight, ChevronRight,
} from 'lucide-react';

const userTypes = [
  { id: 'startup', icon: Rocket, title: 'Startup', desc: 'Find investors, advisors, and growth resources' },
  { id: 'investor', icon: TrendingUp, title: 'Investor', desc: 'Discover curated deal flow and opportunities' },
  { id: 'partner', icon: Building2, title: 'Ecosystem Partner', desc: 'Connect with startups that need your services' },
];

const industries = ['AI/ML', 'Fintech', 'Healthcare', 'EdTech', 'Climate Tech', 'Cybersecurity', 'SaaS', 'Marketplace', 'Developer Tools', 'Consumer', 'Other'];
const stages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'];
const investorTypes = ['Angel Investor', 'VC Fund', 'Family Office', 'Syndicate', 'Corporate VC'];
const partnerTypes = ['Law Firm', 'Marketing Agency', 'Recruiter', 'Accelerator', 'University', 'Community', 'Accountancy', 'Design Agency'];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [formData, setFormData] = useState({});
  const { completeOnboarding, startOnboarding } = useAuthStore();
  const { setCredits } = useCreditStore();
  const navigate = useNavigate();

  const totalSteps = 4;
  const canNext = () => {
    if (step === 0) return !!selectedType;
    if (step === 1) return formData.name && formData.name.trim() !== '';
    return true;
  };

  const handleNext = () => {
    if (step === 0 && selectedType) startOnboarding(selectedType);
    if (step < totalSteps - 1) setStep(s => s + 1);
  };

  const handleFinish = () => {
    const tier = MEMBERSHIP_TIERS[selectedType]?.find(t => t.id === selectedTier) || MEMBERSHIP_TIERS[selectedType]?.[0];
    completeOnboarding({ ...formData, type: selectedType });
    setCredits(tier?.monthlyCredits || 25, 0);
    navigate('/dashboard');
  };

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
  const tiers = selectedType ? MEMBERSHIP_TIERS[selectedType] || [] : [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header */}
      <div style={{ width: '100%', padding: '12px var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)' }}>
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)' }}>Nexus</span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Step {step + 1} of {totalSteps}</span>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', margin: 'var(--space-8) 0 var(--space-6)' }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div className={`step-dot ${i < step ? 'step-dot-completed' : i === step ? 'step-dot-active' : ''}`}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            {i < totalSteps - 1 && <div className={`step-line ${i < step ? 'step-line-completed' : ''}`} />}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ width: '100%', maxWidth: 720, padding: '0 var(--space-6)', flex: 1 }}>
        {step === 0 && (
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', textAlign: 'center', marginBottom: 'var(--space-2)' }}>
              Welcome to Nexus
            </h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-sm)' }}>
              How do you participate in the startup ecosystem?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
              {userTypes.map(type => (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className="card"
                  style={{
                    cursor: 'pointer', textAlign: 'center', padding: 'var(--space-8) var(--space-4)',
                    borderColor: selectedType === type.id ? 'var(--blue)' : undefined,
                    background: selectedType === type.id ? 'var(--bg-blue-light)' : undefined,
                  }}
                  id={`onboard-type-${type.id}`}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto var(--space-3)',
                  }}>
                    <type.icon size={22} />
                  </div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-1)' }}>{type.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{type.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', textAlign: 'center', marginBottom: 'var(--space-1)' }}>Set Up Your Profile</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
              Tell us about {selectedType === 'investor' ? 'yourself' : 'your organization'}
            </p>
            <div className="card" style={{ maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {selectedType === 'startup' && (
                <>
                  <div className="input-group"><label className="input-label">Company Name *</label><input className="input" placeholder="e.g. NeuralMed" value={formData.name || ''} onChange={e => updateForm('name', e.target.value)} id="onboard-name" /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <div className="input-group"><label className="input-label">Industry</label><select className="input select" value={formData.industry || ''} onChange={e => updateForm('industry', e.target.value)}><option value="">Select...</option>{industries.map(i => <option key={i} value={i}>{i}</option>)}</select></div>
                    <div className="input-group"><label className="input-label">Stage</label><select className="input select" value={formData.stage || ''} onChange={e => updateForm('stage', e.target.value)}><option value="">Select...</option>{stages.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <div className="input-group"><label className="input-label">Team Size</label><input className="input" type="number" placeholder="e.g. 8" value={formData.teamSize || ''} onChange={e => updateForm('teamSize', e.target.value)} /></div>
                    <div className="input-group"><label className="input-label">Location</label><input className="input" placeholder="San Francisco, CA" value={formData.location || ''} onChange={e => updateForm('location', e.target.value)} /></div>
                  </div>
                  <div className="input-group"><label className="input-label">Tagline</label><input className="input" placeholder="One-line description" value={formData.tagline || ''} onChange={e => updateForm('tagline', e.target.value)} /></div>
                </>
              )}
              {selectedType === 'investor' && (
                <>
                  <div className="input-group"><label className="input-label">Full Name *</label><input className="input" placeholder="e.g. David Chen" value={formData.name || ''} onChange={e => updateForm('name', e.target.value)} id="onboard-name" /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <div className="input-group"><label className="input-label">Firm</label><input className="input" placeholder="e.g. Horizon Ventures" value={formData.firm || ''} onChange={e => updateForm('firm', e.target.value)} /></div>
                    <div className="input-group"><label className="input-label">Investor Type</label><select className="input select" value={formData.investorType || ''} onChange={e => updateForm('investorType', e.target.value)}><option value="">Select...</option>{investorTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                  </div>
                  <div className="input-group"><label className="input-label">Check Size</label><input className="input" placeholder="$500K - $2M" value={formData.checkSize || ''} onChange={e => updateForm('checkSize', e.target.value)} /></div>
                </>
              )}
              {selectedType === 'partner' && (
                <>
                  <div className="input-group"><label className="input-label">Organization Name *</label><input className="input" placeholder="e.g. Apex Legal" value={formData.name || ''} onChange={e => updateForm('name', e.target.value)} id="onboard-name" /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <div className="input-group"><label className="input-label">Partner Type</label><select className="input select" value={formData.partnerType || ''} onChange={e => updateForm('partnerType', e.target.value)}><option value="">Select...</option>{partnerTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div className="input-group"><label className="input-label">Location</label><input className="input" placeholder="New York, NY" value={formData.location || ''} onChange={e => updateForm('location', e.target.value)} /></div>
                  </div>
                  <div className="input-group"><label className="input-label">Description</label><textarea className="input textarea" placeholder="Describe your organization..." value={formData.description || ''} onChange={e => updateForm('description', e.target.value)} /></div>
                </>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', textAlign: 'center', marginBottom: 'var(--space-1)' }}>Choose Your Plan</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>Start free. Upgrade when Nexus creates value.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
              {tiers.map((tier, idx) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`pricing-card ${idx === 1 ? 'pricing-card-featured' : ''}`}
                  style={{
                    cursor: 'pointer',
                    borderColor: selectedTier === tier.id ? 'var(--blue)' : undefined,
                    background: selectedTier === tier.id ? 'var(--bg-blue-light)' : undefined,
                  }}
                  id={`onboard-tier-${tier.id}`}
                >
                  {idx === 1 && <span className="pricing-badge">Popular</span>}
                  <div className="pricing-tier">{tier.name}</div>
                  <div className="pricing-price">
                    <span className="pricing-amount">{tier.price === 0 ? 'Free' : `$${tier.price}`}</span>
                    {tier.price > 0 && <span className="pricing-period">/mo</span>}
                  </div>
                  <div className="pricing-credits">{tier.monthlyCredits} credits/month</div>
                  <ul className="pricing-features">
                    {tier.features.map(f => (
                      <li key={f} className="pricing-feature"><Check size={14} /> {f}</li>
                    ))}
                  </ul>
                  <button className={`btn ${selectedTier === tier.id ? 'btn-primary' : 'btn-secondary'} w-full`}>
                    {selectedTier === tier.id ? 'Selected' : tier.price === 0 ? 'Start Free' : 'Select'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', paddingTop: 'var(--space-12)' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 'var(--radius-full)',
              background: 'var(--bg-green-light)', border: '2px solid var(--green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-5)',
            }}>
              <Check size={28} color="var(--green)" />
            </div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
              Welcome to Nexus
            </h1>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto var(--space-6)' }}>
              Your profile is ready. Start creating opportunities and building ecosystem relationships.
            </p>
            <button onClick={handleFinish} className="btn btn-primary btn-lg" id="onboard-finish">
              Go to Dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      {step < 3 && (
        <div style={{
          width: '100%', maxWidth: 720, padding: 'var(--space-6)',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <button className="btn btn-ghost" onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/')}>
            <ArrowLeft size={14} /> {step === 0 ? 'Home' : 'Back'}
          </button>
          <button className="btn btn-primary" onClick={handleNext} disabled={!canNext()} id="onboard-next">
            {step === 2 ? 'Complete Setup' : 'Continue'} <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
