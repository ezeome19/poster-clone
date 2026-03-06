import React from 'react';
import { ChevronRight } from 'lucide-react';

const subjects = [
    { name: 'Abstract', count: '1,240', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=400' },
    { name: 'Photography', count: '3,150', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=400' },
    { name: 'Vintage', count: '890', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=400' },
    { name: 'Anime', count: '2,100', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=400' },
    { name: 'Music', count: '1,560', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=400' },
    { name: 'Nature', count: '4,200', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400' },
];

const SubjectGrid = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 py-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-center md:text-left">
                <div>
                    <h2 className="text-4xl font-black mb-4 tracking-tight">Shop by Subject</h2>
                    <p className="text-gray-500 text-lg">Curated collections for every artistic taste and interior style.</p>
                </div>
                <button
                    onClick={() => document.getElementById('curated-collection')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all mx-auto md:mx-0 active:scale-95"
                >
                    View All Categories <ChevronRight size={20} />
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                {subjects.map((subject) => (
                    <div key={subject.name} className="group cursor-pointer">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4 bg-gray-100 shadow-sm border border-gray-100 transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                            <img
                                src={subject.image}
                                alt={subject.name}
                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <span className="text-white text-xs font-bold uppercase tracking-widest">{subject.count} Pieces</span>
                            </div>
                        </div>
                        <h3 className="font-bold text-lg text-center">{subject.name}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SubjectGrid;
