import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startQuiz, submitQuiz } from '../services/api';
import { Clock, CheckCircle } from 'lucide-react';

const QuizPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const { data } = await startQuiz(id);
                setQuiz(data);
            } catch (error) {
                alert('Cannot start quiz. You might not be enrolled.');
                navigate(-1);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleOptionChange = (questionId, option) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async () => {
        if (!window.confirm("Are you sure you want to submit your answers?")) return;
        setSubmitting(true);
        try {
            const { data } = await submitQuiz(id, { answers });
            navigate(`/quizzes/results/${data.id}`, { state: { attempt: data } });
        } catch (error) {
            alert('Failed to submit quiz.');
            setSubmitting(false);
        }
    };

    if (!quiz) return <div className="text-center py-20 font-bold text-xl">Loading Quiz...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{quiz.title}</h1>
                    <p className="text-slate-500 mt-2">{quiz.description}</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold flex items-center space-x-2 shrink-0">
                    <Clock size={20} />
                    <span>Total Marks: {quiz.total_marks}</span>
                </div>
            </div>

            <div className="space-y-6">
                {quiz.questions?.map((q, index) => (
                    <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                            <h3 className="text-lg font-bold text-slate-800">
                                <span className="text-primary mr-2">Q{index + 1}.</span> 
                                {q.question_text}
                            </h3>
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold shrink-0">{q.marks} Marks</span>
                        </div>
                        <div className="space-y-3 mt-4">
                            {['A', 'B', 'C', 'D'].map(opt => {
                                const optKey = `option_${opt.toLowerCase()}`;
                                const isSelected = answers[q.id] === opt;
                                return (
                                    <label key={opt} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${isSelected ? 'border-primary bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                                        <input 
                                            type="radio" 
                                            name={`question_${q.id}`} 
                                            value={opt} 
                                            checked={isSelected}
                                            onChange={() => handleOptionChange(q.id, opt)}
                                            className="w-4 h-4 text-primary focus:ring-primary border-slate-300 shrink-0"
                                        />
                                        <span className="ml-3 font-medium text-slate-700 break-words">{opt}. {q[optKey]}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <button 
                    onClick={handleSubmit} 
                    disabled={submitting || Object.keys(answers).length < (quiz.questions?.length || 0)}
                    className="w-full sm:w-auto bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-secondary transition-all shadow-md disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                    <CheckCircle size={24} />
                    <span>{submitting ? 'Evaluating...' : 'Submit Quiz'}</span>
                </button>
            </div>
            {Object.keys(answers).length < (quiz.questions?.length || 0) && (
                <p className="text-center sm:text-right text-red-500 mt-2 text-sm font-medium">Please answer all questions before submitting.</p>
            )}
        </div>
    );
};

export default QuizPage;
