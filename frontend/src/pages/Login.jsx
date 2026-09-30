import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setLoginError('');
        try {
            const userData = await login(data.email, data.password);
            if (userData?.role === 'ADMIN') {
                navigate('/admin');
            } else if (userData?.role === 'INSTRUCTOR') {
                navigate('/instructor');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            setLoginError('Invalid email or password.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 sm:px-0">
            <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
                <h2 className="text-3xl font-bold text-center text-primary mb-6">Welcome Back</h2>
                
                {loginError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm text-center border border-red-100">
                        {loginError}
                    </div>
                )}
                
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input 
                            type="email" 
                            autoComplete="email"
                            className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-300' : 'border-slate-300'} focus:ring-primary focus:border-primary transition-colors`}
                            placeholder="you@example.com" 
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input 
                            type="password" 
                            autoComplete="current-password"
                            className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-300' : 'border-slate-300'} focus:ring-primary focus:border-primary transition-colors`}
                            placeholder="••••••••" 
                            {...register("password", { required: "Password is required" })}
                        />
                        {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-secondary disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg mt-6"
                    >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>
                    
                    <div className="mt-4 text-center">
                        <span className="text-slate-600 text-sm">Don't have an account? </span>
                        <Link to="/register" className="text-primary hover:text-secondary font-semibold text-sm transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Login;
