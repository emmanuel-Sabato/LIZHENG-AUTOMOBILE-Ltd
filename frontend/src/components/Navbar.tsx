"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Car } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Cars", href: "/cars" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-7xl px-6 py-3 glass-card border border-white/5 shadow-2xl rounded-2xl ${scrolled ? "bg-primary/80" : "bg-primary/40"
                }`}
        >
            <div className="flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2 group">
                    <span className="text-accent font-extrabold text-xl md:text-2xl tracking-tighter group-hover:scale-105 transition-transform">
                        LIZHENG <span className="text-secondary">AUTO</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-secondary/80 hover:text-accent hover:bg-white/5 px-4 py-2 rounded-lg transition-all font-medium text-sm"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:block">
                    <Link
                        href="https://wa.me/250780000000"
                        className="btn-primary text-xs px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider"
                    >
                        Chat Support
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-secondary hover:text-accent focus:outline-none transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-white/5 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 text-secondary hover:bg-white/5 rounded-xl font-medium text-base transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="https://wa.me/250780000000"
                        className="block px-4 py-3 text-accent font-bold"
                    >
                        Chat on WhatsApp
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
