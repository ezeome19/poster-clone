import React, { useState } from 'react';
import { Check } from 'lucide-react';

const FrameSelector = ({ onSelect }) => {
    const frames = [
        { name: 'None', material: 'Paper', color: 'White', price: 0 },
        { name: 'Essential Black', material: 'MDF', color: 'Black', price: 5000 },
        { name: 'Gramercy Wood', material: 'Wood', color: 'Natural', price: 8000 },
        { name: 'Chelsea Gold', material: 'Wood', color: 'Gold', price: 12000 }
    ];

    const [selected, setSelected] = useState('None');

    const handleSelect = (frame) => {
        setSelected(frame.name);
        onSelect(frame);
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {frames.map((frame) => (
                <button
                    key={frame.name}
                    onClick={() => handleSelect(frame)}
                    className={`p-4 rounded-2xl border-2 text-left relative transition ${selected === frame.name ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                    <p className="font-bold text-lg">{frame.name}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-tighter">{frame.material} • {frame.color}</p>
                    <p className="mt-2 font-black">+{frame.price === 0 ? 'FREE' : `₦${frame.price.toLocaleString()}`}</p>
                    {selected === frame.name && <Check className="absolute top-4 right-4" size={20} />}
                </button>
            ))}
        </div>
    );
};

export default FrameSelector;
