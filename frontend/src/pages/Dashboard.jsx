import { useState, useEffect } from 'react';
import { getStudentAnalytics } from '../services/api';
import { BookOpen, Award, CheckCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await getStudentAnalytics();
                setAnalytics(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-slate-500 animate-pulse">Loading your dashboard...</p>
        </div>
    );
    
    if (!analytics) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                <span className="font-medium">Failed to load analytics. Please try again.</span>
            </div>
        </div>
    );

    const stats = [
        { label: 'Enrolled Courses', value: analytics.enrolled_courses, icon: BookOpen, gradient: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/20' },
        { label: 'Completed', value: analytics.completed_courses, icon: CheckCircle, gradient: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20' },
        { label: 'Certificates', value: analytics.certificates, icon: Award, gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/20' },
        { label: 'Quiz Attempts', value: analytics.quiz_attempts, icon: Clock, gradient: 'from-purple-500 to-indigo-500', shadow: 'shadow-indigo-500/20' }
    ];

    return (
        <div className="dashboard-container">
           
            <div className="dashboard-hero">
                <div className="dashboard-hero-bg-1"></div>
                <div className="dashboard-hero-bg-2"></div>
                
                <div className="dashboard-hero-content">
                    <h1 className="dashboard-hero-title">
                        Your Learning <span className="dashboard-hero-title-highlight">Overview</span>
                    </h1>
                    <p className="dashboard-hero-subtitle">Track your progress, continue your courses, and see your latest achievements all in one place.</p>
                </div>
            </div>

        
            <div className="dashboard-stats-grid">
                {stats.map((stat, idx) => (
                    <div key={idx} className="dashboard-stat-card">
                        <div className={`dashboard-stat-bg bg-gradient-to-br ${stat.gradient}`}></div>
                        
                        <div className="dashboard-stat-content">
                            <div>
                                <p className="dashboard-stat-label">{stat.label}</p>
                                <h3 className="dashboard-stat-value">{stat.value}</h3>
                            </div>
                            <div className={`dashboard-stat-icon bg-gradient-to-br ${stat.gradient} ${stat.shadow}`}>
                                <stat.icon size={24} strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

           
            <h2 className="dashboard-actions-title">
                Quick Actions
            </h2>
            <div className="dashboard-actions-grid">
                <Link to="/my-courses" className="dashboard-action-card">
                    <div className="dashboard-action-bg-blue"></div>
                    <div className="dashboard-action-content">
                        <div className="dashboard-action-icon-blue">
                            <BookOpen size={24} />
                        </div>
                        <h2 className="dashboard-action-title">Continue Learning</h2>
                        <p className="dashboard-action-desc">Pick up where you left off in your enrolled courses.</p>
                    </div>
                    <div className="dashboard-action-link-blue">
                        <span>Go to My Courses</span>
                        <ArrowRight size={20} className="ml-2" />
                    </div>
                </Link>

                <Link to="/my-results" className="dashboard-action-card">
                    <div className="dashboard-action-bg-purple"></div>
                    <div className="dashboard-action-content">
                        <div className="dashboard-action-icon-purple">
                            <Clock size={24} />
                        </div>
                        <h2 className="dashboard-action-title">View Quiz Results</h2>
                        <p className="dashboard-action-desc">Review your past performance and check your scores.</p>
                    </div>
                    <div className="dashboard-action-link-purple">
                        <span>See Results</span>
                        <ArrowRight size={20} className="ml-2" />
                    </div>
                </Link>

                <Link to="/my-certificates" className="dashboard-action-card">
                    <div className="dashboard-action-bg-blue" style={{ background: 'linear-gradient(to bottom right, rgba(245, 158, 11, 0.05), transparent)' }}></div>
                    <div className="dashboard-action-content">
                        <div className="dashboard-action-icon-blue" style={{ color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                            <Award size={24} />
                        </div>
                        <h2 className="dashboard-action-title">My Certificates</h2>
                        <p className="dashboard-action-desc">View and download your earned course certificates.</p>
                    </div>
                    <div className="dashboard-action-link-blue" style={{ color: '#F59E0B' }}>
                        <span>View Certificates</span>
                        <ArrowRight size={20} className="ml-2" />
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
