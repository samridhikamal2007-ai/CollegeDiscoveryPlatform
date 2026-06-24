import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SunIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
);

const MoonIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
);

const ChevronDown = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <polyline points="6 9 12 15 18 9"/>
    </svg>
);

const LogoIcon = () => (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
        <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c5af6"/>
                <stop offset="100%" stopColor="#a855f7"/>
            </linearGradient>
        </defs>
        <rect width="40" height="40" rx="12" fill="url(#logoGrad)"/>
        <path d="M12 28L20 12L28 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 23H25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="3" fill="white" fillOpacity="0.3"/>
    </svg>
);

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { to: '/colleges', label: 'Top Colleges' },
        { to: '/exams', label: 'Exams' },
        { to: '/courses', label: 'Courses' },
        { to: '/jobs', label: 'Careers & Jobs' },
        { to: '/ai-tools', label: 'AI Tools ✨' },
    ];

    return (
        <>
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                ...(scrolled ? {
                    background: isDark ? 'rgba(10, 9, 20, 0.92)' : 'rgba(255,255,255,0.88)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    borderBottom: `1px solid ${isDark ? 'rgba(167,139,250,0.12)' : 'rgba(139,92,246,0.12)'}`,
                    boxShadow: isDark
                        ? '0 4px 24px rgba(0,0,0,0.4)'
                        : '0 4px 24px rgba(109,58,237,0.08)',
                } : {
                    background: 'transparent',
                    borderBottom: '1px solid transparent',
                })
            }}>
                <div style={{
                    maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem',
                    height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}>
                        <LogoIcon />
                        <span style={{
                            fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            background: 'linear-gradient(135deg, #7c5af6 0%, #a855f7 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>RightPlace</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}
                        className="hide-mobile">
                        {navLinks.map(({ to, label }) => (
                            <Link key={to} to={to} style={{
                                padding: '0.5rem 0.875rem', borderRadius: 8,
                                fontSize: '0.875rem', fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                                color: isActive(to)
                                    ? '#7c5af6'
                                    : isDark ? '#c8c4e8' : '#2d2b4e',
                                background: isActive(to)
                                    ? 'rgba(124,90,246,0.1)'
                                    : 'transparent',
                                border: isActive(to)
                                    ? '1px solid rgba(124,90,246,0.2)'
                                    : '1px solid transparent',
                            }}>
                                {label}
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <>
                                <Link to="/dashboard" style={{
                                    padding: '0.5rem 0.875rem', borderRadius: 8,
                                    fontSize: '0.875rem', fontWeight: 600,
                                    textDecoration: 'none', transition: 'all 0.2s ease',
                                    color: isActive('/dashboard') ? '#7c5af6' : isDark ? '#c8c4e8' : '#2d2b4e',
                                    background: isActive('/dashboard') ? 'rgba(124,90,246,0.1)' : 'transparent',
                                    border: isActive('/dashboard') ? '1px solid rgba(124,90,246,0.2)' : '1px solid transparent',
                                }}>Dashboard</Link>
                                <Link to="/tracker" style={{
                                    padding: '0.5rem 0.875rem', borderRadius: 8,
                                    fontSize: '0.875rem', fontWeight: 600,
                                    textDecoration: 'none', transition: 'all 0.2s ease',
                                    color: isActive('/tracker') ? '#7c5af6' : isDark ? '#c8c4e8' : '#2d2b4e',
                                    background: isActive('/tracker') ? 'rgba(124,90,246,0.1)' : 'transparent',
                                    border: isActive('/tracker') ? '1px solid rgba(124,90,246,0.2)' : '1px solid transparent',
                                }}>Tracker</Link>
                                {user?.role === 'employer' && (
                                    <Link to="/post-job" style={{
                                        padding: '0.5rem 0.875rem', borderRadius: 8,
                                        fontSize: '0.875rem', fontWeight: 600,
                                        textDecoration: 'none', transition: 'all 0.2s ease',
                                        color: isDark ? '#c8c4e8' : '#2d2b4e',
                                        background: 'transparent', border: '1px solid transparent',
                                    }}>Post Job</Link>
                                )}
                                {user?.role === 'admin' && (
                                    <Link to="/admin" style={{
                                        padding: '0.5rem 0.875rem', borderRadius: 8,
                                        fontSize: '0.875rem', fontWeight: 600,
                                        textDecoration: 'none', transition: 'all 0.2s ease',
                                        color: isDark ? '#c8c4e8' : '#2d2b4e',
                                        background: 'transparent', border: '1px solid transparent',
                                    }}>Admin</Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 36, height: 36, borderRadius: 10,
                                border: `1px solid ${isDark ? 'rgba(167,139,250,0.2)' : 'rgba(139,92,246,0.15)'}`,
                                background: isDark ? 'rgba(167,139,250,0.08)' : 'rgba(124,90,246,0.05)',
                                color: isDark ? '#a78bfa' : '#6d3aed',
                                cursor: 'pointer', transition: 'all 0.2s ease',
                            }}
                        >
                            {isDark ? <SunIcon /> : <MoonIcon />}
                        </button>

                        {isAuthenticated ? (
                            <div ref={dropdownRef} style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="hide-mobile"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.375rem 0.75rem 0.375rem 0.375rem',
                                        borderRadius: 10,
                                        border: `1px solid ${isDark ? 'rgba(167,139,250,0.2)' : 'rgba(139,92,246,0.15)'}`,
                                        background: isDark ? 'rgba(167,139,250,0.08)' : 'rgba(124,90,246,0.05)',
                                        cursor: 'pointer', transition: 'all 0.2s ease',
                                    }}
                                >
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #7c5af6, #a855f7)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                                    }}>
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isDark ? '#c8c4e8' : '#2d2b4e', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {user?.name?.split(' ')[0]}
                                    </span>
                                    <span style={{ color: isDark ? '#8884aa' : '#6b6896', transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
                                        <ChevronDown />
                                    </span>
                                </button>

                                {isDropdownOpen && (
                                    <div style={{
                                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                        minWidth: 200,
                                        background: isDark ? '#110f22' : '#ffffff',
                                        border: `1px solid ${isDark ? 'rgba(167,139,250,0.15)' : 'rgba(139,92,246,0.12)'}`,
                                        borderRadius: 14, overflow: 'hidden',
                                        boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(109,58,237,0.15)',
                                        animation: 'slideDown 0.2s ease both',
                                        zIndex: 400,
                                    }}>
                                        <div style={{ padding: '0.875rem 1rem', borderBottom: `1px solid ${isDark ? 'rgba(167,139,250,0.1)' : 'rgba(139,92,246,0.08)'}` }}>
                                            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: isDark ? '#f0eeff' : '#0f0e17', marginBottom: '0.15rem' }}>{user?.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: isDark ? '#8884aa' : '#6b6896' }}>{user?.email}</p>
                                            <span style={{
                                                display: 'inline-block', marginTop: '0.375rem',
                                                padding: '0.15rem 0.5rem', borderRadius: 20,
                                                fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                                                background: 'rgba(124,90,246,0.12)', color: '#7c5af6',
                                                border: '1px solid rgba(124,90,246,0.2)'
                                            }}>{user?.role}</span>
                                        </div>
                                        {[
                                            { to: '/dashboard', label: '👤  Profile' },
                                            { to: '/tracker', label: '📊  Applications' },
                                            { to: '/saved-jobs', label: '🔖  Saved Jobs' },
                                        ].map(({ to, label }) => (
                                            <Link key={to} to={to} style={{
                                                display: 'block', padding: '0.7rem 1rem',
                                                fontSize: '0.875rem', fontWeight: 500,
                                                color: isDark ? '#c8c4e8' : '#2d2b4e',
                                                textDecoration: 'none',
                                                transition: 'background 0.15s ease',
                                            }}
                                                onMouseEnter={e => e.target.style.background = isDark ? 'rgba(124,90,246,0.1)' : 'rgba(124,90,246,0.06)'}
                                                onMouseLeave={e => e.target.style.background = 'transparent'}
                                            >{label}</Link>
                                        ))}
                                        <div style={{ borderTop: `1px solid ${isDark ? 'rgba(167,139,250,0.1)' : 'rgba(139,92,246,0.08)'}` }}>
                                            <button onClick={handleLogout} style={{
                                                display: 'block', width: '100%', padding: '0.7rem 1rem',
                                                textAlign: 'left', fontSize: '0.875rem', fontWeight: 500,
                                                color: '#f43f5e', background: 'none', border: 'none', cursor: 'pointer',
                                                transition: 'background 0.15s ease',
                                            }}
                                                onMouseEnter={e => e.target.style.background = 'rgba(244,63,94,0.08)'}
                                                onMouseLeave={e => e.target.style.background = 'transparent'}
                                            >🚪  Sign Out</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hide-mobile" style={{ display: 'flex', gap: '0.625rem' }}>
                                <Link to="/login" style={{
                                    padding: '0.5rem 1rem', borderRadius: 10,
                                    fontSize: '0.875rem', fontWeight: 600,
                                    textDecoration: 'none',
                                    color: isDark ? '#c8c4e8' : '#2d2b4e',
                                    border: `1px solid ${isDark ? 'rgba(167,139,250,0.2)' : 'rgba(139,92,246,0.15)'}`,
                                    background: isDark ? 'rgba(167,139,250,0.06)' : 'rgba(124,90,246,0.04)',
                                    transition: 'all 0.2s ease',
                                }}>Log in</Link>
                                <Link to="/register" style={{
                                    padding: '0.5rem 1.125rem', borderRadius: 10,
                                    fontSize: '0.875rem', fontWeight: 600,
                                    textDecoration: 'none', color: '#ffffff',
                                    background: 'linear-gradient(135deg, #7c5af6 0%, #a855f7 100%)',
                                    boxShadow: '0 4px 14px rgba(124,90,246,0.35)',
                                    transition: 'all 0.2s ease',
                                }}>Get Started</Link>
                            </div>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            className="hide-desktop"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                            style={{
                                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                                gap: 5, width: 36, height: 36, padding: '0.5rem',
                                background: 'transparent', border: 'none', cursor: 'pointer',
                            }}
                        >
                            {[0, 1, 2].map((i) => (
                                <span key={i} style={{
                                    display: 'block', height: 2, borderRadius: 2,
                                    background: isDark ? '#c8c4e8' : '#2d2b4e',
                                    transition: 'all 0.3s ease',
                                    transformOrigin: 'center',
                                    width: i === 1 ? (isMenuOpen ? '100%' : '75%') : '100%',
                                    transform: isMenuOpen
                                        ? i === 0 ? 'translateY(7px) rotate(45deg)'
                                        : i === 2 ? 'translateY(-7px) rotate(-45deg)'
                                        : 'scaleX(0)'
                                        : 'none',
                                    opacity: isMenuOpen && i === 1 ? 0 : 1
                                }} />
                            ))}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                {isMenuOpen && (
                    <div style={{
                        background: isDark ? '#0a0914' : '#ffffff',
                        borderTop: `1px solid ${isDark ? 'rgba(167,139,250,0.12)' : 'rgba(139,92,246,0.1)'}`,
                        padding: '1rem',
                        animation: 'slideDown 0.25s ease both',
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {navLinks.map(({ to, label }) => (
                                <Link key={to} to={to} style={{
                                    padding: '0.875rem 1rem', borderRadius: 10,
                                    fontSize: '0.9375rem', fontWeight: 600,
                                    textDecoration: 'none',
                                    color: isActive(to) ? '#7c5af6' : isDark ? '#c8c4e8' : '#2d2b4e',
                                    background: isActive(to) ? 'rgba(124,90,246,0.1)' : 'transparent',
                                    border: `1px solid ${isActive(to) ? 'rgba(124,90,246,0.2)' : 'transparent'}`,
                                    transition: 'all 0.2s ease',
                                }}>{label}</Link>
                            ))}
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" style={{ padding: '0.875rem 1rem', borderRadius: 10, fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none', color: isDark ? '#c8c4e8' : '#2d2b4e' }}>Dashboard</Link>
                                    <Link to="/tracker" style={{ padding: '0.875rem 1rem', borderRadius: 10, fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none', color: isDark ? '#c8c4e8' : '#2d2b4e' }}>Applications</Link>
                                    <Link to="/saved-jobs" style={{ padding: '0.875rem 1rem', borderRadius: 10, fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none', color: isDark ? '#c8c4e8' : '#2d2b4e' }}>Saved Jobs</Link>
                                    <button onClick={handleLogout} style={{ padding: '0.875rem 1rem', borderRadius: 10, fontSize: '0.9375rem', fontWeight: 600, textAlign: 'left', background: 'rgba(244,63,94,0.08)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.15)', cursor: 'pointer', marginTop: '0.5rem' }}>Sign Out</button>
                                </>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                                    <Link to="/login" style={{ flex: 1, padding: '0.875rem', borderRadius: 10, fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center', color: isDark ? '#c8c4e8' : '#2d2b4e', border: `1px solid ${isDark ? 'rgba(167,139,250,0.2)' : 'rgba(139,92,246,0.2)'}` }}>Log in</Link>
                                    <Link to="/register" style={{ flex: 1, padding: '0.875rem', borderRadius: 10, fontSize: '0.9375rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center', color: '#fff', background: 'linear-gradient(135deg, #7c5af6, #a855f7)' }}>Get Started</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (max-width: 768px) {
                    .hide-mobile { display: none !important; }
                }
                @media (min-width: 769px) {
                    .hide-desktop { display: none !important; }
                }
            `}</style>
        </>
    );
};

export default Navbar;
