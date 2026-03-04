import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User, Sparkles, Image } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 mt-4">
                <div className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl h-16 flex items-center justify-between px-6">
                    <Link to="/" className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <span className="bg-black text-white px-2 py-0.5 rounded-lg">P</span>
                        <span>Clone</span>
                    </Link>

                    <div className="hidden md:flex gap-8 items-center font-bold text-sm uppercase tracking-wider">
                        <Link to="/" className="hover:text-blue-600 transition-colors">Collection</Link>
                        <Link to="/ai" className="hover:text-purple-600 transition flex items-center gap-1.5">
                            <Sparkles size={16} /> AI Studio
                        </Link>
                        <Link to="/stock" className="hover:text-blue-600 transition flex items-center gap-1.5">
                            <Image size={16} /> Assets
                        </Link>
                        <Link to="/custom" className="hover:text-blue-600 transition">Custom</Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="hover:text-blue-600 transition-transform hover:scale-110 active:scale-95"><Search size={20} /></button>
                        <button className="hover:text-blue-600 transition-transform hover:scale-110 active:scale-95"><User size={20} /></button>
                        <button className="hover:text-blue-600 relative group transition-transform hover:scale-110 active:scale-95">
                            <ShoppingCart size={20} />
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
