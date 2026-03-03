import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/api';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/home/HeroBanner';
import SubjectGrid from '../components/home/SubjectGrid';
import TrendingCarousel from '../components/home/TrendingCarousel';
import PromotionalStrip from '../components/home/PromotionalStrip';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('All');

    useEffect(() => {
        getProducts().then(res => setProducts(res.data));
    }, []);

    const categories = ['All', 'Poster', 'Calendar', 'Frame', 'Custom', 'AI-Generated', 'E-Poster', 'E-Card', 'E-Calendar', 'E-Flyer', 'E-Menu'];
    const filteredProducts = category === 'All' ? products : products.filter(p => p.category === category);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <HeroBanner />

            {/* Promotional Strip */}
            <PromotionalStrip />

            {/* Subject Grid */}
            <SubjectGrid />

            {/* Trending Carousel */}
            <TrendingCarousel products={products} />

            {/* Main Product Feed */}
            <main className="max-w-7xl mx-auto px-4 py-20 border-t border-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Explore Collection</h2>
                        <p className="text-gray-500 font-medium">Find the perfect piece of art for your space.</p>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-6 py-2 rounded-full border-2 text-sm font-bold whitespace-nowrap transition-all ${category === cat ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <Link key={product._id} to={`/product/${product._id}`} className="group relative">
                            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50 mb-4 border border-gray-100 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500">
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                        <div className="w-1.5 h-1.5 bg-black rounded-full mx-0.5"></div>
                                        <div className="w-1.5 h-1.5 bg-black rounded-full mx-0.5"></div>
                                        <div className="w-1.5 h-1.5 bg-black rounded-full mx-0.5"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                            <div className="flex items-center justify-between">
                                <p className="text-gray-400 text-sm">{product.category}</p>
                                <p className="font-black">₦{product.price?.toLocaleString()}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            {/* Footer Tagline Section */}
            <section className="bg-gray-50 py-24 border-t border-gray-100 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-4xl font-black mb-6 tracking-tight">Beyond Just Posters.</h2>
                    <p className="text-gray-500 text-xl leading-relaxed mb-10">
                        We believe that art should be accessible to everyone. Our mission is to help you create a space that inspires you every single day.
                    </p>
                    <Link to="/ai" className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-xl">
                        Start Designing Your Own
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
