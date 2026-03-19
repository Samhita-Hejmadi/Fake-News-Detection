import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, LogOut, Loader2, AlertCircle, CheckCircle2, HelpCircle, Shield, Globe, BarChart3, Search } from 'lucide-react';

const Dashboard = () => {
    const [news, setNews] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(savedUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const analyzeNews = async () => {
        if (!news.trim()) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ news }),
            });

            const data = await response.json();
            if (response.ok) {
                setResult(data);
            } else {
                setError(data.detail || 'Analysis failed');
            }
        } catch (err) {
            setError('Connection refused. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    const getVerdictStyle = (verdict) => {
        switch (verdict) {
            case 'TRUE': return 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-emerald-200';
            case 'FAKE': return 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-200';
            default: return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-orange-200';
        }
    };

    const getVerdictIcon = (verdict) => {
        switch (verdict) {
            case 'TRUE': return <CheckCircle2 className="w-10 h-10 text-white" />;
            case 'FAKE': return <AlertCircle className="w-10 h-10 text-white" />;
            default: return <HelpCircle className="w-10 h-10 text-white" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 bg-grid-pattern relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/90 pointer-events-none"></div>
            
            {/* Navbar */}
            <nav className="glass-panel fixed top-0 w-full z-50 transition-all border-b-0 border-slate-200/50">
                <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6 md:px-8">
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                        FakeNews<span className="text-indigo-600">AI</span>
                    </h1>
                    <div className="flex items-center gap-6">
                        <span className="text-slate-600 text-sm font-medium hidden sm:block">
                            Welcome, <span className="font-bold text-slate-900">{user?.name || 'User'}</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-bold bg-white/50 px-4 py-2 rounded-full border border-slate-200 hover:border-red-200 hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4" /> <span className="hidden sm:block">Sign Out</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto pt-32 pb-20 px-4 sm:px-6 relative z-10">
                
                {/* Input Section */}
                <div className="glass-panel rounded-3xl p-6 sm:p-10 mb-10 animate-fade-in-up shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Search className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verify Content</h2>
                            <p className="text-slate-500 text-sm font-medium mt-0.5">Paste any article or claim to analyze its authenticity.</p>
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <textarea
                            className="w-full h-40 p-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-slate-700 shadow-sm text-lg leading-relaxed placeholder-slate-400 font-medium"
                            placeholder="Paste the news text or claim here..."
                            value={news}
                            onChange={(e) => setNews(e.target.value)}
                        />
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/5 pointer-events-none group-focus-within:ring-indigo-500/10 transition-all"></div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={analyzeNews}
                            disabled={loading || !news.trim()}
                            className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:bg-slate-300 disabled:transform-none disabled:shadow-none"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Processing Analysis...</>
                            ) : (
                                <><Send className="w-5 h-5" /> Analyze Content</>
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50/80 backdrop-blur-md text-red-600 p-6 rounded-2xl border border-red-100 flex items-center gap-4 mb-10 animate-fade-in-up">
                        <AlertCircle className="w-6 h-6 flex-shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {/* Results Section */}
                {result && (
                    <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        
                        {/* Summary Header */}
                        <div className={`p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden ${getVerdictStyle(result.final_verdict)} border border-white/20`}>
                            {/* Decorative background circle */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30 shadow-sm">
                                        {getVerdictIcon(result.final_verdict)}
                                    </div>
                                    <div>
                                        <p className="text-white/80 font-bold uppercase tracking-widest text-sm mb-1">Final Verdict</p>
                                        <h3 className="text-4xl sm:text-5xl font-black tracking-tight">{result.final_verdict}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="h-1.5 w-16 bg-white/30 rounded-full overflow-hidden">
                                                <div className="h-full bg-white rounded-full" style={{ width: `${result.confidence}%` }}></div>
                                            </div>
                                            <p className="text-white/90 font-bold text-sm">{result.confidence}% Confidence</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 text-center shadow-lg">
                                        <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Verification Status</p>
                                        <p className="text-xl font-black">{result.verification}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { title: 'ML Score', score: result.ml_score, icon: BarChart3, color: 'blue', desc: 'Linguistic Patterns' },
                                { title: 'Web Evidence', score: result.evidence_score, icon: Globe, color: 'purple', desc: 'Fact-Check Cross-Ref' },
                                { title: 'Credibility', score: result.credibility_score, icon: Shield, color: 'emerald', desc: 'Source Authority' }
                            ].map((metric, idx) => (
                                <div key={idx} className="glass-panel rounded-3xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`w-14 h-14 bg-${metric.color}-100 rounded-2xl flex items-center justify-center mb-4 border border-${metric.color}-200/50 shadow-sm`}>
                                        <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{metric.title}</h4>
                                    <div className="flex items-baseline gap-1">
                                        <p className="text-3xl font-black text-slate-900">{metric.score}</p>
                                        <span className="text-lg font-bold text-slate-400">%</span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-500 mt-2 bg-slate-100 px-3 py-1 rounded-full">{metric.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Reasoning and Sources */}
                        <div className="grid lg:grid-cols-5 gap-6">
                            <div className="lg:col-span-3 glass-panel rounded-3xl p-8 shadow-sm">
                                <h4 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <HelpCircle className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    AI Reasoning Engine
                                </h4>
                                
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Claim Analyzed</p>
                                        <p className="text-slate-800 font-medium leading-relaxed italic border-l-4 border-indigo-200 pl-4 py-1">"{result.claim}"</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Detailed Explanation</p>
                                        <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/60 shadow-inner">
                                            <p className="text-slate-700 leading-relaxed font-medium">{result.explanation}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 glass-panel rounded-3xl p-8 shadow-sm h-full max-h-[500px] overflow-y-auto">
                                <h4 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                                    <div className="bg-slate-100 p-2 rounded-lg">
                                        <Search className="w-5 h-5 text-slate-600" />
                                    </div>
                                    Sources & Evidence
                                </h4>
                                
                                <div className="space-y-4">
                                    {result.sources && result.sources.length > 0 ? (
                                        result.sources.map((source, idx) => (
                                            <div key={idx} className="group flex items-start justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all">
                                                <div className="flex gap-3 items-start flex-grow overflow-hidden pr-3">
                                                    <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${source.stance === 'support' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : source.stance === 'contradict' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-slate-300'}`}></div>
                                                    <div className="min-w-0">
                                                        <span className="text-sm font-bold text-slate-800 block truncate" title={source.name}>{source.name}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-lg ${source.stance === 'support' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : source.stance === 'contradict' ? 'bg-rose-50 text-rose-700 border border-rose-200/50' : 'bg-slate-100 text-slate-600 border border-slate-200/50'}`}>
                                                        {source.stance}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 text-center">
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                                <Shield className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-600">No external sources found.</p>
                                            <p className="text-xs font-medium text-slate-400 mt-1 max-w-[200px]">The model relied primarily on linguistic analysis for this claim.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
