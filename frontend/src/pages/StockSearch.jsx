import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchPexelsImages, searchUnsplash } from '../api/api';
import { Search, Download, Image as ImageIcon, Loader2, ExternalLink } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const StockSearch = () => {
    const [query, setQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const handleDownload = async (imageUrl, source, id) => {
        const toastId = toast.loading(`Preparing ${source} download...`);
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${source}-photo-${id}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Download started!', { id: toastId });
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback: Open in new tab
            window.open(imageUrl, '_blank');
            toast.error('Direct download failed, opening in new tab', { id: toastId });
        }
    };

    const fetchResults = async (searchQuery, pageNum, append = true) => {
        setLoading(true);
        try {
            const [pexelsRes, unsplashRes] = await Promise.all([
                searchPexelsImages(searchQuery, pageNum),
                searchUnsplash(searchQuery, pageNum)
            ]);

            const newBatch = [
                ...pexelsRes.data.results,
                ...unsplashRes.data.results
            ];

            // Shuffle slightly to mix sources better
            const shuffled = newBatch.sort(() => Math.random() - 0.5);

            setResults(prev => append ? [...prev, ...shuffled] : shuffled);

            // If combined results are low, we likely reached the end
            if (newBatch.length < 8) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (err) {
            toast.error('Failed to fetch more media');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInitialSearch = async (e) => {
        if (e) e.preventDefault();
        if (!query) return toast.error('Please enter a search term');

        setResults([]);
        setPage(1);
        setSearchTerm(query);
        await fetchResults(query, 1, false);
    };

    // Load next page when page state changes (from IntersectionObserver)
    useEffect(() => {
        if (page > 1 && searchTerm) {
            fetchResults(searchTerm, page, true);
        }
    }, [page]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <Toaster />
            <div className="text-center mb-12">
                <h1 className="text-5xl font-black mb-4 tracking-tight">Stock Media Hub</h1>
                <p className="text-gray-500 text-lg">High-resolution assets from Pexels and Unsplash.</p>
            </div>

            <form onSubmit={handleInitialSearch} className="max-w-3xl mx-auto mb-16 flex gap-3 p-2 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                    <input
                        type="text"
                        placeholder="Nature, Architecture, Abstract..."
                        className="w-full bg-transparent pl-12 pr-4 py-4 focus:outline-none text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <button
                    disabled={loading}
                    className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-xl shadow-black/10 active:scale-95"
                >
                    {loading && results.length === 0 ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
                </button>
            </form>

            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {results.map((item, index) => (
                    <div
                        key={`${item.id}-${index}`}
                        className="relative group rounded-2xl overflow-hidden break-inside-avoid shadow-sm hover:shadow-2xl transition-all duration-500 bg-gray-100"
                    >
                        <img
                            src={item.preview}
                            alt={`Stock result from ${item.source}`}
                            className="w-full transform group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                        />

                        {/* Source Badge */}
                        <div className="absolute top-3 left-3 flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md ${item.source === 'pexels' ? 'bg-green-600/80' : 'bg-blue-600/80'
                                }`}>
                                {item.source}
                            </span>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                            <p className="text-white/70 text-xs mb-1 font-medium italic">by {item.creator}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDownload(item.url, item.source, item.id)}
                                    className="flex-1 bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors"
                                >
                                    <Download size={16} /> Download
                                </button>
                                <a
                                    href={item.creator_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-12 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Infinite Scroll Sentinel */}
            <div ref={lastElementRef} className="h-20 w-full flex items-center justify-center">
                {loading && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-black" size={40} />
                        <p className="text-gray-400 font-medium animate-pulse">Summoning more media...</p>
                    </div>
                )}
            </div>

            {!hasMore && results.length > 0 && (
                <div className="text-center py-20 border-t border-gray-100 mt-20">
                    <div className="bg-gray-50 inline-block px-8 py-3 rounded-full border border-gray-100">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">All relevant media has been exhausted</p>
                    </div>
                </div>
            )}

            {!loading && results.length === 0 && searchTerm && (
                <div className="text-center py-40 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
                    <ImageIcon size={64} className="mx-auto mb-6 text-gray-200" />
                    <p className="text-2xl font-bold text-gray-400">No results found for "{searchTerm}"</p>
                    <p className="text-gray-300">Try a different or more broad keyword.</p>
                </div>
            )}
        </div>
    );
};

export default StockSearch;
