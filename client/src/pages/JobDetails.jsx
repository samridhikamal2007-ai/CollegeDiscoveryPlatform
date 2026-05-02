import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const { user, isAuthenticated, isCandidate } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applying, setApplying] = useState(false);
    const [applicationData, setApplicationData] = useState({ resume: '', coverLetter: '' });

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        setLoading(true);
        try {
            const res = await jobsAPI.getById(id);
            setJob(res.data.data);
        } catch (error) {
            setError('Job not found');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await jobsAPI.save(id);
            alert('Job saved!');
        } catch (error) {
            alert('Failed to save job');
        }
    };

    const handleApply = async () => {
        setApplying(true);
        try {
            await jobsAPI.apply(id, applicationData);
            alert('Application submitted successfully!');
            fetchJob();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    const formatSalary = (salary) => {
        if (!salary || !salary.min || !salary.max) return 'Not specified';
        return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()} ${salary.currency || 'USD'}/year`;
    };

    const hasApplied = job?.applicants?.some(app => app.user === user?._id);

    if (loading) {
        return <div style={styles.loading}><div className="spinner"></div></div>;
    }

    if (error || !job) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <div style={styles.error}>{error || 'Job not found'}</div>
                    <Link to="/jobs">← Back to Jobs</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <Link to="/jobs" style={styles.back}>← Back to Jobs</Link>

                <div style={styles.grid}>
                    {/* Main Content */}
                    <div style={styles.main}>
                        <div style={styles.card}>
                            <div style={styles.header}>
                                <h1 style={styles.title}>{job.title}</h1>
                                <p style={styles.company}>{job.company}</p>
                            </div>

                            <div style={styles.meta}>
                                <span>📍 {job.location}</span>
                                <span>💰 {formatSalary(job.salary)}</span>
                                <span>🕒 Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div style={styles.badges}>
                                <span style={styles.badge}>{job.jobType}</span>
                                {job.remote && <span style={styles.badge}>Remote</span>}
                                <span style={styles.badge}>{job.experience} Level</span>
                            </div>

                            <div style={styles.section}>
                                <h2 style={styles.sectionTitle}>Description</h2>
                                <p style={styles.description}>{job.description}</p>
                            </div>

                            {job.requirements?.length > 0 && (
                                <div style={styles.section}>
                                    <h2 style={styles.sectionTitle}>Requirements</h2>
                                    <ul style={styles.list}>
                                        {job.requirements.map((req, index) => (
                                            <li key={index}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {job.responsibilities?.length > 0 && (
                                <div style={styles.section}>
                                    <h2 style={styles.sectionTitle}>Responsibilities</h2>
                                    <ul style={styles.list}>
                                        {job.responsibilities.map((res, index) => (
                                            <li key={index}>{res}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {job.skills?.length > 0 && (
                                <div style={styles.section}>
                                    <h2 style={styles.sectionTitle}>Skills</h2>
                                    <div style={styles.skills}>
                                        {job.skills.map((skill, index) => (
                                            <span key={index} style={styles.skill}>{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div style={styles.sidebar}>
                        <div style={styles.card}>
                            <h3 style={styles.sidebarTitle}>About Company</h3>
                            <p style={styles.companyInfo}>{job.employer?.company || job.company}</p>
                            {job.employer?.companyDescription && (
                                <p style={styles.companyDesc}>{job.employer.companyDescription}</p>
                            )}
                            {job.employer?.companyWebsite && (
                                <a href={job.employer.companyWebsite} target="_blank" rel="noopener noreferrer" style={styles.website}>
                                    Visit Website →
                                </a>
                            )}

                            <div style={styles.actions}>
                                {isAuthenticated && isCandidate && !hasApplied && (
                                    <>
                                        <button onClick={handleApply} style={styles.applyButton} disabled={applying}>
                                            {applying ? 'Applying...' : 'Apply Now'}
                                        </button>
                                        <button onClick={handleSave} style={styles.saveButton}>Save Job</button>
                                    </>
                                )}
                                {hasApplied && (
                                    <div style={styles.appliedBadge}>✓ Applied</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', paddingTop: '5rem', paddingBottom: '4rem', backgroundColor: '#f9fafb' },
    container: { maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' },
    back: { display: 'inline-block', marginBottom: '1.5rem', color: '#6b7280', textDecoration: 'none' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' },
    main: {},
    card: { backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem', marginBottom: '1rem' },
    header: { marginBottom: '1rem' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' },
    company: { fontSize: '1rem', color: '#6b7280' },
    meta: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', color: '#4b5563', fontSize: '0.875rem' },
    badges: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
    badge: { padding: '0.25rem 0.625rem', fontSize: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '9999px', color: '#4b5563' },
    section: { marginBottom: '1.5rem' },
    sectionTitle: { fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.75rem' },
    description: { color: '#4b5563', lineHeight: '1.6' },
    list: { paddingLeft: '1.25rem', color: '#4b5563', lineHeight: '1.8' },
    skills: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
    skill: { padding: '0.375rem 0.75rem', fontSize: '0.875rem', backgroundColor: '#ede9fe', color: '#6d28d9', borderRadius: '0.25rem' },
    sidebar: {},
    sidebarTitle: { fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.75rem' },
    companyInfo: { fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' },
    companyDesc: { fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem', lineHeight: '1.6' },
    website: { display: 'inline-block', fontSize: '0.875rem', color: '#7c3aed', textDecoration: 'none' },
    actions: { marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    applyButton: { backgroundColor: '#7c3aed', color: '#ffffff', padding: '0.75rem 1rem', borderRadius: '0.375rem', fontWeight: '500', border: 'none', cursor: 'pointer' },
    saveButton: { backgroundColor: '#ffffff', color: '#4b5563', padding: '0.75rem 1rem', borderRadius: '0.375rem', fontWeight: '500', border: '1px solid #d1d5db', cursor: 'pointer' },
    appliedBadge: { backgroundColor: '#d1fae5', color: '#065f46', padding: '0.75rem 1rem', borderRadius: '0.375rem', fontWeight: '500', textAlign: 'center' },
    loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' },
    error: { textAlign: 'center', padding: '2rem', color: '#6b7280' }
};

export default JobDetails;
