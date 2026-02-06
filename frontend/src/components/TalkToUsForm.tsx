"use client";

import { useState } from "react";
import { Send, Phone, MessageSquare, Mail, Globe, MapPin, CheckCircle2 } from "lucide-react";

interface TalkToUsFormProps {
    carId: string;
    carName: string;
}

const LANGUAGES = ["Kinyarwanda", "English", "French", "Swahili"];
const REPLY_METHODS = ["Email", "Call", "Whatsapp"];

export default function TalkToUsForm({ carId, carName }: TalkToUsFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        location: "",
        language: LANGUAGES[0],
        method: REPLY_METHODS[0],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:5001/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    carId,
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        whatsapp: "",
                        location: "",
                        language: LANGUAGES[0],
                        method: REPLY_METHODS[0],
                    });
                }, 10000); // Keep success message longer for inline
            } else {
                alert("Failed to send inquiry. Please try again.");
            }
        } catch (error) {
            console.error("Error sending inquiry:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div id="inquiry-form" className="relative w-full bg-[#0F0F0F]/50 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden">
            {isSuccess ? (
                <div className="p-16 text-center space-y-6">
                    <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto text-accent border border-accent/30">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-secondary tracking-tight">Inquiry Received</h2>
                        <p className="text-muted text-lg max-w-md mx-auto">
                            Thank you. Our concierge will contact you shortly via {formData.method}.
                        </p>
                        <button
                            onClick={() => setIsSuccess(false)}
                            className="mt-4 text-accent hover:underline text-sm font-bold uppercase tracking-widest"
                        >
                            Send another inquiry
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col">
                    {/* Header Section */}
                    <div className="relative p-8 sm:p-10 border-b border-white/5 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-full -mr-20 -mt-20" />

                        <div className="relative flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-secondary tracking-tight flex items-center gap-3">
                                    Talk to Us
                                    <div className="h-px w-12 bg-accent/50" />
                                </h2>
                                <p className="text-accent/80 font-medium uppercase tracking-[0.2em] text-[10px]">
                                    Concierge Service for {carName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Body - 2 Column Grid */}
                    <div className="p-8 sm:p-10 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.15em] ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent">
                                        <Globe size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Smith"
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-secondary outline-none focus:border-accent/40 focus:bg-white/[0.06] transition-all placeholder:text-muted/20"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.15em] ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent">
                                        <Mail size={16} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-secondary outline-none focus:border-accent/40 focus:bg-white/[0.06] transition-all placeholder:text-muted/20"
                                    />
                                </div>
                            </div>

                            {/* Call Number */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.15em] ml-1">Call Number</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent">
                                        <Phone size={16} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+250..."
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-secondary outline-none focus:border-accent/40 focus:bg-white/[0.06] transition-all placeholder:text-muted/20"
                                    />
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.15em] ml-1">WhatsApp</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent">
                                        <MessageSquare size={16} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        required
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        placeholder="+250..."
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-secondary outline-none focus:border-accent/40 focus:bg-white/[0.06] transition-all placeholder:text-muted/20"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="sm:col-span-2 space-y-2">
                                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.15em] ml-1">Location</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent">
                                        <MapPin size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Kigali, Rwanda"
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-secondary outline-none focus:border-accent/40 focus:bg-white/[0.06] transition-all placeholder:text-muted/20"
                                    />
                                </div>
                            </div>

                            {/* Dropdowns */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.15em] ml-1">Language</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-secondary outline-none focus:border-accent/40 focus:bg-white/[0.06] transition-all appearance-none cursor-pointer"
                                >
                                    {LANGUAGES.map(lang => <option key={lang} value={lang} className="bg-[#0F0F0F]">{lang}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.15em] ml-1">Reply By</label>
                                <select
                                    name="method"
                                    value={formData.method}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-secondary outline-none focus:border-accent/40 focus:bg-white/[0.06] transition-all appearance-none cursor-pointer"
                                >
                                    {REPLY_METHODS.map(m => <option key={m} value={m} className="bg-[#0F0F0F]">{m}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-4 py-4 bg-accent hover:bg-accent/90 text-primary font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_12px_24px_-8px_rgba(212,175,55,0.4)] flex items-center justify-center gap-4 disabled:opacity-50 group overflow-hidden relative"
                        >
                            {isSubmitting ? "Sending..." : "Request Call"}
                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
