import React, { useState } from 'react';
import api from '../api/api';
import { Wand2, Download, ShoppingCart, Sparkles, MessageSquare, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AIEditor = () => {
    const [step, setStep] = useState(1);
    const [prompt, setPrompt] = useState('');
    const [expandedPrompt, setExpandedPrompt] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultImage, setResultImage] = useState(null);

    const handleWhisprFlow = async () => {
        if (!prompt) return toast.error('Please enter a prompt');
        setIsProcessing(true);
        try {
            const res = await api.post('/ai/whispr-flow', { prompt });
            setExpandedPrompt(res.data.expandedPrompt);
            setStep(2);
        } catch (err) {
            toast.error('Whispr Flow failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleStartInterview = async () => {
        setIsProcessing(true);
        try {
            const res = await api.post('/ai/interview-agent', { expandedPrompt });
            setQuestions(res.data.questions);
            setStep(3);
        } catch (err) {
            toast.error('Interview Agent failed.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGenerate = async () => {
        setIsProcessing(true);
        try {
            const res = await api.post('/ai/generate', {
                prompt: expandedPrompt,
                answers: Object.values(answers)
            });
            setResultImage(res.data.imageUrl);
            setStep(4);
            toast.success('Artwork generated successfully!');
        } catch (err) {
            toast.error('Generation failed.');
        } finally {
            setIsProcessing(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="bg-white/80 backdrop-blur-2xl p-12 rounded-[2.5rem] border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <label className="block font-black text-xs uppercase tracking-[0.3em] mb-4 text-blue-600">Phase 01 — Vision</label>
                        <h2 className="text-4xl font-black mb-8 tracking-tighter leading-none">Describe your<br />masterpiece.</h2>
                        <textarea
                            rows="4"
                            className="w-full bg-gray-50/50 border-2 border-transparent rounded-3xl p-6 focus:bg-white focus:border-blue-500/20 focus:outline-none text-xl transition-all duration-500 placeholder:text-gray-300"
                            placeholder="A futuristic oasis in the middle of a neon desert..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button
                            disabled={isProcessing}
                            onClick={handleWhisprFlow}
                            className="w-full mt-8 py-5 rounded-[1.5rem] bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all duration-500 flex items-center justify-center gap-3 group"
                        >
                            {isProcessing ? <RefreshCw className="animate-spin" /> : <><Sparkles size={18} className="group-hover:rotate-12 transition-transform" /> Initialize Expansion</>}
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="bg-white/80 backdrop-blur-2xl p-12 rounded-[2.5rem] border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-right-8 duration-1000">
                        <label className="block font-black text-xs uppercase tracking-[0.3em] mb-4 text-purple-600">Phase 02 — Intelligence</label>
                        <h2 className="text-4xl font-black mb-6 tracking-tighter leading-none">Refining the<br />Conceptual Core.</h2>
                        <div className="bg-gray-50/50 p-8 rounded-3xl border border-black/5 italic text-gray-500 text-lg leading-relaxed mb-10">
                            "{expandedPrompt}"
                        </div>
                        <button
                            onClick={handleStartInterview}
                            className="w-full py-5 rounded-[1.5rem] bg-purple-600 text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-all duration-500 flex items-center justify-center gap-3"
                        >
                            <MessageSquare size={18} /> Deep-Dive Analysis
                        </button>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white/80 backdrop-blur-2xl p-12 rounded-[2.5rem] border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-right-8 duration-1000">
                        <label className="block font-black text-xs uppercase tracking-[0.3em] mb-4 text-emerald-600">Phase 03 — Nuance</label>
                        <h2 className="text-4xl font-black mb-8 tracking-tighter leading-none">The Technical<br />Specifications.</h2>
                        <div className="space-y-10">
                            {questions.map((q, i) => (
                                <div key={i} className="group">
                                    <p className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-3 group-focus-within:text-emerald-600 transition-colors">{q}</p>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-b-2 border-gray-100 focus:border-emerald-500 focus:outline-none py-3 text-xl transition-colors"
                                        placeholder="Define attribute..."
                                        onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            disabled={isProcessing}
                            onClick={handleGenerate}
                            className="w-full mt-12 py-5 rounded-[1.5rem] bg-emerald-600 text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-all duration-500 flex items-center justify-center gap-3"
                        >
                            {isProcessing ? <RefreshCw className="animate-spin" /> : <><Wand2 size={18} /> Manifest Artwork</>}
                        </button>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white/80 backdrop-blur-2xl p-6 rounded-[3rem] border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-1000">
                        <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl relative group">
                            <img src={resultImage} alt="Final AI Artwork" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                                <button className="bg-white text-black px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">View Details</button>
                            </div>
                        </div>
                        <div className="px-6 pb-6">
                            <h2 className="text-3xl font-black mb-8 tracking-tighter">Your Manifestation is Ready.</h2>
                            <div className="flex gap-4">
                                <button className="flex-2 bg-black text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-colors flex items-center justify-center gap-3">
                                    <ShoppingCart size={18} /> Acquire Print
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-5 rounded-[1.5rem] border-2 border-gray-100 font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-[140vh] bg-gray-50/30">
            <Toaster />
            <div className="max-w-6xl mx-auto px-4 py-32">
                <div className="text-center mb-24">
                    <h1 className="text-7xl font-black mb-6 tracking-tighter leading-none uppercase italic">
                        AI <span className="not-italic text-blue-600">Studio</span>
                    </h1>
                    <p className="text-gray-400 text-xl font-medium max-w-xl mx-auto leading-relaxed">
                        Where algorithmic precision meets human intuition. Construct your unique aesthetic.
                    </p>

                    <div className="flex items-center justify-center gap-6 mt-12">
                        {[1, 2, 3, 4].map((s) => (
                            <React.Fragment key={s}>
                                <div className={`w-3 h-3 rounded-full transition-all duration-700 ${step >= s ? 'bg-black w-12' : 'bg-gray-200'}`} />
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="max-w-2xl mx-auto perspective-1000">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default AIEditor;
