import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/api';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, PuzzleIcon } from 'lucide-react';
import HeroBanner from '../components/home/HeroBanner';
import SubjectGrid from '../components/home/SubjectGrid';
import TrendingCarousel from '../components/home/TrendingCarousel';
import PromotionalStrip from '../components/home/PromotionalStrip';

import Masonry from 'react-masonry-css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('All');

    useEffect(() => {
        getProducts().then(res => setProducts(res.data));
    }, []);

    const categories = ['All', 'Poster', 'Calendar', 'Frame', 'Custom', 'AI-Generated', 'Art', 'Canvas', 'Accessory', 'E-Poster', 'E-Card', 'E-Calendar', 'E-Flyer', 'E-Menu'];
    const filteredProducts = category === 'All' ? products : products.filter(p => p.category === category);

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div className="bg-white">
            <HeroBanner />
            <PromotionalStrip />
            <SubjectGrid />
            <TrendingCarousel products={products} />

            {/* Import from Web Section */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-4">New Feature</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-4">
                            Import from <span className="text-blue-400">Pinterest</span> or <span className="text-indigo-400">Cosmos</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Found the perfect image online? Paste its URL and we'll turn it into a poster, canvas, calendar, and more — no download needed.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/external"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-blue-500 transition-all duration-300 shadow-xl shadow-blue-900/40"
                            >
                                Try It Now <ArrowRight size={14} />
                            </Link>
                            <a
                                href="#extension"
                                className="inline-flex items-center gap-3 px-8 py-4 border border-white/10 text-white/70 font-black uppercase tracking-widest text-xs rounded-full hover:border-white/30 hover:text-white transition-all duration-300"
                            >
                                Get Browser Extension
                            </a>
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0">
                        {[
                            { name: 'Pinterest', logo: '📌', color: 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20', text: 'text-red-400' },
                            { name: 'Cosmos.so', logo: '🌌', color: 'bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20', text: 'text-indigo-400' },
                        ].map(s => (
                            <div key={s.name} className={`w-32 h-32 rounded-3xl border ${s.color} flex flex-col items-center justify-center gap-2 transition-colors cursor-default`}>
                                <span className="text-4xl">{s.logo}</span>
                                <span className={`text-xs font-black ${s.text}`}>{s.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <main id="curated-collection" className="max-w-7xl mx-auto px-4 py-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-xl">
                        <h2 className="text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                            The <span className="text-blue-600">Curated</span><br />Collection
                        </h2>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed">
                            Discover a world of artistic expression, meticulously gathered for the modern space.
                        </p>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${category === cat ? 'bg-black text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-black'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex -ml-8 w-auto"
                    columnClassName="pl-8 bg-clip-padding"
                >
                    {filteredProducts.map((product, index) => (
                        <Link
                            key={product._id}
                            to={`/product/${product._id}`}
                            className="group mb-12 block animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`overflow-hidden rounded-3xl bg-gray-50 mb-6 transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] group-hover:-translate-y-2 ${index % 3 === 0 ? 'aspect-[3/4]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[4/5]'}`}>
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                            <div className="px-2">
                                <h3 className="font-black text-xl mb-1 uppercase tracking-tight group-hover:text-blue-600 transition-colors duration-300">{product.name}</h3>
                                <div className="flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                                    <p className="text-xs font-bold uppercase tracking-widest">{product.category}</p>
                                    <p className="font-black text-lg">₦{product.price?.toLocaleString()}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </Masonry>
            </main>

            {/* Footer Tagline Section */}
            <section className="bg-gray-50/50 py-40 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-gray-200" />
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-7xl font-black mb-10 tracking-tighter leading-[0.8] uppercase">
                        Beyond <span className="text-blue-600">Posters</span>.<br />
                        Beyond <span className="italic font-serif not-uppercase text-gray-300">Limits</span>.
                    </h2>
                    <p className="text-gray-400 text-xl leading-relaxed mb-16 max-w-2xl mx-auto font-medium">
                        Art is the signature of civilization. We provide the canvas; you provide the soul.
                    </p>
                    <Link to="/ai" className="inline-flex items-center gap-4 px-12 py-5 bg-black text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-blue-600 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95">
                        Start Your Manifestation <ArrowRight size={16} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
