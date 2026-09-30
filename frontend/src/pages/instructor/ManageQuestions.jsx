import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuiz, createQuestion, deleteQuestion } from '../../services/api';
import { Trash2 } from 'lucide-react';

const ManageQuestions = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [formData, setFormData] = useState({
        quiz: quizId,
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'A',
        marks: 1
    });

    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            const { data } = await getQuiz(quizId);
            setQuiz(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        try {
            await createQuestion(formData);
            fetchQuiz();
            setFormData({
                ...formData,
                question_text: '',
                option_a: '',
                option_b: '',
                option_c: '',
                option_d: '',
                correct_answer: 'A'
            });
        } catch (error) {
            alert('Error adding question');
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Delete question?')) {
            try {
                await deleteQuestion(id);
                fetchQuiz();
            } catch (error) {
                alert('Error deleting');
            }
        }
    };

    if(!quiz) return <div>Loading...</div>;

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Manage Questions</h1>
                    <p className="text-slate-500">Quiz: {quiz.title}</p>
                </div>
                <Link to="/instructor/quizzes" className="text-slate-600 hover:text-primary font-medium">
                    Back to Quizzes
                </Link> 
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Existing Questions ({quiz.questions?.length || 0})</h2>
                    <div className="space-y-4">
                        {quiz.questions?.map((q, idx) => (

                            <div key={q.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
                                <p className="font-bold text-slate-800 mb-2 pr-20">{idx+1}. {q.question_text}</p>
                                <div className="text-sm text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className={q.correct_answer === 'A' ? 'text-emerald-600 font-bold' : ''}>A. {q.option_a}</div>
                                    <div className={q.correct_answer === 'B' ? 'text-emerald-600 font-bold' : ''}>B. {q.option_b}</div>
                                    <div className={q.correct_answer === 'C' ? 'text-emerald-600 font-bold' : ''}>C. {q.option_c}</div>
                                    <div className={q.correct_answer === 'D' ? 'text-emerald-600 font-bold' : ''}>D. {q.option_d}</div>
                                </div>
                                <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white pl-2">
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 shrink-0">{q.marks} Marks</span>
                                    <button onClick={() => handleDelete(q.id)} className="text-red-500 hover:text-red-700 shrink-0"><Trash2 size={18}/></button>
                                </div>
                            </div>

                        ))}


                    </div>
                </div>

                <div>
                    <form onSubmit={handleAddQuestion} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Add New Question</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Question Text</label>
                                <textarea required name="question_text" value={formData.question_text} onChange={handleChange} rows="2" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none"></textarea>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-slate-600">Option A</label><input required type="text" name="option_a" value={formData.option_a} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" /></div>
                                <div><label className="block text-xs font-bold text-slate-600">Option B</label><input required type="text" name="option_b" value={formData.option_b} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" /></div>
                                <div><label className="block text-xs font-bold text-slate-600">Option C</label><input required type="text" name="option_c" value={formData.option_c} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" /></div>
                                <div><label className="block text-xs font-bold text-slate-600">Option D</label><input required type="text" name="option_d" value={formData.option_d} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" /></div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Correct Answer</label>
                                    <select name="correct_answer" value={formData.correct_answer} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none bg-white">
                                        <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                                    </select>
                                </div>

                                
                                <div className="w-full sm:w-32">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Marks</label>
                                    <input required type="number" min="1" name="marks" value={formData.marks} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            </div>


                            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-secondary transition-colors mt-4">Add Question</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageQuestions;
