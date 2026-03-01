import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import AIEditor from './pages/AIEditor'
import CustomUpload from './pages/CustomUpload'
import Checkout from './pages/Checkout'
import Navbar from './components/layout/Navbar'

function App() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/ai" element={<AIEditor />} />
                <Route path="/custom" element={<CustomUpload />} />
                <Route path="/checkout" element={<Checkout />} />
            </Routes>
        </div>
    )
}

export default App
