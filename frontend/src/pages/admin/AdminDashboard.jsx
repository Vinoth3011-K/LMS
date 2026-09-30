import { useState, useEffect } from 'react';
import api, { getAdminAnalytics } from '../../services/api';
import { Link } from 'react-router-dom';
import { Users, BookOpen, UserCheck, GraduationCap, Award, FileText, Sparkles, TrendingUp, Activity, Zap } from 'lucide-react';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await getAdminAnalytics();
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
            <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-slate-500 animate-pulse">Loading admin workspace...</p>
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
        { title: 'Total Users', value: analytics.total_users, icon: Users, gradient: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/20' },
        { title: 'Students', value: analytics.students, icon: GraduationCap, gradient: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20' },
        { title: 'Instructors', value: analytics.instructors, icon: UserCheck, gradient: 'from-purple-500 to-indigo-500', shadow: 'shadow-purple-500/20' },
        { title: 'Total Courses', value: analytics.courses, icon: BookOpen, gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/20' },
        { title: 'Published Courses', value: analytics.published_courses, icon: FileText, gradient: 'from-pink-500 to-rose-400', shadow: 'shadow-pink-500/20' },
        { title: 'Certificates Generated', value: analytics.certificates, icon: Award, gradient: 'from-yellow-400 to-amber-500', shadow: 'shadow-yellow-500/20' }
    ];

    const handleOpenAPI = async (endpoint) => {
        try {
            const { data } = await api.get(endpoint);
            const newWindow = window.open();
            if (newWindow) {
                newWindow.document.write('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
                newWindow.document.close();
            }
        } catch (error) {
            console.error(error);
            alert('Failed to fetch data: ' + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Dashboard</span>
                    </h1>
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500`}></div>

                            <div className="flex items-center gap-5 relative z-10">
                                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadow} shrink-0`}>
                                    <Icon size={28} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.title}</p>
                                    <p className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>


            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-100 p-6 sm:px-8">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="text-primary" />
                        Detailed Engagement Metrics
                    </h2>
                </div>
                <div className="p-6 sm:p-8 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            <span className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Enrollments</span>
                            <span className="block text-4xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">{analytics.enrollments}</span>
                        </div>


                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                            <span className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Quiz Attempts</span>
                            <span className="block text-4xl font-black text-slate-800 group-hover:text-purple-600 transition-colors">{analytics.quiz_attempts}</span>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-slate-400"></div>
                            <span className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Draft Courses</span>
                            <span className="block text-4xl font-black text-slate-800 group-hover:text-slate-600 transition-colors">{analytics.draft_courses}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mt-8">
                <div className="border-b border-slate-100 p-6 sm:px-8">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Zap className="text-primary" />
                        Quick Actions
                    </h2>
                </div>
                <div className="p-6 sm:p-8 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow flex flex-col h-full group">
                            <div className="bg-blue-50 text-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Award size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Manage Certificates</h3>
                            <p className="text-slate-500 text-sm mb-6 flex-grow">View and manage generated certificates.</p>
                            <Link to="/admin/certificates" className="w-full bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-xl border border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-colors flex justify-center items-center gap-2">
                                View Certificates
                            </Link>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow flex flex-col h-full group">
                            <div className="bg-emerald-50 text-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Manage Courses</h3>
                            <p className="text-slate-500 text-sm mb-6 flex-grow">View and manage all courses.</p>
                            <Link to="/admin/courses" className="w-full bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-xl border border-slate-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors flex justify-center items-center gap-2">
                                View Courses
                            </Link>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow flex flex-col h-full group">
                            <div className="bg-purple-50 text-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Manage Users</h3>
                            <p className="text-slate-500 text-sm mb-6 flex-grow">Manage students and instructors.</p>
                            <Link to="/admin/users" className="w-full bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-xl border border-slate-200 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-colors flex justify-center items-center gap-2">
                                View Users
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mt-8">
                <div className="border-b border-slate-100 p-6 sm:px-8">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="text-primary" />
                        Recent Activities
                    </h2>
                </div>
                <div className="p-6 sm:p-8 bg-slate-50/50">
                    {analytics.recent_activities && analytics.recent_activities.length > 0 ? (
                        <div className="space-y-4">
                            {analytics.recent_activities.map((activity, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <span className="font-medium text-slate-700">{activity.action}</span>
                                    <span className="text-sm text-slate-500">{new Date(activity.date).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-center py-4">No recent activities found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
