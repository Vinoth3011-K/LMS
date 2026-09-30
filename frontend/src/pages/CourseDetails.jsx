import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseDetails, enrollCourse } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Clock, BarChart, CheckCircle } from 'lucide-react';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const { data } = await getCourseDetails(id);
            setCourse(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setEnrolling(true);
        try {
            await enrollCourse(id);
            alert("Successfully enrolled!");
            navigate('/my-courses');
        } catch (error) {
            alert(error.response?.data?.detail || "Error enrolling in course.");
        } finally {
            setEnrolling(false);
        }
    };

    const renderActionButton = () => {
        if (!user || user.role === 'STUDENT') {
            return (
                <button 
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full md:w-auto bg-primary hover:bg-secondary text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
            );
        }
        if (user.role === 'INSTRUCTOR') {
            return (
                <button
                    onClick={() => navigate(`/instructor/courses/${id}/modules`)}
                    className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                >
                    Manage Course
                </button>
            );
        }
        if (user.role === 'ADMIN') {
            return (
                <button
                    onClick={() => navigate(`/admin`)}
                    className="w-full md:w-auto bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                >
                    Admin Dashboard
                </button>
            );
        }
        return null;
    };

    if (loading) return <div className="text-center py-20 text-xl font-medium">Loading course...</div>;
    if (!course) return <div className="text-center py-20 text-xl font-medium">Course not found.</div>;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                <div className="h-64 md:h-96 w-full bg-slate-800 relative">
                    {(course.thumbnail_url || course.thumbnail) ? (
                        <img src={course.thumbnail_url || course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-60" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-800">
                            <span className="text-xl font-semibold opacity-60">No Image Available</span>
                        </div>
                    )}


                    <div className="absolute bottom-0 left-0 p-8 text-white w-full bg-gradient-to-t from-slate-900/90 to-transparent">
                        <span className="bg-primary/90 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                            {course.category}
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">{course.title}</h1>
                        <p className="text-lg text-slate-200">Instructor: {course.instructor_name}</p>
                    </div>
                </div>


                <div className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:space-x-6 text-slate-600">
                        <div className="flex items-center space-x-2">
                            <BarChart size={20} className="text-primary"/>
                            <span className="font-medium capitalize">{course.difficulty_level}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock size={20} className="text-primary"/>
                            <span className="font-medium">{course.duration} minutes total</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row w-full md:w-auto items-start md:items-center gap-4 md:space-x-4">
                        <span className="text-3xl font-extrabold text-slate-800">
                            {course.price > 0 ? `$${course.price}` : 'Free'}
                        </span>
                        {renderActionButton()}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">About this course</h2>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{course.description}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Course Curriculum</h2>
                        <div className="space-y-4">
                            {course.modules?.map((module, index) => (
                                <div key={module.id} className="border border-slate-100 rounded-xl overflow-hidden">
                                    <div className="bg-slate-50 p-4 font-bold text-slate-700 flex justify-between">
                                        <span>Module {index + 1}: {module.title}</span>
                                    </div>
                                    <div className="p-4 space-y-2 bg-white">
                                        {module.lessons?.map((lesson, idx) => (
                                            <div key={lesson.id} className="flex items-center space-x-3 text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                                <CheckCircle size={16} className="text-slate-300" />
                                                <span className="font-medium text-sm">{idx + 1}. {lesson.title}</span>
                                                <span className="ml-auto text-xs text-slate-400">{lesson.duration} min</span>
                                            </div>
                                        ))}


                                        {(!module.lessons || module.lessons.length === 0) && (
                                            <p className="text-sm text-slate-400 italic">No lessons in this module yet.</p>
                                        )}
                                    </div>
                                </div>
                            ))}


                            {(!course.modules || course.modules.length === 0) && (
                                <p className="text-slate-500 italic">Curriculum is being prepared.</p>
                            )}
                            
                            {course.quizzes && course.quizzes.length > 0 && (
                                <div className="border border-slate-100 rounded-xl overflow-hidden mt-6">
                                    <div className="bg-slate-50 p-4 font-bold text-slate-700 flex justify-between">
                                        <span>Course Quizzes</span>
                                    </div>
                                    <div className="p-4 space-y-2 bg-white">
                                        {course.quizzes.map((quiz, idx) => (
                                            <div key={quiz.id} className="flex items-center space-x-3 text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                                <CheckCircle size={16} className="text-indigo-400" />
                                                <span className="font-medium text-sm text-indigo-700">{idx + 1}. {quiz.title}</span>
                                                <span className="ml-auto text-xs text-slate-400 font-bold bg-indigo-50 px-2 py-1 rounded-full">{quiz.total_marks} Marks</span>
                                            </div>
                                        ))}
                                        
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
