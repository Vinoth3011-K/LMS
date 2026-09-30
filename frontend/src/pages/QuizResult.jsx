import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';

const QuizResult = () => {
    const location = useLocation();
    const { attempt } = location.state || {};

    if (!attempt) return <div className="text-center py-20 text-xl font-bold">Result not found.</div>;

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10 text-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-4 ${attempt.passed ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                
                <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${attempt.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">
                    {attempt.passed ? 'Congratulations!' : 'Keep Practicing!'}
                </h1>
                <p className="text-slate-500 text-base sm:text-lg mb-8">You have {attempt.passed ? 'passed' : 'failed'} the quiz.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto mb-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <p className="text-sm text-slate-500 font-bold uppercase mb-1">Your Score</p>
                        <p className="text-4xl font-black text-primary">{attempt.score} <span className="text-lg text-slate-400">/ {attempt.total_marks}</span></p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <p className="text-sm text-slate-500 font-bold uppercase mb-1">Percentage</p>
                        <p className={`text-4xl font-black ${attempt.passed ? 'text-emerald-500' : 'text-red-500'}`}>{attempt.percentage.toFixed(1)}%</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-2 sm:gap-6 mb-10 text-slate-600 font-medium">
                    <div>Total Questions: <span className="font-bold text-slate-800">{attempt.answers?.length || 0}</span></div>
                    <div>Correct: <span className="font-bold text-emerald-600">{attempt.answers?.filter(a => a.is_correct).length || 0}</span></div>
                    <div>Wrong: <span className="font-bold text-red-600">{attempt.answers?.filter(a => !a.is_correct).length || 0}</span></div>
                    <div>Date: <span className="font-bold text-slate-800">{new Date(attempt.attempted_at).toLocaleDateString()}</span></div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/my-results" className="w-full sm:w-auto bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">
                        View All Results
                    </Link>
                    <Link to="/my-courses" className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-secondary transition-all shadow-md">
                        Continue Learning
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default QuizResult;
