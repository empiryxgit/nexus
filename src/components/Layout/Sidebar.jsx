import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  LayoutDashboard, Target, Search, Wallet, User,
  Settings, LogOut, ChevronLeft, ChevronRight,
  Plus, CreditCard, Star,
} from 'lucide-react';

const startupLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/opportunities', icon: Search, label: 'Discover' },
  { to: '/opportunities/create', icon: Plus, label: 'Create Opportunity' },
  { to: '/wallet', icon: Wallet, label: 'Credit Wallet' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/pricing', icon: Star, label: 'Plans & Pricing' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const investorLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Deal Flow' },
  { to: '/opportunities', icon: Search, label: 'Opportunities' },
  { to: '/wallet', icon: Wallet, label: 'Credit Wallet' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/pricing', icon: Star, label: 'Plans & Pricing' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const partnerLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/opportunities', icon: Search, label: 'Browse Leads' },
  { to: '/wallet', icon: Wallet, label: 'Credit Wallet' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/pricing', icon: Star, label: 'Plans & Pricing' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const getLinks = (type) => {
  switch (type) {
    case 'investor': return investorLinks;
    case 'partner': return partnerLinks;
    default: return startupLinks;
  }
};

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const links = getLinks(user?.type);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0,
      width: 'var(--sidebar-width)',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-default)',
      display: 'flex', flexDirection: 'column',
      zIndex: 'var(--z-sticky)',
      overflow: 'hidden',
    }} id="sidebar-nav">
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 14px', height: 'var(--topbar-height)',
      }}>
        <span style={{
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--weight-bold)',
          letterSpacing: '-0.01em',
          color: 'var(--text-primary)',
        }}>Nexus</span>
      </div>

      {/* Nav */}
      <nav style={{
        flex: 1, padding: '4px 8px',
        display: 'flex', flexDirection: 'column', gap: 1,
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-sm)',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 'var(--weight-medium)' : 'var(--weight-normal)',
              background: isActive ? 'var(--bg-active)' : 'transparent',
              textDecoration: 'none',
              transition: 'background 80ms',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.background.includes('active'))
                e.currentTarget.style.background = 'var(--bg-hover)';
            }}
            onMouseLeave={e => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
          >
            <link.icon size={16} style={{ flexShrink: 0, opacity: 0.75 }} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile Section */}
      <div style={{
        padding: '10px 12px',
        borderTop: '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div className={`avatar avatar-${user?.type || 'startup'}`}>
          {user?.name?.[0] || 'U'}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-medium)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {user?.name || 'User'}
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ padding: 4, borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}
          title="Sign Out"
          id="sidebar-logout-btn"
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}
