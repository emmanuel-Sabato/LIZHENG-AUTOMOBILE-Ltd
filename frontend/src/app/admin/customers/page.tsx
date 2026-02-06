"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
    Search,
    UserPlus,
    Mail,
    Phone,
    Calendar,
    MessageSquare,
    MoreVertical,
    ExternalLink,
    MapPin,
} from "lucide-react";

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    totalInquiries: number;
    lastContact: string;
    status: "active" | "potential" | "converted";
    joinedDate: string;
}

const mockCustomers: Customer[] = [
    {
        id: "CUS-001",
        name: "Jean Pierre Habimana",
        email: "jean.pierre@gmail.com",
        phone: "+250 788 123 456",
        location: "Kigali, Rwanda",
        totalInquiries: 5,
        lastContact: "2024-02-05",
        status: "active",
        joinedDate: "2024-01-15",
    },
    {
        id: "CUS-002",
        name: "Marie Claire Uwamahoro",
        email: "marie.claire@outlook.com",
        phone: "+250 788 234 567",
        location: "Kigali, Rwanda",
        totalInquiries: 3,
        lastContact: "2024-02-04",
        status: "converted",
        joinedDate: "2023-12-20",
    },
    {
        id: "CUS-003",
        name: "Emmanuel Nsengiyumva",
        email: "emmanuel.n@yahoo.com",
        phone: "+250 788 345 678",
        location: "Musanze, Rwanda",
        totalInquiries: 2,
        lastContact: "2024-02-03",
        status: "potential",
        joinedDate: "2024-01-25",
    },
    {
        id: "CUS-004",
        name: "Grace Ingabire",
        email: "grace.i@business.rw",
        phone: "+250 788 456 789",
        location: "Kigali, Rwanda",
        totalInquiries: 8,
        lastContact: "2024-02-05",
        status: "active",
        joinedDate: "2023-11-10",
    },
    {
        id: "CUS-005",
        name: "Patrick Mugisha",
        email: "patrick.m@company.com",
        phone: "+250 788 567 890",
        location: "Rubavu, Rwanda",
        totalInquiries: 1,
        lastContact: "2024-02-01",
        status: "potential",
        joinedDate: "2024-02-01",
    },
    {
        id: "CUS-006",
        name: "Diane Kayitesi",
        email: "diane.k@gmail.com",
        phone: "+250 788 678 901",
        location: "Huye, Rwanda",
        totalInquiries: 4,
        lastContact: "2024-01-28",
        status: "converted",
        joinedDate: "2023-10-05",
    },
];

const statusConfig = {
    active: { label: "Active", color: "bg-blue-500/10 text-blue-500" },
    potential: { label: "Potential", color: "bg-amber-500/10 text-amber-500" },
    converted: { label: "Converted", color: "bg-green-500/10 text-green-500" },
};

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchCustomers = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch("http://localhost:5001/api/orders/customers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                const mappedCustomers = data.map((c: any) => ({
                    id: c._id.substring(c._id.length - 8).toUpperCase(),
                    name: c.name,
                    email: c.email,
                    phone: c.phone,
                    location: c.location,
                    totalInquiries: c.totalInquiries || 0,
                    lastContact: new Date(c.lastContact || c.updatedAt).toLocaleDateString(),
                    status: (c.totalInquiries > 2 ? "active" : c.totalInquiries > 0 ? "potential" : "converted") as any,
                    joinedDate: new Date(c.createdAt).toLocaleDateString(),
                }));
                setCustomers(mappedCustomers);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase());

        if (statusFilter === "all") return matchesSearch;
        return matchesSearch && customer.status === statusFilter;
    });

    return (
        <div className="min-h-screen bg-primary">
            <AdminHeader
                title="Customer Management"
                subtitle={`${customers.length} registered customers`}
            />

            <main className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="glass-card p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <UserPlus size={24} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-secondary">{customers.length}</p>
                            <p className="text-sm text-muted">Total Customers</p>
                        </div>
                    </div>
                    <div className="glass-card p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <MessageSquare size={24} className="text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-secondary">
                                {customers.reduce((sum, c) => sum + c.totalInquiries, 0)}
                            </p>
                            <p className="text-sm text-muted">Total Inquiries</p>
                        </div>
                    </div>
                    <div className="glass-card p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Calendar size={24} className="text-accent" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-secondary">
                                {customers.filter((c) => c.status === "converted").length}
                            </p>
                            <p className="text-sm text-muted">Converted</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-surface rounded-xl border border-white/5 focus-within:border-accent/30 transition-colors flex-1 sm:max-w-sm">
                        <Search size={18} className="text-muted" />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-sm text-secondary placeholder:text-muted outline-none w-full"
                        />
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-surface rounded-xl">
                        {["all", "active", "potential", "converted"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${statusFilter === status
                                    ? "bg-accent text-primary"
                                    : "text-muted hover:text-secondary"
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Customer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCustomers.map((customer) => (
                        <div key={customer.id} className="glass-card p-5 hover:border-white/20 transition-all">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-primary font-bold text-lg">
                                        {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-secondary">{customer.name}</h3>
                                        <p className="text-xs text-muted">{customer.id}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[customer.status].color}`}>
                                    {statusConfig[customer.status].label}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail size={14} className="text-muted" />
                                    <span className="text-muted truncate">{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone size={14} className="text-muted" />
                                    <span className="text-muted">{customer.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin size={14} className="text-muted" />
                                    <span className="text-muted">{customer.location}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 py-3 border-t border-white/5">
                                <div className="flex-1 text-center">
                                    <p className="text-lg font-bold text-secondary">{customer.totalInquiries}</p>
                                    <p className="text-xs text-muted">Inquiries</p>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="flex-1 text-center">
                                    <p className="text-sm font-semibold text-secondary">{customer.lastContact}</p>
                                    <p className="text-xs text-muted">Last Contact</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                <a
                                    href={`https://wa.me/${customer.phone.replace(/\s+/g, "").replace("+", "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-2 px-3 rounded-lg bg-green-500/10 text-green-500 text-sm font-medium text-center hover:bg-green-500/20 transition-colors"
                                >
                                    WhatsApp
                                </a>
                                <a
                                    href={`mailto:${customer.email}`}
                                    className="flex-1 py-2 px-3 rounded-lg bg-blue-500/10 text-blue-500 text-sm font-medium text-center hover:bg-blue-500/20 transition-colors"
                                >
                                    Email
                                </a>
                                <button className="py-2 px-3 rounded-lg bg-white/5 text-muted text-sm hover:bg-white/10 transition-colors">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCustomers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted">No customers found</p>
                    </div>
                )}
            </main>
        </div>
    );
}
