import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuizAttempts, getQuiz } from '../../services/api';
import { CheckCircle, XCircle } from 'lucide-react';

const QuizResults = () => {
    const { quizId } = useParams();
    const [attempts, setAttempts] = useState([]);
    const [quiz, setQuiz] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const quizRes = await getQuiz(quizId);
                setQuiz(quizRes.data);
                const attemptsRes = await getQuizAttempts(quizId);
                setAttempts(attemptsRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchResults();
    }, [quizId]);

    if (!quiz) return <div>Loading...</div>;

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Quiz Results</h1>
                    <p className="text-slate-500 mt-1">Quiz: {quiz.title}</p>
                </div>
                <Link to="/instructor/quizzes" className="text-slate-600 hover:text-primary font-medium">
                    Back to Quizzes
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Student ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Attempt Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>


                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {attempts.map(attempt => (
                            <tr key={attempt.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">Student #{attempt.student}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(attempt.attempted_at).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{attempt.score} / {attempt.total_marks} ({attempt.percentage.toFixed(1)}%)</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {attempt.passed ? (
                                        <span className="flex items-center text-emerald-600 text-sm font-bold"><CheckCircle size={16} className="mr-1"/> Passed</span>
                                    ) : (
                                        <span className="flex items-center text-red-600 text-sm font-bold"><XCircle size={16} className="mr-1"/> Failed</span>
                                    )}


                                </td>
                            </tr>
                        ))}

                        
                    </tbody>
                </table>
                {attempts.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No students have attempted this quiz yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizResults;
