import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getModule, createLesson, deleteLesson } from '../../services/api';
import { Trash2, PlayCircle, ArrowLeft } from 'lucide-react';

const ManageLessons = () => {
    const { moduleId } = useParams();
    const [moduleData, setModuleData] = useState(null);
    const [lessons, setLessons] = useState([]);
    
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [duration, setDuration] = useState(0);
    const [orderNumber, setOrderNumber] = useState(1);

    const fetchLessons = async () => {
        try {
            const { data } = await getModule(moduleId);
            setModuleData(data);
            setLessons(data.lessons || []);
            if (data.lessons) {
                setOrderNumber(data.lessons.length + 1);
            }
        } catch (error) {
            console.error('Failed to fetch module', error);
        }
    };

    useEffect(() => {
        fetchLessons();
    }, [moduleId]);

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            await createLesson({ 
                module: moduleId, 
                title, 
                description, 
                video_url: videoUrl, 
                notes, 
                duration, 
                order_number: orderNumber 
            });
            alert('Lesson added!');
            fetchLessons();
            setTitle('');
            setDescription('');
            setVideoUrl('');
            setNotes('');
            setDuration(0);
        } catch (error) {
            alert('Failed to add lesson');
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Delete this lesson?')) {
            try {
                await deleteLesson(id);
                fetchLessons();
            } catch (error) {
                alert('Failed to delete');
            }
        }
    };

    if (!moduleData) return <div>Loading...</div>;

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Manage Lessons</h1>
                    <p className="text-slate-500 mt-1">Module: {moduleData.title}</p>
                </div>
                {moduleData.course && (
                    <Link to={`/instructor/courses/${moduleData.course}/modules`} className="flex items-center space-x-2 text-slate-600 hover:text-primary font-medium">
                        <ArrowLeft size={18} />
                        <span>Back to Modules</span>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {lessons.length > 0 ? lessons.map((lesson, index) => (
                        <div key={lesson.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                                        <PlayCircle size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">Lesson {index + 1}: {lesson.title}</h3>
                                        {lesson.description && <p className="text-sm text-slate-500">{lesson.description}</p>}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleDelete(lesson.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center text-sm text-slate-500">
                                <span>Duration: {lesson.duration} min</span>
                                {lesson.video_url && <a href={lesson.video_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">View Video</a>}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
                            Lessons will appear here. Add one below.
                        </div>
                    )}
                </div>

                <div>
                    <form onSubmit={handleAddLesson} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Add New Lesson</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Video URL</label>
                                <input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none" rows="2"></textarea>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Duration (min)</label>
                                    <input required type="number" min="0" value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Order</label>
                                    <input required type="number" min="1" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            </div>
                            
                            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-secondary transition-colors mt-4">
                                Save Lesson
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageLessons;
