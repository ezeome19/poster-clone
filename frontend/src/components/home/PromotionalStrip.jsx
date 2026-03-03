import React from 'react';
import { Truck, ShieldCheck, Clock, CreditCard } from 'lucide-react';

const PromotionalStrip = () => {
    const features = [
        { icon: <Truck size={24} />, title: 'Premium Shipping', desc: 'Secure worldwide delivery' },
        { icon: <ShieldCheck size={24} />, title: 'Quality Guaranteed', desc: 'Museum-grade materials' },
        { icon: <Clock size={24} />, title: 'Fast Turnaround', desc: 'Ships within 48 hours' },
        { icon: <CreditCard size={24} />, title: 'Secure Payment', desc: 'All major cards accepted' },
    ];

    return (
        <section className="bg-black py-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 text-white group cursor-default">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-500">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-widest">{item.title}</h4>
                                <p className="text-gray-500 text-xs">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PromotionalStrip;
