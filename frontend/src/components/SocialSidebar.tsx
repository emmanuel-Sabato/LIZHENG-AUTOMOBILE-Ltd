import { useState, useEffect } from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import API_BASE_URL from "@/config/api";

const SocialSidebar = () => {
    const [socialLinks, setSocialLinks] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/settings`);
                const data = await res.json();
                setSocialLinks(data);
            } catch (error) {
                console.error("Error fetching social links:", error);
            }
        };
        fetchSettings();
    }, []);

    const socials = [
        { name: "Facebook", icon: <Facebook size={18} />, href: socialLinks?.facebookUrl || "#", color: "bg-white/5 hover:bg-white/20" },
        { name: "Instagram", icon: <Instagram size={18} />, href: socialLinks?.instagramUrl || "#", color: "bg-[#F07B3F]" },
        { name: "LinkedIn", icon: <Linkedin size={18} />, href: socialLinks?.linkedinUrl || "#", color: "bg-white/5 hover:bg-white/20" },
        { name: "X", icon: <span className="font-extrabold text-sm tracking-tighter">X</span>, href: socialLinks?.twitterUrl || "#", color: "bg-white/5 hover:bg-white/20" },
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
