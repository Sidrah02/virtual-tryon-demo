import Link from "next/link";
import Image from "next/image";
import { outfits } from "@/data/outfits";

export default function Catalog() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <nav className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur fixed w-full top-0 z-50">
                <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    VIRTUAL TRY-ON
                </Link>
                <Link href="/try">
                    <button className="px-6 py-2 bg-slate-800 rounded-full hover:bg-slate-700 transition font-medium text-sm">
                        Go to Try-On
                    </button>
                </Link>
            </nav>

            <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold mb-4">Collection</h1>
                    <p className="text-slate-400">Explore our latest arrivals</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {outfits.map((outfit) => (
                        <div key={outfit.id} className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-purple-500/50 transition-all duration-300">
                            <div className="aspect-[3/4] relative bg-slate-800">
                                <Image
                                    src={outfit.image}
                                    alt={outfit.name}
                                    fill
                                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-4">
                                <div className="text-xs font-semibold text-purple-400 mb-1 uppercase tracking-wider">{outfit.category}</div>
                                <h3 className="font-bold text-lg mb-1 truncate">{outfit.name}</h3>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-slate-300">${outfit.price}</span>
                                    <Link href={`/try?outfit=${outfit.id}`}>
                                        <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-purple-50 hover:text-purple-900 transition-colors">
                                            Try On
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
