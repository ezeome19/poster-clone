import React, { useState } from 'react';
import api from '../api/api';
import { Wand2, Download, ShoppingCart, Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AIEditor = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState(null);

    const handleGenerate = async () => {
        if (!prompt) return toast.error('Please enter a prompt');

        setIsGenerating(true);
        try {
            const res = await api.post('/ai/generate', { prompt });
            setResultImage(res.data.imageUrl);
            toast.success('Artwork generated successfully!');
        } catch (err) {
            toast.error('Generation failed. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <Toaster />
            <div className="text-center mb-12">
                <h1 className="text-5xl font-black mb-4 flex items-center justify-center gap-3">
                    <Sparkles className="text-purple-600" size={40} />
                    AI Poster Generator
                </h1>
                <p className="text-gray-600 text-xl">Turn your wildest ideas into museum-quality posters in seconds.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="bg-white p-8 rounded-2xl border shadow-xl">
                    <label className="block font-bold text-sm uppercase tracking-wider mb-3">Describe your masterpiece</label>
                    <textarea
                        rows="5"
                        className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-purple-500 focus:outline-none text-lg resize-none"
                        placeholder="e.g. A futuristic cyberpunk city with neon lights and flying cars, synthwave aesthetic, 8k resolution..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />

                    <button
                        disabled={isGenerating}
                        onClick={handleGenerate}
                        className={`w-full mt-6 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg'}`}
                    >
                        {isGenerating ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Painting your masterpiece...
                            </>
                        ) : (
                            <>
                                <Wand2 size={20} />
                                Generate Poster
                            </>
                        )}
                    </button>
                </div>

                <div className="aspect-[3/4] rounded-2xl border-4 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center overflow-hidden relative group">
                    {resultImage ? (
                        <>
                            <img src={resultImage} alt="AI Generated Artwork" className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-white text-black py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                                        <ShoppingCart size={18} /> Buy Print
                                    </button>
                                    <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg backdrop-blur-sm">
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-8">
                            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center shadow-md mb-4 mx-auto">
                                <Sparkles className="text-purple-300" size={40} />
                            </div>
                            <p className="text-gray-400 font-medium">Your artwork will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIEditor;
