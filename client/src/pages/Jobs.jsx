import React, { useState, useEffect } from 'react';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        jobType: '',
        category: '',
        remote: false
    });
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });

    useEffect(() => {
        fetchJobs();
    }, [filters, pagination.page]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                page: pagination.page,
                limit: 10
            };
            // Remove empty filters
            Object.keys(params).forEach(key => {
                if (!params[key]) delete params[key];
            });

            const res = await jobsAPI.getAll(params);
            setJobs(res.data.data);
            setPagination(prev => ({
                ...prev,
                totalPages: res.data.totalPages,
                total: res.data.total
            }));
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'temporary'];
    const categories = [
        'engineering', 'design', 'marketing', 'sales',
        'customer-service', 'hr', 'finance', 'healthcare', 'education', 'other'
    ];

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Browse Jobs</h1>
                    <p style={styles.subtitle}>{pagination.total} jobs available</p>
                </div>

                {/* Filters */}
                <div style={styles.filtersCard}>
                    <form onSubmit={handleSearch} style={styles.filtersForm}>
                        <div style={styles.filtersGrid}>
                            <div style={styles.filterGroup}>
                                <input
                                    type="text"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Search jobs..."
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.filterGroup}>
                                <input
                                    type="text"
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    placeholder="Location"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.filterGroup}>
                                <select
                                    name="jobType"
                                    value={filters.jobType}
                                    onChange={handleFilterChange}
                                    style={styles.input}
                                >
                                    <option value="">All Job Types</option>
                                    {jobTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.filterGroup}>
                                <select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    style={styles.input}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.filterGroup}>
                                <label style={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        name="remote"
                                        checked={filters.remote}
                                        onChange={handleFilterChange}
                                    />
                                    <span>Remote Only</span>
                                </label>
                            </div>
                        </div>
                        <button type="submit" style={styles.searchButton}>Search</button>
                    </form>
                </div>

                {/* Jobs List */}
                {loading ? (
                    <div style={styles.loading}>
                        <div className="spinner"></div>
                    </div>
                ) : jobs.length > 0 ? (
                    <>
                        <div style={styles.jobsList}>
                            {jobs.map(job => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div style={styles.pagination}>
                                <button
                                    style={styles.pageButton}
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                >
                                    Previous
                                </button>
                                <span style={styles.pageInfo}>
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                                <button
                                    style={styles.pageButton}
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === pagination.totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={styles.empty}>
                        <p>No jobs found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', paddingTop: '5rem', paddingBottom: '4rem', backgroundColor: '#f9fafb' },
    container: { maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' },
    subtitle: { fontSize: '1rem', color: '#6b7280' },
    filtersCard: { backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem', marginBottom: '2rem' },
    filtersForm: { display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' },
    filtersGrid: { display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1 },
    filterGroup: { flex: '1 1 200px' },
    input: { width: '100%', padding: '0.625rem 0.875rem', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none' },
    checkbox: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563', cursor: 'pointer', marginTop: '0.5rem' },
    searchButton: { backgroundColor: '#7c3aed', color: '#ffffff', padding: '0.625rem 1.5rem', borderRadius: '0.375rem', fontWeight: '500', border: 'none', cursor: 'pointer' },
    jobsList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    loading: { display: 'flex', justifyContent: 'center', padding: '4rem' },
    empty: { textAlign: 'center', padding: '4rem', color: '#6b7280' },
    pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' },
    pageButton: { backgroundColor: '#ffffff', color: '#4b5563', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '500', border: '1px solid #d1d5db', cursor: 'pointer' },
    pageInfo: { fontSize: '0.875rem', color: '#6b7280' }
};

export default Jobs;
