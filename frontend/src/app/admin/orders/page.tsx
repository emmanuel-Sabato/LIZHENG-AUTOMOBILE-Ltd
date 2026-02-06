"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
    Search,
    Filter,
    MessageSquare,
    Phone,
    Mail,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ExternalLink,
    MoreVertical,
} from "lucide-react";
import API_BASE_URL from "@/config/api";

interface Order {
    id: string;
    customerName: string;
    email: string;
    phone: string;
    carInterested: string;
    message: string;
    status: "new" | "in_progress" | "completed" | "cancelled";
    date: string;
    source: "whatsapp" | "website" | "call";
}

const mockOrders: Order[] = [
    {
        id: "ORD-001",
        customerName: "Jean Pierre",
        email: "jean@gmail.com",
        phone: "+250 788 123 456",
        carInterested: "Toyota Camry XSE V6",
        message: "I would like to schedule a test drive for the Toyota Camry this weekend.",
        status: "new",
        date: "2024-02-05 10:30",
        source: "whatsapp",
    },
    {
        id: "ORD-002",
        customerName: "Marie Claire",
        email: "marie.c@outlook.com",
        phone: "+250 788 234 567",
        carInterested: "Lexus IS 350 F Sport",
        message: "Is the Lexus IS still available? What's the best price you can offer?",
        status: "in_progress",
        date: "2024-02-04 15:45",
        source: "website",
    },
    {
        id: "ORD-003",
        customerName: "Emmanuel Uwimana",
        email: "emmanuel@yahoo.com",
        phone: "+250 788 345 678",
        carInterested: "Toyota Highlander Hybrid",
        message: "Interested in financing options for the Highlander.",
        status: "completed",
        date: "2024-02-03 09:15",
        source: "call",
    },
    {
        id: "ORD-004",
        customerName: "Grace Mukamana",
        email: "grace.m@gmail.com",
        phone: "+250 788 456 789",
        carInterested: "Toyota RAV4 Adventure",
        message: "Looking for a family SUV. Would like more details about the RAV4.",
        status: "new",
        date: "2024-02-05 08:00",
        source: "whatsapp",
    },
    {
        id: "ORD-005",
        customerName: "Patrick Habimana",
        email: "patrick.h@business.com",
        phone: "+250 788 567 890",
        carInterested: "Toyota Tundra TRD Pro",
        message: "I need a powerful pickup for my business. When can I see the Tundra?",
        status: "cancelled",
        date: "2024-02-02 14:20",
        source: "website",
    },
];

const statusConfig = {
    new: {
        label: "New",
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        icon: <AlertCircle size={14} />,
    },
    in_progress: {
        label: "In Progress",
        color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        icon: <Clock size={14} />,
    },
    completed: {
        label: "Completed",
        color: "bg-green-500/10 text-green-500 border-green-500/20",
        icon: <CheckCircle size={14} />,
    },
    cancelled: {
        label: "Cancelled",
        color: "bg-red-500/10 text-red-500 border-red-500/20",
        icon: <XCircle size={14} />,
    },
};

