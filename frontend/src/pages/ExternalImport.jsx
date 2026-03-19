import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link2, ExternalLink, ImageOff, Loader2, Wand2, ShieldAlert, X, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import ProductTypeModal from '../components/ProductTypeModal';

const SOURCE_SHORTCUTS = [
    {
        name: 'Pinterest',
        url: 'https://www.pinterest.com/search/pins/?q=',
        placeholder: 'naruto',
        color: 'bg-red-600',
        logo: '📌'
    },
    {
        name: 'Cosmos',
        url: 'https://www.cosmos.so/search/elements/',
        placeholder: 'nature',
        color: 'bg-indigo-600',
        logo: '🌌'
    }
];

const ExternalImport = () => {
    const [searchParams] = useSearchParams();
    const [url, setUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);   // shown immediately on paste
    const [imgStatus, setImgStatus] = useState('idle');   // 'idle' | 'loading' | 'ok' | 'error'
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const debounceRef = useRef(null);

    // Pre-fill from browser extension ?url= query param
    useEffect(() => {
        const urlParam = searchParams.get('url');
        if (urlParam) {
            setUrl(urlParam);
            loadPreview(urlParam);
        }
    }, []);

    // Auto-preview when URL is pasted / typed (debounced 600ms)
    const handleUrlChange = (value) => {
        setUrl(value);
        clearTimeout(debounceRef.current);
        if (!value.trim()) {
            setPreviewUrl(null);
            setImgStatus('idle');
            return;
        }
        debounceRef.current = setTimeout(() => loadPreview(value.trim()), 600);
    };

    const loadPreview = (rawUrl) => {
        try {
            // Basic sanity check — must look like an http URL
            const parsed = new URL(rawUrl);
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                toast.error('Only HTTP/HTTPS URLs are supported');
                return;
            }
            setPreviewUrl(rawUrl);
            setImgStatus('loading');
        } catch {
            toast.error('That doesn\'t look like a valid URL');
        }
    };

    const openSource = (source) => {
        const term = searchQuery.trim() || source.placeholder;
        const query = encodeURIComponent(term);
        window.open(`${source.url}${query}`, '_blank', 'noopener,noreferrer');
    };

    const handleClear = () => {
        setUrl('');
        setPreviewUrl(null);
        setImgStatus('idle');
    };

    const imageReady = imgStatus === 'ok';

    return (
        <div className="min-h-screen bg-gray-50/40">
            <Toaster />
            {showModal && previewUrl && imageReady && (
                <ProductTypeModal
                    imageUrl={previewUrl}
                    imageSource={new URL(previewUrl).hostname}
                    onClose={() => setShowModal(false)}
                />
            )}

            <div className="max-w-3xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4">External Media Import</p>
                    <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">
                        Import from <span className="text-blue-600">Anywhere</span>
                    </h1>
                    <p className="text-gray-400 text-lg font-medium max-w-lg mx-auto">
                        Browse Pinterest or Cosmos.so, grab an image URL, and turn it into a beautiful printed product — no download needed.
                    </p>
                </div>

                {/* How it works */}
                <div className="grid grid-cols-3 gap-4 mb-12 text-center">
                    {[
                        { step: '01', label: 'Browse a site below', icon: '🌐' },
                        { step: '02', label: 'Paste the image URL', icon: '🔗' },
                        { step: '03', label: 'Pick your product & order', icon: '📦' },
                    ].map(s => (
                        <div key={s.step} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <div className="text-2xl mb-2">{s.icon}</div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mb-1">{s.step}</p>
                            <p className="text-sm font-bold text-gray-700">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick open panel */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8">
                    <h2 className="font-black text-sm uppercase tracking-widest mb-2 text-gray-400">Quick Open</h2>
                    <p className="text-xs text-gray-400 mb-5 leading-relaxed">
                        Type what you're looking for, open the site, find an image, then
                        <strong className="text-gray-700"> right-click → "Copy image address"</strong> and paste it below.
                        <br />
                        <span className="text-amber-500 font-bold">Pinterest tip:</span> Click on a pin to open the full image first, then right-click.
                    </p>
                    <div className="flex gap-3 mb-4">
                        <input
                            type="text"
                            placeholder="What are you looking for? (e.g. naruto, sunset...)"
                            className="flex-1 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300 transition bg-gray-50"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {SOURCE_SHORTCUTS.map(source => (
                            <button
                                key={source.name}
                                onClick={() => openSource(source)}
                                className={`${source.color} text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-lg active:scale-95`}
                            >
                                <span className="text-xl">{source.logo}</span>
                                Open {source.name}
                                <ExternalLink size={14} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* URL Input */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-6">
                    <h2 className="font-black text-sm uppercase tracking-widest mb-2 text-gray-400">Paste Image URL</h2>
                    <p className="text-xs text-gray-400 mb-5">
                        Paste the <strong className="text-gray-600">direct image URL</strong> (starts with https://i.pinimg.com or https://images.cosmos.so). The preview will appear automatically.
                    </p>

                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                                type="url"
                                placeholder="Paste image URL here — preview loads automatically"
                                className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500/30 focus:outline-none text-sm transition-all bg-gray-50 focus:bg-white"
                                value={url}
                                onChange={e => handleUrlChange(e.target.value)}
                            />
                        </div>
                        {url && (
                            <button
                                onClick={handleClear}
                                className="px-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs hover:bg-gray-200 transition"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Image Preview — optimistic, no backend needed */}
                    {previewUrl && (
                        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="relative rounded-2xl overflow-hidden bg-gray-100 min-h-40 flex items-center justify-center">
                                {imgStatus === 'loading' && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <Loader2 className="animate-spin text-gray-300" size={32} />
                                    </div>
                                )}

                                {imgStatus === 'error' ? (
                                    <div className="py-14 flex flex-col items-center gap-3 text-gray-300 px-8 text-center">
                                        <ImageOff size={40} />
                                        <div>
                                            <p className="text-sm font-bold text-gray-500 mb-1">Can't display this image</p>
                                            <p className="text-xs leading-relaxed">
                                                This URL may not be a direct image link. Make sure to <strong>right-click the image itself</strong> on Pinterest/Cosmos and choose <strong>"Copy image address"</strong> — not the page URL from the browser address bar.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className={`w-full max-h-96 object-contain transition-opacity duration-500 ${imgStatus === 'ok' ? 'opacity-100' : 'opacity-0'}`}
                                        onLoad={() => setImgStatus('ok')}
                                        onError={() => setImgStatus('error')}
                                    />
                                )}

                                {imgStatus === 'ok' && (
                                    <div className="absolute top-3 right-3">
                                        <button onClick={handleClear} className="w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black transition">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}

                                {imgStatus === 'ok' && (
                                    <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                        <CheckCircle size={11} /> Image Ready
                                    </div>
                                )}
                            </div>

                            {imageReady && (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-full mt-5 bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-black/10 active:scale-95"
                                >
                                    <Wand2 size={18} /> Make Something With This
                                </button>
                            )}

                            {imgStatus === 'error' && (
                                <p className="text-center text-xs text-amber-600 font-bold mt-4">
                                    💡 Try installing the browser extension — it captures the correct image URL automatically without copy-pasting.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Copyright disclaimer */}
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-5">
                    <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-amber-800 text-xs leading-relaxed">
                        <span className="font-bold">Copyright Notice.</span> Ensure you have the right to use any image you import. Products must be for personal, non-commercial use only. You are solely responsible for copyright compliance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExternalImport;
