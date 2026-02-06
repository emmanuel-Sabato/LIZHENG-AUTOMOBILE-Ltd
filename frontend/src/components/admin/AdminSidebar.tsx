"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    Car,
    ClipboardList,
    Users,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Sparkles,
} from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { label: "Overview", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { label: "Inventory", href: "/admin/inventory", icon: <Car size={20} /> },
    { label: "Orders", href: "/admin/orders", icon: <ClipboardList size={20} /> },
    { label: "Customers", href: "/admin/customers", icon: <Users size={20} /> },
    { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 size={20} /> },
    { label: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
];

const AdminSidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }
        return pathname.startsWith(href);
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-surface/95 backdrop-blur-xl border-r border-white/5 z-50 transition-all duration-300 flex flex-col ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            {/* Logo Section */}
            <div className="h-20 flex items-center justify-between px-4 border-b border-white/5">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg shadow-accent/20">
                        <Sparkles size={20} className="text-primary" />
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <h1 className="text-lg font-bold text-secondary leading-tight">
                                LIZHENG
                            </h1>
                            <p className="text-[10px] text-accent font-semibold tracking-widest">
                                ADMIN PANEL
                            </p>
                        </div>
                    )}
                </Link>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-secondary transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative ${isActive(item.href)
                            ? "bg-accent/10 text-accent"
                            : "text-muted hover:text-secondary hover:bg-white/5"
                            }`}
                    >
                        {/* Active Indicator */}
                        {isActive(item.href) && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full" />
                        )}

                        {/* Icon */}
                        <span className={`flex-shrink-0 ${isActive(item.href) ? "text-accent" : ""}`}>
                            {item.icon}
                        </span>

                        {/* Label */}
                        {!isCollapsed && (
                            <span className="font-medium text-sm">{item.label}</span>
                        )}

                        {/* Hover Glow */}
                        {isActive(item.href) && (
                            <div className="absolute inset-0 bg-accent/5 rounded-xl blur-xl -z-10" />
                        )}
                    </Link>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t border-white/5">
                {/* User Profile */}
                <div className={`flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-3 ${isCollapsed ? "justify-center" : ""}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/80 to-accent/40 flex items-center justify-center text-primary font-bold text-sm">
                        {user?.name?.substring(0, 2).toUpperCase() || "AD"}
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-secondary truncate">{user?.name || "Admin User"}</p>
                            <p className="text-xs text-muted truncate">{user?.email || "admin@lizheng.rw"}</p>
                        </div>
                    )}
                </div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-muted hover:text-red-400 hover:bg-red-500/10 transition-all ${isCollapsed ? "justify-center" : ""}`}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
                </button>
            </div>
        </aside>

    );
};

export default AdminSidebar;
