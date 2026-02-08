"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import API_BASE_URL from "@/config/api";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "Inquiry about a car",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const response = await fetch(`${API_BASE_URL}/api/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "Inquiry about a car",
                    message: ""
                });
                // Reset success message after 5 seconds
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                setStatus("error");
                setErrorMessage(data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage("Failed to send message. Please check your connection.");
        }
    };

    return (
        <div className="pt-32 pb-24 min-h-screen bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-secondary mb-4 tracking-tighter">
                        Get in <span className="text-accent">Touch</span>
                    </h1>
                    <p className="text-muted text-lg max-w-2xl mx-auto">
                        Have a question or interested in a car? Reach out to us through any of the channels below.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Details */}
                    <div className="lg:col-span-1 space-y-8">
                        <h2 className="text-3xl font-bold text-secondary mb-8">Contact Information</h2>

                        <div className="glass-card p-6 flex items-start space-x-4">
                            <div className="bg-accent/10 p-3 rounded-lg text-accent">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-secondary">Call Us</h3>
                                <p className="text-muted">+250 780 000 000</p>
                                <p className="text-muted">+250 780 111 222</p>
                            </div>
                        </div>

                        <div className="glass-card p-6 flex items-start space-x-4">
                            <div className="bg-accent/10 p-3 rounded-lg text-accent">
                                <MessageCircle size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-secondary">WhatsApp</h3>
                                <a
                                    href="https://wa.me/250780000000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent hover:underline font-bold"
                                >
                                    Message Now
                                </a>
                            </div>
                        </div>

                        <div className="glass-card p-6 flex items-start space-x-4">
                            <div className="bg-accent/10 p-3 rounded-lg text-accent">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-secondary">Showroom Location</h3>
                                <p className="text-muted">KN 3 Rd, Kigali, Rwanda</p>
                                <p className="text-muted">Near Kigali Heights</p>
                            </div>
                        </div>

                        <div className="glass-card p-6 flex items-start space-x-4">
                            <div className="bg-accent/10 p-3 rounded-lg text-accent">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-secondary">Business Hours</h3>
                                <p className="text-muted">Mon - Sat: 8:00 AM - 6:00 PM</p>
                                <p className="text-muted">Sun: Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-8 md:p-12">
                            <h2 className="text-3xl font-bold text-secondary mb-8">Send us a Message</h2>

                            {status === "success" && (
                                <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-500">
                                    <CheckCircle2 size={20} />
                                    <p className="text-sm font-medium">Thank you! Your message has been sent successfully. We will get back to you soon.</p>
                                </div>
                            )}

                            {status === "error" && (
                                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
                                    <AlertCircle size={20} />
                                    <p className="text-sm font-medium">{errorMessage}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted uppercase">Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full bg-primary/50 border border-white/10 rounded-lg p-4 text-secondary focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted uppercase">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="w-full bg-primary/50 border border-white/10 rounded-lg p-4 text-secondary focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted uppercase">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+250 78X XXX XXX"
                                        className="w-full bg-primary/50 border border-white/10 rounded-lg p-4 text-secondary focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted uppercase">Subject</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full bg-primary/50 border border-white/10 rounded-lg p-4 text-secondary focus:outline-none focus:border-accent appearance-none"
                                    >
                                        <option>Inquiry about a car</option>
                                        <option>Selling my car</option>
                                        <option>Service inquiry</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted uppercase">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        placeholder="Tell us what you are looking for..."
                                        className="w-full bg-primary/50 border border-white/10 rounded-lg p-4 text-secondary focus:outline-none focus:border-accent resize-none"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="btn-primary w-full flex items-center justify-center space-x-2 py-4 disabled:opacity-50"
                                >
                                    {status === "loading" ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <Send size={20} />
                                    )}
                                    <span>{status === "loading" ? "Sending..." : "Send Message"}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
