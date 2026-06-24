import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ─── Simulated AI responses ──────────────────────── */
const generateResumeScore = (text) => {
    if (!text.trim()) return null;
    const words = text.split(/\s+/).length;
    const hasQuantified = /\d+%|\d+x|\$\d+|\d+ years?/i.test(text);
    const hasKeywords = /experience|skills|education|project|achieve|led|built|developed/i.test(text);
    const hasEmail = /@/.test(text);
    const hasPhone = /\d{10}|\d{3}[-.\s]\d{3}/.test(text);

    let score = 40;
    if (words > 200) score += 15;
    if (words > 400) score += 10;
    if (hasQuantified) score += 20;
    if (hasKeywords) score += 15;
    if (hasEmail) score += 5;
    if (hasPhone) score += 5;
    score = Math.min(score + Math.floor(Math.random() * 10), 97);

    const suggestions = [];
    if (!hasQuantified) suggestions.push('Add quantified achievements (e.g., "Increased revenue by 35%", "Led team of 8 engineers")');
    if (words < 200) suggestions.push('Resume is too short — aim for at least 400 words for ATS systems');
    if (!hasKeywords) suggestions.push('Include more action verbs: Led, Built, Architected, Delivered, Scaled');
    if (!hasEmail) suggestions.push('Add your professional email address');
    suggestions.push('Use bullet points for work experience descriptions');
    if (score < 75) suggestions.push('Add a Professional Summary section at the top');
    suggestions.push('Ensure consistent date formatting throughout');

    return {
        score,
        grade: score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : 'D',
        gradeColor: score >= 85 ? '#10b981' : score >= 70 ? '#7c5af6' : score >= 55 ? '#f59e0b' : '#f43f5e',
        suggestions: suggestions.slice(0, 5),
        breakdown: {
            'ATS Compatibility': Math.min(score + 5, 98),
            'Keyword Density': hasKeywords ? Math.min(score - 5, 90) : Math.max(score - 25, 30),
            'Formatting': Math.min(score + 8, 95),
            'Impact Statements': hasQuantified ? Math.min(score + 10, 99) : Math.max(score - 20, 25),
            'Completeness': Math.min(score + 2, 92),
        }
    };
};

const generateCoverLetter = async (jobTitle, company, skills, callback) => {
    const letter = `Dear Hiring Manager at ${company || '[Company Name]'},

I am writing to express my enthusiastic interest in the ${jobTitle || '[Job Title]'} position at ${company || '[Company Name]'}. As a passionate professional with expertise in ${skills || 'relevant technologies and methodologies'}, I am confident that my background aligns perfectly with your team's mission and goals.

Throughout my career, I have consistently delivered measurable results by leveraging ${skills ? skills.split(',').slice(0, 3).join(', ') : 'my core competencies'}. My approach combines technical excellence with strong communication and collaboration skills, enabling me to thrive in fast-paced environments and contribute meaningfully from day one.

What excites me most about ${company || 'your organization'} is your commitment to innovation and impact. I have followed your work closely and am inspired by the caliber of problems you're solving. I am eager to bring my unique perspective and drive to your team.

I would welcome the opportunity to discuss how my experience can contribute to ${company || 'your'} continued success. I am available at your earliest convenience for an interview.

Thank you for your time and consideration.

Best regards,
[Your Name]`;

    let i = 0;
    const interval = setInterval(() => {
        i += 3;
        callback(letter.slice(0, i));
        if (i >= letter.length) {
            callback(letter);
            clearInterval(interval);
        }
    }, 12);
    return () => clearInterval(interval);
};

