import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
            <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex absolute top-0 p-6">
                <div className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    VIRTUAL TRY-ON
                </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-8 text-center mt-20">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                    Experience Fashion <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Reimagined</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 max-w-2xl">
                    Upload your photo, select premium outfits, and visualize your perfect look in seconds. No fitting rooms, just style.
                </p>

                <div className="flex gap-4 mt-8">
                    <Link href="/try">
                        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30">
                            Try Now
                        </button>
                    </Link>
                    <Link href="/catalog">
                        <button className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-full font-bold text-lg hover:bg-slate-700 transition-colors">
                            View Catalog
                        </button>
                    </Link>
                </div>
            </div>

            <div className="mt-20 w-full max-w-4xl p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-4">
                        <div className="text-3xl mb-2">📸</div>
                        <h3 className="font-bold text-lg mb-2">Upload Photo</h3>
                        <p className="text-slate-400 text-sm">Use any full-body photo of yourself.</p>
                    </div>
                    <div className="p-4">
                        <div className="text-3xl mb-2">👗</div>
                        <h3 className="font-bold text-lg mb-2">Choose Outfit</h3>
                        <p className="text-slate-400 text-sm">Select from our curated collection.</p>
                    </div>
                    <div className="p-4">
                        <div className="text-3xl mb-2">✨</div>
                        <h3 className="font-bold text-lg mb-2">Perfect Fit</h3>
                        <p className="text-slate-400 text-sm">Adjust scale and rotation for the perfect look.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
