import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';

/* ── Animated Counter ─────────────────────────────── */
const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const startTime = performance.now();
                    const animate = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 4);
                        setCount(Math.floor(eased * end));
                        if (progress < 1) requestAnimationFrame(animate);
                        else setCount(end);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ── Typewriter ───────────────────────────────────── */
const roles = ['College', 'Course', 'Career', 'Dream Job', 'Exam Strategy'];

const Typewriter = () => {
    const [roleIdx, setRoleIdx] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const role = roles[roleIdx];
        let timeout;
        if (!deleting && displayed.length < role.length) {
            timeout = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 70);
        } else if (!deleting && displayed.length === role.length) {
            timeout = setTimeout(() => setDeleting(true), 2000);
        } else if (deleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
        } else if (deleting && displayed.length === 0) {
            setDeleting(false);
            setRoleIdx((i) => (i + 1) % roles.length);
        }
        return () => clearTimeout(timeout);
    }, [displayed, deleting, roleIdx]);

    return (
        <span style={{
            background: 'linear-gradient(135deg, #7c5af6 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            borderRight: '3px solid #7c5af6', paddingRight: 4,
            animation: 'blink 1.1s step-end infinite',
            minWidth: 20, display: 'inline-block'
        }}>
            {displayed}
        </span>
    );
};

/* ── Features Data ────────────────────────────────── */
const features = [
    {
        icon: '🤖',
        title: 'AI-Powered Matching',
        desc: 'Our AI analyzes your skills and experience to find jobs with the highest compatibility score.',
        color: '#7c5af6'
    },
    {
        icon: '📄',
        title: 'Resume Builder & Scorer',
        desc: 'Build ATS-optimized resumes and get instant scoring with actionable improvement tips.',
        color: '#a855f7'
    },
    {
        icon: '🎯',
        title: 'Interview Coach',
        desc: 'AI-powered mock interviews with real-time feedback tailored to your target role.',
        color: '#6366f1'
    },
    {
        icon: '📊',
        title: 'Application Tracker',
        desc: 'Visualize your entire job search pipeline with a beautiful Kanban-style board.',
        color: '#06b6d4'
    },
    {
        icon: '💡',
        title: 'Skill Gap Analysis',
        desc: 'Discover which skills to learn next to unlock higher-paying opportunities.',
        color: '#10b981'
    },
    {
        icon: '💰',
        title: 'Salary Intelligence',
        desc: 'Access real-time salary data by role, company, location, and experience level.',
        color: '#f59e0b'
    },
];

/* ── Testimonials Data ────────────────────────────── */
const testimonials = [
    {
        name: 'Sarah Chen', role: 'Software Engineer @ Google',
        avatar: 'SC', avatarBg: '#7c5af6',
        text: 'RightPlace matched me with my dream job at Google in just 3 weeks. The AI resume scorer boosted my callback rate by 4x.',
        stars: 5,
    },
    {
        name: 'Marcus Williams', role: 'Product Manager @ Stripe',
        avatar: 'MW', avatarBg: '#6366f1',
        text: 'The interview prep feature is unbelievable. It predicted 8 out of 10 questions I was asked in my final interview.',
        stars: 5,
    },
    {
        name: 'Priya Patel', role: 'Data Scientist @ Airbnb',
        avatar: 'PP', avatarBg: '#a855f7',
        text: 'I went from 0 callbacks to 6 interviews in a month after using the AI cover letter generator. Life-changing.',
        stars: 5,
    },
    {
        name: 'James O\'Brien', role: 'UX Designer @ Linear',
        avatar: 'JO', avatarBg: '#06b6d4',
        text: 'The company culture insights helped me filter for places I\'d actually thrive. Joined Linear 3 months ago and love it.',
        stars: 5,
    },
];

/* ── Company Logos ────────────────────────────────── */
const companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Stripe', 'Airbnb', 'Figma', 'Linear', 'Notion', 'OpenAI'];

