import { useState, useEffect } from 'react';
import { getCourses, deleteCourse } from '../../services/api';
import { Link } from 'react-router-dom';
import { Trash2, Settings, HelpCircle } from 'lucide-react';
const ManageCourses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await getCourses({ my_courses: true });
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this course?')) {
            try {
                await deleteCourse(id);
                setCourses(courses.filter(c => c.id !== id));
            } catch (error) {
                alert('Error deleting course');
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Manage Courses</h1>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Link to="/instructor/courses/create" className="w-full sm:w-auto text-center bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                        Create New Course
                    </Link>
                    <Link to="/instructor/quizzes/create" className="w-full sm:w-auto text-center bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-secondary transition-colors">
                        Create New Quiz
                    </Link>
                </div>
            </div>      



            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>


                    <tbody className="bg-white divide-y divide-slate-200">
                        {courses.map(course => (
                            <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-16 bg-slate-200 rounded overflow-hidden mr-4 flex items-center justify-center">
                                            {(course.thumbnail_url || course.thumbnail) ? (
                                                <img src={course.thumbnail_url || course.thumbnail} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-[10px] text-slate-400">No Img</span>
                                            )}
                                        </div>
                                        <div className="text-sm font-bold text-slate-800">{course.title}</div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {course.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${course.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                        {course.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                                    ${course.price}
                                </td>


                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                    <Link to={`/instructor/courses/${course.id}/modules`} className="text-slate-500 hover:text-primary transition-colors inline-block" title="Manage Modules">
                                        <Settings size={18} />
                                    </Link>
                                    <Link to={`/instructor/courses/${course.id}/quizzes`} className="text-purple-500 hover:text-purple-700 transition-colors inline-block" title="Manage Quizzes">
                                        <HelpCircle size={18} />
                                    </Link>
                                    <button onClick={() => handleDelete(course.id)} className="text-red-500 hover:text-red-700 transition-colors inline-block" title="Delete Course">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        
                    </tbody>
                </table>
                {courses.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No courses found. Start by creating one!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCourses;
