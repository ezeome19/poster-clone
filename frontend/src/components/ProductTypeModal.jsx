import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ImageOff, ShieldAlert, ArrowRight } from 'lucide-react';

const PRODUCT_TYPES = [
    { id: 'Poster', label: 'Poster', description: 'A3 / A4 high-quality print', price: 3500, emoji: '🖼️' },
    { id: 'Canvas', label: 'Canvas Print', description: 'Stretched canvas, ready to hang', price: 6000, emoji: '🎨' },
    { id: 'Calendar', label: 'Calendar', description: '12-month personalised calendar', price: 4500, emoji: '📅' },
    { id: 'Card', label: 'Greeting Card', description: 'Glossy fold-out card', price: 1500, emoji: '💌' },
    { id: 'Mug', label: 'Mug', description: '11oz ceramic full-wrap print', price: 2500, emoji: '☕' },
];

const ProductTypeModal = ({ imageUrl, imageSource, onClose }) => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    const handleContinue = () => {
        if (!selected) return;
        const product = PRODUCT_TYPES.find(p => p.id === selected);
        navigate('/checkout', {
            state: {
                externalImageUrl: imageUrl,
                imageSource: imageSource || 'external',
                productType: selected,
                price: product.price,
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-500 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-8 pb-0">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-1">Step 1 of 2</p>
                        <h2 className="text-2xl font-black tracking-tighter">What would you like to make?</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Image preview strip */}
                {imageUrl && (
                    <div className="mx-8 mt-6 h-32 rounded-2xl overflow-hidden bg-gray-100 relative">
                        <img
                            src={imageUrl}
                            alt="Selected media"
                            className="w-full h-full object-cover"
                            onError={e => { e.target.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent flex items-end p-4">
                            <span className="text-white text-xs font-bold uppercase tracking-widest opacity-80">
                                {imageSource || 'External Image'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Copyright notice */}
                <div className="mx-8 mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-amber-800 text-xs leading-relaxed">
                        <span className="font-bold">Personal use only.</span> Products created with external images are for personal, non-commercial use. Do not resell printed products.
                    </p>
                </div>

                {/* Product type list — scrollable */}
                <div className="px-8 pt-5">
                    <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 gap-3">
                        {PRODUCT_TYPES.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setSelected(type.id)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left
                                    ${selected === type.id
                                        ? 'border-black bg-gray-50 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)]'
                                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                                    }`}
                            >
                                <span className="text-2xl w-10 text-center">{type.emoji}</span>
                                <div className="flex-1">
                                    <p className="font-black text-sm">{type.label}</p>
                                    <p className="text-gray-400 text-xs">{type.description}</p>
                                </div>
                                <p className="font-black text-sm">₦{type.price.toLocaleString()}</p>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                    selected === type.id ? 'border-black bg-black' : 'border-gray-200'
                                }`}>
                                    {selected === type.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="p-8">
                    <button
                        disabled={!selected}
                        onClick={handleContinue}
                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-300
                            ${selected
                                ? 'bg-black text-white hover:bg-blue-600 shadow-xl shadow-black/10'
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            }`}
                    >
                        Continue to Checkout <ArrowRight size={16} />
                    </button>
                    
                    <style>{`
                        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                        .custom-scrollbar::-webkit-scrollbar-track { background: translucent; }
                        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
                    `}</style>
                </div>
            </div>
        </div>
    );
};

export default ProductTypeModal;
