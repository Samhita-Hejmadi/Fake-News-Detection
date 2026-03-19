import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                setError(data.detail || 'Login failed');
            }
        } catch (err) {
            setError('Connection refused. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 bg-grid-pattern relative flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 pointer-events-none"></div>
            
            <div className="w-full max-w-md animate-fade-in-up">
                <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100 border border-white/60">
                    <div className="p-10">
                        <div className="flex justify-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 transform rotate-3">
                                <LogIn className="text-white w-8 h-8 -rotate-3" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-center text-slate-500 mb-8 font-medium">Please enter your details to sign in.</p>

                        {error && (
                            <div className="bg-red-50/80 backdrop-blur-sm text-red-600 p-4 rounded-xl mb-6 border border-red-100 text-sm flex items-center gap-3 animate-fade-in-up">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200/80 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 shadow-sm"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200/80 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 shadow-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 mt-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:bg-slate-400 disabled:transform-none disabled:shadow-none"
                            >
                                {loading ? 'Authenticating...' : 'Sign In'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-colors">
                                Sign up free
                            </Link>
                        </p>
                        
                        <div className="mt-8 pt-6 border-t border-slate-200/50 flex justify-center">
                            <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
