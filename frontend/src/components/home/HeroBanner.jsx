import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
    const scrollToCollection = () => {
        const element = document.getElementById('curated-collection');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative h-[600px] flex items-center overflow-hidden bg-slate-900 rounded-3xl mx-4 my-8">
            {/* Background Gradient & Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 z-0"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                        <Sparkles size={16} className="text-blue-400" />
                        <span>Empowering your creative vision with AI</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tighter">
                        Art That <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Speaks</span> To Your Space.
                    </h1>

                    <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-lg">
                        Discover thousands of premium posters or use our revolutionary AI Designer to bring your most imaginative ideas to life.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={scrollToCollection}
                            className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 group shadow-lg shadow-white/5 active:scale-95"
                        >
                            Shop Collection
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <Link
                            to="/ai"
                            className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all active:scale-95"
                        >
                            Try AI Designer
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Image/Graphic Placeholder */}
            <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 hidden lg:block w-1/2 h-4/5 animate-in fade-in slide-in-from-right-12 duration-1000">
                <div className="relative w-full h-full bg-gradient-to-tr from-gray-800 to-gray-700 rounded-2xl border border-white/10 overflow-hidden rotate-[-5deg] shadow-2xl">
                    <img
                        src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1200"
                        alt="Hero Art"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                </div>
                {/* Secondary Floating Card */}
                <div className="absolute top-1/2 left-[-10%] w-64 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl rotate-[10deg] animate-bounce-slow">
                    <div className="w-full aspect-square bg-gray-800 rounded-lg mb-3">
                        <img
                            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400"
                            alt="Small Art"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                    <div className="h-2 w-3/4 bg-white/20 rounded mb-2"></div>
                    <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;
