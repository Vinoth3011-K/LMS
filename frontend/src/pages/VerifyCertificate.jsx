import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, CheckCircle, XCircle, Award } from 'lucide-react';

export default function VerifyCertificate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  
  const [certId, setCertId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialId) {
      handleVerify(initialId);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setSearchParams({ id: certId });
    handleVerify(certId);
  };

  const handleVerify = async (idToVerify) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.get(`http://localhost:8000/api/certificates/verify/?id=${idToVerify}`);
      setResult(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Certificate not found or invalid ID.');
      } else {
        setError('An error occurred while verifying the certificate.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-3xl mx-auto px-4">
      <div className="text-center mb-10">
        <Award className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-4">
          Verify Certificate
        </h1>
        <p className="text-slate-500 text-lg">
          Enter the unique certificate ID to verify its authenticity.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary outline-none font-mono text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !certId.trim()}
            className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 p-8 rounded-3xl border border-red-100 flex flex-col items-center text-center">
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-red-700 mb-2">Invalid Certificate</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && result.valid && (
        <div className="bg-green-50 p-8 rounded-3xl border border-green-100 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-10">
            <CheckCircle className="w-64 h-64 text-green-500" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-green-700 mb-2">Authentic Certificate</h3>
            <p className="text-green-600 font-medium">This certificate is valid and recognized by our platform.</p>
          </div>
          
          <div className="relative z-10 bg-white rounded-2xl p-6 border border-green-100 shadow-sm space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Recipient</p>
              <p className="text-lg font-bold text-slate-800">{result.student_name}</p>
            </div>
            
            <div className="h-px bg-slate-100 w-full"></div>
            
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Course Completed</p>
              <p className="text-lg font-bold text-slate-800">{result.course_title}</p>
            </div>
            
            <div className="h-px bg-slate-100 w-full"></div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Date</p>
                <p className="font-medium text-slate-700">{new Date(result.issued_date).toLocaleDateString()}</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Certificate ID</p>
                <p className="font-mono text-sm bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  {result.certificate_number}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
