import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const icons = {
    home: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
    ),
    jobs: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        </svg>
    ),
    ai: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
        </svg>
    ),
    tracker: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
    ),
    profile: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
    ),
    login: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
    ),
};

const MobileNav = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ||
        (path !== '/' && location.pathname.startsWith(path));

    const tabs = isAuthenticated
        ? [
            { to: '/', icon: icons.home, label: 'Home' },
            { to: '/jobs', icon: icons.jobs, label: 'Jobs' },
            { to: '/ai-tools', icon: icons.ai, label: 'AI Tools' },
            { to: '/tracker', icon: icons.tracker, label: 'Tracker' },
            { to: '/dashboard', icon: icons.profile, label: 'Profile' },
        ]
        : [
            { to: '/', icon: icons.home, label: 'Home' },
            { to: '/jobs', icon: icons.jobs, label: 'Jobs' },
            { to: '/ai-tools', icon: icons.ai, label: 'AI Tools' },
            { to: '/login', icon: icons.login, label: 'Sign In' },
        ];

    return (
        <nav
            className="hide-desktop"
            style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderTop: '1px solid var(--border-glass)',
                zIndex: 300, padding: '0.5rem 0 env(safe-area-inset-bottom, 0.5rem)',
                boxShadow: '0 -8px 24px rgba(0,0,0,0.1)',
            }}
        >
            <div style={{
                display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                maxWidth: 500, margin: '0 auto',
            }}>
                {tabs.map(({ to, icon, label }) => {
                    const active = isActive(to);
                    return (
                        <Link
                            key={to}
                            to={to}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                gap: 3, padding: '0.5rem 1rem', textDecoration: 'none',
                                flex: 1, transition: 'all 0.2s ease',
                                color: active ? '#7c5af6' : 'var(--text-muted)',
                                position: 'relative',
                            }}
                        >
                            {active && (
                                <div style={{
                                    position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
                                    width: 28, height: 3, borderRadius: 3,
                                    background: 'linear-gradient(135deg, #7c5af6, #a855f7)',
                                }} />
                            )}
                            <div style={{
                                padding: active ? '0.35rem' : '0.25rem',
                                borderRadius: 10,
                                background: active ? 'rgba(124,90,246,0.1)' : 'transparent',
                                transition: 'all 0.2s ease',
                            }}>
                                {icon}
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: active ? 700 : 500, lineHeight: 1 }}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
            <style>{`
                @media (min-width: 769px) {
                    nav[class*="hide-desktop"] { display: none !important; }
                }
            `}</style>
        </nav>
    );
};

export default MobileNav;
