import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import AIEditor from './pages/AIEditor'
import StockSearch from './pages/StockSearch'
import CustomUpload from './pages/CustomUpload'
import Checkout from './pages/Checkout'
import Navbar from './components/layout/Navbar'

function App() {
    useEffect(() => {
        const lenis = new Lenis()

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [])

    return (
        <div className="min-h-screen bg-white selection:bg-black selection:text-white">
            <Navbar />
            <div className="pt-24">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/ai" element={<AIEditor />} />
                    <Route path="/stock" element={<StockSearch />} />
                    <Route path="/custom" element={<CustomUpload />} />
                    <Route path="/checkout" element={<Checkout />} />
                </Routes>
            </div>
        </div>
    )
}

export default App
