import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCourseDetails, deleteQuiz } from '../../services/api';
import { Edit, Trash2, List, BarChart2 } from 'lucide-react';

const QuizManagement = () => {
    const { courseId } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const [courseInfo, setCourseInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (courseId) {
            fetchCourseQuizzes();
        } else {
            fetchAllQuizzes();
        }
    }, [courseId]);

    const fetchCourseQuizzes = async () => {
        try {
            const { data } = await getCourseDetails(courseId);
            setCourseInfo(data);
            const courseQuizzes = (data.quizzes || []).map(q => ({...q, courseTitle: data.title}));
            setQuizzes(courseQuizzes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllQuizzes = async () => {
        try {
            const { data } = await getCourses({ my_courses: true });
            const allQuizzes = data.reduce((acc, course) => {
                const courseQuizzes = (course.quizzes || []).map(q => ({...q, courseTitle: course.title}));
                return [...acc, ...courseQuizzes];
            }, []);
            setQuizzes(allQuizzes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Delete this quiz?')) {
            try {
                await deleteQuiz(id);
                if (courseId) {
                    fetchCourseQuizzes();
                } else {
                    fetchAllQuizzes();
                }
            } catch (error) {
                alert('Error deleting quiz');
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading quizzes...</div>;

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Manage Quizzes</h1>
                    <p className="text-slate-500 mt-1">{courseId && courseInfo ? `Course: ${courseInfo.title}` : 'All quizzes across your courses'}</p>
                </div>
                <Link to="/instructor/quizzes/create" className="w-full sm:w-auto text-center bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-secondary transition-colors">
                    Create New Quiz
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Quiz Title</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Passing Marks</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {quizzes.map(quiz => (
                            <tr key={quiz.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                                    {quiz.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {quiz.courseTitle}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {quiz.passing_marks} / {quiz.total_marks}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                    <Link to={`/instructor/quizzes/${quiz.id}/questions`} className="text-slate-500 hover:text-primary transition-colors inline-block" title="Manage Questions">
                                        <List size={18} />
                                    </Link>
                                    <Link to={`/instructor/quizzes/${quiz.id}/results`} className="text-emerald-500 hover:text-emerald-700 transition-colors inline-block" title="View Results">
                                        <BarChart2 size={18} />
                                    </Link>
                                    <button onClick={() => handleDelete(quiz.id)} className="text-red-500 hover:text-red-700 transition-colors inline-block" title="Delete Quiz">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        
                    </tbody>
                </table>
                {quizzes.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No quizzes found. Start by creating one!
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizManagement;