/* ── FAQ Data ─────────────────────────────────────── */
const faqs = [
    { q: 'Is RightPlace free to use?', a: 'Yes! Core features including job search, basic applications, and profile creation are completely free. Premium AI features are available on our Pro plan.' },
    { q: 'How does the AI job matching work?', a: 'Our AI analyzes your skills, experience, location preferences, and career goals to compute a compatibility score for every job. We consider 40+ factors to surface the most relevant opportunities.' },
    { q: 'Can employers see my profile?', a: 'Your profile is only visible to verified employers when you apply or when you enable "Open to Opportunities" mode. You have full control over your visibility.' },
    { q: 'How accurate is the Resume ATS Scorer?', a: 'Our scorer is trained on data from 50,000+ ATS systems and 2M+ resumes. It achieves 94% accuracy in predicting ATS pass rates.' },
    { q: 'What makes RightPlace different from LinkedIn or Indeed?', a: 'Unlike generic job boards, we combine a curated job database with AI-powered career tools in one place — resume builder, interview coach, skill gap analysis, and salary intelligence all at no extra cost.' },
];

/* ── Steps ────────────────────────────────────────── */
const steps = [
    { n: '01', title: 'Create Your Profile', desc: 'Upload your resume or use our AI builder to create a stunning profile in minutes.', icon: '✨' },
    { n: '02', title: 'Get AI-Matched', desc: 'Our AI finds jobs matching your skills, salary expectations, and culture preferences.', icon: '🎯' },
    { n: '03', title: 'Apply in 1 Click', desc: 'Apply instantly with your pre-filled profile. Track every application in real-time.', icon: '🚀' },
    { n: '04', title: 'Land the Job', desc: 'Use our AI interview coach to prepare and negotiate the best offer with salary intelligence.', icon: '🏆' },
];

/* ══════════════════════════════════════════════════
   MAIN HOME COMPONENT
   ══════════════════════════════════════════════════ */
