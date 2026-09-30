import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createQuiz, getCourses } from '../../services/api';

const CreateQuiz = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        course: courseId || '',
        title: '',
        description: '',
        passing_marks: 50,
        total_marks: 100
    });
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    
    useEffect(() => {
        if (!courseId) {
            fetchCourses();
        }
    }, [courseId]);

    const fetchCourses = async () => {
        try {
            const { data } = await getCourses({ my_courses: true });
            setCourses(data);
            if(data.length > 0) {
                setFormData(prev => ({ ...prev, course: data[0].id }));
            }
        } catch (error) {
            console.error('Error fetching courses', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSubmit = { ...formData };
            if (!dataToSubmit.lesson) {
                delete dataToSubmit.lesson;
            }
            const { data } = await createQuiz(dataToSubmit);
            alert('Quiz created successfully!');
            navigate(`/instructor/quizzes/${data.id}/questions`);
        } catch (error) {
            alert('Error creating quiz.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8">Create Quiz</h1>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
                {!courseId && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Select Course</label>
                        <select required name="course" value={formData.course} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none">
                            <option value="">-- Select a Course --</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Quiz Title</label>
                    <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none" placeholder="Enter quiz title" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Related Lesson (Optional)</label>
                    <input type="number" name="lesson" value={formData.lesson || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none" placeholder="Enter lesson ID (Optional)" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Total Marks</label>
                        <input required type="number" name="total_marks" value={formData.total_marks} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Passing Marks</label>
                        <input required type="number" name="passing_marks" value={formData.passing_marks} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition-all shadow-md">
                        {loading ? 'Creating...' : 'Create Quiz'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuiz;
