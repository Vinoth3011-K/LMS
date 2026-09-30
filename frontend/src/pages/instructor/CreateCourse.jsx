import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../../services/api';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        difficulty_level: 'beginner',
        duration: 0,
        price: 0,
        status: 'Draft'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await createCourse(formData);
            alert('Course created successfully!');
            navigate(`/instructor/courses/${data.id}/modules`); 
        } catch (error) {
            console.error(error);
            alert('Error creating course.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8">Create New Course</h1>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Course Title</label>
                    <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Enter course title" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Enter course description"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                        <input required type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="e.g. Programming" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                        <select name="difficulty_level" value={formData.difficulty_level} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
                        <input required type="number" min="0" name="duration" value={formData.duration} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Price ($)</label>
                        <input required type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white">
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                    </div>
                </div>

                <div className="pt-6 flex flex-col-reverse sm:flex-row justify-end gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="w-full sm:w-auto px-6 py-3 font-medium text-slate-600 hover:text-slate-800 transition-colors bg-slate-100 hover:bg-slate-200 rounded-xl sm:bg-transparent sm:hover:bg-transparent">
                        Cancel
                    </button>

                    <button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition-all shadow-md">
                        {loading ? 'Creating...' : 'Create Course'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCourse;
