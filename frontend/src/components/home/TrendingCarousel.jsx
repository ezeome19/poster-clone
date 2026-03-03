import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrendingCarousel = ({ products }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-20 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">Trending Now</h2>
                            <p className="text-gray-500 font-medium">The pieces everyone is talking about.</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="p-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition shadow-sm"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition shadow-sm"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.slice(0, 8).map((product) => (
                        <Link
                            key={product._id}
                            to={`/product/${product._id}`}
                            className="min-w-[300px] group snap-start"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-4 bg-white shadow-md border border-gray-100 transition-all duration-500 group-hover:shadow-2xl group-hover:border-blue-100">
                                <img
                                    src={product.images?.[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                                        Best Seller
                                    </span>
                                </div>
                            </div>
                            <div className="px-1">
                                <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{product.name}</h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-400 text-sm font-medium">{product.subcategory || 'Premium Art'}</p>
                                    <p className="font-black text-lg">₦{product.price?.toLocaleString()}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrendingCarousel;
