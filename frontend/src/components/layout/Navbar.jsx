import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User, Sparkles, Image } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="border-b sticky top-0 bg-white z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-2xl font-black uppercase tracking-tighter">
                    Poster<span className="text-blue-600">Clone</span>
                </Link>

                <div className="hidden md:flex gap-8 items-center font-medium">
                    <Link to="/" className="hover:text-blue-600">Shop All</Link>
                    <Link to="/ai" className="hover:text-purple-600 transition flex items-center gap-1">
                        <Sparkles size={18} /> AI Designer
                    </Link>
                    <Link to="/stock" className="hover:text-blue-600 transition flex items-center gap-1">
                        <Image size={18} /> Stock Media
                    </Link>
                    <Link to="/custom" className="hover:text-blue-600 transition">Custom Prints</Link>
                </div>

                <div className="flex items-center gap-5">
                    <button className="hover:text-blue-600"><Search size={22} /></button>
                    <button className="hover:text-blue-600"><User size={22} /></button>
                    <button className="hover:text-blue-600 relative">
                        <ShoppingCart size={22} />
                        <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
