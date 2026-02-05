import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react";

export const metadata = {
    title: "Contact Us | LIZHENG AUTOMOBILE Ltd",
    description: "Get in touch with us for your car needs in Rwanda.",
};

export default function ContactPage() {
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

                    {/* Contact Form (Visual Only) */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-8 md:p-12">
                            <h2 className="text-3xl font-bold text-secondary mb-8">Send us a Message</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted uppercase">Your Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-primary/50 border border-white/10 rounded-lg p-4 text-secondary focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted uppercase">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full bg-primary/50 border border-white/10 rounded-lg p-4 text-secondary focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted uppercase">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+250 78X XXX XXX"
                                        className="w-full bg-primary/50 border border-white/10 rounded-lg p-4 text-secondary focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted uppercase">Subject</label>
                                    <select className="w-full bg-primary/50 border border-white/10 rounded-lg p-4 text-secondary focus:outline-none focus:border-accent appearance-none">
                                        <option>Inquiry about a car</option>
                                        <option>Selling my car</option>
                                        <option>Service inquiry</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted uppercase">Message</label>
                                    <textarea
                                        rows={6}
                                        placeholder="Tell us what you are looking for..."
                                        className="w-full bg-primary/50 border border-white/10 rounded-lg p-4 text-secondary focus:outline-none focus:border-accent resize-none"
                                    ></textarea>
                                </div>
                                <button
                                    type="button"
                                    className="btn-primary w-full flex items-center justify-center space-x-2 py-4"
                                >
                                    <Send size={20} />
                                    <span>Send Message</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
