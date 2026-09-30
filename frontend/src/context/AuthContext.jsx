import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/api/auth/profile/');
      setUser(data);
      return data;
    } catch (error) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login/', { email, password });
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    const profile = await fetchProfile();
    if (!profile) throw new Error("Failed to fetch profile");
    return profile;
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser: fetchProfile, loading, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
