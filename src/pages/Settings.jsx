import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { User, Bell, Moon, Sun, Shield, LogOut } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuthStore();
  const [theme, setTheme] = useState('light');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [matchNotifs, setMatchNotifs] = useState(true);
  const [creditNotifs, setCreditNotifs] = useState(true);

  const Toggle = ({ on, onToggle, id }) => (
    <button onClick={onToggle} id={id} style={{
      width: 36, height: 20, borderRadius: 'var(--radius-full)', position: 'relative', padding: 0,
      background: on ? 'var(--blue)' : 'var(--border-strong)', border: 'none', cursor: 'pointer',
      transition: 'background 80ms',
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: 'var(--radius-full)', background: 'white',
        position: 'absolute', top: 3, left: on ? 19 : 3, transition: 'left 80ms',
      }} />
    </button>
  );

  const Row = ({ label, desc, children }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-default)' }}>
      <div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>{label}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{desc}</div>
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 2 }}>Settings</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-8)' }}>Manage your account preferences</p>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-3)' }}>
          <User size={15} color="var(--text-secondary)" />
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)' }}>Account</h2>
        </div>
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <Row label="Name" desc={user?.name || 'User'}><button className="btn btn-ghost btn-sm">Edit</button></Row>
          <Row label="Email" desc={user?.email || 'user@email.com'}><button className="btn btn-ghost btn-sm">Edit</button></Row>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
            <div><div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>Membership</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{user?.membership || 'Free'}</div></div>
            <button className="btn btn-outline-brand btn-sm">Upgrade</button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-3)' }}>
          <Bell size={15} color="var(--text-secondary)" />
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)' }}>Notifications</h2>
        </div>
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <Row label="Email Notifications" desc="Receive updates via email"><Toggle on={emailNotifs} onToggle={() => setEmailNotifs(!emailNotifs)} id="toggle-email-notifs" /></Row>
          <Row label="Match Alerts" desc="Notified for new matches"><Toggle on={matchNotifs} onToggle={() => setMatchNotifs(!matchNotifs)} id="toggle-match-notifs" /></Row>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
            <div><div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>Credit Reminders</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Low credit alerts</div></div>
            <Toggle on={creditNotifs} onToggle={() => setCreditNotifs(!creditNotifs)} id="toggle-credit-notifs" />
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-3)' }}>
          <Shield size={15} color="var(--red)" />
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)' }}>Danger Zone</h2>
        </div>
        <div className="card" style={{ padding: 'var(--space-4)', borderColor: 'rgba(235,87,87,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div><div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>Sign Out</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Sign out of Nexus</div></div>
            <button className="btn btn-danger btn-sm" onClick={logout} id="settings-logout"><LogOut size={12} /> Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
