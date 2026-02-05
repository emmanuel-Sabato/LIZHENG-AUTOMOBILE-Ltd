"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const SocialSidebar = () => {
    const socials = [
        { name: "Facebook", icon: <Facebook size={18} />, href: "#", color: "bg-white/5 hover:bg-white/20" },
        { name: "Instagram", icon: <Instagram size={18} />, href: "#", color: "bg-[#F07B3F]" }, // Matches the orange in screenshot
        { name: "LinkedIn", icon: <Linkedin size={18} />, href: "#", color: "bg-white/5 hover:bg-white/20" },
        { name: "X", icon: <span className="font-extrabold text-sm tracking-tighter">X</span>, href: "#", color: "bg-white/5 hover:bg-white/20" },
    ];

    return (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3 p-3 glass-card rounded-full border border-white/5 shadow-2xl">
            {socials.map((social) => (
                <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 ${social.color}`}
                    aria-label={social.name}
                >
                    {social.icon}
                </a>
            ))}
        </div>
    );
};

export default SocialSidebar;
