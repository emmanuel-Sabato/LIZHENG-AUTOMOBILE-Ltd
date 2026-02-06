"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
    TrendingUp,
    Users,
    Car,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Download
} from "lucide-react";
import API_BASE_URL from "@/config/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from "recharts";

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

export default function ReportsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                // Fetch stats from existing endpoints as a placeholder or create a new one
                // For now, we'll combine data from cars, orders, and customers
                const token = localStorage.getItem("adminToken");
                const [carsRes, ordersRes, customersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/cars`),
                    fetch(`${API_BASE_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/orders/customers`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                const cars = await carsRes.json();
                const orders = await ordersRes.json();
                const customers = await customersRes.json();

                // Process data for charts
                const categoryData = Object.entries(
                    cars.reduce((acc: any, car: any) => {
                        acc[car.category] = (acc[car.category] || 0) + 1;
                        return acc;
                    }, {})
                ).map(([name, value]) => ({ name, value }));

                const statusData = Object.entries(
                    customers.reduce((acc: any, cust: any) => {
                        acc[cust.status || 'Potential'] = (acc[cust.status || 'Potential'] || 0) + 1;
                        return acc;
                    }, {})
                ).map(([name, value]) => ({ name, value }));

                // Last 7 days inquiries trend
                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return d.toISOString().split('T')[0];
                });

                const inquiriesTrend = last7Days.map(date => ({
                    date: new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
                    count: orders.filter((o: any) => o.createdAt.split('T')[0] === date).length
                }));

                setStats({
                    totalCars: cars.length,
                    totalValue: cars.reduce((sum: any, car: any) => sum + (parseFloat(car.price?.replace(/[^0-9.]/g, '') || "0")), 0),
                    totalCustomers: customers.length,
                    totalInquiries: orders.length,
                    categoryData,
                    statusData,
                    inquiriesTrend
                });
            } catch (error) {
                console.error("Error fetching report data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReportData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-secondary animate-pulse font-bold">Generating Reports...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            <AdminHeader
                title="Business Reports"
                subtitle="Detailed overview of your performance and inventory"
            />

            <main className="p-6 space-y-6">
                {/* Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Inventory Value", value: `$${(stats.totalValue / 1000000).toFixed(1)}M`, icon: <DollarSign className="text-emerald-500" />, trend: "+12%", up: true },
                        { label: "Total Customers", value: stats.totalCustomers, icon: <Users className="text-blue-500" />, trend: "+5%", up: true },
                        { label: "Active Inquiries", value: stats.totalInquiries, icon: <TrendingUp className="text-purple-500" />, trend: "-2%", up: false },
                        { label: "Stock Units", value: stats.totalCars, icon: <Car className="text-accent" />, trend: "Optimal", up: true },
                    ].map((item, idx) => (
                        <div key={idx} className="glass-card p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-lg bg-white/5">{item.icon}</div>
                                <div className={`flex items-center gap-1 text-xs font-bold ${item.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {item.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {item.trend}
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-secondary">{item.value}</p>
                            <p className="text-xs text-muted font-medium uppercase tracking-wider mt-1">{item.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Inquiries Trend */}
                    <div className="lg:col-span-2 glass-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-secondary">Inquiries Trend (Last 7 Days)</h3>
                            <button className="p-2 rounded-lg bg-white/5 text-muted hover:text-secondary hover:bg-white/10 transition-all">
                                <Download size={16} />
                            </button>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.inquiriesTrend}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                                        itemStyle={{ color: '#8b5cf6' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#8B5CF6"
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Customer Status Breakdown */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-secondary mb-6">Customer Funnel</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.statusData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3 mt-4">
                            {stats.statusData.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                        <span className="text-sm text-muted">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-secondary">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Category Distribution */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-secondary mb-6">Inventory by Category</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#ffffff05' }}
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {stats.categoryData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="glass-card p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-secondary mb-6">Operational Efficiency</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-muted">Lead Response Time</span>
                                        <span className="text-sm font-bold text-accent">1.2h Average</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-accent w-[85%] rounded-full" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-muted">Conversion Rate</span>
                                        <span className="text-sm font-bold text-emerald-500">24% Total</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[72%] rounded-full" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-muted">Customer Satisfaction</span>
                                        <span className="text-sm font-bold text-blue-500">4.8 / 5.0</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[94%] rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 p-4 rounded-xl bg-accent/5 border border-accent/10">
                            <p className="text-xs text-secondary/80 italic">
                                "Tip: Your SUV category is performing 20% higher than average this month. Consider increasing stock for similar models."
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
