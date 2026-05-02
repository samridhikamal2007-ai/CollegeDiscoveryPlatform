import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/api';

const JobCard = ({ job, onSave, showSaveButton = true }) => {
    const { user, isAuthenticated } = useAuth();

    const formatSalary = (salary) => {
        if (!salary || !salary.min || !salary.max) return 'Not specified';
        return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSave) {
            onSave(job._id);
        }
    };

    const getJobTypeBadge = (type) => {
        const badges = {
            'full-time': { bg: '#d1fae5', color: '#065f46', text: 'Full Time' },
            'part-time': { bg: '#dbeafe', color: '#1e40af', text: 'Part Time' },
            'contract': { bg: '#fef3c7', color: '#92400e', text: 'Contract' },
            'internship': { bg: '#ede9fe', color: '#6d28d9', text: 'Internship' },
            'temporary': { bg: '#fce7f3', color: '#9d174d', text: 'Temporary' }
        };
        return badges[type] || badges['full-time'];
    };

    const badge = getJobTypeBadge(job.jobType);

    return (
        <Link to={`/jobs/${job._id}`} style={styles.card}>
            {job.companyLogo && (
                <div style={styles.logoContainer}>
                    <img src={job.companyLogo} alt={job.company} style={styles.logo} />
                </div>
            )}

            <div style={styles.content}>
                <div style={styles.header}>
                    <h3 style={styles.title}>{job.title}</h3>
                    {showSaveButton && isAuthenticated && user?.role === 'candidate' && (
                        <button
                            onClick={handleSave}
                            style={styles.saveButton}
                            title="Save job"
                        >
                            ★
                        </button>
                    )}
                </div>

                <p style={styles.company}>{job.company}</p>

                <div style={styles.meta}>
                    <span style={styles.metaItem}>
                        📍 {job.location}
                    </span>
                    <span style={styles.metaItem}>
                        💰 {formatSalary(job.salary)}
                    </span>
                    <span style={styles.metaItem}>
                        🕒 {formatDate(job.createdAt)}
                    </span>
                </div>

                <div style={styles.badges}>
                    <span style={{ ...styles.badge, backgroundColor: badge.bg, color: badge.color }}>
                        {badge.text}
                    </span>
                    {job.remote && (
                        <span style={{ ...styles.badge, backgroundColor: '#ede9fe', color: '#6d28d9' }}>
                            Remote
                        </span>
                    )}
                </div>

                {job.skills && job.skills.length > 0 && (
                    <div style={styles.skills}>
                        {job.skills.slice(0, 4).map((skill, index) => (
                            <span key={index} style={styles.skill}>
                                {skill}
                            </span>
                        ))}
                        {job.skills.length > 4 && (
                            <span style={styles.skillMore}>+{job.skills.length - 4}</span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
};

const styles = {
    card: {
        display: 'flex',
        gap: '1rem',
        padding: '1.25rem',
        backgroundColor: '#ffffff',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.2s ease',
        border: '1px solid #e5e7eb'
    },
    logoContainer: {
        flexShrink: 0,
        width: '4rem',
        height: '4rem',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    content: {
        flex: 1,
        minWidth: 0
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '0.5rem',
        marginBottom: '0.25rem'
    },
    title: {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: '#111827',
        margin: 0,
        lineHeight: '1.4'
    },
    saveButton: {
        flexShrink: 0,
        padding: '0.25rem',
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '1.25rem',
        color: '#9ca3af',
        cursor: 'pointer',
        transition: 'color 0.2s'
    },
    company: {
        fontSize: '0.875rem',
        color: '#6b7280',
        margin: '0 0 0.75rem'
    },
    meta: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '0.75rem'
    },
    metaItem: {
        fontSize: '0.875rem',
        color: '#6b7280'
    },
    badges: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '0.75rem'
    },
    badge: {
        display: 'inline-block',
        padding: '0.25rem 0.625rem',
        fontSize: '0.75rem',
        fontWeight: '500',
        borderRadius: '9999px'
    },
    skills: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem'
    },
    skill: {
        padding: '0.25rem 0.625rem',
        fontSize: '0.75rem',
        color: '#4b5563',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.25rem'
    },
    skillMore: {
        padding: '0.25rem 0.625rem',
        fontSize: '0.75rem',
        color: '#6b7280',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.25rem'
    }
};

export default JobCard;
