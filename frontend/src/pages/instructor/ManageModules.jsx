import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseDetails, createModule, deleteModule } from '../../services/api';
import { Trash2, Plus, Layers } from 'lucide-react';

const ManageModules = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [orderNumber, setOrderNumber] = useState(1);
    
    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const { data } = await getCourseDetails(courseId);
            setCourse(data);
            if (data.modules) {
                setOrderNumber(data.modules.length + 1);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddModule = async (e) => {
        e.preventDefault();
        try {
            await createModule({ course: courseId, title, description, order_number: orderNumber });
            setTitle('');
            setDescription('');
            fetchCourse();
        } catch (error) {
            alert('Failed to add module');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this module?")) {
            try {
                await deleteModule(id);
                fetchCourse();
            } catch (error) {
                alert('Failed to delete module');
            }
        }
    };

    if (!course) return <div>Loading...</div>;

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Manage Modules</h1>
                    <p className="text-slate-500 mt-1">Course: {course.title}</p>
                </div>
                <Link to="/instructor/courses" className="text-slate-600 hover:text-primary font-medium">
                    Back to Courses
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {course.modules?.map((module, index) => (
                        <div key={module.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                                        <Layers size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">Module {index + 1}: {module.title}</h3>
                                        {module.description && <p className="text-sm text-slate-500">{module.description}</p>}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleDelete(module.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center">
                                <span className="text-sm text-slate-500">{module.lessons?.length || 0} Lessons</span>
                                <Link to={`/instructor/modules/${module.id}/lessons`} className="text-sm font-medium text-primary hover:text-secondary flex items-center space-x-1">
                                    <span>Manage Lessons</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                    {(!course.modules || course.modules.length === 0) && (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
                            No modules added yet.
                        </div>
                    )}
                </div>

                <div>
                    <form onSubmit={handleAddModule} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Add New Module</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Module Title</label>
                                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" rows="3"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Order</label>
                                <input required type="number" min="1" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                            </div>
                            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center space-x-2">
                                <Plus size={20} />
                                <span>Add Module</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageModules;
