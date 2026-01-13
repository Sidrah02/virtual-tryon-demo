"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { outfits } from "@/data/outfits";
import Link from "next/link";

function TryOnContent() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    // State
    const [photo, setPhoto] = useState<string | null>(null); // Preview URL
    const [photoFile, setPhotoFile] = useState<File | null>(null); // Actual file
    const [outfitId, setOutfitId] = useState<string | null>(null);

    // Transform State
    const [position, setPosition] = useState({ x: 0, y: 0 }); // Center position
    const [scale, setScale] = useState(1.0);
    const [rotation, setRotation] = useState(0);
    const [opacity, setOpacity] = useState(1.0);
    const [flip, setFlip] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Init
    useEffect(() => {
        const oid = searchParams.get("outfit");
        if (oid) setOutfitId(oid);
    }, [searchParams]);

    const selectedOutfit = outfits.find((o) => o.id === outfitId);

    // Handlers
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhotoFile(file);
            setPhoto(URL.createObjectURL(file));
            setPosition({ x: 0, y: 0 });
        }
    };

    const centerOutfit = () => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setPosition({ x: width / 2, y: height / 3 });
        }
    };

    useEffect(() => {
        if (photo && selectedOutfit) {
            centerOutfit();
        }
    }, [photo, selectedOutfit]);


    // Drag Logic
    const handlePointerDown = (e: React.PointerEvent) => {
        if (!selectedOutfit) return;
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handlePointerUp = () => {
        setIsDragging(false);
    };

    // Download Logic
    const handleDownload = async () => {
        if (!photoFile || !selectedOutfit || !containerRef.current) return;

        const formData = new FormData();
        formData.append("photo", photoFile);

        // Fetch outfit blob
        const outfitBlob = await fetch(selectedOutfit.image).then(r => r.blob());
        formData.append("outfit", outfitBlob, "outfit.png");

        const containerRect = containerRef.current.getBoundingClientRect();
        const baseWidth = 200;
        const currentWidth = baseWidth * scale;

        formData.append("x", position.x.toString());
        formData.append("y", position.y.toString());
        formData.append("container_width", containerRect.width.toString());
        formData.append("outfit_width", currentWidth.toString());
        formData.append("rotation", rotation.toString());
        formData.append("flip", flip.toString());
        formData.append("opacity", opacity.toString());

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/render`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "tryon-result.png";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                console.error("Backend error");
                alert("Failed to render image. Ensure backend is running.");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to backend.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row"
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerMove={handlePointerMove}>

            {/* Sidebar Controls */}
            <div className="w-full md:w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col h-[50vh] md:h-screen overflow-y-auto z-20">
                <Link href="/" className="mb-8 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    VIRTUAL TRY-ON
                </Link>
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">1. Photos</h3>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl hover:border-purple-500 hover:bg-slate-800 transition flex items-center justify-center gap-2 text-slate-300"
                    >
                        <span>Upload Full Body Photo</span>
                        <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                    </button>
                </div>
                <div className="mb-8 flex-1">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">2. Select Outfit</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {outfits.map(o => (
                            <div key={o.id}
                                onClick={() => setOutfitId(o.id)}
                                className={`cursor-pointer rounded-lg border p-2 transition text-center ${outfitId === o.id ? 'border-purple-500 bg-purple-500/10' : 'border-slate-800 hover:border-slate-600'}`}>
                                <div className="relative aspect-[3/4] mb-2">
                                    <Image src={o.image} alt={o.name} fill className="object-contain" />
                                </div>
                                <div className="text-[10px] truncate">{o.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 relative bg-slate-950 flex flex-col">
                <div className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-slate-300">Editor</span>
                    </div>
                    <button
                        onClick={handleDownload}
                        disabled={!photo || !selectedOutfit}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                        Download Result
                    </button>
                </div>
                <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[url('/grid.svg')] bg-repeat opacity-100 p-10">
                    <div
                        ref={containerRef}
                        className="relative shadow-2xl overflow-hidden bg-slate-800"
                        style={{
                            maxHeight: '80vh',
                            aspectRatio: '3/4',
                            maxWidth: '100%',
                        }}
                    >
                        {photo ? (
                            <img
                                src={photo}
                                alt="User"
                                className="w-full h-full object-contain pointer-events-none select-none"
                            />
                        ) : (
                            <div className="w-[400px] h-[500px] flex items-center justify-center text-slate-500 flex-col">
                                <p>Upload a photo to start</p>
                            </div>
                        )}

                        {photo && selectedOutfit && (
                            <div
                                className="absolute cursor-move origin-center active:cursor-grabbing"
                                onPointerDown={handlePointerDown}
                                style={{
                                    left: position.x,
                                    top: position.y,
                                    width: '200px',
                                    transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale}) scaleX(${flip ? -1 : 1})`,
                                    opacity: opacity,
                                    touchAction: 'none'
                                }}
                            >
                                <img
                                    src={selectedOutfit.image}
                                    alt="Outfit"
                                    className="w-full h-auto pointer-events-none select-none drop-shadow-xl"
                                />
                                <div className={`absolute inset-0 border-2 border-purple-500 rounded pointer-events-none transition-opacity ${isDragging ? 'opacity-50' : 'opacity-0'}`}></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Controls */}
                {selectedOutfit && (
                    <div className="bg-slate-900 border-t border-slate-800 p-4 grid grid-cols-2 md:grid-cols-4 gap-6 z-10">
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 font-bold uppercase">Scale ({scale.toFixed(1)}x)</label>
                            <input type="range" min="0.2" max="2.0" step="0.1" value={scale} onChange={e => setScale(parseFloat(e.target.value))} className="w-full accent-purple-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 font-bold uppercase">Rotate ({rotation}°)</label>
                            <input type="range" min="-180" max="180" value={rotation} onChange={e => setRotation(parseInt(e.target.value))} className="w-full accent-purple-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 font-bold uppercase">Opacity ({Math.round(opacity * 100)}%)</label>
                            <input type="range" min="0.2" max="1.0" step="0.1" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} className="w-full accent-purple-500" />
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setFlip(!flip)} className={`px-4 py-2 rounded border border-slate-700 text-sm font-bold ${flip ? 'bg-purple-900 border-purple-500' : 'bg-slate-800'}`}>
                                Flip
                            </button>
                            <button onClick={() => { setScale(1); setRotation(0); setOpacity(1); }} className="px-4 py-2 rounded text-sm text-slate-400 hover:text-white">
                                Reset
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TryOn() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
            <TryOnContent />
        </Suspense>
    );
}
