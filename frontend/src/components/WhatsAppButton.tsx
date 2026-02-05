"use client";

import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
    return (
        <a
            href="https://wa.me/250780000000"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center animate-bounce-slow"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle size={32} fill="currentColor" />
        </a>
    );
};

export default WhatsAppButton;
