import { Link } from 'react-router-dom';
import {
  Lightbulb, FileText, Search, Heart, Handshake,
  ChevronRight, Rocket, TrendingUp, Building2,
  ArrowRight, Check,
} from 'lucide-react';

const flowSteps = [
  { icon: Lightbulb, label: 'Intent', desc: 'Express your need' },
  { icon: FileText, label: 'Opportunity', desc: 'Structured request' },
  { icon: Search, label: 'Matching', desc: 'AI-powered matching' },
  { icon: Heart, label: 'Interest', desc: 'Mutual engagement' },
  { icon: Handshake, label: 'Introduction', desc: 'Connected' },
];

const userTypes = [
  {
    icon: Rocket, title: 'For Startups',
    desc: 'Find investors, advisors, agencies, and accelerators. Stop cold outreach — let opportunities come to you.',
    features: ['Raise funding', 'Find service providers', 'Join accelerators', 'Discover grants'],
  },
  {
    icon: TrendingUp, title: 'For Investors',
    desc: 'Receive curated deal flow matched to your thesis. No more drowning in unqualified pitches.',
    features: ['Curated deal flow', 'Sector-matched startups', 'Qualified introductions', 'Portfolio discovery'],
  },
  {
    icon: Building2, title: 'For Partners',
    desc: 'Agencies, law firms, recruiters, accelerators — gain visibility when startups need your services.',
    features: ['Warm lead generation', 'Targeted opportunities', 'Referral tracking', 'Service visibility'],
  },
];

const stats = [
  { value: '100+', label: 'Startups' },
  { value: '25+', label: 'Investors' },
  { value: '50+', label: 'Partners' },
  { value: '500+', label: 'Opportunities Created' },
];

export default function Landing() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-default)',
      }}>
        <div style={{
          maxWidth: 960, margin: '0 auto', padding: '0 var(--space-6)',
          height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', letterSpacing: '-0.01em' }}>Nexus</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
            <a href="#how-it-works" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>How It Works</a>
            <a href="#who" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Who It's For</a>
            <Link to="/pricing" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Pricing</Link>
            <Link to="/onboarding" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: 640, margin: '0 auto',
        padding: 'var(--space-20) var(--space-6) var(--space-16)',
        textAlign: 'center',
      }}>
        <span className="hero-badge">Relationship Intelligence Platform</span>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          marginBottom: 'var(--space-4)',
          color: 'var(--text-primary)',
        }}>
          The operating system for startup ecosystems
        </h1>
        <p style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--text-secondary)',
          maxWidth: 480, margin: '0 auto var(--space-8)',
          lineHeight: 'var(--leading-relaxed)',
        }}>
          Stop searching. Start connecting. Nexus transforms your intent into
          qualified introductions with investors, partners, and opportunities.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/onboarding" className="btn btn-primary btn-lg" id="hero-cta-start">
            Get Started <ArrowRight size={16} />
          </Link>
          <Link to="/opportunities" className="btn btn-secondary btn-lg" id="hero-cta-explore">
            Explore Opportunities
          </Link>
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-default)', maxWidth: 960, margin: '0 auto' }} />

      {/* How It Works */}
      <section id="how-it-works" className="landing-section">
        <p className="text-caption" style={{ marginBottom: 'var(--space-1)', textAlign: 'center' }}>HOW IT WORKS</p>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          From intent to introduction
        </h2>

        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          gap: 0, flexWrap: 'wrap',
        }}>
          {flowSteps.map((step, i) => (
            <div key={step.label} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div className="flow-step" style={{ minWidth: 120, maxWidth: 140 }}>
                <div className="flow-step-icon" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                  <step.icon size={20} />
                </div>
                <div style={{ fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-sm)' }}>{step.label}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{step.desc}</div>
              </div>
              {i < flowSteps.length - 1 && (
                <div className="flow-step-arrow" style={{ paddingTop: 12 }}>
                  <ChevronRight size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-default)', maxWidth: 960, margin: '0 auto' }} />

      {/* Who It's For */}
      <section id="who" className="landing-section">
        <p className="text-caption" style={{ marginBottom: 'var(--space-1)', textAlign: 'center' }}>WHO IT'S FOR</p>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          Built for every ecosystem participant
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-5)',
        }}>
          {userTypes.map(type => (
            <div key={type.title} className="card" style={{ padding: 'var(--space-6)' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 'var(--space-4)',
              }}>
                <type.icon size={20} />
              </div>
              <h3 style={{
                fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)',
                marginBottom: 'var(--space-2)',
              }}>{type.title}</h3>
              <p style={{
                fontSize: 'var(--text-sm)', color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)',
              }}>{type.desc}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {type.features.map(f => (
                  <li key={f} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 'var(--text-sm)', color: 'var(--text-secondary)',
                  }}>
                    <Check size={14} color="var(--green)" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-default)', maxWidth: 960, margin: '0 auto' }} />

      {/* Stats */}
      <section className="landing-section">
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-6)', textAlign: 'center',
        }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>{s.value}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-default)', maxWidth: 960, margin: '0 auto' }} />

      {/* Bottom CTA */}
      <section className="landing-section" style={{ textAlign: 'center', paddingBottom: 'var(--space-20)' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-3)' }}>
          Ready to join the ecosystem?
        </h2>
        <p style={{
          fontSize: 'var(--text-base)', color: 'var(--text-secondary)',
          maxWidth: 400, margin: '0 auto var(--space-6)',
        }}>
          Create your profile in minutes. Start connecting with the right people today.
        </p>
        <Link to="/onboarding" className="btn btn-primary btn-lg" id="bottom-cta">
          Get Started <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-default)',
        padding: 'var(--space-6)',
        textAlign: 'center',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
      }}>
        © 2025 Nexus
      </footer>
    </div>
  );
}