const sourceConfig = {
    whatsapp: { label: "WhatsApp", color: "text-green-500" },
    website: { label: "Website", color: "text-blue-500" },
    call: { label: "Phone Call", color: "text-purple-500" },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                // Map backend data to local Order interface
                const mappedOrders = data.map((item: any) => ({
                    id: item._id,
                    customerName: item.customer.name,
                    email: item.customer.email,
                    phone: item.customer.phone,
                    carInterested: `${item.car.brand} ${item.car.name}`,
                    message: `Customer preferred to be contacted via ${item.customer.method} in ${item.customer.language}. Location: ${item.customer.location}`,
                    status: item.status,
                    date: new Date(item.createdAt).toLocaleString(),
                    source: item.source || "website",
                }));
                setOrders(mappedOrders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                fetchOrders();
                if (selectedOrder?.id === id) {
                    setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
                }
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.carInterested.toLowerCase().includes(searchQuery.toLowerCase());

        if (statusFilter === "all") return matchesSearch;
        return matchesSearch && order.status === statusFilter;
    });

    const orderCounts = {
        all: orders.length,
        new: orders.filter((o) => o.status === "new").length,
        in_progress: orders.filter((o) => o.status === "in_progress").length,
        completed: orders.filter((o) => o.status === "completed").length,
    };

    return (
        <div className="min-h-screen bg-primary">
            <AdminHeader
                title="Orders & Inquiries"
                subtitle={`${orderCounts.new} new inquiries`}
            />

            <main className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Total Inquiries", value: orderCounts.all, color: "text-secondary" },
                        { label: "New", value: orderCounts.new, color: "text-blue-500" },
                        { label: "In Progress", value: orderCounts.in_progress, color: "text-amber-500" },
                        { label: "Completed", value: orderCounts.completed, color: "text-green-500" },
                    ].map((stat, idx) => (
                        <div key={idx} className="glass-card p-4 text-center">
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-muted mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-surface rounded-xl border border-white/5 focus-within:border-accent/30 transition-colors flex-1 sm:max-w-sm">
                        <Search size={18} className="text-muted" />
                        <input
                            type="text"
                            placeholder="Search inquiries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-sm text-secondary placeholder:text-muted outline-none w-full"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-1 p-1 bg-surface rounded-xl">
                        {["all", "new", "in_progress", "completed"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${statusFilter === status
                                    ? "bg-accent text-primary"
                                    : "text-muted hover:text-secondary"
                                    }`}
                            >
                                {status === "all"
                                    ? "All"
                                    : status === "in_progress"
                                        ? "In Progress"
                                        : status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="glass-card p-5 hover:border-white/20 transition-all cursor-pointer"
                            onClick={() => setSelectedOrder(order)}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Customer Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                                            {order.customerName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-secondary">
                                                {order.customerName}
                                            </h3>
                                            <p className="text-xs text-muted">{order.id}</p>
                                        </div>
                                        {/* Source Badge */}
                                        <span className={`text-xs font-medium ${sourceConfig[order.source].color}`}>
                                            {sourceConfig[order.source].label}
                                        </span>
                                    </div>

                                    {/* Car Interested */}
                                    <p className="text-sm text-accent font-medium mb-1">
                                        {order.carInterested}
                                    </p>

                                    {/* Message Preview */}
                                    <p className="text-sm text-muted line-clamp-2">{order.message}</p>
                                </div>

                                {/* Right Side */}
                                <div className="flex items-center gap-4">
                                    {/* Status Badge */}
                                    <div
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusConfig[order.status].color
                                            }`}
                                    >
                                        {statusConfig[order.status].icon}
                                        <span className="text-xs font-medium">
                                            {statusConfig[order.status].label}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs text-muted">{order.date}</p>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={`https://wa.me/${order.phone.replace(/\s+/g, "").replace("+", "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-9 h-9 rounded-lg bg-green-500/10 hover:bg-green-500/20 flex items-center justify-center text-green-500 transition-colors"
                                        >
                                            <MessageSquare size={16} />
                                        </a>
                                        <a
                                            href={`tel:${order.phone}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-9 h-9 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-500 transition-colors"
                                        >
                                            <Phone size={16} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted">No inquiries found</p>
                    </div>
                )}
            </main>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedOrder(null)}
                    />
                    <div className="relative w-full max-w-lg bg-surface rounded-2xl border border-white/10 shadow-2xl m-4">
                        <div className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-secondary">
                                        {selectedOrder.customerName}
                                    </h2>
                                    <p className="text-sm text-muted">{selectedOrder.id}</p>
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusConfig[selectedOrder.status].color}`}>
                                    {statusConfig[selectedOrder.status].icon}
                                    <span className="text-xs font-medium">
                                        {statusConfig[selectedOrder.status].label}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-muted" />
                                    <span className="text-sm text-secondary">{selectedOrder.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-muted" />
                                    <span className="text-sm text-secondary">{selectedOrder.phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-muted" />
                                    <span className="text-sm text-secondary">{selectedOrder.date}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-xs text-muted uppercase mb-2">Interested In</p>
                                <p className="text-accent font-semibold">{selectedOrder.carInterested}</p>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-xs text-muted uppercase mb-2">Message</p>
                                <p className="text-secondary">{selectedOrder.message}</p>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-xs text-muted uppercase mb-3">Update Status</p>
                                <div className="flex flex-wrap gap-2">
                                    {(['new', 'in_progress', 'completed', 'cancelled'] as const).map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedOrder.status === s
                                                ? 'bg-accent text-primary border-accent'
                                                : 'bg-white/5 text-muted border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <a
                                    href={`https://wa.me/${selectedOrder.phone.replace(/\s+/g, "").replace("+", "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                                >
                                    <MessageSquare size={18} />
                                    Reply on WhatsApp
                                </a>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="btn-outline"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
