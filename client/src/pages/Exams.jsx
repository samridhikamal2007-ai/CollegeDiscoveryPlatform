import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Exams = () => {
    const { isDark } = useTheme();
    const [exams, setExams] = useState([
        { _id: '1', name: 'JEE Main', fullName: 'Joint Entrance Examination (Main)', level: 'UG', examDate: '2027-01-24', officialWebsite: 'https://jeemain.nta.nic.in' },
        { _id: '2', name: 'NEET UG', fullName: 'National Eligibility cum Entrance Test', level: 'UG', examDate: '2027-05-02', officialWebsite: 'https://neet.nta.nic.in' },
        { _id: '3', name: 'CAT', fullName: 'Common Admission Test', level: 'PG', examDate: '2026-11-29', officialWebsite: 'https://iimcat.ac.in' },
        { _id: '4', name: 'GATE', fullName: 'Graduate Aptitude Test in Engineering', level: 'PG', examDate: '2027-02-05', officialWebsite: 'https://gate.iitk.ac.in' }
    ]);

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
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-heading)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Entrance Exams</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1rem' }}>Stay updated with the latest exam dates, patterns, and syllabuses.</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {exams.map(exam => (
                        <div key={exam._id} style={{
                            background: 'var(--bg-elevated)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid var(--border-light)',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)' }}>{exam.name}</h3>
                                    <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>{exam.level}</span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{exam.fullName}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Exam Date</p>
                                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--brand-600)' }}>{new Date(exam.examDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <a href={exam.officialWebsite} target="_blank" rel="noreferrer" style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-strong)',
                                    color: 'var(--text-heading)',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    display: 'inline-block'
                                }}>Official Website ↗</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Exams;
