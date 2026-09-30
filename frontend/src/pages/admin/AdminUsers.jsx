import { useState, useEffect } from 'react';
import { Users, Search, Trash2 } from 'lucide-react';
import api from '../../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/api/auth/users/');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/api/auth/users/${userId}/`);
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user.');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.patch(`/api/auth/users/${userId}/`, { role: newRole });
            setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role.');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                    <Users className="text-primary" size={32} /> User Management
                </h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search users by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
                <select 
                    value={roleFilter} 
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="py-3 px-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                    <option value="ALL">All Roles</option>
                    <option value="STUDENT">Students</option>
                    <option value="INSTRUCTOR">Instructors</option>
                    <option value="ADMIN">Admins</option>
                </select>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium text-sm">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-800">{user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No Name'}</td>
                                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={user.role} 
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold outline-none cursor-pointer hover:bg-slate-200 transition-colors"
                                        >
                                            <option value="STUDENT">STUDENT</option>
                                            <option value="INSTRUCTOR">INSTRUCTOR</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 flex justify-center gap-3">
                                        <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete User">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No users found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
