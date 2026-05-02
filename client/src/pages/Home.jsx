import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';

const Home = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await jobsAPI.getAll({ limit: 6 });
                setJobs(res.data.data);
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>
                        Find Your <span style={styles.highlight}>Dream Job</span>
                    </h1>
                    <p style={styles.heroSubtitle}>
                        Connect with top companies and discover opportunities that match your skills and ambitions.
                    </p>
                    <div style={styles.heroButtons}>
                        <Link to="/jobs" style={styles.primaryButton}>Browse Jobs</Link>
                        <Link to="/register" style={styles.secondaryButton}>Post a Job</Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={styles.stats}>
                <div style={styles.container}>
                    <div style={styles.statsGrid}>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>10,000+</span>
                            <span style={styles.statLabel}>Active Jobs</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>5,000+</span>
                            <span style={styles.statLabel}>Companies</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>50,000+</span>
                            <span style={styles.statLabel}>Candidates</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>25,000+</span>
                            <span style={styles.statLabel}>Hired</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Jobs */}
            <section style={styles.section}>
                <div style={styles.container}>
                    <div style={styles.sectionHeader}>
                        <div>
                            <h2 style={styles.sectionTitle}>Featured Jobs</h2>
                            <p style={styles.sectionSubtitle}>Latest opportunities from top companies</p>
                        </div>
                        <Link to="/jobs" style={styles.viewAll}>View All →</Link>
                    </div>

                    {loading ? (
                        <div style={styles.loading}>
                            <div className="spinner"></div>
                        </div>
                    ) : jobs.length > 0 ? (
                        <div style={styles.jobsGrid}>
                            {jobs.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>
                    ) : (
                        <div style={styles.empty}>
                            <p>No jobs available at the moment. Check back soon!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section style={styles.section}>
                <div style={styles.container}>
                    <h2 style={styles.sectionTitle}>How It Works</h2>
                    <div style={styles.stepsGrid}>
                        <div style={styles.step}>
                            <div style={styles.stepNumber}>1</div>
                            <h3 style={styles.stepTitle}>Create Your Profile</h3>
                            <p style={styles.stepText}>Sign up and build your professional profile with your skills and experience.</p>
                        </div>
                        <div style={styles.step}>
                            <div style={styles.stepNumber}>2</div>
                            <h3 style={styles.stepTitle}>Search Jobs</h3>
                            <p style={styles.stepText}>Browse thousands of job listings and filter by location, salary, and more.</p>
                        </div>
                        <div style={styles.step}>
                            <div style={styles.stepNumber}>3</div>
                            <h3 style={styles.stepTitle}>Apply & Get Hired</h3>
                            <p style={styles.stepText}>Submit your application and connect with employers directly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={styles.cta}>
                <div style={styles.container}>
                    <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
                    <p style={styles.ctaText}>Join thousands of professionals who found their dream job on RightPlace.</p>
                    <Link to="/register" style={styles.ctaButton}>Sign Up Now</Link>
                </div>
            </section>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh' },
    hero: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '6rem 1rem',
        textAlign: 'center'
    },
    heroContent: { maxWidth: '800px', margin: '0 auto' },
    heroTitle: { fontSize: '3rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem' },
    highlight: { color: '#fcd34d' },
    heroSubtitle: { fontSize: '1.25rem', color: '#e0e7ff', marginBottom: '2rem', lineHeight: '1.6' },
    heroButtons: { display: 'flex', gap: '1rem', justifyContent: 'center' },
    primaryButton: { backgroundColor: '#ffffff', color: '#7c3aed', padding: '0.875rem 2rem', borderRadius: '0.5rem', fontWeight: '600', textDecoration: 'none', transition: 'transform 0.2s' },
    secondaryButton: { backgroundColor: 'transparent', color: '#ffffff', border: '2px solid #ffffff', padding: '0.875rem 2rem', borderRadius: '0.5rem', fontWeight: '600', textDecoration: 'none', transition: 'transform 0.2s' },
    stats: { backgroundColor: '#7c3aed', padding: '3rem 1rem' },
    container: { maxWidth: '1200px', margin: '0 auto' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' },
    statItem: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    statNumber: { fontSize: '2rem', fontWeight: '700', color: '#ffffff' },
    statLabel: { fontSize: '0.875rem', color: '#e0e7ff' },
    section: { padding: '4rem 1rem' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    sectionTitle: { fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' },
    sectionSubtitle: { fontSize: '1rem', color: '#6b7280' },
    viewAll: { color: '#7c3aed', textDecoration: 'none', fontWeight: '500' },
    jobsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' },
    loading: { display: 'flex', justifyContent: 'center', padding: '4rem' },
    empty: { textAlign: 'center', padding: '4rem', color: '#6b7280' },
    stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '3rem' },
    step: { textAlign: 'center', padding: '2rem' },
    stepNumber: { width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#7c3aed', color: '#ffffff', fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' },
    stepTitle: { fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' },
    stepText: { color: '#6b7280', lineHeight: '1.6' },
    cta: { backgroundColor: '#f3f4f6', padding: '4rem 1rem', textAlign: 'center' },
    ctaTitle: { fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' },
    ctaText: { fontSize: '1rem', color: '#6b7280', marginBottom: '1.5rem' },
    ctaButton: { display: 'inline-block', backgroundColor: '#7c3aed', color: '#ffffff', padding: '0.875rem 2rem', borderRadius: '0.5rem', fontWeight: '600', textDecoration: 'none' }
};

export default Home;
