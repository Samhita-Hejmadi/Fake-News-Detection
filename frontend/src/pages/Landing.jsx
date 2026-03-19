import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Search, FileText, ArrowRight } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 flex-grow flex flex-col">
                {/* Navigation (Simple) */}
                <nav className="flex justify-between items-center py-6 px-8 max-w-7xl mx-auto w-full animate-fade-in-up">
                    <div className="text-xl font-bold tracking-tight text-slate-900">
                        FakeNews<span className="text-indigo-600">AI</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Sign In</Link>
                        <Link to="/signup" className="text-sm font-semibold bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg">Get Started</Link>
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="flex-grow flex flex-col justify-center items-center text-center px-4 py-20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8">
                            <Shield className="w-4 h-4" />
                            <span>V2.0 Hybrid Engine is Live</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tighter leading-tight">
                            Verify the Truth with <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                                AI Precision
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                            Protect yourself from misinformation. Our multi-layered system uses state-of-the-art NLP and claim verification to analyze news credibility instantly.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                to="/signup"
                                className="group flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full hover:bg-indigo-700 transition-all shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] hover:-translate-y-0.5"
                            >
                                Start Verifying
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Features Section - Glassmorphic */}
                <section className="py-24 px-4 bg-grid-pattern relative border-t border-slate-200/50">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50"></div>
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">How it Works</h2>
                            <p className="text-slate-600 text-lg">A sophisticated four-stage verification pipeline.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <FeatureCard
                                icon={<Search className="w-6 h-6 text-blue-600" />}
                                title="Claim Extraction"
                                description="Automatically isolates the core, verifiable claims from complex news articles."
                                delay="0"
                            />
                            <FeatureCard
                                icon={<Shield className="w-6 h-6 text-indigo-600" />}
                                title="NLP Classifier"
                                description="Analyzes linguistic patterns and stylistic anomalies using machine learning."
                                delay="100"
                            />
                            <FeatureCard
                                icon={<CheckCircle className="w-6 h-6 text-purple-600" />}
                                title="Web Evidence"
                                description="Cross-references claims with trusted fact-checking databases."
                                delay="200"
                            />
                            <FeatureCard
                                icon={<FileText className="w-6 h-6 text-slate-700" />}
                                title="Reasoning Layer"
                                description="Synthesizes all signals into a final verdict with a transparent explanation."
                                delay="300"
                            />
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-md py-8 text-center text-slate-500 text-sm relative z-10">
                    <p>© 2026 FakeNewsAI. Built with precision.</p>
                </footer>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => (
    <div 
        className="glass-panel p-8 rounded-3xl hover:-translate-y-1 transition-all duration-300 group"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-wide">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
    </div>
);

export default Landing;
