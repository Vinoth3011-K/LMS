import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const navigate = useNavigate();
    const [registerError, setRegisterError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const password = watch("password");

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setRegisterError('');
        setSuccessMessage('');
        
        try {
            const payload = {
                name: `${data.firstName} ${data.lastName}`.trim(),
                email: data.email,
                password: data.password,
                role: data.role
            };
            await registerUser(payload);
            setSuccessMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
                
            if (error.response?.data) {
                const dataErrors = error.response.data;
                if (typeof dataErrors === 'object') {
                    
                    const firstErrorKey = Object.keys(dataErrors)[0];
                    const firstError = dataErrors[firstErrorKey];
                    if (Array.isArray(firstError)) {
                        setRegisterError(`${firstErrorKey}: ${firstError[0]}`);
                    } else if (typeof firstError === 'string') {
                        setRegisterError(firstError);
                    } else {
                        setRegisterError(error.response.data?.detail || 'Registration failed. Please try again.');
                    }
                } else {
                    setRegisterError('Registration failed. Please try again.');
                }
            } else {
                setRegisterError('Registration failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-lg border border-slate-100 my-8">
                <h2 className="text-3xl font-bold text-center text-primary mb-6">Create Account</h2>
                
                {registerError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm text-center border border-red-100">
                        {registerError}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm text-center border border-green-100">
                        {successMessage}
                    </div>
                )}
                
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">First Name</label>
                            <input 
                                type="text" 
                                className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.firstName ? 'border-red-300' : 'border-slate-300'} focus:ring-primary focus:border-primary transition-colors`}
                                placeholder="John" 
                                {...register("firstName", { required: "First name is required" })}
                            />
                            {errors.firstName && <span className="text-red-500 text-xs mt-1 block">{errors.firstName.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Last Name</label>
                            <input 
                                type="text" 
                                className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.lastName ? 'border-red-300' : 'border-slate-300'} focus:ring-primary focus:border-primary transition-colors`}
                                placeholder="Doe" 
                                {...register("lastName", { required: "Last name is required" })}
                            />
                            {errors.lastName && <span className="text-red-500 text-xs mt-1 block">{errors.lastName.message}</span>}
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input 
                            type="email" 
                            autoComplete="email"
                            className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-300' : 'border-slate-300'} focus:ring-primary focus:border-primary transition-colors`}
                            placeholder="you@example.com" 
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Invalid email format"
                                }
                            })}
                        />
                        {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Role</label>
                        <select
                            className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.role ? 'border-red-300' : 'border-slate-300'} focus:ring-primary focus:border-primary transition-colors bg-white`}
                            {...register("role", { required: "Role is required" })}
                            defaultValue="STUDENT"
                        >
                            <option value="STUDENT">Student</option>
                            <option value="INSTRUCTOR">Instructor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                        {errors.role && <span className="text-red-500 text-xs mt-1 block">{errors.role.message}</span>}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input 
                            type="password" 
                            autoComplete="new-password"
                            className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-300' : 'border-slate-300'} focus:ring-primary focus:border-primary transition-colors`}
                            placeholder="••••••••" 
                            {...register("password", { 
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                        />
                        {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                        <input 
                            type="password" 
                            autoComplete="new-password"
                            className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-300' : 'border-slate-300'} focus:ring-primary focus:border-primary transition-colors`}
                            placeholder="••••••••" 
                            {...register("confirmPassword", { 
                                required: "Please confirm your password",
                                validate: value => value === password || "Passwords do not match"
                            })}
                        />
                        {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword.message}</span>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-secondary disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg mt-6"
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                    
                    <div className="mt-4 text-center">
                        <span className="text-slate-600 text-sm">Already have an account? </span>
                        <Link to="/login" className="text-primary hover:text-secondary font-semibold text-sm transition-colors">
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Register;
