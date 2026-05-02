import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.grid}>
                    {/* Brand */}
                    <div style={styles.column}>
                        <Link to="/" style={styles.logo}>
                            <span style={styles.logoIcon}>◆</span>
                            <span style={styles.logoText}>RightPlace</span>
                        </Link>
                        <p style={styles.description}>
                            Your trusted platform for finding the perfect job or hiring the best talent.
                        </p>
                    </div>

                    {/* For Candidates */}
                    <div style={styles.column}>
                        <h4 style={styles.heading}>For Candidates</h4>
                        <Link to="/jobs" style={styles.link}>Browse Jobs</Link>
                        <Link to="/register" style={styles.link}>Create Profile</Link>
                        <Link to="/jobs" style={styles.link}>Job Alerts</Link>
                    </div>

                    {/* For Employers */}
                    <div style={styles.column}>
                        <h4 style={styles.heading}>For Employers</h4>
                        <Link to="/register" style={styles.link}>Post a Job</Link>
                        <Link to="/register" style={styles.link}>Search Candidates</Link>
                        <Link to="/register" style={styles.link}>Pricing</Link>
                    </div>

                    {/* Resources */}
                    <div style={styles.column}>
                        <h4 style={styles.heading}>Resources</h4>
                        <Link to="#" style={styles.link}>Help Center</Link>
                        <Link to="#" style={styles.link}>Blog</Link>
                        <Link to="#" style={styles.link}>Contact Us</Link>
                    </div>
                </div>

                <div style={styles.bottom}>
                    <p style={styles.copyright}>
                        © {new Date().getFullYear()} RightPlace. All rights reserved.
                    </p>
                    <div style={styles.links}>
                        <Link to="#" style={styles.bottomLink}>Privacy Policy</Link>
                        <Link to="#" style={styles.bottomLink}>Terms of Service</Link>
                        <Link to="#" style={styles.bottomLink}>Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#111827',
        color: '#ffffff',
        padding: '4rem 0 2rem',
        marginTop: 'auto'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2rem',
        marginBottom: '3rem'
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
        color: '#8b5cf6',
        marginBottom: '0.5rem'
    },
    logoIcon: {
        fontSize: '1.5rem'
    },
    logoText: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#ffffff'
    },
    description: {
        color: '#9ca3af',
        fontSize: '0.875rem',
        lineHeight: '1.6'
    },
    heading: {
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '0.5rem'
    },
    link: {
        color: '#9ca3af',
        textDecoration: 'none',
        fontSize: '0.875rem',
        transition: 'color 0.2s'
    },
    bottom: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '2rem',
        borderTop: '1px solid #374151'
    },
    copyright: {
        color: '#9ca3af',
        fontSize: '0.875rem'
    },
    links: {
        display: 'flex',
        gap: '1.5rem'
    },
    bottomLink: {
        color: '#9ca3af',
        textDecoration: 'none',
        fontSize: '0.875rem'
    }
};

export default Footer;
