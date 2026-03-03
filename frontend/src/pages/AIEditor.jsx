import React, { useState } from 'react';
import api from '../api/api';
import { Wand2, Download, ShoppingCart, Sparkles, MessageSquare, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AIEditor = () => {
    const [step, setStep] = useState(1); // 1: Prompt, 2: Whispr Flow, 3: Interview, 4: Results
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
                    <div className="bg-white p-8 rounded-2xl border shadow-xl animate-in fade-in slide-in-from-bottom-4">
                        <label className="block font-bold text-sm uppercase tracking-wider mb-3 text-purple-600">Step 1: The Vision</label>
                        <h2 className="text-2xl font-bold mb-6">What are we creating today?</h2>
                        <textarea
                            rows="5"
                            className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-purple-500 focus:outline-none text-lg resize-none"
                            placeholder="e.g. A cat in space wearing a neon tuxedo..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button
                            disabled={isProcessing}
                            onClick={handleWhisprFlow}
                            className="w-full mt-6 py-4 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                        >
                            {isProcessing ? <RefreshCw className="animate-spin" /> : <><Sparkles size={20} /> Activate Whispr Flow</>}
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="bg-white p-8 rounded-2xl border shadow-xl animate-in fade-in slide-in-from-right-4">
                        <label className="block font-bold text-sm uppercase tracking-wider mb-3 text-blue-600">Step 2: Whispr Flow Expansion</label>
                        <h2 className="text-2xl font-bold mb-4">We've enhanced your prompt</h2>
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 italic text-gray-700 mb-8">
                            "{expandedPrompt}"
                        </div>
                        <button
                            onClick={handleStartInterview}
                            className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                            <MessageSquare size={20} /> Fine-tune with Interview Agent
                        </button>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white p-8 rounded-2xl border shadow-xl animate-in fade-in slide-in-from-right-4">
                        <label className="block font-bold text-sm uppercase tracking-wider mb-3 text-indigo-600">Step 3: Refinement Interview</label>
                        <h2 className="text-2xl font-bold mb-6">Let's perfect the details</h2>
                        <div className="space-y-6">
                            {questions.map((q, i) => (
                                <div key={i}>
                                    <p className="font-semibold mb-2">{q}</p>
                                    <input
                                        type="text"
                                        className="w-full border-b-2 border-gray-100 focus:border-indigo-500 focus:outline-none py-2"
                                        placeholder="Your answer..."
                                        onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            disabled={isProcessing}
                            onClick={handleGenerate}
                            className="w-full mt-8 py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                        >
                            {isProcessing ? <RefreshCw className="animate-spin" /> : <><Wand2 size={20} /> Generate Masterpiece</>}
                        </button>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-2xl border shadow-xl animate-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-2 text-green-600 font-bold mb-4">
                            <CheckCircle2 size={20} /> Art Generation Complete
                        </div>
                        <h2 className="text-2xl font-bold mb-6">Your customized poster is ready</h2>
                        <div className="aspect-[3/4] rounded-xl overflow-hidden mb-6 border-4 border-gray-50 shadow-2xl">
                            <img src={resultImage} alt="Final AI Artwork" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-4">
                            <button className="flex-1 bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                                <ShoppingCart size={20} /> Order Print
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-4 rounded-xl border-2 border-gray-100 font-bold hover:bg-gray-50 transition"
                            >
                                Start New
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <Toaster />
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black mb-4 tracking-tight">AI Multi-Step Designer</h1>
                <p className="text-gray-500 text-xl max-w-2xl mx-auto">
                    A revolutionary workflow that blends your vision with professional-grade AI precision.
                </p>

                <div className="flex items-center justify-center gap-4 mt-8">
                    {[1, 2, 3, 4].map((s) => (
                        <React.Fragment key={s}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${step >= s ? 'bg-black border-black text-white' : 'border-gray-200 text-gray-300'}`}>
                                {s}
                            </div>
                            {s < 4 && <div className={`w-12 h-1 ${step > s ? 'bg-black' : 'bg-gray-100'}`} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                {renderStep()}
            </div>
        </div>
    );
};

export default AIEditor;
