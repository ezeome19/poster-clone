import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, RotateCcw } from 'lucide-react';

const ImageCropModal = ({ imageUrl, onCropComplete, onClose }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(2 / 3); // Default for posters
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = (crop) => setCrop(crop);
    const onZoomChange = (zoom) => setZoom(zoom);

    const onCropCompleteInternal = useCallback((_croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous'); // Needed for external URLs
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) return;
                const fileUrl = URL.createObjectURL(blob);
                resolve(fileUrl);
            }, 'image/jpeg');
        });
    };

    const handleConfirm = async () => {
        try {
            const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full h-full max-w-4xl max-h-[90vh] flex flex-col">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 text-white">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-widest">Crop Your Image</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Adjust the frame to fit your product perfectly</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Cropper Container */}
                <div className="relative flex-1 bg-zinc-900 overflow-hidden">
                    <Cropper
                        image={imageUrl}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteInternal}
                        onZoomChange={onZoomChange}
                    />
                </div>

                {/* Controls */}
                <div className="p-8 bg-black">
                    <div className="flex flex-col gap-6 max-w-lg mx-auto">
                        
                        {/* Aspect Ratio Options */}
                        <div className="flex justify-center gap-3">
                            {[
                                { label: 'Poster (2:3)', val: 2/3 },
                                { label: 'Canvas (4:5)', val: 4/5 },
                                { label: 'Square (1:1)', val: 1 },
                                { label: 'Landscape (3:2)', val: 3/2 }
                            ].map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={() => setAspect(opt.val)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        aspect === opt.val 
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                            : 'bg-zinc-800 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Zoom Slider */}
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Zoom</span>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="flex-1 accent-blue-600"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => { setZoom(1); setCrop({ x:0, y:0 }); }}
                                className="flex-1 py-4 rounded-2xl bg-zinc-800 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-zinc-700 transition"
                            >
                                <RotateCcw size={14} /> Reset
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-[2] py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition shadow-xl"
                            >
                                <Check size={14} /> Apply Crop
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal;
