import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
            <div className="relative z-20 text-center space-y-8 px-4 animate-in fade-in zoom-in duration-700">
                <h1 className="text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 drop-shadow-2xl">
                    404
                </h1>

                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
                        Lost in the Void
                    </h2>
                    <p className="text-lg text-neutral-400 max-w-md mx-auto">
                        The coordinates you are looking for do not exist in this sector.
                        Let's get you back to solid ground.
                    </p>
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all hover:scale-105 active:scale-95 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Return to Base
                </Link>
            </div>
        </div>
    );
}
