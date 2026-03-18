import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link2, ExternalLink, ImageOff, Loader2, Wand2, ShieldAlert, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { validateExternalUrl } from '../api/api';
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
        url: 'https://www.cosmos.so/explore?q=',
        placeholder: 'nature',
        color: 'bg-indigo-600',
        logo: '🌌'
    }
];

const ExternalImport = () => {
    const [searchParams] = useSearchParams();
    const [url, setUrl] = useState('');
    const [validatedUrl, setValidatedUrl] = useState(null);
    const [imageSource, setImageSource] = useState('');
    const [validating, setValidating] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Pre-fill from browser extension query param
    useEffect(() => {
        const urlParam = searchParams.get('url');
        if (urlParam) {
            setUrl(urlParam);
            handleValidate(urlParam);
        }
    }, []);

    const handleValidate = async (inputUrl = url) => {
        if (!inputUrl.trim()) return toast.error('Please paste an image URL');
        setValidating(true);
        setValidatedUrl(null);
        setImgLoaded(false);
        setImgError(false);

        try {
            const res = await validateExternalUrl(inputUrl.trim());
            if (res.data.valid) {
                setValidatedUrl(inputUrl.trim());
                setImageSource(res.data.source || 'external');
            } else {
                toast.error('This URL does not appear to be a valid image.');
            }
        } catch (err) {
            const errMsg = err.response?.data?.error || 'Could not validate URL';
            toast.error(errMsg);
        } finally {
            setValidating(false);
        }
    };

    const openSource = (source) => {
        const query = encodeURIComponent(searchQuery || source.placeholder);
        window.open(`${source.url}${query}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="min-h-screen bg-gray-50/40">
            <Toaster />
            {showModal && validatedUrl && (
                <ProductTypeModal
                    imageUrl={validatedUrl}
                    imageSource={imageSource}
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
                        Browse Pinterest or Cosmos.so, copy an image URL, and turn it into a beautiful printed product — no download needed.
                    </p>
                </div>

                {/* How it works */}
                <div className="grid grid-cols-3 gap-4 mb-12 text-center">
                    {[
                        { step: '01', label: 'Browse a site', icon: '🌐' },
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
                    <h2 className="font-black text-sm uppercase tracking-widest mb-5 text-gray-400">Quick Open</h2>
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
                    <p className="text-center text-xs text-gray-300 mt-4 font-medium">
                        After opening the site, right-click an image → "Copy image address" then paste below
                    </p>
                </div>

                {/* URL Input */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-6">
                    <h2 className="font-black text-sm uppercase tracking-widest mb-5 text-gray-400">Paste Image URL</h2>
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                                type="url"
                                placeholder="https://i.pinimg.com/originals/..."
                                className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500/30 focus:outline-none text-sm transition-all bg-gray-50 focus:bg-white"
                                value={url}
                                onChange={e => { setUrl(e.target.value); setValidatedUrl(null); setImgLoaded(false); setImgError(false); }}
                                onKeyDown={e => e.key === 'Enter' && handleValidate()}
                            />
                        </div>
                        <button
                            onClick={() => handleValidate()}
                            disabled={validating}
                            className="px-6 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {validating ? <Loader2 className="animate-spin" size={18} /> : 'Preview'}
                        </button>
                    </div>

                    {/* Image Preview */}
                    {validatedUrl && (
                        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="relative rounded-2xl overflow-hidden bg-gray-100 max-h-80 flex items-center justify-center">
                                {!imgLoaded && !imgError && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-gray-300" size={32} />
                                    </div>
                                )}
                                {imgError ? (
                                    <div className="py-16 flex flex-col items-center gap-3 text-gray-300">
                                        <ImageOff size={40} />
                                        <p className="text-sm font-medium">Could not display image preview</p>
                                        <p className="text-xs">The URL may block direct display (cross-origin). You can still proceed.</p>
                                    </div>
                                ) : (
                                    <img
                                        src={validatedUrl}
                                        alt="Preview"
                                        className={`w-full max-h-80 object-contain transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                                        onLoad={() => setImgLoaded(true)}
                                        onError={() => { setImgError(true); setImgLoaded(true); }}
                                    />
                                )}
                                {/* Clear button */}
                                <button
                                    onClick={() => { setUrl(''); setValidatedUrl(null); setImgLoaded(false); setImgError(false); }}
                                    className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black transition"
                                >
                                    <X size={14} />
                                </button>
                                {imageSource && (
                                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                        {imageSource}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full mt-5 bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-black/10 active:scale-95"
                            >
                                <Wand2 size={18} /> Make Something With This
                            </button>
                        </div>
                    )}
                </div>

                {/* Copyright disclaimer */}
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-5">
                    <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-amber-800 text-xs leading-relaxed">
                        <span className="font-bold">Copyright Notice.</span> Ensure you have the right to use any image you import. Products must be for personal, non-commercial use only. Do not resell printed products using third-party images. You are solely responsible for copyright compliance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExternalImport;
