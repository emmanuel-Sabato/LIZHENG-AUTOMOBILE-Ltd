"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // API call to backend
            const response = await fetch("http://localhost:5001/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Use AuthContext to save state
                login(data.user, data.token);

                // Redirect to dashboard
                router.push("/admin");
            } else {
                setError(data.message || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            setError("Cannot connect to server. Please ensure backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md z-10">
                {/* Logo & Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface border border-white/10 mb-4 shadow-xl">
                        <div className="text-2xl font-bold text-accent">L</div>
                    </div>
                    <h1 className="text-3xl font-bold text-secondary tracking-tight">Admin Portal</h1>
                    <p className="text-muted mt-2">Sign in to manage Lizheng Automobile Limited</p>
                </div>

                {/* Login Card */}
                <div className="glass-card p-8 border-white/10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@lizheng.rw"
                                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-secondary outline-none focus:border-accent/30 focus:bg-white/10 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-medium text-muted">Password</label>
                                <button type="button" className="text-xs text-accent hover:underline">Forgot Password?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-12 text-secondary outline-none focus:border-accent/30 focus:bg-white/10 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 group mt-2"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security Note */}
                    <div className="mt-8 flex items-center gap-2 justify-center text-[10px] text-muted uppercase tracking-widest">
                        <Lock size={10} />
                        Secure Admin Environment
                    </div>
                </div>

                <div className="text-center mt-8">
                    <button
                        onClick={() => router.push("/")}
                        className="text-sm text-muted hover:text-secondary transition-colors"
                    >
                        Back to Website
                    </button>
                </div>
            </div>
        </div>
    );
}
