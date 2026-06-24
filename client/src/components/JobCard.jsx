import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/api';

const LocationIcon = () => (
    <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
);

const ClockIcon = () => (
    <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
    </svg>
);

const SalaryIcon = () => (
    <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93V18h-2v1.93c-3.94-.49-7-3.85-7-7.93s3.05-7.44 7-7.93V6h2V4.07c3.94.49 7 3.85 7 7.93s-3.06 7.44-7 7.93zM13 10h-2V8h2v2zm0 6h-2v-4h2v4z"/>
    </svg>
);

const HeartIcon = ({ filled }) => (
    <svg width="16" height="16" fill={filled ? '#f43f5e' : 'none'} stroke={filled ? '#f43f5e' : 'currentColor'} strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
);

const typeColors = {
    'full-time': { bg: 'rgba(16,185,129,0.1)', text: '#065f46', border: 'rgba(16,185,129,0.2)' },
    'part-time': { bg: 'rgba(59,130,246,0.1)', text: '#1e3a8a', border: 'rgba(59,130,246,0.2)' },
    'contract': { bg: 'rgba(245,158,11,0.1)', text: '#78350f', border: 'rgba(245,158,11,0.2)' },
    'internship': { bg: 'rgba(167,139,250,0.12)', text: '#5b21b6', border: 'rgba(167,139,250,0.25)' },
    'temporary': { bg: 'rgba(244,63,94,0.1)', text: '#9f1239', border: 'rgba(244,63,94,0.2)' },
};

const expLabels = {
    'entry': 'Entry Level',
    'mid': 'Mid Level',
    'senior': 'Senior',
    'lead': 'Lead',
    'executive': 'Executive',
};

const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return null;
    const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(0)}K` : `${n}`;
    const curr = salary.currency || 'USD';
    const sym = curr === 'USD' ? '$' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : '';
    if (salary.min && salary.max) return `${sym}${fmt(salary.min)} — ${sym}${fmt(salary.max)}`;
    if (salary.min) return `${sym}${fmt(salary.min)}+`;
    return `Up to ${sym}${fmt(salary.max)}`;
};

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
};

const JobCard = ({ job, compact = false }) => {
    const { isAuthenticated, user } = useAuth();
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [hovered, setHovered] = useState(false);

    const typeStyle = typeColors[job.jobType] || typeColors['full-time'];
    const salaryText = formatSalary(job.salary);
    const companyInitial = (job.company || 'C').charAt(0).toUpperCase();

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) return;
        setSaving(true);
        try {
            const res = await jobsAPI.save(job._id);
            setSaved(res.data.saved);
        } catch { } finally {
            setSaving(false);
        }
    };

    // Generate a consistent hue for each company's avatar
    const hues = [262, 220, 280, 190, 316, 45];
    const hue = hues[(companyInitial.charCodeAt(0) % hues.length)];

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: 'var(--bg-elevated)',
                border: `1px solid ${hovered ? 'rgba(124,90,246,0.3)' : 'var(--border-light)'}`,
                borderRadius: 20,
                padding: compact ? '1.25rem' : '1.5rem',
                transition: 'all 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: hovered ? 'translateY(-4px)' : 'none',
                boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Shimmer overlay on hover */}
            {hovered && (
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 20,
                    background: 'linear-gradient(105deg, transparent 40%, rgba(124,90,246,0.04) 50%, transparent 60%)',
                }} />
            )}

            {/* Hot/New badge */}
            {job.views < 50 && (
                <div style={{
                    position: 'absolute', top: 14, right: 14,
                    padding: '0.2rem 0.6rem', borderRadius: 20,
                    fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
                    background: 'linear-gradient(135deg, #7c5af6, #a855f7)', color: '#fff',
                }}>New</div>
            )}

            {/* Top Row: Company + Save */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Company logo/avatar */}
                    {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.company} style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', border: '1px solid var(--border-light)' }} />
                    ) : (
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: `hsl(${hue}, 70%, ${hovered ? '60%' : '55%'})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 800, fontSize: '1.125rem',
                            flexShrink: 0, transition: 'background 0.2s ease',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>{companyInitial}</div>
                    )}
                    <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.1rem' }}>{job.company}</p>
                        {job.remote && (
                            <span style={{
                                fontSize: '0.65rem', fontWeight: 700, color: '#10b981',
                                background: 'rgba(16,185,129,0.1)', padding: '0.1rem 0.45rem',
                                borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)',
                            }}>🌐 Remote</span>
                        )}
                    </div>
                </div>

                {isAuthenticated && user?.role === 'candidate' && (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        aria-label={saved ? 'Unsave job' : 'Save job'}
                        style={{
                            background: saved ? 'rgba(244,63,94,0.08)' : 'var(--bg-surface)',
                            border: `1px solid ${saved ? 'rgba(244,63,94,0.2)' : 'var(--border-default)'}`,
                            borderRadius: 10, width: 34, height: 34,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0,
                            color: saved ? '#f43f5e' : 'var(--text-muted)',
                        }}
                    >
                        <HeartIcon filled={saved} />
                    </button>
                )}
            </div>

            {/* Job Title */}
            <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
                <h3 style={{
                    fontSize: compact ? '0.9375rem' : '1.0625rem',
                    fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.625rem',
                    lineHeight: 1.3, fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'color 0.2s ease',
                    ...(hovered ? { color: '#7c5af6' } : {}),
                }}>{job.title}</h3>
            </Link>

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginBottom: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    <LocationIcon />{job.location}
                </span>
                {salaryText && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        <SalaryIcon />{salaryText}
                    </span>
                )}
                {job.experience && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {expLabels[job.experience] || job.experience}
                    </span>
                )}
            </div>

            {/* Description preview */}
            {!compact && job.description && (
                <p style={{
                    fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6,
                    marginBottom: '1rem', margin: 0, marginBottom: '1rem',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{job.description}</p>
            )}

            {/* Skills tags */}
            {job.skills && job.skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {job.skills.slice(0, 4).map(skill => (
                        <span key={skill} style={{
                            padding: '0.2rem 0.6rem', borderRadius: 20,
                            fontSize: '0.7rem', fontWeight: 600,
                            background: 'rgba(124,90,246,0.08)', color: '#6d3aed',
                            border: '1px solid rgba(124,90,246,0.18)',
                        }}>{skill}</span>
                    ))}
                    {job.skills.length > 4 && (
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-default)' }}>
                            +{job.skills.length - 4}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.875rem', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{
                        padding: '0.2rem 0.7rem', borderRadius: 20,
                        fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize',
                        background: typeStyle.bg, color: typeStyle.text, border: `1px solid ${typeStyle.border}`,
                    }}>{job.jobType?.replace('-', ' ')}</span>
                    {job.category && (
                        <span style={{ padding: '0.2rem 0.7rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize', background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-default)' }}>
                            {job.category}
                        </span>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <ClockIcon />{timeAgo(job.createdAt)}
                    </span>
                    <Link
                        to={`/jobs/${job._id}`}
                        style={{
                            padding: '0.35rem 0.875rem', borderRadius: 8,
                            fontSize: '0.775rem', fontWeight: 700,
                            textDecoration: 'none', color: hovered ? '#fff' : '#7c5af6',
                            background: hovered ? 'linear-gradient(135deg, #7c5af6, #a855f7)' : 'rgba(124,90,246,0.08)',
                            border: hovered ? '1px solid transparent' : '1px solid rgba(124,90,246,0.2)',
                            transition: 'all 0.2s ease',
                            boxShadow: hovered ? '0 4px 12px rgba(124,90,246,0.3)' : 'none',
                        }}
                    >
                        Apply Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
