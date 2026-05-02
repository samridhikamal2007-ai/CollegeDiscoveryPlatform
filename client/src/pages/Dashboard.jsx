import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, usersAPI, jobsAPI } from '../services/api';

const Dashboard = () => {
    const { user, isCandidate, isEmployer, isAdmin, updateUser } = useAuth();
    const [stats, setStats] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        skills: user?.skills?.join(', ') || '',
        experience: user?.experience || '',
        education: user?.education || '',
        location: user?.location || '',
        company: user?.company || '',
        companyDescription: user?.companyDescription || '',
        companyWebsite: user?.companyWebsite || ''
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const statsRes = await usersAPI.getDashboardStats();
            setStats(statsRes.data.data);

            if (isEmployer) {
                const jobsRes = await jobsAPI.getMyJobs();
                setJobs(jobsRes.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...profileData,
                skills: profileData.skills.split(',').map(s => s.trim()).filter(Boolean)
            };
            await authAPI.updateProfile(data);
            updateUser(data);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile');
        }
    };

    if (loading) {
        return <div style={styles.loading}><div className="spinner"></div></div>;
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>Dashboard</h1>

                {/* Stats Cards */}
                <div style={styles.statsGrid}>
                    {isCandidate && stats && (
                        <>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{stats.applications}</div>
                                <div style={styles.statLabel}>Applications</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{stats.savedJobs}</div>
                                <div style={styles.statLabel}>Saved Jobs</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{stats.pendingApplications}</div>
                                <div style={styles.statLabel}>Pending</div>
                            </div>
                        </>
                    )}
                    {isEmployer && stats && (
                        <>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{stats.jobs}</div>
                                <div style={styles.statLabel}>Total Jobs</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{stats.activeJobs}</div>
                                <div style={styles.statLabel}>Active Jobs</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{stats.totalApplicants}</div>
                                <div style={styles.statLabel}>Applicants</div>
                            </div>
                        </>
                    )}
                    {isAdmin && stats && (
                        <>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{stats.users}</div>
                                <div style={styles.statLabel}>Total Users</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{stats.candidates}</div>
                                <div style={styles.statLabel}>Candidates</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{stats.employers}</div>
                                <div style={styles.statLabel}>Employers</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{stats.jobs}</div>
                                <div style={styles.statLabel}>Total Jobs</div>
                            </div>
                        </>
                    )}
                </div>

                {/* Profile Section */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Profile</h2>
                    <div style={styles.card}>
                        <form onSubmit={handleProfileUpdate} style={styles.form}>
                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Name</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Phone</label>
                                    <input
                                        type="text"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Location</label>
                                    <input
                                        type="text"
                                        value={profileData.location}
                                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Skills (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={profileData.skills}
                                        onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                                        style={styles.input}
                                        placeholder="React, Node.js, MongoDB"
                                    />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Experience</label>
                                <textarea
                                    value={profileData.experience}
                                    onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                                    style={styles.textarea}
                                    rows={3}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Education</label>
                                <textarea
                                    value={profileData.education}
                                    onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                                    style={styles.textarea}
                                    rows={3}
                                />
                            </div>

                            {isEmployer && (
                                <>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Company Name</label>
                                        <input
                                            type="text"
                                            value={profileData.company}
                                            onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Company Description</label>
                                        <textarea
                                            value={profileData.companyDescription}
                                            onChange={(e) => setProfileData({ ...profileData, companyDescription: e.target.value })}
                                            style={styles.textarea}
                                            rows={3}
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Company Website</label>
                                        <input
                                            type="text"
                                            value={profileData.companyWebsite}
                                            onChange={(e) => setProfileData({ ...profileData, companyWebsite: e.target.value })}
                                            style={styles.input}
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </>
                            )}

                            <button type="submit" style={styles.button}>Update Profile</button>
                        </form>
                    </div>
                </div>

                {/* Jobs Section (Employer) */}
                {isEmployer && (
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>My Jobs</h2>
                            <Link to="/post-job" style={styles.linkButton}>Post New Job</Link>
                        </div>
                        <div style={styles.jobsList}>
                            {jobs.length > 0 ? jobs.map(job => (
                                <div key={job._id} style={styles.jobCard}>
                                    <div>
                                        <h3 style={styles.jobTitle}>{job.title}</h3>
                                        <p style={styles.jobCompany}>{job.location} • {job.jobType}</p>
                                    </div>
                                    <div style={styles.jobMeta}>
                                        <span style={job.status === 'open' ? styles.statusOpen : styles.statusClosed}>
                                            {job.status}
                                        </span>
                                        <span>{job.applicants?.length || 0} applicants</span>
                                    </div>
                                </div>
                            )) : (
                                <p style={styles.empty}>No jobs posted yet.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', paddingTop: '5rem', paddingBottom: '4rem', backgroundColor: '#f9fafb' },
    container: { maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' },
    title: { fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' },
    statCard: { backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem', textAlign: 'center' },
    statNumber: { fontSize: '2rem', fontWeight: '700', color: '#7c3aed' },
    statLabel: { fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' },
    section: { marginBottom: '2rem' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    sectionTitle: { fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' },
    card: { backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.375rem' },
    label: { fontSize: '0.875rem', fontWeight: '500', color: '#374151' },
    input: { padding: '0.625rem 0.875rem', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none' },
    textarea: { padding: '0.625rem 0.875rem', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none', resize: 'vertical' },
    button: { backgroundColor: '#7c3aed', color: '#ffffff', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: '500', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' },
    linkButton: { backgroundColor: '#7c3aed', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.375rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' },
    jobsList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    jobCard: { backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    jobTitle: { fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' },
    jobCompany: { fontSize: '0.875rem', color: '#6b7280' },
    jobMeta: { display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280' },
    statusOpen: { padding: '0.25rem 0.625rem', fontSize: '0.75rem', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '9999px' },
    statusClosed: { padding: '0.25rem 0.625rem', fontSize: '0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '9999px' },
    empty: { textAlign: 'center', padding: '2rem', color: '#6b7280' },
    loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }
};

export default Dashboard;
