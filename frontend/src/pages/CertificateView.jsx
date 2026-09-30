import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import api, { getCertificate } from '../services/api';
import CertificateComponent from '../components/CertificateComponent';
import { Download, ArrowLeft, CheckCircle } from 'lucide-react';

export default function CertificateView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  const fetchCertificate = async () => {
    try {
      const response = await getCertificate(id);
      setCertificate(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching certificate details', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required to view this certificate.');
      } else {
        setError('Certificate not found or you do not have permission to view it.');
      }
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/api/certificates/${id}/download/`, {
        responseType: 'blob', 
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate_${certificate?.certificate_number || id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading certificate:', err);
      let errorMsg = 'Failed to download certificate. Please try again.';
      if (err.response && err.response.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          if (json.detail) errorMsg = json.detail;
        } catch (e) {
          
        }
      }
      alert(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="py-12 px-4 max-w-3xl mx-auto text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 mb-6">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-primary font-medium hover:underline flex items-center justify-center gap-2 mx-auto">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2 mb-4 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Certificate Details</h1>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleDownload}
            className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-secondary transition-colors flex items-center gap-2 shadow-sm hover:shadow"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
        <div>
          <h3 className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Course</h3>
          <p className="text-lg font-bold text-slate-800 mb-4">{certificate.course_title}</p>
          
          <h3 className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Issued Date</h3>
          <p className="font-medium text-slate-800 mb-4">{new Date(certificate.issued_date).toLocaleDateString()}</p>
          
          <h3 className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Certificate ID</h3>
          <p className="font-mono bg-slate-100 px-3 py-1.5 rounded border border-slate-200 text-sm inline-block">
            {certificate.certificate_number}
          </p>
        </div>
        
        <div className="bg-green-50 p-5 rounded-xl border border-green-100 flex flex-col items-center justify-center w-full md:w-auto md:min-w-[200px]">
          <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
          <span className="text-green-700 font-bold text-lg text-center">Verified <br/> Certificate</span>
        </div>
      </div>

      <div className="bg-slate-100 p-4 sm:p-8 rounded-2xl border border-slate-200 flex justify-center w-full overflow-hidden">
        <svg viewBox="0 0 1056 816" className="w-full h-auto max-w-[1056px] drop-shadow-xl bg-white">
          <foreignObject width="1056" height="816">
            <CertificateComponent certificate={certificate} ref={componentRef} />
          </foreignObject>
        </svg>
      </div>
    </div>
  );
}
