"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCard from "@/components/admin/StatsCard";
import ChartCard, { PeriodSelector, SimpleBarChart, SimpleDonutChart } from "@/components/admin/ChartCard";
import { cars } from "@/data/cars";
import {
    DollarSign,
    Car,
    Users,
    TrendingUp,
    Eye,
    MessageSquare,
    Clock,
    ArrowUpRight,
    Loader2
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import API_BASE_URL from "@/config/api";

// Category data will be calculated dynamically from the fetched cars

export default function AdminDashboard() {
    const { token } = useAuth();
    const [revenuePeriod, setRevenuePeriod] = useState("7d");
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>({
        totalCars: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalViews: 0,
        recentActivities: [],
        topCars: [],
        revenueData: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const headers = { 'Authorization': `Bearer ${token}` };

                const [carsRes, ordersRes, customersRes, analyticsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/cars`),
                    fetch(`${API_BASE_URL}/api/orders`, { headers }),
                    fetch(`${API_BASE_URL}/api/orders/customers`, { headers }),
                    fetch(`${API_BASE_URL}/api/analytics/stats`, { headers })
                ]);

                const [carsData, ordersData, customersData, analyticsData] = await Promise.all([
                    carsRes.json(),
                    ordersRes.json(),
                    customersRes.json(),
                    analyticsRes.json()
                ]);

                // Map recent activities from orders
                const activities = ordersData.slice(0, 4).map((order: any) => ({
                    id: order._id,
                    type: "inquiry",
                    message: order.car
                        ? `New inquiry for ${order.car.brand} ${order.car.name}`
                        : `New inquiry for a recently removed vehicle`,
                    time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));

                // Calculate category distribution
                const categories = carsData.reduce((acc: any, car: any) => {
                    acc[car.category] = (acc[car.category] || 0) + 1;
                    return acc;
                }, {});

                const total = carsData.length;
                const colors = ["#D4AF37", "#22C55E", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"];
                const dynamicCategoryData = Object.keys(categories).map((cat, idx) => ({
                    label: cat,
                    value: Math.round((categories[cat] / total) * 100),
                    color: colors[idx % colors.length]
                }));

                setDashboardData({
                    totalCars: carsData.length,
                    totalOrders: ordersData.length,
                    totalCustomers: customersData.length,
                    totalViews: analyticsData.totalViews || 0,
                    recentActivities: activities,
                    topCars: carsData.sort((a: any, b: any) => (b.views || 0) - (a.views || 0)).slice(0, 4),
                    revenueData: analyticsData.viewsPerDay?.map((day: any) => ({
                        label: day._id.split('-').slice(2).join('/'),
                        value: day.count
                    })) || [],
                    categoryData: dynamicCategoryData
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6">
                <Loader2 className="w-12 h-12 animate-spin text-accent mb-4" />
                <p className="text-secondary font-medium">Synchronizing your dashboard...</p>
            </div>
        );
    }

    const { totalCars, totalOrders, totalCustomers, totalViews, recentActivities, topCars, revenueData, categoryData } = dashboardData;

    return (
        <div className="min-h-screen bg-primary">
            <AdminHeader
                title="Dashboard Overview"
                subtitle="Welcome back, Admin"
            />

            <main className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Views"
                        value={totalViews.toLocaleString()}
                        change={12.5}
                        icon={<Eye size={24} />}
                        color="blue"
                    />
                    <StatsCard
                        title="Cars in Stock"
                        value={totalCars.toString()}
                        change={-2}
                        icon={<Car size={24} />}
                        color="gold"
                    />
                    <StatsCard
                        title="Total Inquiries"
                        value={totalOrders.toString()}
                        change={8.3}
                        icon={<MessageSquare size={24} />}
                        color="green"
                    />
                    <StatsCard
                        title="Total Customers"
                        value={totalCustomers.toString()}
                        change={3.2}
                        icon={<Users size={24} />}
                        color="gold"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart - Takes 2 columns */}
                    <div className="lg:col-span-2">
                        <ChartCard
                            title="Revenue Overview"
                            subtitle="Monthly revenue trends"
                            action={
                                <PeriodSelector
                                    periods={["7d", "30d", "90d"]}
                                    selected={revenuePeriod}
                                    onChange={setRevenuePeriod}
                                />
                            }
                        >
                            <SimpleBarChart data={revenueData} height={220} />
                        </ChartCard>
                    </div>

                    {/* Category Distribution */}
                    <ChartCard title="Vehicle Categories" subtitle="Stock distribution">
                        <div className="flex flex-col items-center">
                            <SimpleDonutChart
                                data={categoryData || []}
                                size={160}
                                centerValue={`${totalCars}`}
                                centerLabel="Total Cars"
                            />
                            {/* Legend */}
                            <div className="grid grid-cols-2 gap-3 mt-6 w-full">
                                {categoryData?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-xs text-muted">{item.label}</span>
                                        <span className="text-xs font-semibold text-secondary ml-auto">
                                            {item.value}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ChartCard>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-secondary">Recent Activity</h3>
                            <button className="text-xs text-accent hover:underline flex items-center gap-1">
                                View All <ArrowUpRight size={12} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentActivities.map((activity: any) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.type === "inquiry"
                                            ? "bg-accent/10 text-accent"
                                            : activity.type === "view"
                                                ? "bg-blue-500/10 text-blue-500"
                                                : activity.type === "customer"
                                                    ? "bg-green-500/10 text-green-500"
                                                    : "bg-purple-500/10 text-purple-500"
                                            }`}
                                    >
                                        {activity.type === "inquiry" && <MessageSquare size={18} />}
                                        {activity.type === "view" && <Eye size={18} />}
                                        {activity.type === "customer" && <Users size={18} />}
                                        {activity.type === "sale" && <DollarSign size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-secondary">{activity.message}</p>
                                        <div className="flex items-center gap-1 mt-1 text-xs text-muted">
                                            <Clock size={12} />
                                            {activity.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Performing Cars */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-secondary">Top Performing Cars</h3>
                            <button className="text-xs text-accent hover:underline flex items-center gap-1">
                                View Inventory <ArrowUpRight size={12} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {topCars.map((car, idx) => (
                                <div
                                    key={car._id}
                                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    {/* Rank */}
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${idx === 0 ? "bg-accent text-primary" : "bg-white/10 text-muted"
                                        }`}>
                                        #{idx + 1}
                                    </div>

                                    {/* Car Image */}
                                    <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                                        <Image
                                            src={car.images[0]}
                                            alt={car.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Car Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-secondary truncate">
                                            {car.name}
                                        </p>
                                        <p className="text-xs text-muted">{car.model}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-accent">{car.price}</p>
                                        <p className="text-xs text-muted flex items-center gap-1 justify-end">
                                            <Eye size={10} /> {car.views || 0} views
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-secondary mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <button className="btn-primary flex items-center gap-2">
                            <Car size={18} />
                            Add New Car
                        </button>
                        <button className="btn-outline flex items-center gap-2">
                            <MessageSquare size={18} />
                            View Inquiries
                        </button>
                        <button className="btn-outline flex items-center gap-2">
                            <Users size={18} />
                            Manage Customers
                        </button>
                        <button className="btn-outline flex items-center gap-2">
                            <TrendingUp size={18} />
                            View Analytics
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
