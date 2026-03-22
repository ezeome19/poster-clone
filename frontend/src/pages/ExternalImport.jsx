import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link2, ExternalLink, ImageOff, Loader2, Wand2, ShieldAlert, X, CheckCircle, Crop } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import ProductTypeModal from '../components/ProductTypeModal';
import ImageCropModal from '../components/ImageCropModal';
import { validateExternalUrl, getProxyUrl } from '../api/api';

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
    const [originalUrl, setOriginalUrl] = useState(null); // original external url
    const [previewUrl, setPreviewUrl] = useState(null);   // proxied url for display
    const [croppedUrl, setCroppedUrl] = useState(null);   // blob url from cropper
    const [imgStatus, setImgStatus] = useState('idle');   // 'idle' | 'loading' | 'ok' | 'error'
    const [showCropModal, setShowCropModal] = useState(false);
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const debounceRef = useRef(null);

    // Pre-fill from browser extension ?url= query param
    useEffect(() => {
        const urlParam = searchParams.get('url');
        if (urlParam) {
            setUrl(urlParam);
            loadPreview(urlParam);
        }
    }, [searchParams]);

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

    const loadPreview = async (rawUrl) => {
        try {
            // Basic sanity check — must look like an http URL
            const parsed = new URL(rawUrl);
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                toast.error('Only HTTP/HTTPS URLs are supported');
                return;
            }

            setImgStatus('loading');
            
            // Validate via backend to ensure it's a direct image
            const { data } = await validateExternalUrl(rawUrl);
            
            if (data.valid) {
                setOriginalUrl(rawUrl);
                // Use proxy URL for the preview to avoid CORS issues
                const proxyUrl = getProxyUrl(rawUrl);
                console.log('Setting Preview URL:', proxyUrl);
                setPreviewUrl(proxyUrl);
                setCroppedUrl(null); // Reset crop on new url
                // Note: setImgStatus('ok') will be called by img.onLoad
            }
        } catch (err) {
            setImgStatus('error');
            // Log the full error to help debugging
            console.error('Validation Error Details:', {
                message: err.message,
                code: err.code,
                response: err.response?.data,
                status: err.response?.status,
                config: err.config // helpful for checking the URL used
            });
            
            // Priority: Backend error message -> Network error description -> Generic fallback
            const errorMsg = err.response?.data?.error || 
                             (typeof err.response?.data === 'string' ? err.response.data : null) ||
                             (err.code === 'ERR_NETWORK' ? 'Network error: Backend might be offline or blocked by CORS.' : null) ||
                             'That doesn\'t look like a valid direct image URL';
                             
            toast.error(errorMsg);
        }
    };

    const openSource = (source) => {
        const term = searchQuery.trim() || source.placeholder;
        const query = encodeURIComponent(term);
        window.open(`${source.url}${query}`, '_blank', 'noopener,noreferrer');
    };

    const handleClear = () => {
        setUrl('');
        setOriginalUrl(null);
        setPreviewUrl(null);
        setCroppedUrl(null);
        setImgStatus('idle');
    };

    const handleCropComplete = (newUrl) => {
        setCroppedUrl(newUrl);
        setShowCropModal(false);
        setShowTypeModal(true); // Move directly to product selection after crop
    };

    const imageReady = imgStatus === 'ok';

    return (
        <div className="min-h-screen bg-gray-50/40">
            <Toaster />
            
            {/* Phase 1: Crop */}
            {showCropModal && previewUrl && (
                <ImageCropModal
                    imageUrl={previewUrl}
                    onCropComplete={handleCropComplete}
                    onClose={() => setShowCropModal(false)}
                />
            )}

            {/* Phase 2: Select Product Type */}
            {showTypeModal && (croppedUrl || previewUrl) && (
                <ProductTypeModal
                    imageUrl={croppedUrl || originalUrl}
                    displayUrl={croppedUrl || previewUrl}
                    imageSource={originalUrl ? new URL(originalUrl).hostname : 'External'}
                    onClose={() => setShowTypeModal(false)}
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

                {/* Quick open panel — same as before */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8">
                    <h2 className="font-black text-sm uppercase tracking-widest mb-2 text-gray-400">Quick Open</h2>
                    <p className="text-xs text-gray-400 mb-5 leading-relaxed">
                        Type what you're looking for, open the site, find an image, then
                        <strong className="text-gray-700"> right-click → "Copy image address"</strong> and paste it below.
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
                            <button onClick={handleClear} className="px-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs hover:bg-gray-200 transition">Clear</button>
                        )}
                    </div>

                    {previewUrl && (
                        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="relative rounded-2xl overflow-hidden bg-gray-100 min-h-40 flex items-center justify-center">
                                {imgStatus === 'loading' ? (
                                    <Loader2 className="animate-spin text-gray-300" size={32} />
                                ) : imgStatus === 'error' ? (
                                    <div className="py-14 flex flex-col items-center gap-3 text-gray-300 px-8 text-center text-xs">
                                        <ImageOff size={40} />
                                        <p className="font-bold text-gray-500">Can't display this image. Try "Copy image address" from the original source.</p>
                                    </div>
                                ) : (
                                    <img
                                        src={croppedUrl || previewUrl}
                                        alt="Preview"
                                        className="w-full max-h-96 object-contain"
                                        onLoad={() => setImgStatus('ok')}
                                        onError={() => setImgStatus('error')}
                                    />
                                )}

                                {imageReady && (
                                    <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                        <CheckCircle size={11} /> Image Ready {croppedUrl && "(Cropped)"}
                                    </div>
                                )}
                            </div>

                            {imageReady && (
                                <div className="flex gap-3 mt-5">
                                    <button
                                        onClick={() => setShowCropModal(true)}
                                        className="flex-1 border-2 border-black py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <Crop size={16} /> Edit / Crop
                                    </button>
                                    <button
                                        onClick={() => setShowTypeModal(true)}
                                        className="flex-[2] bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <Wand2 size={18} /> Make Something
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Copyright Disclaimer */}
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-5">
                    <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-amber-800 text-xs leading-relaxed">
                        <span className="font-bold">Copyright Notice.</span> Ensure you have the right to use any image you import. Products are for personal, non-commercial use only.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExternalImport;
