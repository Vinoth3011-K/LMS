import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Shield, GraduationCap, Calendar, Hash, BadgeInfo } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const { data } = await api.get('/api/auth/profile/');
                setProfileData(data);
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfileData();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Loading profile...</p>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-50 text-red-500 rounded-2xl border border-red-100 flex items-center justify-center gap-2 font-medium">
                <Shield size={20} />
                Failed to load profile data. Please try again.
            </div>
        );
    }

    const isStudent = profileData.role === 'STUDENT';
    const isInstructor = profileData.role === 'INSTRUCTOR';
    const isAdmin = profileData.role === 'ADMIN';

    const getRoleTheme = () => {
        if (isAdmin) return { gradient: 'from-purple-500 to-indigo-600', color: 'text-purple-600', bg: 'bg-purple-100' };
        if (isInstructor) return { gradient: 'from-emerald-400 to-teal-500', color: 'text-emerald-600', bg: 'bg-emerald-100' };
        return { gradient: 'from-blue-500 to-cyan-500', color: 'text-blue-600', bg: 'bg-blue-100' };
    };
    
    const theme = getRoleTheme();
    const joinDate = new Date(profileData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const profileId = profileData.id || `USR-${profileData.email.split('@')[0].toUpperCase()}`;

    return (
        <div className="profile-container">
            
            <div className="profile-card">
               
                <div className={`profile-header-gradient ${theme.gradient}`}></div>
                
             
                <div className="profile-content">
                    <div className="profile-header-content">
                   
                        <div className="profile-avatar-wrapper">
                            <div className={`profile-avatar-inner ${theme.bg} ${theme.color}`}>
                                {profileData.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        
                     
                        <div className="profile-title-wrapper">
                            <h1 className="profile-name">{profileData.name}</h1>
                            <div className="profile-badges">
                                <span className={`profile-role-badge ${theme.bg} ${theme.color}`}>
                                    {isAdmin && <Shield size={14} />}
                                    {isInstructor && <GraduationCap size={14} />}
                                    {isStudent && <User size={14} />}
                                    {profileData.role}
                                </span>
                                <span className="profile-email-badge">
                                    <Mail size={16} className="text-slate-400" />
                                    {profileData.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    
                    <div className="profile-details-card">
                        <h2 className="profile-details-title">
                            <BadgeInfo className={theme.color} size={20} />
                            Profile Details
                        </h2>
                        
                        <div className="profile-details-grid">
                            
                            <div>
                                <p className="profile-field-label">
                                    <User size={14} /> Full Name
                                </p>
                                <p className="profile-field-value">{profileData.name}</p>
                            </div>
                            
                            <div>
                                <p className="profile-field-label">
                                    <Mail size={14} /> Email Address
                                </p>
                                <p className="profile-field-value">{profileData.email}</p>
                            </div>

                            <div>
                                <p className="profile-field-label">
                                    <Shield size={14} /> Role
                                </p>
                                <p className="profile-field-value capitalize">{profileData.role.toLowerCase()}</p>
                            </div>

                            <div>
                                <p className="profile-field-label">
                                    <Calendar size={14} /> Joined Date
                                </p>
                                <p className="profile-field-value">{joinDate}</p>
                            </div>

                        
                            {!isAdmin && (
                                <div>
                                    <p className="profile-field-label">
                                        <Hash size={14} /> {isInstructor ? 'Instructor ID' : 'Student ID'}
                                    </p>
                                    <p className="profile-field-value-mono">
                                        {profileId}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                </div>
            </div>
            
        </div>
    );
};

export default Profile;
