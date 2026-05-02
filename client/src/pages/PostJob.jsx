import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';

const PostJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        description: '',
        location: '',
        remote: false,
        jobType: 'full-time',
        experience: 'mid',
        category: 'engineering',
        salaryMin: '',
        salaryMax: '',
        requirements: '',
        responsibilities: '',
        skills: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                ...formData,
                salary: {
                    min: parseInt(formData.salaryMin) || 0,
                    max: parseInt(formData.salaryMax) || 0,
                    currency: 'USD'
                },
                requirements: formData.requirements.split('\n').filter(r => r.trim()),
                responsibilities: formData.responsibilities.split('\n').filter(r => r.trim()),
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
            };

            await jobsAPI.create(data);
            alert('Job posted successfully!');
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>Post a New Job</h1>

                <div style={styles.card}>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGrid}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Job Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Company Name *</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                style={styles.textarea}
                                rows={5}
                                required
                            />
                        </div>

                        <div style={styles.formGrid}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="e.g., New York, NY"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Job Type</label>
                                <select name="jobType" value={formData.jobType} onChange={handleChange} style={styles.input}>
                                    <option value="full-time">Full Time</option>
                                    <option value="part-time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                    <option value="temporary">Temporary</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.formGrid}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Experience Level</label>
                                <select name="experience" value={formData.experience} onChange={handleChange} style={styles.input}>
                                    <option value="entry">Entry Level</option>
                                    <option value="mid">Mid Level</option>
                                    <option value="senior">Senior Level</option>
                                    <option value="lead">Lead</option>
                                    <option value="executive">Executive</option>
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} style={styles.input}>
                                    <option value="engineering">Engineering</option>
                                    <option value="design">Design</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="sales">Sales</option>
                                    <option value="customer-service">Customer Service</option>
                                    <option value="hr">HR</option>
                                    <option value="finance">Finance</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="education">Education</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.formGrid}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Minimum Salary (USD/year)</label>
                                <input
                                    type="number"
                                    name="salaryMin"
                                    value={formData.salaryMin}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="e.g., 50000"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Maximum Salary (USD/year)</label>
                                <input
                                    type="number"
                                    name="salaryMax"
                                    value={formData.salaryMax}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="e.g., 100000"
                                />
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Requirements (one per line)</label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                style={styles.textarea}
                                rows={4}
                                placeholder="Bachelor's degree in Computer Science&#10;3+ years of experience&#10;Strong communication skills"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Responsibilities (one per line)</label>
                            <textarea
                                name="responsibilities"
                                value={formData.responsibilities}
                                onChange={handleChange}
                                style={styles.textarea}
                                rows={4}
                                placeholder="Develop full-stack applications&#10;Collaborate with team members&#10;Participate in code reviews"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Skills (comma-separated)</label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="React, Node.js, MongoDB, JavaScript"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    name="remote"
                                    checked={formData.remote}
                                    onChange={handleChange}
                                />
                                <span>This is a remote position</span>
                            </label>
                        </div>

                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? 'Posting...' : 'Post Job'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', paddingTop: '5rem', paddingBottom: '4rem', backgroundColor: '#f9fafb' },
    container: { maxWidth: '700px', margin: '0 auto', padding: '0 1rem' },
    title: { fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' },
    card: { backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '2rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.375rem' },
    label: { fontSize: '0.875rem', fontWeight: '500', color: '#374151' },
    input: { padding: '0.625rem 0.875rem', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none' },
    textarea: { padding: '0.625rem 0.875rem', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none', resize: 'vertical' },
    checkbox: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563', cursor: 'pointer' },
    button: { backgroundColor: '#7c3aed', color: '#ffffff', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: '500', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }
};

export default PostJob;
