import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>
                    <span style={styles.logoIcon}>◆</span>
                    <span style={styles.logoText}>RightPlace</span>
                </Link>

                {/* Desktop Navigation */}
                <div style={styles.navLinks}>
                    <Link to="/jobs" style={styles.navLink}>Browse Jobs</Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
                            <Link to="/saved-jobs" style={styles.navLink}>Saved Jobs</Link>
                            {user?.role === 'employer' && (
                                <Link to="/post-job" style={styles.navLink}>Post Job</Link>
                            )}
                            {user?.role === 'admin' && (
                                <Link to="/admin" style={styles.navLink}>Admin</Link>
                            )}
                            <div style={styles.dropdown}>
                                <button style={styles.userButton}>
                                    <span style={styles.avatar}>{user?.name?.charAt(0)}</span>
                                    <span style={styles.userName}>{user?.name}</span>
                                    <span style={styles.arrow}>▼</span>
                                </button>
                                <div style={styles.dropdownMenu}>
                                    <Link to="/dashboard" style={styles.dropdownItem}>Profile</Link>
                                    <button onClick={handleLogout} style={styles.dropdownItem}>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={styles.loginButton}>Login</Link>
                            <Link to="/register" style={styles.registerButton}>Sign Up</Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    style={styles.menuButton}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span style={isMenuOpen ? styles.menuIconOpen : styles.menuIcon}></span>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div style={styles.mobileMenu}>
                    <Link to="/jobs" style={styles.mobileNavLink}>Browse Jobs</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" style={styles.mobileNavLink}>Dashboard</Link>
                            <Link to="/saved-jobs" style={styles.mobileNavLink}>Saved Jobs</Link>
                            {user?.role === 'employer' && (
                                <Link to="/post-job" style={styles.mobileNavLink}>Post Job</Link>
                            )}
                            <button onClick={handleLogout} style={styles.mobileNavLink}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={styles.mobileNavLink}>Login</Link>
                            <Link to="/register" style={styles.mobileNavLink}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

const styles = {
    navbar: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        zIndex: 1000,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        height: '4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
        color: '#7c3aed'
    },
    logoIcon: {
        fontSize: '1.5rem'
    },
    logoText: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#111827'
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
    },
    navLink: {
        textDecoration: 'none',
        color: '#4b5563',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'color 0.2s'
    },
    loginButton: {
        textDecoration: 'none',
        color: '#4b5563',
        fontSize: '0.875rem',
        fontWeight: '500',
        padding: '0.5rem 1rem'
    },
    registerButton: {
        textDecoration: 'none',
        backgroundColor: '#7c3aed',
        color: '#ffffff',
        fontSize: '0.875rem',
        fontWeight: '500',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        transition: 'background-color 0.2s'
    },
    dropdown: {
        position: 'relative'
    },
    userButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '0.25rem'
    },
    avatar: {
        width: '2rem',
        height: '2rem',
        borderRadius: '50%',
        backgroundColor: '#7c3aed',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.875rem',
        fontWeight: '600'
    },
    userName: {
        color: '#111827',
        fontSize: '0.875rem',
        fontWeight: '500'
    },
    arrow: {
        fontSize: '0.625rem',
        color: '#9ca3af'
    },
    dropdownMenu: {
        display: 'none',
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: '0.5rem',
        backgroundColor: '#ffffff',
        borderRadius: '0.375rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        minWidth: '12rem',
        overflow: 'hidden'
    },
    dropdownItem: {
        display: 'block',
        width: '100%',
        padding: '0.625rem 1rem',
        textAlign: 'left',
        textDecoration: 'none',
        color: '#4b5563',
        fontSize: '0.875rem',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    menuButton: {
        display: 'none',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem'
    },
    menuIcon: {
        display: 'block',
        width: '1.25rem',
        height: '2px',
        backgroundColor: '#4b5563',
        position: 'relative'
    },
    menuIconOpen: {
        display: 'block',
        width: '1.25rem',
        height: '2px',
        backgroundColor: '#4b5563'
    },
    mobileMenu: {
        display: 'block',
        padding: '1rem',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb'
    },
    mobileNavLink: {
        display: 'block',
        padding: '0.75rem 0',
        textDecoration: 'none',
        color: '#4b5563',
        fontSize: '1rem',
        fontWeight: '500',
        borderBottom: '1px solid #f3f4f6'
    }
};

export default Navbar;
