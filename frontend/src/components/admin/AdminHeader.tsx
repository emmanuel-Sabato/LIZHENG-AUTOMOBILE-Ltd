"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Moon, Sun, Menu } from "lucide-react";

interface AdminHeaderProps {
    title: string;
    subtitle?: string;
    onMenuClick?: () => void;
}

const AdminHeader = ({ title, subtitle, onMenuClick }: AdminHeaderProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [formattedDate, setFormattedDate] = useState("");

    // Format date on client side only to avoid hydration mismatch
    useEffect(() => {
        setFormattedDate(
            new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })
        );
    }, []);

    const notifications = [
        { id: 1, title: "New inquiry received", time: "5 min ago", unread: true },
        { id: 2, title: "Toyota Camry viewed 50 times", time: "1 hour ago", unread: true },
        { id: 3, title: "New customer registered", time: "3 hours ago", unread: false },
    ];

    const unreadCount = notifications.filter((n) => n.unread).length;

    return (
        <header className="h-20 bg-surface/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Left Side */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-secondary transition-colors"
                >
                    <Menu size={20} />
                </button>

                {/* Title */}
                <div>
                    <h1 className="text-xl font-bold text-secondary">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-muted">{subtitle}</p>
                    )}
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white/5 rounded-xl border border-white/5 focus-within:border-accent/30 transition-colors w-64">
                    <Search size={18} className="text-muted" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm text-secondary placeholder:text-muted outline-none w-full"
                    />
                    <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-[10px] text-muted font-mono">
                        ⌘K
                    </kbd>
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-secondary transition-colors"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowNotifications(false)}
                            />
                            <div className="absolute right-0 top-12 w-80 bg-surface border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="font-semibold text-secondary">Notifications</h3>
                                    <span className="text-xs text-accent cursor-pointer hover:underline">
                                        Mark all read
                                    </span>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors ${notif.unread ? "bg-accent/5" : ""
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {notif.unread && (
                                                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                                )}
                                                <div className={notif.unread ? "" : "ml-5"}>
                                                    <p className="text-sm text-secondary">{notif.title}</p>
                                                    <p className="text-xs text-muted mt-0.5">{notif.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-3 border-t border-white/5 text-center">
                                    <span className="text-sm text-accent cursor-pointer hover:underline">
                                        View all notifications
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Current Date */}
                <div className="hidden lg:flex flex-col items-end px-4 py-2 bg-white/5 rounded-xl">
                    <span className="text-xs text-muted">Today</span>
                    <span className="text-sm font-semibold text-secondary">
                        {formattedDate || "Loading..."}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
