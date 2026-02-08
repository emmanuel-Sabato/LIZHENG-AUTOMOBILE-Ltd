"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
    Mail,
    Search,
    Trash2,
    CheckCircle,
    Clock,
    User,
    Phone,
    MessageSquare,
    ChevronRight,
    Loader2,
    CheckCircle2,
    MoreVertical
} from "lucide-react";
import API_BASE_URL from "@/config/api";

interface Message {
    _id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: "Unread" | "Read";
    createdAt: string;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`${API_BASE_URL}/api/messages`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (messageId: string) => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`${API_BASE_URL}/api/messages/${messageId}/read`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setMessages(prev => prev.map(msg =>
                    msg._id === messageId ? { ...msg, status: "Read" } : msg
                ));
            }
        } catch (error) {
            console.error("Error marking message as read:", error);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`${API_BASE_URL}/api/messages/${messageId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setMessages(prev => prev.filter(msg => msg._id !== messageId));
                if (selectedMessage?._id === messageId) setSelectedMessage(null);
            }
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const unreadCount = messages.filter(msg => msg.status === "Unread").length;

    return (
        <div className="min-h-screen bg-primary">
            <AdminHeader
                title="Messages Center"
                subtitle={unreadCount > 0 ? `${unreadCount} unread messages` : "All caught up!"}
            />

            <main className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)]">
                    {/* List View */}
                    <div className={`${selectedMessage ? "hidden lg:block lg:col-span-4" : "lg:col-span-12"} glass-card flex flex-col overflow-hidden`}>
                        <div className="p-4 border-b border-white/5 space-y-4">
                            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5 focus-within:border-accent/30 transition-colors">
                                <Search size={18} className="text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search messages..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent text-sm text-secondary placeholder:text-muted outline-none w-full"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted gap-3">
                                    <Loader2 className="animate-spin text-accent" />
                                    <p className="text-sm">Loading messages...</p>
                                </div>
                            ) : filteredMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted p-6 text-center">
                                    <Mail size={48} className="mb-4 opacity-20" />
                                    <p className="font-medium text-secondary">No messages found</p>
                                    <p className="text-sm">When users contact you, they will appear here.</p>
                                </div>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <button
                                        key={msg._id}
                                        onClick={() => {
                                            setSelectedMessage(msg);
                                            if (msg.status === "Unread") handleMarkAsRead(msg._id);
                                        }}
                                        className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-all relative group ${selectedMessage?._id === msg._id ? "bg-accent/10" : ""
                                            }`}
                                    >
                                        {msg.status === "Unread" && (
                                            <div className="absolute right-4 top-4 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                                        )}
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className={`text-sm truncate pr-4 ${msg.status === "Unread" ? "text-secondary font-bold" : "text-muted font-medium"}`}>
                                                {msg.name}
                                            </h4>
                                            <span className="text-[10px] text-muted whitespace-nowrap">
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate ${msg.status === "Unread" ? "text-accent/90" : "text-muted"}`}>
                                            {msg.subject}
                                        </p>
                                        <p className="text-xs text-muted/60 truncate mt-1">
                                            {msg.message}
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Detail View */}
                    {selectedMessage ? (
                        <div className="lg:col-span-8 glass-card flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="lg:hidden p-2 -ml-2 text-muted hover:text-secondary"
                                >
                                    <ChevronRight className="rotate-180" size={24} />
                                </button>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-secondary">{selectedMessage.name}</h3>
                                        <p className="text-xs text-muted">Sent on {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDeleteMessage(selectedMessage._id)}
                                        className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                                        title="Delete Message"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                                {/* Message Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">Email</p>
                                        <div className="flex items-center gap-2 text-secondary">
                                            <Mail size={14} className="text-muted" />
                                            <a href={`mailto:${selectedMessage.email}`} className="text-sm truncate hover:text-accent transition-colors">
                                                {selectedMessage.email}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">Phone</p>
                                        <div className="flex items-center gap-2 text-secondary">
                                            <Phone size={14} className="text-muted" />
                                            <span className="text-sm">{selectedMessage.phone}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">Subject</p>
                                        <div className="flex items-center gap-2 text-secondary">
                                            <MessageSquare size={14} className="text-muted" />
                                            <span className="text-sm truncate font-medium">{selectedMessage.subject}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold text-accent uppercase tracking-wider">Message Content</p>
                                    <div className="p-6 rounded-3xl bg-surface/50 border border-white/5 text-secondary leading-relaxed whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </div>
                                </div>

                                {/* Quick Reply */}
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        <Mail size={18} />
                                        Reply via Email
                                    </a>
                                    <a
                                        href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-2.5 rounded-xl bg-green-500/10 text-green-500 font-bold text-sm hover:bg-green-500/20 transition-all flex items-center gap-2"
                                    >
                                        <MessageSquare size={18} />
                                        WhatsApp Reply
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden lg:flex lg:col-span-8 glass-card items-center justify-center text-center p-12">
                            <div className="max-w-md">
                                <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center text-accent mx-auto mb-6">
                                    <Mail size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-secondary mb-2">Select a message</h3>
                                <p className="text-muted">Choose a message from the list to view its contents and respond to the user.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
