import { useState, useEffect } from 'react';
import { BookOpen, Search, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/api/courses/');
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
        try {
            await api.delete(`/api/courses/${courseId}/`);
            setCourses(courses.filter(c => c.id !== courseId));
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Failed to delete course.');
        }
    };

    const filteredCourses = courses.filter(course => 
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                    <BookOpen className="text-primary" size={32} /> Course Management
                </h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search courses by title or category..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium text-sm">
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCourses.map(course => (
                                <tr key={course.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-800 max-w-[300px] truncate" title={course.title}>
                                        {course.title}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{course.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${course.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-700">${course.price}</td>
                                    <td className="px-6 py-4 flex justify-center gap-3">
                                        <Link to={`/courses/${course.id}`} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="View Course Details">
                                            <ExternalLink size={18} />
                                        </Link>
                                        <button onClick={() => handleDelete(course.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete Course">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredCourses.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No courses found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCourses;
