import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-primary text-secondary pt-16 pb-8 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Logo & About */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="inline-block mb-6">
                            <span className="text-accent font-extrabold text-2xl tracking-tighter">
                                LIZHENG <span className="text-secondary">AUTO</span>
                            </span>
                        </Link>
                        <p className="text-muted text-sm leading-relaxed mb-6">
                            LIZHENG AUTOMOBILE Ltd is Rwanda's premier dealership for quality cars. We provide trusted deals and exceptional service to our valued customers.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted hover:text-accent transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-muted hover:text-accent transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-muted hover:text-accent transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-bold mb-6 text-accent">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/" className="text-muted hover:text-white transition-colors text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/cars" className="text-muted hover:text-white transition-colors text-sm">
                                    Available Cars
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-muted hover:text-white transition-colors text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted hover:text-white transition-colors text-sm">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-bold mb-6 text-accent">Contact Info</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <Phone size={18} className="text-accent shrink-0 mt-1" />
                                <span className="text-muted text-sm">+250 780 000 000</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Mail size={18} className="text-accent shrink-0 mt-1" />
                                <span className="text-muted text-sm">info@lizhengauto.rw</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin size={18} className="text-accent shrink-0 mt-1" />
                                <span className="text-muted text-sm">Kigali, Rwanda</span>
                            </li>
                        </ul>
                    </div>

                    {/* Operation Hours */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-bold mb-6 text-accent">Hours</h3>
                        <ul className="space-y-4">
                            <li className="flex justify-between text-sm">
                                <span className="text-muted">Mon - Fri:</span>
                                <span className="text-secondary text-right">8:00 AM - 6:00 PM</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span className="text-muted">Saturday:</span>
                                <span className="text-secondary text-right">9:00 AM - 4:00 PM</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span className="text-muted">Sunday:</span>
                                <span className="text-secondary text-right">Closed</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center">
                    <p className="text-muted text-xs">
                        © {new Date().getFullYear()} LIZHENG AUTOMOBILE Ltd. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
