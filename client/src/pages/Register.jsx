import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'candidate'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Create Account</h1>
                        <p style={styles.subtitle}>Join RightPlace today</p>
                    </div>

                    {error && (
                        <div style={styles.error}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="Create a password"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>I am a...</label>
                            <div style={styles.roleButtons}>
                                <button
                                    type="button"
                                    style={formData.role === 'candidate' ? styles.roleButtonActive : styles.roleButton}
                                    onClick={() => setFormData({ ...formData, role: 'candidate' })}
                                >
                                    <span style={styles.roleIcon}>👤</span>
                                    <span>Candidate</span>
                                    <span style={styles.roleDesc}>Looking for a job</span>
                                </button>
                                <button
                                    type="button"
                                    style={formData.role === 'employer' ? styles.roleButtonActive : styles.roleButton}
                                    onClick={() => setFormData({ ...formData, role: 'employer' })}
                                >
                                    <span style={styles.roleIcon}>🏢</span>
                                    <span>Employer</span>
                                    <span style={styles.roleDesc}>Hiring talent</span>
                                </button>
                            </div>
                        </div>

                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p style={styles.footer}>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', backgroundColor: '#f9fafb' },
    container: { width: '100%', maxWidth: '32rem' },
    card: { backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '2rem' },
    header: { textAlign: 'center', marginBottom: '1.5rem' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' },
    subtitle: { fontSize: '0.875rem', color: '#6b7280' },
    error: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.375rem', marginBottom: '1rem', fontSize: '0.875rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.375rem' },
    label: { fontSize: '0.875rem', fontWeight: '500', color: '#374151' },
    input: { padding: '0.625rem 0.875rem', fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none', transition: 'border-color 0.2s' },
    roleButtons: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' },
    roleButton: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '1rem', backgroundColor: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' },
    roleButtonActive: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '1rem', backgroundColor: '#ede9fe', border: '2px solid #7c3aed', borderRadius: '0.5rem', cursor: 'pointer' },
    roleIcon: { fontSize: '1.5rem' },
    roleDesc: { fontSize: '0.75rem', color: '#6b7280' },
    button: { backgroundColor: '#7c3aed', color: '#ffffff', padding: '0.75rem 1rem', borderRadius: '0.375rem', fontWeight: '500', fontSize: '0.875rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', marginTop: '0.5rem' },
    footer: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }
};

export default Register;
