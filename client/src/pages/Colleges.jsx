import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Colleges = () => {
    const { isDark } = useTheme();
    const [colleges, setColleges] = useState([
        { _id: '1', name: 'Indian Institute of Technology Bombay', location: 'Mumbai, Maharashtra', ranking: 1, averageFees: 200000, placementRate: 98, type: 'Public' },
        { _id: '2', name: 'Indian Institute of Technology Delhi', location: 'New Delhi, Delhi', ranking: 2, averageFees: 220000, placementRate: 97, type: 'Public' },
        { _id: '3', name: 'BITS Pilani', location: 'Pilani, Rajasthan', ranking: 5, averageFees: 500000, placementRate: 95, type: 'Private' },
        { _id: '4', name: 'Vellore Institute of Technology', location: 'Vellore, Tamil Nadu', ranking: 12, averageFees: 350000, placementRate: 92, type: 'Private' }
    ]);
    const [search, setSearch] = useState('');

    return (
        <div style={{
            minHeight: '100vh',
            background: isDark ? 'var(--bg-base)' : '#f9fafb',
            color: 'var(--text-body)',
            paddingTop: '100px',
            paddingBottom: '4rem'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-heading)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Top Colleges in India</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1rem' }}>Find the right college for your future. Filter by location, ranking, and fees.</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {colleges.map(college => (
                        <div key={college._id} style={{
                            background: 'var(--bg-elevated)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid var(--border-light)',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>{college.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>📍 {college.location}</p>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(124,90,246,0.1)', color: '#7c5af6', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600 }}>Rank #{college.ranking}</span>
                                <span style={{ padding: '0.25rem 0.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', color: 'var(--text-body)', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600 }}>{college.type}</span>
                            </div>
                            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg. Fees</p>
                                    <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-heading)' }}>₹{college.averageFees.toLocaleString()}/yr</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Placement</p>
                                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#10b981' }}>{college.placementRate}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Colleges;
