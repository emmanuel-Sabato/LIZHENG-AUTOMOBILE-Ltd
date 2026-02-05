"use client";

import { useState } from "react";
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
} from "lucide-react";
import Image from "next/image";

// Mock data for charts
const revenueData = [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 52 },
    { label: "Mar", value: 38 },
    { label: "Apr", value: 65 },
    { label: "May", value: 48 },
    { label: "Jun", value: 72 },
    { label: "Jul", value: 58 },
];

const categoryData = [
    { label: "SUV", value: 40, color: "#D4AF37" },
    { label: "Sedan", value: 25, color: "#22C55E" },
    { label: "Truck", value: 20, color: "#3B82F6" },
    { label: "Electric", value: 15, color: "#8B5CF6" },
];

const recentActivities = [
    { id: 1, type: "inquiry", message: "New inquiry for Toyota Camry", time: "5 min ago" },
    { id: 2, type: "view", message: "Lexus IS viewed 50 times today", time: "1 hour ago" },
    { id: 3, type: "customer", message: "New customer: John Doe", time: "2 hours ago" },
    { id: 4, type: "sale", message: "Toyota Highlander marked as sold", time: "5 hours ago" },
];

const topCars = cars.slice(0, 4);
const carViews = [87, 62, 45, 38]; // Static view counts to avoid hydration mismatch

export default function AdminDashboard() {
    const [revenuePeriod, setRevenuePeriod] = useState("7d");

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
                        title="Total Revenue"
                        value="$285,400"
                        change={12.5}
                        icon={<DollarSign size={24} />}
                        color="gold"
                    />
                    <StatsCard
                        title="Cars in Stock"
                        value={cars.length.toString()}
                        change={-2}
                        icon={<Car size={24} />}
                        color="blue"
                    />
                    <StatsCard
                        title="Total Customers"
                        value="1,248"
                        change={8.3}
                        icon={<Users size={24} />}
                        color="green"
                    />
                    <StatsCard
                        title="Conversion Rate"
                        value="24%"
                        change={3.2}
                        icon={<TrendingUp size={24} />}
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
                                data={categoryData}
                                size={160}
                                centerValue={`${cars.length}`}
                                centerLabel="Total Cars"
                            />
                            {/* Legend */}
                            <div className="grid grid-cols-2 gap-3 mt-6 w-full">
                                {categoryData.map((item, idx) => (
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
                            {recentActivities.map((activity) => (
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
                                    key={car.id}
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
                                            <Eye size={10} /> {carViews[idx]} views
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
