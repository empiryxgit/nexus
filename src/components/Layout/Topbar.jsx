import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreditStore } from '../../stores/creditStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { Bell, Coins, Search, Heart, Link as LinkIcon, Target, Gift } from 'lucide-react';

const notifIcons = { interest: Heart, match: Target, introduction: LinkIcon, opportunity: Gift };

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const creditStore = useCreditStore();
  const totalCredits = creditStore.totalCredits();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const unread = unreadCount();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 'var(--sidebar-width)', right: 0,
      height: 'var(--topbar-height)',
      background: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', zIndex: 'var(--z-sticky)',
    }} id="topbar">
      {/* Search */}
      <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Search..."
          className="input"
          style={{
            width: '100%', height: 30, paddingLeft: 30,
            background: 'var(--bg-secondary)', border: '1px solid transparent',
            borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)',
          }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={(e) => { e.target.style.borderColor = 'var(--border-strong)'; e.target.style.background = 'var(--bg-primary)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'var(--bg-secondary)'; }}
          id="topbar-search"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Credits */}
        <button
          onClick={() => navigate('/wallet')}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)', color: 'var(--text-secondary)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          id="topbar-credits"
        >
          <Coins size={14} />
          <span style={{ fontWeight: 'var(--weight-medium)' }}>{totalCredits}</span>
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: 30, height: 30, borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)', position: 'relative',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            id="topbar-notifications-btn"
          >
            <Bell size={16} />
            {unread > 0 && <span className="notification-dot" style={{ top: 3, right: 3, width: 6, height: 6 }} />}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              width: 340, maxHeight: 420,
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden', zIndex: 'var(--z-dropdown)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderBottom: '1px solid var(--border-default)',
              }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>
                  Notifications {unread > 0 && `(${unread})`}
                </span>
                {unread > 0 && (
                  <button onClick={markAllAsRead} style={{ fontSize: 'var(--text-xs)', color: 'var(--blue)' }} id="mark-all-read-btn">
                    Mark all read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                {notifications.map(notif => {
                  const Icon = notifIcons[notif.type] || Bell;
                  return (
                    <div
                      key={notif.id}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '10px 14px', cursor: 'pointer',
                        borderBottom: '1px solid var(--border-default)',
                        background: notif.read ? 'transparent' : 'var(--bg-blue-light)',
                      }}
                      onClick={() => markAsRead(notif.id)}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = notif.read ? 'transparent' : 'var(--bg-blue-light)'; }}
                    >
                      <div style={{
                        width: 24, height: 24, borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)', color: 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Icon size={12} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: notif.read ? 'var(--weight-normal)' : 'var(--weight-medium)' }}>
                          {notif.title}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
                          {notif.message}
                        </div>
                      </div>
                      {!notif.read && <div style={{ width: 6, height: 6, borderRadius: 'var(--radius-full)', background: 'var(--blue)', flexShrink: 0, marginTop: 5 }} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
