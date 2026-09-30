import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMenuOpen(false);
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                    <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-black">L</div>
                    <span className="hidden sm:inline">LMS Platform</span>
                </Link>
            
         
            <nav className="hidden md:flex items-center gap-4 sm:gap-6">
              <Link to="/catalog" className="font-medium text-slate-600 hover:text-primary transition-colors">Courses</Link>
              
              {isAuthenticated && user?.role === 'STUDENT' && (
                  <>
                      <Link to="/my-courses" className="font-medium text-slate-600 hover:text-primary transition-colors">My Learning</Link>
                      <Link to="/dashboard" className="font-medium text-slate-600 hover:text-primary transition-colors">Dashboard</Link>
                  </>
              )}

              {isAuthenticated && user?.role === 'INSTRUCTOR' && (
                  <Link to="/instructor" className="font-medium text-slate-600 hover:text-emerald-600 transition-colors">Dashboard</Link>
              )}

              {isAuthenticated && user?.role === 'ADMIN' && (
                  <Link to="/admin" className="font-medium text-slate-600 hover:text-purple-600 transition-colors">Dashboard</Link>
              )}

              
              {!isAuthenticated ? (
                  <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                      <Link to="/login" className="font-semibold text-primary hover:text-indigo-600 transition-colors">Login</Link>
                      <Link to="/register" className="font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors shadow-sm">Sign Up</Link>
                  </div>
              ) : (

                  <div className="flex items-center gap-4 pl-4 sm:pl-6 border-l border-slate-200">
                      <Link to="/profile" className="flex items-center gap-3 group">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 group-hover:bg-primary/20 transition-colors shrink-0">
                              {user?.name?.charAt(0).toUpperCase() || <User size={20} />}
                          </div>
                          <div className="hidden lg:block text-left">
                              <div className="font-semibold text-sm text-slate-800 group-hover:text-primary transition-colors">{user?.name}</div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 inline-block px-1.5 py-0.5 rounded mt-0.5">{user?.role}</div>
                          </div>
                      </Link>
                      
                      <button 
                          onClick={handleLogout} 
                          className="flex items-center gap-2 p-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors ml-2 shrink-0"
                          title="Logout"
                      >
                          <LogOut size={18} />
                          <span className="hidden lg:inline">Logout</span>
                      </button>
                  </div>
              )}


            </nav>

            
            <div className="md:hidden flex items-center gap-4">
                {isAuthenticated && (
                    <Link to="/profile" className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        {user?.name?.charAt(0).toUpperCase() || <User size={16} />}
                    </Link>
                )}


                <button 
                    onClick={() => setMenuOpen(!menuOpen)} 
                    className="text-slate-600 hover:text-primary p-2 -mr-2 focus:outline-none">

                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>
            </div>
          </div>

      
          {menuOpen && (
              <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-4 shadow-lg absolute w-full left-0 z-40 flex flex-col">
                  <Link to="/catalog" onClick={() => setMenuOpen(false)} className="block font-medium text-slate-600 hover:text-primary py-2">Courses</Link>
                  
                  {isAuthenticated && user?.role === 'STUDENT' && (
                      <>
                          <Link to="/my-courses" onClick={() => setMenuOpen(false)} className="block font-medium text-slate-600 hover:text-primary py-2">My Learning</Link>
                          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block font-medium text-slate-600 hover:text-primary py-2">Dashboard</Link>
                      </>
                  )}

                  {isAuthenticated && user?.role === 'INSTRUCTOR' && (
                      <Link to="/instructor" onClick={() => setMenuOpen(false)} className="block font-medium text-slate-600 hover:text-emerald-600 py-2">Instructor Dashboard</Link>
                  )}
                  {isAuthenticated && user?.role === 'ADMIN' && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)} className="block font-medium text-slate-600 hover:text-purple-600 py-2">Admin Dashboard</Link>
                  )}

                  
                  {!isAuthenticated ? (
                      <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                          <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-center font-semibold text-primary py-2 border border-primary rounded-lg">Login</Link>
                          <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-center font-semibold bg-primary text-white py-2 rounded-lg">Sign Up</Link>
                      </div>
                  ) : (
                      <div className="pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-3 mb-4 px-2">
                              <div className="font-semibold text-sm text-slate-800">{user?.name}</div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{user?.role}</div>
                          </div>

                          <button 
                              onClick={handleLogout} 
                              className="w-full flex justify-center items-center gap-2 p-3 font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                              <LogOut size={18} />
                              Logout
                          </button>
                      </div>

                      
                  )}
              </div>
          )}
        </header>
    );
};

export default Navbar;
