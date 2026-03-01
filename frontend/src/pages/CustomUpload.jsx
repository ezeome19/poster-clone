import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Check, ShoppingCart } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const CustomUpload = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 25 * 1024 * 1024) return toast.error('File too large (Max 25MB)');
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Toaster />
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black mb-4 uppercase">Print Your Own Photos</h1>
                <p className="text-gray-500 text-lg">High-quality custom posters from your digital memories.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-6">
                    <div className="border-4 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-blue-400 transition cursor-pointer relative">
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        <Upload className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="font-bold text-lg mb-2">Click to upload or drag and drop</p>
                        <p className="text-gray-400 text-sm">JPEG, PNG up to 25MB</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <Check size={18} /> Quality Tips
                        </h3>
                        <ul className="text-blue-700 text-sm space-y-2">
                            <li>• Use high-resolution images (min 3000px)</li>
                            <li>• Ensure good lighting in your photos</li>
                            <li>• Files over 2MB usually yield better prints</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden border flex items-center justify-center shadow-lg relative">
                        {preview ? (
                            <img src={preview} alt="Upload Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center text-gray-400">
                                <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
                                <p>Preview will appear here</p>
                            </div>
                        )}
                    </div>

                    <button
                        disabled={!image}
                        className={`py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition ${image ? 'bg-black hover:bg-gray-800 shadow-xl' : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                        <ShoppingCart size={20} />
                        Continue to Framing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomUpload;
