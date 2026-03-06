import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { createOrder, verifyOrder } from '../api/api';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        fullName: '',
        address: '',
        phone: '',
        paymentMethod: 'card'
    });

    // Mock cart for now
    const cart = [{ product: '65d4...', quantity: 1, priceAtPurchase: 5000 }];
    const total = 5000;

    const config = {
        public_key: 'FLWPUBK_TEST-CHANGEME', // Replace with real key
        tx_ref: Date.now().toString(), // Temporary tx_ref for initialization
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
            description: 'Payment for posters',
        },
    };

    const handleFlutterPayment = useFlutterwave(config);

    const handlePlaceOrder = async () => {
        if (!form.email || !form.fullName) return toast.error('Please fill required fields');

        toast.loading('Initializing checkout...', { id: 'checkout' });

        try {
            const res = await createOrder({
                ...form,
                products: cart,
                shippingFee: 1000
            });

            if (form.paymentMethod === 'card') {
                handleFlutterPayment({
                    callback: async (response) => {
                        closePaymentModal();
                        if (response.status === "successful") {
                            await verifyOrder({ transaction_id: response.transaction_id });
                            toast.success('Order placed successfully!', { id: 'checkout' });
                            navigate('/');
                        } else {
                            toast.error('Payment failed', { id: 'checkout' });
                        }
                    },
                    onClose: () => toast.error('Payment cancelled', { id: 'checkout' }),
                });
            } else {
                toast.success('Order placed (COD)!', { id: 'checkout' });
                navigate('/');
            }
        } catch (err) {
            toast.error('Checkout failed', { id: 'checkout' });
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
                </div>

                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 h-fit sticky top-24">
                    <h3 className="font-bold mb-6 text-xl">Order Summary</h3>
                    <div className="flex flex-col gap-4 border-b pb-6 mb-6">
                        <div className="flex justify-between items-center font-medium">
                            <p className="text-gray-500">Subtotal</p>
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

                    <button onClick={handlePlaceOrder} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-lg hover:bg-gray-800 transition shadow-2xl">
                        Place Order
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest px-4">Secure encrypted SSL checkout powered by Flutterwave</p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
