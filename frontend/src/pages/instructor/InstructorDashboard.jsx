import { useState, useEffect } from 'react';
import { getInstructorAnalytics } from '../../services/api';
import { BookOpen, Users, TrendingUp, PlusCircle, Settings, ArrowRight, Sparkles, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstructorDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await getInstructorAnalytics();
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
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-slate-500 animate-pulse">Loading dashboard...</p>
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
        { label: 'Total Courses', value: analytics.total_courses, icon: BookOpen, gradient: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/20' },
        { label: 'Published', value: analytics.published_courses, icon: TrendingUp, gradient: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20' },
        { label: 'Total Students', value: analytics.total_students, icon: Users, gradient: 'from-purple-500 to-indigo-500', shadow: 'shadow-purple-500/20' },
        { label: 'Certificates', value: analytics.certificates, icon: Award, gradient: 'from-yellow-400 to-amber-500', shadow: 'shadow-yellow-500/20' },
    ];

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 mb-10 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-2xl opacity-30"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
                            Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Overview</span>
                        </h1>
                        <p className="text-slate-300 max-w-2xl text-lg">Manage your courses, track student engagement, and create new learning experiences.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link to="/instructor/courses/create" className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5">
                            <PlusCircle size={20} />
                            <span>New Course</span>
                        </Link>
                        <Link to="/instructor/courses" className="flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm hover:-translate-y-0.5">
                            <Settings size={20} />
                            <span>Manage</span>
                        </Link>
                    </div>
                </div>
            </div>
            
           
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500`}></div>
                        
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                <h3 className="text-4xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                            </div>
                            
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadow}`}>
                                <stat.icon size={24} strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/instructor/courses" className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[180px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen size={24} />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-1">Course Management</h2>
                            <p className="text-slate-500 text-sm font-medium">Edit course details, update modules, and publish your content.</p>
                        </div>
                    </div>
                    <div className="relative z-10 flex items-center justify-end text-blue-600 font-bold mt-4 group-hover:translate-x-1 transition-transform duration-300">
                        <ArrowRight size={20} />
                    </div>
                </Link>

                <Link to="/instructor/courses/create" className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[180px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <PlusCircle size={24} />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-1">Create New Course</h2>
                            <p className="text-slate-500 text-sm font-medium">Start building a new learning experience for your students.</p>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-end text-purple-600 font-bold mt-4 group-hover:translate-x-1 transition-transform duration-300">
                        <ArrowRight size={20} />
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default InstructorDashboard;
