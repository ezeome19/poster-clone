import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/api';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('All');

    useEffect(() => {
        getProducts().then(res => setProducts(res.data));
    }, []);

    const categories = ['All', 'Poster', 'Calendar', 'Frame', 'Custom', 'AI-Generated'];
    const filteredProducts = category === 'All' ? products : products.filter(p => p.category === category);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Premium Posters & Art</h1>

            <div className="flex gap-4 mb-8 overflow-x-auto pb-2 justify-center">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-full border ${category === cat ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <Link key={product._id} to={`/product/${product._id}`} className="group">
                        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-4 border shadow-sm group-hover:shadow-md transition">
                            <img src={product.images?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        </div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-gray-600">₦{product.price?.toLocaleString()}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
