import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Contexts
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import SavedJobs from './pages/SavedJobs';
import AdminPanel from './pages/AdminPanel';
import AITools from './pages/AITools';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import ApplicationTracker from './pages/ApplicationTracker';
import Colleges from './pages/Colleges';
import Exams from './pages/Exams';
import Courses from './pages/Courses';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <main style={{ flex: 1 }}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/jobs" element={<Jobs />} />
                            <Route path="/jobs/:id" element={<JobDetails />} />
                            <Route path="/companies" element={<Companies />} />
                            <Route path="/companies/:id" element={<CompanyDetail />} />
                            <Route path="/ai-tools" element={<AITools />} />
                            <Route path="/colleges" element={<Colleges />} />
                            <Route path="/exams" element={<Exams />} />
                            <Route path="/courses" element={<Courses />} />

                            {/* Protected Routes */}
                            <Route path="/dashboard" element={
                                <ProtectedRoute><Dashboard /></ProtectedRoute>
                            } />
                            <Route path="/tracker" element={
                                <ProtectedRoute><ApplicationTracker /></ProtectedRoute>
                            } />
                            <Route path="/post-job" element={
                                <ProtectedRoute allowedRoles={['employer', 'admin']}><PostJob /></ProtectedRoute>
                            } />
                            <Route path="/saved-jobs" element={
                                <ProtectedRoute><SavedJobs /></ProtectedRoute>
                            } />
                            <Route path="/admin" element={
                                <ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>
                            } />
                        </Routes>
                    </main>
                    <Footer />
                    <MobileNav />
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
