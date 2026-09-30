import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCertificates } from '../services/api';
import { Award, Download, CheckCircle, ExternalLink } from 'lucide-react';

export default function MyCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await getCertificates();
      setCertificates(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching certificates', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required to view certificates. Please log in.');
      } else {
        setError('Failed to load certificates.');
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <Award className="w-8 h-8 text-primary" /> My Certificates
          </h1>
          <p className="text-slate-500 mt-2">View and download your earned certificates.</p>
        </div>
        <Link to="/verify" className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Verify a Certificate
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
          {error}
        </div>
      )}

      {certificates.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm mt-8">
          <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Certificates Yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">Complete courses with 100% progress and pass all required quizzes to earn certificates.</p>
          <Link to="/my-courses" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary transition-colors inline-block">
            Go to My Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <div key={cert.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col h-full">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Award className="w-24 h-24 text-primary" />
              </div>
              <div className="mb-4">
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Earned</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 relative z-10">{cert.course_title}</h3>
              <p className="text-sm text-slate-500 mb-6 relative z-10">Issued: {new Date(cert.issued_date).toLocaleDateString()}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                <Link to={`/certificates/${cert.id}`} className="text-primary hover:text-secondary font-semibold text-sm flex items-center gap-1">
                  View Certificate <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
