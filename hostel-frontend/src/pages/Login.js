import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const result = await login(email, password);
            if (result.success) {
                if (result.role === 'ADMIN') {
                    navigate('/admin-dashboard');
                } else if (result.role === 'STUDENT') {
                    navigate('/student-dashboard');
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-[1.01]">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                        <Hotel className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">HostelHub</h2>
                    <p className="text-gray-500 mt-2">Welcome back! Please sign in.</p>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-center gap-3">
                        <div className="w-1 h-full bg-red-600 rounded-full"></div>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <Mail className="w-5 h-5" />
                            </span>
                            <input
                                type="email"
                                id="email"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <Lock className="w-5 h-5" />
                            </span>
                            <input
                                type="password"
                                id="password"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                Sign In
                            </>
                        )}
                    </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;