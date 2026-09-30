import { useState, useEffect } from 'react';
import { getMyCourses } from '../services/api';
import { Link } from 'react-router-dom';

const MyCourses = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            const { data } = await getMyCourses();
            setEnrollments(data);
        } catch (error) {
            console.error('Error fetching my courses:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-xl font-medium">Loading your courses...</div>;

    return (
        <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-8">My Learning</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {enrollments.map(enrollment => {
                    const course = enrollment.course_details;
                    return (
                        <div key={enrollment.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col">
                            <div className="h-40 w-full bg-slate-200 relative">
                                {(course?.thumbnail_url || course?.thumbnail) ? (
                                    <img src={course.thumbnail_url || course.thumbnail} alt={course?.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                                        <span className="text-sm font-semibold">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">{course?.title}</h3>
                                <p className="text-sm text-slate-500 mb-4 flex-grow">Instructor: {course?.instructor_name}</p>
                                
                                <div className="progress-bar-container mb-2">
                                    <div style={{ width: `${enrollment.completion_percentage || 0}%` }} className="progress-bar-fill progress-bar-emerald"></div>
                                </div>
                                <div className="text-xs font-semibold text-slate-600 mb-6">{enrollment.completion_percentage}% Complete</div>

                                <Link to={`/courses/${course?.id}/learn`} className="bg-primary text-white text-center w-full px-4 py-2 rounded-lg hover:bg-secondary transition-colors font-medium mt-auto">
                                    Continue Learning
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {enrollments.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm mt-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">You aren't enrolled in any courses yet.</h3>
                    <p className="text-slate-500 mb-6">Discover thousands of courses and start your journey.</p>
                    <Link to="/catalog" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-secondary transition-all shadow-md">
                        Browse Courses
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyCourses;
