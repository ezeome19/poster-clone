import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { checkout, verifyOrder } from '../api/api';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ImageOff } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // External image data passed from ProductTypeModal via React Router state
    const { externalImageUrl, displayImageUrl, imageSource, productType, price } = location.state || {};
    const isExternalOrder = Boolean(externalImageUrl);

    const [form, setForm] = useState({
        email: '',
        fullName: '',
        address: '',
        phone: '',
        paymentMethod: 'card'
    });
    const [copyrightAgreed, setCopyrightAgreed] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);

    // Cart: use external image item or fall back to mock cart
    const cart = isExternalOrder
        ? [{
            externalImageUrl,
            imageSource: imageSource || 'external',
            productType: productType || 'Poster',
            quantity: 1,
            priceAtPurchase: price || 3500,
          }]
        : [{ product: '65d4...', quantity: 1, priceAtPurchase: 5000 }];

    const total = isExternalOrder ? (price || 3500) : 5000;

    // Flutterwave hook initialization with a "base" config
    // We will override properties when calling the payment function
    const handleFlutterPayment = useFlutterwave({
        public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-CHANGEME',
        tx_ref: Date.now().toString(),
        amount: total + 1000,
        currency: 'NGN',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            email: form.email,
            phone_number: form.phone,
            name: form.fullName,
        },
        customizations: {
            title: 'Poster Clone',
            description: `Payment for ${productType || 'product'}`,
        },
    });

    const handlePlaceOrder = async () => {
        if (!form.email || !form.fullName || !form.address) return toast.error('Please fill all required fields');
        if (isExternalOrder && !copyrightAgreed) {
            return toast.error('Please confirm the copyright disclaimer before ordering');
        }

        setIsInitializing(true);
        const toastId = toast.loading('Initializing secure checkout...');

        try {
            // 1. Initialize checkout on the backend to get a secure txn_ref and final amount
            const { data: checkoutData } = await checkout({
                ...form,
                products: cart,
                shippingFee: 1000
            });

            if (form.paymentMethod === 'card') {
                // 2. Open Flutterwave with the backend-provided data
                handleFlutterPayment({
                    callback: async (response) => {
                        closePaymentModal();
                        
                        if (response.status === "successful") {
                            toast.loading('Verifying payment...', { id: toastId });
                            try {
                                // 3. Verify the transaction on the backend
                                await verifyOrder({ transaction_id: response.transaction_id });
                                toast.success('Order placed successfully!', { id: toastId });
                                navigate('/');
                            } catch (verifyErr) {
                                toast.error('Verification failed. Please contact support.', { id: toastId });
                            }
                        } else {
                            toast.error('Payment failed', { id: toastId });
                        }
                        setIsInitializing(false);
                    },
                    onClose: () => {
                        toast.dismiss(toastId);
                        setIsInitializing(false);
                    },
                    // Direct overrides from backend initialization
                    tx_ref: checkoutData.tx_ref,
                    amount: checkoutData.amount,
                    customer: checkoutData.customer
                });
            } else {
                // Handle COD or other direct methods
                toast.success('Order placed successfully!', { id: toastId });
                navigate('/');
                setIsInitializing(false);
            }
        } catch (err) {
            console.error("Checkout handle error:", err);
            toast.error(err.response?.data || 'Checkout initialization failed', { id: toastId });
            setIsInitializing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Toaster />
            <h1 className="text-3xl font-black mb-8 uppercase tracking-widest">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-bold mb-4 uppercase text-sm text-gray-400">Shipping Details</h3>
                        <div className="flex flex-col gap-4">
                            <input placeholder="Full Name" className="border px-4 py-3 rounded-lg" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                            <input placeholder="Email Address" className="border px-4 py-3 rounded-lg" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            <input placeholder="Phone Number" className="border px-4 py-3 rounded-lg" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            <textarea placeholder="Full Shipping Address" className="border px-4 py-3 rounded-lg" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-bold mb-4 uppercase text-sm text-gray-400">Payment Method</h3>
                        <div className="flex gap-4">
                            <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition ${form.paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-100 opacity-60'}`}>
                                <input type="radio" name="payment" className="hidden" checked={form.paymentMethod === 'card'} onChange={() => setForm({ ...form, paymentMethod: 'card' })} />
                                <p className="font-bold uppercase text-xs">Card / Online</p>
                            </label>
                            <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition ${form.paymentMethod === 'pod' ? 'border-black bg-gray-50' : 'border-gray-100 opacity-60'}`}>
                                <input type="radio" name="payment" className="hidden" checked={form.paymentMethod === 'pod'} onChange={() => setForm({ ...form, paymentMethod: 'pod' })} />
                                <p className="font-bold uppercase text-xs">Pay on Delivery</p>
                            </label>
                        </div>
                    </div>

                    {/* Copyright disclaimer — only shown for external image orders */}
                    {isExternalOrder && (
                        <div className={`p-5 rounded-2xl border-2 transition-all ${copyrightAgreed ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
                            <div className="flex items-start gap-4">
                                <ShieldAlert size={20} className={`shrink-0 mt-0.5 ${copyrightAgreed ? 'text-green-600' : 'text-amber-600'}`} />
                                <div className="flex-1">
                                    <p className="font-bold text-sm mb-2">Copyright & Usage Agreement</p>
                                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                        I confirm that I own or have the legal right to use this image. This product is for <strong>personal use only</strong>. I will <strong>not resell</strong> this printed product commercially. I understand that I am solely responsible for any copyright issues.
                                    </p>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div
                                            onClick={() => setCopyrightAgreed(!copyrightAgreed)}
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${copyrightAgreed ? 'bg-green-600 border-green-600' : 'border-gray-300 group-hover:border-amber-500'}`}
                                        >
                                            {copyrightAgreed && <span className="text-white text-xs font-black">✓</span>}
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">I agree to the above terms</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 h-fit sticky top-24">
                    <h3 className="font-bold mb-6 text-xl">Order Summary</h3>

                    {/* External image preview in Order Summary */}
                    {isExternalOrder && (
                        <div className="mb-6 rounded-2xl overflow-hidden bg-gray-100 aspect-video relative">
                            {imgError ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                    <ImageOff size={28} />
                                    <p className="text-xs">Image preview unavailable</p>
                                </div>
                            ) : (
                                <img
                                    src={displayImageUrl || externalImageUrl}
                                    alt="Your custom image"
                                    className="w-full h-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            )}
                            <div className="absolute bottom-0 inset-x-0 bg-black/50 backdrop-blur-sm py-2 px-3 flex items-center justify-between">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">
                                    {productType || 'Poster'}
                                </span>
                                <span className="text-white/60 text-[10px] uppercase">{imageSource}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-4 border-b pb-6 mb-6">
                        <div className="flex justify-between items-center font-medium">
                            <p className="text-gray-500">
                                {isExternalOrder ? `${productType || 'Custom Print'} (×1)` : 'Subtotal'}
                            </p>
                            <p>₦{total.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between items-center font-medium">
                            <p className="text-gray-500">Shipping Fee</p>
                            <p>₦1,000</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mb-8">
                        <p className="font-black text-2xl uppercase tracking-tighter">Total</p>
                        <p className="font-black text-2xl">₦{(total + 1000).toLocaleString()}</p>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={isExternalOrder && !copyrightAgreed}
                        className={`w-full py-5 rounded-2xl font-black uppercase text-lg transition shadow-2xl ${
                            isExternalOrder && !copyrightAgreed
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                        Place Order
                    </button>

                    {isExternalOrder && !copyrightAgreed && (
                        <p className="text-center text-[10px] text-amber-500 mt-3 font-bold uppercase tracking-widest">
                            ↑ Please agree to the copyright terms
                        </p>
                    )}

                    <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest px-4">Secure encrypted SSL checkout powered by Flutterwave</p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
