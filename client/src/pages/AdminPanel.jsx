import React, { useState, useEffect } from 'react';
import { usersAPI, jobsAPI } from '../services/api';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const statsRes = await usersAPI.getDashboardStats();
            setStats(statsRes.data.data);

            const usersRes = await usersAPI.getAll();
            setUsers(usersRes.data.data);

            const jobsRes = await jobsAPI.getAll({ limit: 100 });
            setJobs(jobsRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserAction = async (userId, action) => {
        try {
            if (action === 'delete') {
                if (!window.confirm('Are you sure you want to delete this user?')) return;
                await usersAPI.delete(userId);
            } else {
                await usersAPI.update(userId, action === 'verify' ? { isVerified: true } : { isActive: action === 'activate' });
            }
            fetchData();
        } catch (error) {
            alert('Action failed');
        }
    };

    const handleJobAction = async (jobId, action) => {
        try {
            if (action === 'delete') {
                if (!window.confirm('Are you sure you want to delete this job?')) return;
                await jobsAPI.delete(jobId);
            } else {
                await jobsAPI.update(jobId, { status: action });
            }
            fetchData();
        } catch (error) {
            alert('Action failed');
        }
    };

    if (loading) {
        return <div style={styles.loading}><div className="spinner"></div></div>;
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>Admin Panel</h1>

                {/* Stats */}
                {stats && (
                    <div style={styles.statsGrid}>
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
                            <div style={styles.statLabel}>Jobs</div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statNumber}>{stats.applications}</div>
                            <div style={styles.statLabel}>Applications</div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div style={styles.tabs}>
                    <button style={activeTab === 'users' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('users')}>
                        Users ({users.length})
                    </button>
                    <button style={activeTab === 'jobs' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('jobs')}>
                        Jobs ({jobs.length})
                    </button>
                </div>

                {/* Users Table */}
                {activeTab === 'users' && (
                    <div style={styles.table}>
                        <table style={styles.tableElement}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Role</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} style={styles.tr}>
                                        <td style={styles.td}>{user.name}</td>
                                        <td style={styles.td}>{user.email}</td>
                                        <td style={styles.td}>
                                            <span style={styles.badge}>{user.role}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={user.isActive ? styles.activeStatus : styles.inactiveStatus}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.actions}>
                                                {!user.isVerified && (
                                                    <button onClick={() => handleUserAction(user._id, 'verify')} style={styles.actionButton}>
                                                        Verify
                                                    </button>
                                                )}
                                                {!user.isActive && (
                                                    <button onClick={() => handleUserAction(user._id, 'activate')} style={styles.actionButton}>
                                                        Activate
                                                    </button>
                                                )}
                                                {user.isActive && (
                                                    <button onClick={() => handleUserAction(user._id, 'deactivate')} style={styles.actionButton}>
                                                        Deactivate
                                                    </button>
                                                )}
                                                <button onClick={() => handleUserAction(user._id, 'delete')} style={{ ...styles.actionButton, color: '#ef4444' }}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Jobs Table */}
                {activeTab === 'jobs' && (
                    <div style={styles.table}>
                        <table style={styles.tableElement}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Title</th>
                                    <th style={styles.th}>Company</th>
                                    <th style={styles.th}>Location</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map(job => (
                                    <tr key={job._id} style={styles.tr}>
                                        <td style={styles.td}>{job.title}</td>
                                        <td style={styles.td}>{job.company}</td>
                                        <td style={styles.td}>{job.location}</td>
                                        <td style={styles.td}>
                                            <span style={job.status === 'open' ? styles.activeStatus : styles.inactiveStatus}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.actions}>
                                                {job.status === 'open' && (
                                                    <button onClick={() => handleJobAction(job._id, 'closed')} style={styles.actionButton}>
                                                        Close
                                                    </button>
                                                )}
                                                <button onClick={() => handleJobAction(job._id, 'delete')} style={{ ...styles.actionButton, color: '#ef4444' }}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', paddingTop: '5rem', paddingBottom: '4rem', backgroundColor: '#f9fafb' },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' },
    title: { fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' },
    statCard: { backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.25rem', textAlign: 'center' },
    statNumber: { fontSize: '1.5rem', fontWeight: '700', color: '#7c3aed' },
    statLabel: { fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' },
    tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
    tab: { backgroundColor: '#ffffff', color: '#6b7280', padding: '0.625rem 1.25rem', borderRadius: '0.375rem', fontWeight: '500', border: '1px solid #e5e7eb', cursor: 'pointer' },
    activeTab: { backgroundColor: '#7c3aed', color: '#ffffff', padding: '0.625rem 1.25rem', borderRadius: '0.375rem', fontWeight: '500', border: 'none', cursor: 'pointer' },
    table: { backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' },
    tableElement: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
    tr: { borderBottom: '1px solid #e5e7eb' },
    td: { padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#374151' },
    badge: { padding: '0.125rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#ede9fe', color: '#6d28d9', borderRadius: '9999px' },
    activeStatus: { color: '#059669', fontSize: '0.875rem' },
    inactiveStatus: { color: '#dc2626', fontSize: '0.875rem' },
    actions: { display: 'flex', gap: '0.5rem' },
    actionButton: { backgroundColor: 'transparent', color: '#6b7280', padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.25rem', cursor: 'pointer' },
    loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }
};

export default AdminPanel;
