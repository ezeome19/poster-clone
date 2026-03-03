import React, { useState } from 'react';
import api from '../api/api';
import { Search, Download, Image as ImageIcon, Film, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const StockSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ pexels: [], unsplash: [] });
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('images'); // 'images' or 'videos'

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!query) return toast.error('Please enter a search term');

        setLoading(true);
        try {
            const [pexelsRes, unsplashRes] = await Promise.all([
                api.get(`/stock/pexels/${type}`, { params: { query } }),
                type === 'images' ? api.get('/stock/unsplash', { params: { query } }) : Promise.resolve({ data: { results: [] } })
            ]);

            setResults({
                pexels: pexelsRes.data.photos || pexelsRes.data.videos || [],
                unsplash: unsplashRes.data.results || []
            });
        } catch (err) {
            toast.error('Failed to fetch stock media');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <Toaster />
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black mb-4">Stock Media Hub</h1>
                <p className="text-gray-600">Download premium stock images and videos for your projects.</p>
            </div>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for anything..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-black focus:outline-none text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <button
                    disabled={loading}
                    className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition flex items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
                </button>
            </form>

            <div className="flex justify-center gap-4 mb-12">
                <button
                    onClick={() => setType('images')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full border ${type === 'images' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                >
                    <ImageIcon size={18} /> Images
                </button>
                <button
                    onClick={() => setType('videos')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full border ${type === 'videos' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                >
                    <Film size={18} /> Videos
                </button>
            </div>

            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {/* Pexels Results */}
                {results.pexels.map((item) => (
                    <div key={item.id} className="relative group rounded-xl overflow-hidden break-inside-avoid shadow-lg">
                        {type === 'images' ? (
                            <img src={item.src.large} alt={item.alt} className="w-full" />
                        ) : (
                            <video src={item.video_files[0].link} className="w-full" muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <a
                                href={type === 'images' ? item.src.original : item.video_files[0].link}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-white text-black py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-sm"
                            >
                                <Download size={16} /> Download
                            </a>
                        </div>
                    </div>
                ))}

                {/* Unsplash Results */}
                {type === 'images' && results.unsplash.map((item) => (
                    <div key={item.id} className="relative group rounded-xl overflow-hidden break-inside-avoid shadow-lg">
                        <img src={item.urls.regular} alt={item.alt_description} className="w-full" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <a
                                href={item.urls.full}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-white text-black py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-sm"
                            >
                                <Download size={16} /> Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && results.pexels.length === 0 && results.unsplash.length === 0 && query && (
                <div className="text-center py-24 text-gray-400">
                    <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
                    <p className="text-xl">No results found for "{query}"</p>
                </div>
            )}
        </div>
    );
};

export default StockSearch;
