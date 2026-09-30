import { useState, useEffect } from 'react';
import { getMyResults } from '../services/api';
import { CheckCircle, XCircle } from 'lucide-react';

const MyResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const { data } = await getMyResults();
                setResults(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return <div className="text-center py-20 font-bold">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto py-8 p-4">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">My Quiz Results</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Quiz</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Course Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>

                    
                    <tbody className="bg-white divide-y divide-slate-200">
                        {results.map(attempt => (
                            <tr key={attempt.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{attempt.quiz_title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{attempt.course_title}</td>
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
                {results.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        You have not attempted any quizzes yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyResults;