const Home = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [openFaq, setOpenFaq] = useState(null);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await jobsAPI.getAll({ limit: 6 });
                setJobs(res.data.data || []);
            } catch { } finally { setLoading(false); }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        const t = setInterval(() => setActiveTestimonial(i => (i + 1) % testimonials.length), 5000);
        return () => clearInterval(t);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/jobs?search=${search}&location=${location}`);
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        setSubscribed(true);
        setEmail('');
    };

    return (
        <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
            <style>{`
                @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
                @keyframes gradientFlow { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }
                @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)} }
                @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
                @keyframes orbit { from{transform:rotate(0deg) translateX(120px) rotate(0deg)}to{transform:rotate(360deg) translateX(120px) rotate(-360deg)} }
                @keyframes infiniteScroll { from{transform:translateX(0)}to{transform:translateX(-50%)} }
                .hero-orb { animation: float 6s ease-in-out infinite; }
                .scroll-logos { animation: infiniteScroll 25s linear infinite; }
                .scroll-logos:hover { animation-play-state: paused; }
                .feature-card:hover { transform: translateY(-6px) !important; }
                .step-card:hover { transform: translateY(-4px) scale(1.02) !important; }
            `}</style>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                HERO SECTION
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)',
                position: 'relative', overflow: 'hidden', display: 'flex',
                alignItems: 'center', paddingTop: 70,
            }}>
                {/* Background mesh */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <div style={{
                        position: 'absolute', top: '15%', left: '8%', width: 420, height: 420,
                        borderRadius: '50%', filter: 'blur(80px)', opacity: 0.25,
                        background: 'radial-gradient(circle, #7c5af6 0%, transparent 70%)',
                    }} className="hero-orb" />
                    <div style={{
                        position: 'absolute', bottom: '10%', right: '8%', width: 360, height: 360,
                        borderRadius: '50%', filter: 'blur(80px)', opacity: 0.2,
                        background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                        animationDelay: '2s'
                    }} className="hero-orb" />
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                        width: 600, height: 600, borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1,
                        background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
                    }} />
                    {/* Grid pattern */}
                    <div style={{
                        position: 'absolute', inset: 0, opacity: 0.06,
                        backgroundImage: `linear-gradient(rgba(124,90,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,90,246,0.5) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }} />
                </div>

                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem', width: '100%', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', maxWidth: 860, margin: '0 auto' }}>
                        {/* Label */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '0.4rem 1rem', borderRadius: 100,
                            background: 'rgba(124,90,246,0.15)', border: '1px solid rgba(124,90,246,0.3)',
                            marginBottom: '1.75rem', animation: 'fadeInUp 0.6s ease both',
                        }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                AI-Powered Education & Career Platform
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 900,
                            color: '#f0eeff', lineHeight: 1.1, letterSpacing: '-0.04em',
                            marginBottom: '1.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
                            animation: 'fadeInUp 0.6s 0.1s ease both',
                        }}>
                            Discover Your Perfect{' '}
                            <br />
                            <Typewriter />
                        </h1>

                        {/* Subtitle */}
                        <p style={{
                            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'rgba(240,238,255,0.7)',
                            lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 620, margin: '0 auto 2.5rem',
                            animation: 'fadeInUp 0.6s 0.2s ease both',
                        }}>
                            The smartest way to navigate your educational journey and land your dream job. AI matches you to colleges, exams, and roles that fit your goals.
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} style={{
                            display: 'flex', gap: '0', maxWidth: 700, margin: '0 auto 2rem',
                            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(124,90,246,0.3)', borderRadius: 16, padding: 6,
                            animation: 'fadeInUp 0.6s 0.3s ease both',
                        }}>
                            <input
                                type="text" placeholder="Search colleges, exams, or jobs..."
                                value={search} onChange={e => setSearch(e.target.value)}
                                style={{
                                    flex: 2, padding: '0.875rem 1rem',
                                    background: 'transparent', border: 'none', outline: 'none',
                                    color: '#f0eeff', fontSize: '0.9375rem',
                                }}
                            />
                            <div style={{ width: 1, background: 'rgba(124,90,246,0.3)', margin: '8px 0' }} />
                            <input
                                type="text" placeholder="Location or Remote"
                                value={location} onChange={e => setLocation(e.target.value)}
                                style={{
                                    flex: 1, padding: '0.875rem 1rem',
                                    background: 'transparent', border: 'none', outline: 'none',
                                    color: '#f0eeff', fontSize: '0.9375rem',
                                }}
                            />
                            <button type="submit" style={{
                                padding: '0.75rem 1.5rem', borderRadius: 12, border: 'none',
                                background: 'linear-gradient(135deg, #7c5af6, #a855f7)',
                                color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(124,90,246,0.4)', flexShrink: 0,
                                transition: 'all 0.2s ease',
                            }}>Search Jobs</button>
                        </form>

                        {/* Quick filters */}
                        <div style={{
                            display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap',
                            animation: 'fadeInUp 0.6s 0.4s ease both',
                        }}>
                            {['Remote', 'Full-Time', 'Engineering', 'Design', 'Product'].map(tag => (
                                <Link key={tag} to={`/jobs?category=${tag.toLowerCase()}`} style={{
                                    padding: '0.3rem 0.875rem', borderRadius: 100,
                                    fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none',
                                    background: 'rgba(255,255,255,0.08)', color: 'rgba(240,238,255,0.8)',
                                    border: '1px solid rgba(124,90,246,0.25)', transition: 'all 0.2s ease',
                                }}>#{tag}</Link>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div style={{
                            display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap',
                            marginTop: '2rem', animation: 'fadeInUp 0.6s 0.5s ease both',
                        }}>
                            <Link to="/register" style={{
                                padding: '0.875rem 2rem', borderRadius: 12, fontWeight: 700,
                                fontSize: '1rem', textDecoration: 'none', color: '#fff',
                                background: 'linear-gradient(135deg, #7c5af6, #a855f7)',
                                boxShadow: '0 8px 24px rgba(124,90,246,0.45)',
                                transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: 8,
                            }}>Get Started Free →</Link>
                            <Link to="/jobs" style={{
                                padding: '0.875rem 2rem', borderRadius: 12, fontWeight: 700,
                                fontSize: '1rem', textDecoration: 'none', color: '#f0eeff',
                                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.2s ease',
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                            }}>Browse Jobs</Link>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div style={{
                    position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    animation: 'float 2s ease-in-out infinite',
                }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(240,238,255,0.4)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
                    <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(124,90,246,0.6), transparent)', borderRadius: 2 }} />
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                STATS SECTION
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section style={{
                padding: '4rem 1.5rem',
                background: 'linear-gradient(135deg, #7c5af6 0%, #6366f1 50%, #a855f7 100%)',
                backgroundSize: '200% 200%', animation: 'gradientFlow 8s ease-in-out infinite',
            }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem', textAlign: 'center'
                    }}>
                        {[
                            { end: 10000, suffix: '+', label: 'Active Jobs', icon: '💼' },
                            { end: 5000, suffix: '+', label: 'Companies', icon: '🏢' },
                            { end: 250000, suffix: '+', label: 'Candidates', icon: '👩‍💻' },
                            { end: 95000, suffix: '+', label: 'Hired', icon: '🎉' },
                        ].map(({ end, suffix, label, icon }) => (
                            <div key={label} style={{ padding: '1.5rem' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
                                <div style={{
                                    fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900,
                                    color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    lineHeight: 1, letterSpacing: '-0.03em'
                                }}>
                                    <AnimatedCounter end={end} suffix={suffix} />
                                </div>
                                <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600, marginTop: '0.5rem' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TRUSTED COMPANIES MARQUEE
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section style={{ padding: '3rem 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', overflow: 'hidden', background: 'var(--bg-elevated)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', paddingInline: '1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                        Trusted by people from the world's best companies
                    </p>
                </div>
                <div style={{ overflow: 'hidden', width: '100%' }}>
                    <div className="scroll-logos" style={{ display: 'flex', gap: '3rem', width: 'max-content' }}>
                        {[...companies, ...companies].map((c, i) => (
                            <span key={i} style={{
                                fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-subtle)',
                                opacity: 0.5, letterSpacing: '-0.02em', whiteSpace: 'nowrap',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                transition: 'opacity 0.2s ease',
                            }}>{c}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                FEATURES SECTION
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-base)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '0.35rem 1rem', borderRadius: 100, marginBottom: '1rem',
                            background: 'rgba(124,90,246,0.1)', border: '1px solid rgba(124,90,246,0.2)',
                        }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Features</span>
                        </div>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-heading)',
                            letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif",
                            marginBottom: '1rem', lineHeight: 1.15,
                        }}>
                            Everything you need to{' '}
                            <span style={{ background: 'linear-gradient(135deg, #7c5af6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                land your dream job
                            </span>
                        </h2>
                        <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                            One platform with all the AI tools, insights, and opportunities you need to accelerate your career.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {features.map(({ icon, title, desc, color }) => (
                            <div key={title} className="feature-card" style={{
                                background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
                                borderRadius: 20, padding: '2rem', cursor: 'default',
                                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                boxShadow: 'var(--shadow-sm)',
                            }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14, marginBottom: '1.25rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.5rem', background: `${color}15`, border: `1px solid ${color}25`,
                                }}>{icon}</div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.625rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                FEATURED JOBS SECTION
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-surface)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.35rem 1rem',
                                borderRadius: 100, marginBottom: '0.75rem',
                                background: 'rgba(124,90,246,0.1)', border: '1px solid rgba(124,90,246,0.2)',
                            }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    🔥 Hot Right Now
                                </span>
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                Featured Jobs
                            </h2>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.375rem', fontSize: '1rem' }}>
                                Handpicked opportunities from top companies
                            </p>
                        </div>
                        <Link to="/jobs" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '0.625rem 1.25rem', borderRadius: 10, fontWeight: 600,
                            fontSize: '0.875rem', textDecoration: 'none',
                            color: 'var(--brand-600)', background: 'rgba(124,90,246,0.08)',
                            border: '1px solid rgba(124,90,246,0.2)', transition: 'all 0.2s ease',
                        }}>View all jobs →</Link>
                    </div>

                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                            {[1,2,3,4,5,6].map(i => (
                                <div key={i} style={{ borderRadius: 20, padding: '1.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-light)' }}>
                                    <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 12 }} />
                                    <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 16 }} />
                                    <div className="skeleton" style={{ height: 10, width: '80%', marginBottom: 8 }} />
                                    <div className="skeleton" style={{ height: 10, width: '70%' }} />
                                </div>
                            ))}
                        </div>
                    ) : jobs.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                            {jobs.map(job => <JobCard key={job._id} job={job} />)}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border-light)' }}>
                            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No jobs available yet. Check back soon!</p>
                            <Link to="/post-job" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.625rem 1.25rem', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', color: '#fff', background: 'linear-gradient(135deg, #7c5af6, #a855f7)' }}>Post the First Job</Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                HOW IT WORKS
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-base)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '0.75rem' }}>
                            How It Works
                        </h2>
                        <p style={{ fontSize: '1.0625rem', color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>
                            From signup to job offer in 4 simple steps
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem' }}>
                        {steps.map(({ n, title, desc, icon }, i) => (
                            <div key={n} className="step-card" style={{
                                background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
                                borderRadius: 20, padding: '2rem', textAlign: 'center',
                                transition: 'all 0.3s ease', boxShadow: 'var(--shadow-sm)', position: 'relative',
                            }}>
                                {i < steps.length - 1 && (
                                    <div style={{
                                        position: 'absolute', top: '50%', right: -25, transform: 'translateY(-50%)',
                                        fontSize: '1.5rem', color: 'var(--text-subtle)', zIndex: 2,
                                        display: 'none'
                                    }}>→</div>
                                )}
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
                                <div style={{
                                    fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em',
                                    textTransform: 'uppercase', color: 'var(--brand-600)', marginBottom: '0.75rem'
                                }}>{n}</div>
                                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.625rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                TESTIMONIALS
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-surface)' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '0.75rem' }}>
                            What Our Users Say
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.0625rem' }}>Real stories from real people who found their dream jobs</p>
                    </div>

                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                            background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
                            borderRadius: 24, padding: '3rem', boxShadow: 'var(--shadow-lg)',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1.25rem', color: '#f59e0b', letterSpacing: 4 }}>{'★'.repeat(testimonials[activeTestimonial].stars)}</div>
                            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '2rem', fontStyle: 'italic', maxWidth: 680, margin: '0 auto 2rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                "{testimonials[activeTestimonial].text}"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.875rem' }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: '50%',
                                    background: testimonials[activeTestimonial].avatarBg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontWeight: 800, fontSize: '1rem',
                                }}>{testimonials[activeTestimonial].avatar}</div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.9375rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        {testimonials[activeTestimonial].name}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                        {testimonials[activeTestimonial].role}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nav dots */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                            {testimonials.map((_, i) => (
                                <button key={i} onClick={() => setActiveTestimonial(i)} style={{
                                    width: i === activeTestimonial ? 24 : 8,
                                    height: 8, borderRadius: 4, border: 'none', cursor: 'pointer',
                                    background: i === activeTestimonial ? '#7c5af6' : 'var(--border-strong)',
                                    transition: 'all 0.3s ease',
                                }} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                FAQ
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-base)' }}>
                <div style={{ maxWidth: 760, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '0.75rem' }}>
                            Frequently Asked Questions
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.0625rem' }}>
                            Everything you need to know about RightPlace
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {faqs.map(({ q, a }, i) => (
                            <div key={i} style={{
                                background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
                                borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s ease',
                                ...(openFaq === i ? { borderColor: 'rgba(124,90,246,0.3)' } : {}),
                            }}>
                                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    width: '100%', padding: '1.25rem 1.5rem', textAlign: 'left',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    gap: '1rem',
                                }}>
                                    <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-heading)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{q}</span>
                                    <span style={{
                                        fontSize: '1.25rem', color: 'var(--brand-600)', flexShrink: 0,
                                        transition: 'transform 0.3s ease', transform: openFaq === i ? 'rotate(45deg)' : 'none',
                                    }}>+</span>
                                </button>
                                {openFaq === i && (
                                    <div style={{ padding: '0 1.5rem 1.25rem', animation: 'fadeInUp 0.2s ease' }}>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.8, margin: 0 }}>{a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                NEWSLETTER
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section style={{
                padding: '5rem 1.5rem',
                background: 'linear-gradient(135deg, #302b63 0%, #24243e 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: `radial-gradient(rgba(124,90,246,0.15) 1px, transparent 1px)`,
                    backgroundSize: '30px 30px',
                }} />
                <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#f0eeff', letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '0.75rem' }}>
                        Get Job Alerts in Your Inbox
                    </h2>
                    <p style={{ color: 'rgba(240,238,255,0.65)', fontSize: '1.0625rem', marginBottom: '2rem', lineHeight: 1.7 }}>
                        Subscribe and be the first to know about new opportunities that match your profile.
                    </p>
                    {subscribed ? (
                        <div style={{
                            padding: '1.25rem 2rem', borderRadius: 14,
                            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                            color: '#6ee7b7', fontWeight: 600, fontSize: '1rem',
                        }}>
                            🎉 You're subscribed! We'll send you the best opportunities.
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8, maxWidth: 480, margin: '0 auto' }}>
                            <input
                                type="email" required placeholder="Enter your email address"
                                value={email} onChange={e => setEmail(e.target.value)}
                                style={{
                                    flex: 1, padding: '0.875rem 1.125rem', borderRadius: 12,
                                    background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(124,90,246,0.35)', color: '#f0eeff',
                                    fontSize: '0.9rem', outline: 'none',
                                }}
                            />
                            <button type="submit" style={{
                                padding: '0.875rem 1.5rem', borderRadius: 12, border: 'none',
                                background: 'linear-gradient(135deg, #7c5af6, #a855f7)',
                                color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(124,90,246,0.4)', flexShrink: 0,
                            }}>Subscribe</button>
                        </form>
                    )}
                    <p style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.35)', marginTop: '1rem' }}>
                        No spam, ever. Unsubscribe anytime.
                    </p>
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                CTA SECTION
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <section style={{
                padding: '6rem 1.5rem',
                background: 'linear-gradient(135deg, #7c5af6 0%, #a855f7 50%, #6366f1 100%)',
                backgroundSize: '200% 200%', animation: 'gradientFlow 8s ease-in-out infinite',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: 700, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '1rem', lineHeight: 1.1 }}>
                        Your Dream Job Is Waiting
                    </h2>
                    <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
                        Join 250,000+ professionals who found their next opportunity on RightPlace. It's free to get started.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" style={{
                            padding: '1rem 2.5rem', borderRadius: 14, fontWeight: 700, fontSize: '1.0625rem',
                            textDecoration: 'none', color: '#7c5af6', background: '#fff',
                            boxShadow: '0 8px 28px rgba(0,0,0,0.2)', transition: 'all 0.25s ease',
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                        }}>Get Started — It's Free 🚀</Link>
                        <Link to="/jobs" style={{
                            padding: '1rem 2.5rem', borderRadius: 14, fontWeight: 700, fontSize: '1.0625rem',
                            textDecoration: 'none', color: '#fff',
                            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.3)', transition: 'all 0.25s ease',
                        }}>Browse Jobs</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