const interviewQuestions = {
    engineering: [
        "Tell me about a time you had to debug a critical production issue under pressure.",
        "How do you approach system design for a service that needs to handle 1M requests/day?",
        "Describe your experience with microservices architecture and the tradeoffs you've encountered.",
        "How do you ensure code quality in a team environment?",
        "Walk me through how you'd design a URL shortener like bit.ly.",
        "How do you handle technical debt while keeping delivery velocity high?",
    ],
    design: [
        "Walk me through your design process from discovery to delivery.",
        "Tell me about a design decision you made that was controversial — how did you navigate it?",
        "How do you balance business goals with user needs?",
        "Describe your experience with design systems and how you've contributed to one.",
        "How do you measure the success of a design after launch?",
        "Tell me about a time you had to redesign something based on user research findings.",
    ],
    marketing: [
        "Describe a campaign you led from strategy to execution. What was the outcome?",
        "How do you approach building a content strategy for a new product?",
        "Tell me about a time you had to pivot a marketing strategy mid-execution.",
        "How do you measure marketing ROI and which metrics matter most to you?",
        "Walk me through how you'd launch a product in a new market.",
        "How do you stay current with evolving marketing channels and algorithms?",
    ],
    general: [
        "Tell me about yourself and why you're excited about this role.",
        "Describe a time you failed and what you learned from it.",
        "How do you prioritize when you have multiple competing deadlines?",
        "Where do you see yourself in 5 years?",
        "What's your greatest professional achievement?",
        "Tell me about a time you had to influence someone without direct authority.",
    ],
};

const salaryData = {
    'Software Engineer': { entry: '$70K-$95K', mid: '$95K-$140K', senior: '$140K-$200K', lead: '$180K-$250K' },
    'Product Manager': { entry: '$80K-$110K', mid: '$110K-$160K', senior: '$160K-$220K', lead: '$200K-$280K' },
    'Data Scientist': { entry: '$75K-$105K', mid: '$105K-$155K', senior: '$155K-$210K', lead: '$190K-$260K' },
    'UX Designer': { entry: '$60K-$85K', mid: '$85K-$120K', senior: '$120K-$165K', lead: '$150K-$200K' },
    'DevOps Engineer': { entry: '$75K-$100K', mid: '$100K-$145K', senior: '$145K-$195K', lead: '$175K-$235K' },
    'Marketing Manager': { entry: '$55K-$75K', mid: '$75K-$110K', senior: '$110K-$150K', lead: '$140K-$190K' },
};

/* ─── Tab Config ──────────────────────────────────── */
const TABS = [
    { id: 'resume', label: '📄 Resume Scorer', desc: 'ATS score & feedback' },
    { id: 'cover', label: '✉️ Cover Letter', desc: 'AI-generated letter' },
    { id: 'interview', label: '🎯 Interview Coach', desc: 'Practice questions' },
    { id: 'salary', label: '💰 Salary Intel', desc: 'Market rate data' },
    { id: 'chat', label: '🤖 Career Chat', desc: 'AI career assistant' },
];

/* ─── Chat message component ──────────────────────── */
const ChatMessage = ({ msg }) => (
    <div style={{
        display: 'flex', gap: '0.75rem', marginBottom: '1rem',
        ...(msg.role === 'user' ? { flexDirection: 'row-reverse' } : {}),
    }}>
        <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: msg.role === 'user' ? 'linear-gradient(135deg, #7c5af6, #a855f7)' : 'var(--bg-surface)',
            fontSize: '1rem', fontWeight: 700, color: msg.role === 'user' ? '#fff' : undefined,
            border: '1px solid var(--border-default)',
        }}>
            {msg.role === 'user' ? '👤' : '🤖'}
        </div>
        <div style={{
            maxWidth: '78%', padding: '0.75rem 1rem',
            borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            background: msg.role === 'user' ? 'linear-gradient(135deg, #7c5af6, #a855f7)' : 'var(--bg-surface)',
            color: msg.role === 'user' ? '#fff' : 'var(--text-body)',
            fontSize: '0.875rem', lineHeight: 1.65,
            border: msg.role === 'user' ? 'none' : '1px solid var(--border-light)',
        }}>
            {msg.content}
        </div>
    </div>
);

const aiResponses = [
    "Based on your goals, I'd recommend focusing on building a strong portfolio of projects that demonstrate your skills. Employers value practical experience alongside certifications.",
    "The most in-demand skills right now in your field include cloud infrastructure (AWS/GCP), machine learning fundamentals, and strong communication abilities. Focusing on these will significantly boost your marketability.",
    "For salary negotiation, always anchor with a number first — research shows you'll typically land 10-20% higher. Come armed with market data from sources like Levels.fyi and Glassdoor.",
    "LinkedIn profile optimization tip: Your headline should be your value proposition, not just your job title. Instead of 'Software Engineer', try 'Software Engineer | Building scalable systems @ Stripe'.",
    "The biggest mistake candidates make is applying to too many jobs passively. Focus on 5-10 highly targeted applications with customized materials rather than mass-applying.",
    "For career transitions, focus on transferable skills and build a portfolio that bridges your old domain with the new one. A focused personal project can open more doors than 10 years of unrelated experience.",
];

