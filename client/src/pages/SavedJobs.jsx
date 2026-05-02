import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';

const SavedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        setLoading(true);
        try {
            const res = await jobsAPI.getSaved();
            setJobs(res.data.data);
        } catch (error) {
            console.error('Failed to fetch saved jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (jobId) => {
        try {
            await jobsAPI.save(jobId);
            setJobs(jobs.filter(job => job._id !== jobId));
        } catch (error) {
            alert('Failed to unsave job');
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>Saved Jobs</h1>

                {loading ? (
                    <div style={styles.loading}>
                        <div className="spinner"></div>
                    </div>
                ) : jobs.length > 0 ? (
                    <div style={styles.jobsList}>
                        {jobs.map(job => (
                            <JobCard key={job._id} job={job} onSave={handleUnsave} />
                        ))}
                    </div>
                ) : (
                    <div style={styles.empty}>
                        <p>No saved jobs yet.</p>
                        <Link to="/jobs" style={styles.link}>Browse Jobs</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', paddingTop: '5rem', paddingBottom: '4rem', backgroundColor: '#f9fafb' },
    container: { maxWidth: '800px', margin: '0 auto', padding: '0 1rem' },
    title: { fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' },
    jobsList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    loading: { display: 'flex', justifyContent: 'center', padding: '4rem' },
    empty: { textAlign: 'center', padding: '4rem', color: '#6b7280' },
    link: { display: 'inline-block', marginTop: '1rem', color: '#7c3aed', textDecoration: 'none' }
};

export default SavedJobs;
