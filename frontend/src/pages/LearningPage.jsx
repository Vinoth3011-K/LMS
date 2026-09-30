import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { getCourseDetails, generateCertificate } from '../services/api';
import { getCourseProgress, markLessonComplete, removeLessonCompletion } from '../services/learningService';
import ProgressBar from '../components/ProgressBar';
import { CheckCircle, PlayCircle, Menu, X, ArrowLeft, Layers } from 'lucide-react';

const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
            return `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}`;
        }
        if (urlObj.hostname.includes('youtu.be')) {
            return `https://www.youtube.com/embed${urlObj.pathname}`;
        }
        return url;
    } catch (e) {
        return url;
    }
};

const LearningPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [progress, setProgress] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const courseRes = await getCourseDetails(id);
            setCourse(courseRes.data);
            const progressRes = await getCourseProgress(id);
            setProgress(progressRes.data);
            
          
            if (courseRes.data.modules?.length > 0 && courseRes.data.modules[0].lessons?.length > 0) {
                setActiveLesson(courseRes.data.modules[0].lessons[0]);
            }
        } catch (error) {
            console.error('Error fetching learning data', error);
            if (error.response?.status === 403) {
                alert("You are not enrolled in this course.");
                navigate('/catalog');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleToggleComplete = async () => {
        try {
            await markLessonComplete(activeLesson.id);
            const progressRes = await getCourseProgress(id);
            setProgress(progressRes.data);
            alert('Lesson marked as completed!');
        } catch (error) {
            console.error(error);
            alert("Error updating progress");
        }
    };

    if (loading) return <div className="text-center py-20 text-xl font-medium">Loading Learning Environment...</div>;
    if (!course) return <div className="text-center py-20 text-xl font-medium">Course not found.</div>;

    return (
        <div className="flex h-[calc(100vh-80px)] -mt-4 -mx-4 overflow-hidden bg-white">
            
            <div className={`w-full md:w-80 bg-slate-50 border-r border-slate-200 flex flex-col transition-all duration-300 absolute md:relative z-40 h-full ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0'}`}>
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                    <Link to="/my-courses" className="text-slate-500 hover:text-primary transition-colors flex items-center gap-2 font-medium">
                        <ArrowLeft size={18} />
                        Back to Courses
                    </Link>
                    <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                
                {progress && (
                    <div className="p-4 bg-white border-b border-slate-200">
                        <h2 className="font-bold text-slate-800 mb-4 line-clamp-2">{course.title}</h2>
                        <ProgressBar percentage={progress.progress} completed={progress.completed_lessons} total={progress.total_lessons} />
                        
                        {progress.progress >= 100 && (
                            <button 
                                onClick={async () => {
                                    try {
                                        const res = await generateCertificate(course.id);
                                        alert('Certificate generated successfully!');
                                        navigate(`/certificates/${res.data.id}`);
                                    } catch (err) {
                                        alert(err.response?.data?.detail || 'Could not generate certificate.');
                                    }
                                }}
                                className="mt-4 w-full bg-primary text-white py-2 rounded-lg font-bold text-sm hover:bg-secondary transition-colors"
                            >
                                Get Certificate
                            </button>
                        )}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                    {course.modules?.map((module, mIdx) => (
                        <div key={module.id} className="border-b border-slate-100">
                            <div className="p-4 bg-slate-100 font-bold text-slate-700 text-sm">
                                Module {mIdx + 1}: {module.title}
                            </div>
                            <div>
                                {module.lessons?.map((lesson, lIdx) => (
                                    <button 
                                        key={lesson.id}
                                        onClick={() => { setActiveLesson(lesson); setSidebarOpen(false); }}
                                        className={`w-full text-left p-4 flex items-start gap-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${activeLesson?.id === lesson.id ? 'bg-blue-50 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                                    >
                                        <PlayCircle size={18} className={`mt-0.5 ${activeLesson?.id === lesson.id ? 'text-primary' : 'text-slate-400'}`} />
                                        <div>
                                            <p className={`text-sm font-medium ${activeLesson?.id === lesson.id ? 'text-primary' : 'text-slate-700'}`}>{lIdx + 1}. {lesson.title}</p>
                                            <p className="text-xs text-slate-400 mt-1">{lesson.duration} min</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    
                    {course.quizzes && course.quizzes.length > 0 && (
                        <div className="border-b border-slate-100">
                            <div className="p-4 bg-indigo-50 font-bold text-indigo-800 text-sm border-t border-slate-200">
                                Course Quizzes
                            </div>
                            <div>
                                {course.quizzes.map((quiz, qIdx) => (
                                    <Link 
                                        key={`quiz-${quiz.id}`}
                                        to={`/quizzes/${quiz.id}`}
                                        className="w-full text-left p-4 flex items-start gap-3 border-b border-slate-50 hover:bg-slate-50 transition-colors"
                                    >
                                        <CheckCircle size={18} className="mt-0.5 text-indigo-400" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Quiz {qIdx + 1}. {quiz.title}</p>
                                            <p className="text-xs text-slate-400 mt-1">{quiz.total_marks} Marks</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            
            <div className="flex-1 flex flex-col h-full relative overflow-y-auto bg-white">
                <div className="p-4 flex items-center bg-white border-b border-slate-200 md:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="text-slate-600 flex items-center gap-2">
                        <Menu size={24} />
                        <span className="font-medium">Course Content</span>
                    </button>
                </div>

                {activeLesson ? (
                    <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
                        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden mb-8 shadow-lg flex items-center justify-center relative group">
                            {activeLesson.video_url ? (
                                <iframe 
                                    src={getEmbedUrl(activeLesson.video_url)} 
                                    className="w-full h-full" 
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="text-white text-center">
                                    <PlayCircle size={64} className="mx-auto mb-4 opacity-50" />
                                    <p>Video not available</p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">{activeLesson.title}</h1>
                                <p className="text-slate-500">Duration: {activeLesson.duration} minutes</p>
                            </div>
                            <div className="flex gap-4">
                                {activeLesson.quiz_id && (
                                    <Link 
                                        to={`/quizzes/${activeLesson.quiz_id}`}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
                                    >
                                        Take Quiz
                                    </Link>
                                )}
                                <button 
                                    onClick={handleToggleComplete}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
                                >
                                    <CheckCircle size={20} />
                                    Mark as Completed
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Lesson Notes</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {activeLesson.notes || activeLesson.description || 'No additional notes provided for this lesson.'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="text-center text-slate-500">
                            <Layers size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="text-xl">Select a lesson from the curriculum to start learning.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningPage;
