import { useState, useEffect } from 'react';
import { Award, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const { data } = await api.get('/api/certificates/');
            setCertificates(data);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCertificates = certificates.filter(cert => 
        cert.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        cert.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificate_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                    <Award className="text-primary" size={32} /> Certificate Management
                </h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search certificates by student, course, or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium text-sm">
                                <th className="px-6 py-4">Certificate ID</th>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Course</th>
                                <th className="px-6 py-4">Issued Date</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCertificates.map(cert => (
                                <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{cert.certificate_id}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">{cert.student_name}</td>
                                    <td className="px-6 py-4 text-slate-600 max-w-[250px] truncate" title={cert.course_title}>{cert.course_title}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(cert.issued_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 flex justify-center gap-3">
                                        <Link to={`/certificates/${cert.id}`} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="View Certificate">
                                            <ExternalLink size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredCertificates.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No certificates found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCertificates;