/* ══════════════════════════════════════════════════
   MAIN AI TOOLS PAGE
   ══════════════════════════════════════════════════ */
const AITools = () => {
    const { isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState('resume');

    // Resume Scorer state
    const [resumeText, setResumeText] = useState('');
    const [resumeResult, setResumeResult] = useState(null);
    const [scoring, setScoring] = useState(false);

    // Cover Letter state
    const [clJob, setClJob] = useState('');
    const [clCompany, setClCompany] = useState('');
    const [clSkills, setClSkills] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [generating, setGenerating] = useState(false);

    // Interview state
    const [intCategory, setIntCategory] = useState('general');
    const [currentQ, setCurrentQ] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [intQuestions, setIntQuestions] = useState(interviewQuestions.general);

    // Salary state
    const [salaryRole, setSalaryRole] = useState('Software Engineer');
    const [salaryExp, setSalaryExp] = useState('mid');

    // Chat state
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hi! I'm your AI Career Assistant. I can help you with job search strategies, salary negotiation, career transitions, interview prep, and more. What's on your mind? 🚀" }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleScoreResume = () => {
        if (!resumeText.trim()) return;
        setScoring(true);
        setTimeout(() => {
            setResumeResult(generateResumeScore(resumeText));
            setScoring(false);
        }, 1800);
    };

    const handleGenerateCoverLetter = () => {
        if (!clJob && !clCompany) return;
        setGenerating(true);
        setCoverLetter('');
        generateCoverLetter(clJob, clCompany, clSkills, (text) => {
            setCoverLetter(text);
        }).then(() => {
            setTimeout(() => setGenerating(false), 100);
        });
    };

    const handleCategoryChange = (cat) => {
        setIntCategory(cat);
        setIntQuestions(interviewQuestions[cat] || interviewQuestions.general);
        setCurrentQ(0);
        setShowAnswer(false);
    };

    const handleSendChat = (e) => {
        e.preventDefault();
        if (!chatInput.trim() || chatLoading) return;
        const userMsg = { role: 'user', content: chatInput };
        setMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setChatLoading(true);
        setTimeout(() => {
            const aiMsg = { role: 'ai', content: aiResponses[Math.floor(Math.random() * aiResponses.length)] };
            setMessages(prev => [...prev, aiMsg]);
            setChatLoading(false);
        }, 1200 + Math.random() * 800);
    };

    return (
        <div className="page" style={{ background: 'var(--bg-base)' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 60%, #24243e 100%)',
                padding: '4rem 1.5rem 3rem', marginBottom: '2rem',
            }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem',
                        padding: '0.35rem 1rem', borderRadius: 100,
                        background: 'rgba(124,90,246,0.15)', border: '1px solid rgba(124,90,246,0.3)',
                    }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI-Powered Tools</span>
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#f0eeff',
                        letterSpacing: '-0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif",
                        marginBottom: '0.875rem', lineHeight: 1.1,
                    }}>
                        Your AI Career Toolkit ✨
                    </h1>
                    <p style={{ fontSize: '1.0625rem', color: 'rgba(240,238,255,0.65)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                        Resume scorer, cover letter writer, interview coach, salary intelligence, and personal career assistant — all in one place.
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 4rem' }}>
                {/* Tabs */}
                <div style={{
                    display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem',
                    marginBottom: '2rem', scrollbarWidth: 'none',
                }}>
                    {TABS.map(({ id, label, desc }) => (
                        <button key={id} onClick={() => setActiveTab(id)} style={{
                            padding: '0.75rem 1.25rem', borderRadius: 12, border: 'none', cursor: 'pointer',
                            flexShrink: 0, transition: 'all 0.2s ease', textAlign: 'left',
                            background: activeTab === id ? 'linear-gradient(135deg, #7c5af6, #a855f7)' : 'var(--bg-elevated)',
                            color: activeTab === id ? '#fff' : 'var(--text-body)',
                            border: activeTab === id ? 'none' : '1px solid var(--border-light)',
                            boxShadow: activeTab === id ? '0 4px 14px rgba(124,90,246,0.35)' : 'var(--shadow-xs)',
                        }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.75, marginTop: 2 }}>{desc}</div>
                        </button>
                    ))}
                </div>

                {/* ─── RESUME SCORER ─── */}
                {activeTab === 'resume' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: 20, padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                📄 Resume ATS Scorer
                            </h2>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                Paste your resume text below to get an instant ATS compatibility score and improvement suggestions.
                            </p>
                            <textarea
                                value={resumeText}
                                onChange={e => setResumeText(e.target.value)}
                                placeholder="Paste your entire resume text here...&#10;&#10;John Doe&#10;john@email.com | +1 234 567 8900&#10;&#10;EXPERIENCE&#10;Software Engineer at Acme Corp (2020-Present)&#10;• Led development of microservices platform serving 2M users&#10;• Reduced API latency by 40% through query optimization..."
                                style={{
                                    width: '100%', height: 280, padding: '1rem', borderRadius: 12,
                                    border: '1.5px solid var(--border-default)', background: 'var(--bg-surface)',
                                    color: 'var(--text-body)', fontSize: '0.85rem', lineHeight: 1.65,
                                    fontFamily: 'inherit', resize: 'vertical', outline: 'none',
                                    transition: 'border-color 0.2s ease',
                                }}
                                onFocus={e => e.target.style.borderColor = '#7c5af6'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                            />
                            <button onClick={handleScoreResume} disabled={scoring || !resumeText.trim()} style={{
                                marginTop: '1rem', width: '100%', padding: '0.875rem', borderRadius: 12, border: 'none',
                                background: scoring || !resumeText.trim() ? 'var(--bg-surface)' : 'linear-gradient(135deg, #7c5af6, #a855f7)',
                                color: scoring || !resumeText.trim() ? 'var(--text-muted)' : '#fff',
                                fontSize: '0.9375rem', fontWeight: 700, cursor: scoring || !resumeText.trim() ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease', boxShadow: scoring || !resumeText.trim() ? 'none' : '0 4px 14px rgba(124,90,246,0.35)',
                            }}>
                                {scoring ? '⏳ Analyzing your resume...' : '🔍 Analyze Resume'}
                            </button>
                        </div>

                        <div>
                            {resumeResult ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {/* Score Card */}
                                    <div style={{
                                        background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
                                        borderRadius: 20, padding: '2rem', textAlign: 'center',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                                            <div>
                                                <div style={{
                                                    fontSize: '5rem', fontWeight: 900, lineHeight: 1,
                                                    background: 'linear-gradient(135deg, #7c5af6, #a855f7)',
                                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                }}>{resumeResult.score}</div>
                                                <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ 100</div>
                                            </div>
                                            <div style={{
                                                width: 72, height: 72, borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: `${resumeResult.gradeColor}15`,
                                                border: `3px solid ${resumeResult.gradeColor}`,
                                                fontSize: '2rem', fontWeight: 900, color: resumeResult.gradeColor,
                                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                            }}>{resumeResult.grade}</div>
                                        </div>
                                        <div style={{ width: '100%', height: 8, borderRadius: 4, background: 'var(--bg-surface)', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%', borderRadius: 4,
                                                background: `linear-gradient(90deg, ${resumeResult.gradeColor}, ${resumeResult.gradeColor}80)`,
                                                width: `${resumeResult.score}%`, transition: 'width 1.5s ease',
                                            }} />
                                        </div>
                                    </div>

                                    {/* Breakdown */}
                                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: 20, padding: '1.5rem' }}>
                                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Score Breakdown</h3>
                                        {Object.entries(resumeResult.breakdown).map(([label, val]) => (
                                            <div key={label} style={{ marginBottom: '0.875rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-body)' }}>{label}</span>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7c5af6' }}>{val}%</span>
                                                </div>
                                                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-surface)', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #7c5af6, #a855f7)', width: `${val}%`, transition: 'width 1s ease' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Suggestions */}
                                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: 20, padding: '1.5rem' }}>
                                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>💡 Improvement Tips</h3>
                                        {resumeResult.suggestions.map((s, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', padding: '0.75rem', borderRadius: 10, background: 'var(--bg-surface)' }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', flexShrink: 0 }}>→</span>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: 1.55 }}>{s}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    height: '100%', minHeight: 300,
                                    background: 'var(--bg-elevated)', border: '1px dashed var(--border-default)',
                                    borderRadius: 20, display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '3rem',
                                }}>
                                    <span style={{ fontSize: '4rem' }}>📊</span>
                                    <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-heading)', textAlign: 'center' }}>Your score will appear here</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.7 }}>Paste your resume text and click Analyze to get your ATS compatibility score with detailed feedback</p>
                                </div>
                            )}
                        </div>

                        <style>{`@media (max-width: 768px) { .grid-ai-resume { grid-template-columns: 1fr !important; } }`}</style>
                    </div>
                )}

                {/* ─── COVER LETTER ─── */}
                {activeTab === 'cover' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: 20, padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                ✉️ AI Cover Letter Generator
                            </h2>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                Fill in the details and let our AI craft a personalized, professional cover letter in seconds.
                            </p>
                            {[
                                { label: 'Job Title', value: clJob, onChange: setClJob, placeholder: 'e.g. Senior Software Engineer' },
                                { label: 'Company Name', value: clCompany, onChange: setClCompany, placeholder: 'e.g. Google' },
                                { label: 'Your Key Skills', value: clSkills, onChange: setClSkills, placeholder: 'e.g. React, Node.js, Team Leadership' },
                            ].map(({ label, value, onChange, placeholder }) => (
                                <div key={label} style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>{label}</label>
                                    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
                                        width: '100%', padding: '0.75rem 1rem', borderRadius: 10,
                                        border: '1.5px solid var(--border-default)', background: 'var(--bg-surface)',
                                        color: 'var(--text-body)', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
                                    }} />
                                </div>
                            ))}
                            <button onClick={handleGenerateCoverLetter} disabled={generating || (!clJob && !clCompany)} style={{
                                marginTop: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: 12, border: 'none',
                                background: generating || (!clJob && !clCompany) ? 'var(--bg-surface)' : 'linear-gradient(135deg, #7c5af6, #a855f7)',
                                color: generating || (!clJob && !clCompany) ? 'var(--text-muted)' : '#fff',
                                fontSize: '0.9375rem', fontWeight: 700,
                                cursor: generating || (!clJob && !clCompany) ? 'not-allowed' : 'pointer',
                                boxShadow: generating || (!clJob && !clCompany) ? 'none' : '0 4px 14px rgba(124,90,246,0.35)',
                            }}>
                                {generating ? '✍️ Writing your letter...' : '✨ Generate Cover Letter'}
                            </button>
                        </div>

                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: 20, padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-heading)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Generated Letter</h3>
                                {coverLetter && (
                                    <button onClick={() => navigator.clipboard?.writeText(coverLetter)} style={{
                                        padding: '0.4rem 0.875rem', borderRadius: 8, border: '1px solid var(--border-default)',
                                        background: 'var(--bg-surface)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                                    }}>📋 Copy</button>
                                )}
                            </div>
                            {coverLetter ? (
                                <textarea
                                    value={coverLetter}
                                    onChange={e => setCoverLetter(e.target.value)}
                                    style={{
                                        width: '100%', height: 340, padding: '1rem', borderRadius: 10,
                                        border: '1px solid var(--border-light)', background: 'var(--bg-surface)',
                                        color: 'var(--text-body)', fontSize: '0.85rem', lineHeight: 1.7,
                                        fontFamily: 'inherit', resize: 'vertical', outline: 'none',
                                    }}
                                />
                            ) : (
                                <div style={{
                                    height: 340, borderRadius: 10, background: 'var(--bg-surface)',
                                    border: '1px dashed var(--border-default)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12,
                                }}>
                                    <span style={{ fontSize: '3rem' }}>✉️</span>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>Your personalized letter will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── INTERVIEW COACH ─── */}
                {activeTab === 'interview' && (
                    <div style={{ maxWidth: 760, margin: '0 auto' }}>
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: 20, padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                🎯 Interview Practice Coach
                            </h2>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                Practice industry-specific interview questions. Read the question, think through your answer, then reveal our guidance.
                            </p>

                            {/* Category selector */}
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                                {Object.keys(interviewQuestions).map(cat => (
                                    <button key={cat} onClick={() => handleCategoryChange(cat)} style={{
                                        padding: '0.5rem 1rem', borderRadius: 20, border: 'none', cursor: 'pointer',
                                        background: intCategory === cat ? 'linear-gradient(135deg, #7c5af6, #a855f7)' : 'var(--bg-surface)',
                                        color: intCategory === cat ? '#fff' : 'var(--text-muted)',
                                        fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize',
                                        border: intCategory === cat ? 'none' : '1px solid var(--border-default)',
                                        transition: 'all 0.2s ease',
                                    }}>{cat}</button>
                                ))}
                            </div>

                            {/* Progress */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    Question {currentQ + 1} of {intQuestions.length}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: '#7c5af6', fontWeight: 700 }}>
                                    {Math.round(((currentQ + 1) / intQuestions.length) * 100)}% complete
                                </span>
                            </div>
                            <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-surface)', marginBottom: '2rem', overflow: 'hidden' }}>
                                <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #7c5af6, #a855f7)', width: `${((currentQ + 1) / intQuestions.length) * 100}%`, transition: 'width 0.5s ease' }} />
                            </div>

                            {/* Question card */}
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(124,90,246,0.08), rgba(168,85,247,0.05))',
                                border: '1px solid rgba(124,90,246,0.2)', borderRadius: 16, padding: '2rem',
                                marginBottom: '1.5rem', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎤</div>
                                <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-heading)', lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    {intQuestions[currentQ]}
                                </p>
                            </div>

                            {/* Answer hints */}
                            {showAnswer && (
                                <div style={{
                                    background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                                    borderRadius: 14, padding: '1.25rem', marginBottom: '1.25rem',
                                    animation: 'fadeInUp 0.3s ease',
                                }}>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#065f46', marginBottom: '0.5rem' }}>💡 Answer Framework (STAR Method)</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.65 }}>
                                        <strong>Situation:</strong> Describe the context and challenge.<br />
                                        <strong>Task:</strong> What was your specific responsibility?<br />
                                        <strong>Action:</strong> What steps did you take? (Use "I" not "we")<br />
                                        <strong>Result:</strong> What was the measurable outcome?
                                    </p>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button onClick={() => setShowAnswer(!showAnswer)} style={{
                                    flex: 1, padding: '0.75rem', borderRadius: 10, border: '1px solid var(--border-default)',
                                    background: 'var(--bg-surface)', color: 'var(--text-body)',
                                    fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                                }}>{showAnswer ? '🙈 Hide Tips' : '💡 Show Answer Tips'}</button>
                                <button onClick={() => { setCurrentQ((q) => (q + 1) % intQuestions.length); setShowAnswer(false); }} style={{
                                    flex: 1, padding: '0.75rem', borderRadius: 10, border: 'none',
                                    background: 'linear-gradient(135deg, #7c5af6, #a855f7)',
                                    color: '#fff', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(124,90,246,0.3)',
                                }}>Next Question →</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── SALARY INTEL ─── */}
                {activeTab === 'salary' && (
                    <div style={{ maxWidth: 760, margin: '0 auto' }}>
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: 20, padding: '2rem', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                💰 Salary Intelligence
                            </h2>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                Get current market rate data for your role and experience level.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>Job Role</label>
                                    <select value={salaryRole} onChange={e => setSalaryRole(e.target.value)} style={{
                                        width: '100%', padding: '0.75rem 1rem', borderRadius: 10,
                                        border: '1.5px solid var(--border-default)', background: 'var(--bg-surface)',
                                        color: 'var(--text-body)', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
                                    }}>
                                        {Object.keys(salaryData).map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>Experience Level</label>
                                    <select value={salaryExp} onChange={e => setSalaryExp(e.target.value)} style={{
                                        width: '100%', padding: '0.75rem 1rem', borderRadius: 10,
                                        border: '1.5px solid var(--border-default)', background: 'var(--bg-surface)',
                                        color: 'var(--text-body)', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
                                    }}>
                                        {[['entry', 'Entry Level (0-2 yrs)'], ['mid', 'Mid Level (3-5 yrs)'], ['senior', 'Senior (6-9 yrs)'], ['lead', 'Lead/Staff (10+ yrs)']].map(([v, l]) => (
                                            <option key={v} value={v}>{l}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Result */}
                        {salaryData[salaryRole]?.[salaryExp] && (
                            <div style={{ background: 'linear-gradient(135deg, #7c5af6, #a855f7)', borderRadius: 20, padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    {salaryRole} · {salaryExp === 'entry' ? 'Entry Level' : salaryExp === 'mid' ? 'Mid Level' : salaryExp === 'senior' ? 'Senior' : 'Lead/Staff'}
                                </p>
                                <div style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em', lineHeight: 1 }}>
                                    {salaryData[salaryRole][salaryExp]}
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '0.75rem' }}>Per year · USA market · Updated 2025</p>
                            </div>
                        )}

                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: 20, padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                All Experience Levels — {salaryRole}
                            </h3>
                            {Object.entries(salaryData[salaryRole] || {}).map(([level, range]) => (
                                <div key={level} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '0.875rem', borderRadius: 10, marginBottom: '0.5rem',
                                    background: level === salaryExp ? 'rgba(124,90,246,0.08)' : 'var(--bg-surface)',
                                    border: level === salaryExp ? '1px solid rgba(124,90,246,0.2)' : '1px solid var(--border-light)',
                                }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: level === salaryExp ? '#7c5af6' : 'var(--text-body)', textTransform: 'capitalize' }}>
                                        {level === 'entry' ? 'Entry Level' : level === 'mid' ? 'Mid Level' : level === 'senior' ? 'Senior' : 'Lead/Staff'}
                                    </span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: level === salaryExp ? '#7c5af6' : 'var(--text-heading)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        {range}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── CAREER CHAT ─── */}
                {activeTab === 'chat' && (
                    <div style={{ maxWidth: 760, margin: '0 auto' }}>
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: 20, overflow: 'hidden' }}>
                            {/* Chat header */}
                            <div style={{
                                padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)',
                                background: 'linear-gradient(135deg, rgba(124,90,246,0.06), rgba(168,85,247,0.03))',
                                display: 'flex', alignItems: 'center', gap: '0.875rem',
                            }}>
                                <div style={{
                                    width: 42, height: 42, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #7c5af6, #a855f7)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
                                }}>🤖</div>
                                <div>
                                    <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-heading)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Career Assistant</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Online • Ready to help</span>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div style={{ height: 380, overflowY: 'auto', padding: '1.25rem 1.5rem', scrollbarWidth: 'thin' }}>
                                {messages.map((msg, i) => <ChatMessage key={i} msg={msg} />)}
                                {chatLoading && (
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🤖</div>
                                        <div style={{ padding: '0.75rem 1rem', borderRadius: '18px 18px 18px 4px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', display: 'flex', gap: 4, alignItems: 'center' }}>
                                            {[0,1,2].map(i => (
                                                <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c5af6', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Quick prompts */}
                            <div style={{ padding: '0 1.5rem 0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                {['How to negotiate salary?', 'Best skills to learn?', 'How to switch careers?', 'LinkedIn profile tips'].map(p => (
                                    <button key={p} onClick={() => { setChatInput(p); }} style={{
                                        padding: '0.35rem 0.75rem', borderRadius: 20, border: '1px solid var(--border-default)',
                                        background: 'var(--bg-surface)', color: 'var(--text-muted)',
                                        fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}>{p}</button>
                                ))}
                            </div>

                            {/* Input */}
                            <div style={{ borderTop: '1px solid var(--border-light)', padding: '1rem 1.25rem' }}>
                                <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '0.75rem' }}>
                                    <input
                                        type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                                        placeholder="Ask anything about your career..."
                                        style={{
                                            flex: 1, padding: '0.75rem 1rem', borderRadius: 12,
                                            border: '1.5px solid var(--border-default)', background: 'var(--bg-surface)',
                                            color: 'var(--text-body)', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#7c5af6'}
                                        onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                                    />
                                    <button type="submit" disabled={chatLoading || !chatInput.trim()} style={{
                                        padding: '0.75rem 1.25rem', borderRadius: 12, border: 'none',
                                        background: chatLoading || !chatInput.trim() ? 'var(--bg-surface)' : 'linear-gradient(135deg, #7c5af6, #a855f7)',
                                        color: chatLoading || !chatInput.trim() ? 'var(--text-subtle)' : '#fff',
                                        fontSize: '1rem', cursor: chatLoading || !chatInput.trim() ? 'not-allowed' : 'pointer',
                                        boxShadow: chatLoading || !chatInput.trim() ? 'none' : '0 4px 12px rgba(124,90,246,0.3)',
                                        transition: 'all 0.2s ease',
                                    }}>↑</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AITools;
