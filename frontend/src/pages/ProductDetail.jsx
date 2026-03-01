import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../api/api';
import { ChevronRight, Check } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('Standard');
    const [selectedFrame, setSelectedFrame] = useState('None');

    useEffect(() => {
        getProduct(id).then(res => setProduct(res.data));
    }, [id]);

    if (!product) return <div className="p-8 text-center">Loading...</div>;

    const sizes = ['Small', 'Standard', 'Large'];
    const frames = [
        { name: 'None', material: 'Paper', color: 'White' },
        { name: 'Essential Black', material: 'MDF', color: 'Black' },
        { name: 'Gramercy Wood', material: 'Wood', color: 'Natural' },
        { name: 'Chelsea Gold', material: 'Wood', color: 'Gold' }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-xl border sticky top-24">
                <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                    <p className="text-gray-600 text-lg mb-4">{product.description}</p>
                    <p className="text-3xl font-black">₦{product.price?.toLocaleString()}</p>
                </div>

                <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2">1. Select Size</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {sizes.map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`py-3 rounded border font-medium ${selectedSize === size ? 'bg-black text-white border-black' : 'hover:border-black'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2">2. Framing Options</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {frames.map(frame => (
                            <button
                                key={frame.name}
                                onClick={() => setSelectedFrame(frame.name)}
                                className={`p-4 rounded border text-left relative transition ${selectedFrame === frame.name ? 'border-black ring-1 ring-black shadow-inner' : 'hover:border-gray-400'}`}
                            >
                                <p className="font-bold">{frame.name}</p>
                                <p className="text-xs text-gray-500 uppercase">{frame.material} • {frame.color}</p>
                                {selectedFrame === frame.name && <Check className="absolute top-2 right-2 text-black" size={16} />}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    className="bg-black text-white py-5 rounded-full text-lg font-bold hover:bg-gray-900 transition mt-4"
                    onClick={() => alert('Implementation of Cart coming next phase!')}
                >
                    Add to Cart — ₦{product.price?.toLocaleString()}
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
