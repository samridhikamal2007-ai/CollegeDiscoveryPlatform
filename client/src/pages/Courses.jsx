import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Courses = () => {
    const { isDark } = useTheme();
    return (
        <div style={{
            minHeight: '100vh',
            background: isDark ? 'var(--bg-base)' : '#f9fafb',
            color: 'var(--text-body)',
            paddingTop: '100px',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-heading)' }}>Courses</h1>
            <p style={{ color: 'var(--text-muted)' }}>Explore degree programs and specializations. Coming soon...</p>
        </div>
    );
};

export default Courses;
