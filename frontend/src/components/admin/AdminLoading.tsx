"use client";

import { Loader2, Sparkles } from "lucide-react";

const AdminLoading = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-primary overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

            <div className="relative flex flex-col items-center">
                {/* Logo Animation */}
                <div className="w-20 h-20 rounded-2xl bg-surface border border-white/10 flex items-center justify-center shadow-2xl mb-8 animate-pulse">
                    <Sparkles size={32} className="text-accent" />
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-3">
                    <h2 className="text-xl font-bold text-secondary tracking-tight">Lizheng Admin</h2>
                    <div className="flex items-center gap-2 text-muted text-sm">
                        <Loader2 size={16} className="animate-spin text-accent" />
                        <span>Securing Connection...</span>
                    </div>
                </div>

                {/* Progress bar simulation */}
                <div className="w-48 h-1 bg-white/5 rounded-full mt-8 overflow-hidden">
                    <div className="h-full bg-accent animate-shimmer" style={{ width: '100%', transform: 'translateX(-100%)' }} />
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default AdminLoading;
