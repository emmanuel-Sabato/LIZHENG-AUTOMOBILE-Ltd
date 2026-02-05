"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ChartCard, { PeriodSelector, SimpleBarChart, SimpleDonutChart } from "@/components/admin/ChartCard";
import { cars } from "@/data/cars";
import {
    TrendingUp,
    TrendingDown,
    Eye,
    MousePointer,
    DollarSign,
    Car,
    Users,
    Clock,
    ArrowUpRight,
    Globe,
    Smartphone,
    Monitor,
} from "lucide-react";

// Mock analytics data
const monthlyViews = [
    { label: "Jan", value: 1250 },
    { label: "Feb", value: 1480 },
    { label: "Mar", value: 980 },
    { label: "Apr", value: 1890 },
    { label: "May", value: 1650 },
    { label: "Jun", value: 2100 },
    { label: "Jul", value: 1920 },
];

const trafficSources = [
    { label: "Direct", value: 35, color: "#D4AF37" },
    { label: "WhatsApp", value: 28, color: "#25D366" },
    { label: "Facebook", value: 22, color: "#1877F2" },
    { label: "Google", value: 15, color: "#EA4335" },
];

const deviceData = [
    { label: "Mobile", value: 58, color: "#8B5CF6" },
    { label: "Desktop", value: 35, color: "#3B82F6" },
    { label: "Tablet", value: 7, color: "#22C55E" },
];

// Static data to avoid hydration mismatch
const carViewsData = [
    { views: 487, inquiries: 28 },
    { views: 392, inquiries: 19 },
    { views: 315, inquiries: 15 },
    { views: 254, inquiries: 12 },
    { views: 189, inquiries: 8 },
];

const topViewedCars = cars.slice(0, 5).map((car, idx) => ({
    ...car,
    views: carViewsData[idx].views,
    inquiries: carViewsData[idx].inquiries,
    rank: idx + 1,
}));

export default function AnalyticsPage() {
    const [period, setPeriod] = useState("30d");

    const statsCards = [
        { label: "Total Views", value: "12,458", change: 12, icon: <Eye size={20} />, color: "text-blue-500" },
        { label: "Unique Visitors", value: "4,832", change: 8, icon: <Users size={20} />, color: "text-green-500" },
        { label: "Avg. Time on Site", value: "3m 42s", change: -2, icon: <Clock size={20} />, color: "text-purple-500" },
        { label: "Conversion Rate", value: "4.8%", change: 15, icon: <MousePointer size={20} />, color: "text-accent" },
    ];

    return (
        <div className="min-h-screen bg-primary">
            <AdminHeader
                title="Analytics & Insights"
                subtitle="Track your performance"
            />

            <main className="p-6 space-y-6">
                {/* Period Selector */}
                <div className="flex justify-end">
                    <PeriodSelector
                        periods={["7d", "30d", "90d", "1y"]}
                        selected={period}
                        onChange={setPeriod}
                    />
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsCards.map((stat, idx) => (
                        <div key={idx} className="glass-card p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${stat.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                                    {stat.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {stat.change >= 0 ? "+" : ""}{stat.change}%
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-secondary">{stat.value}</p>
                            <p className="text-sm text-muted">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Views Chart */}
                    <div className="lg:col-span-2">
                        <ChartCard title="Page Views" subtitle="Monthly traffic trends">
                            <SimpleBarChart data={monthlyViews} height={240} />
                        </ChartCard>
                    </div>

                    {/* Traffic Sources */}
                    <ChartCard title="Traffic Sources" subtitle="Where visitors come from">
                        <div className="flex flex-col items-center">
                            <SimpleDonutChart
                                data={trafficSources}
                                size={140}
                                centerValue="100%"
                                centerLabel="Total"
                            />
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-6 w-full">
                                {trafficSources.map((item, idx) => (
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

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Viewed Cars */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-secondary">Top Viewed Cars</h3>
                            <button className="text-xs text-accent hover:underline flex items-center gap-1">
                                View All <ArrowUpRight size={12} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {topViewedCars.map((car) => (
                                <div key={car.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${car.rank === 1 ? "bg-accent text-primary" :
                                        car.rank === 2 ? "bg-gray-400 text-primary" :
                                            car.rank === 3 ? "bg-amber-700 text-white" :
                                                "bg-white/10 text-muted"
                                        }`}>
                                        #{car.rank}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-secondary truncate">{car.name}</p>
                                        <p className="text-xs text-muted">{car.model}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-secondary flex items-center gap-1">
                                            <Eye size={12} className="text-muted" /> {car.views}
                                        </p>
                                        <p className="text-xs text-muted">{car.inquiries} inquiries</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Device Breakdown */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-secondary mb-6">Device Breakdown</h3>
                        <div className="flex items-center gap-8">
                            <SimpleDonutChart
                                data={deviceData}
                                size={140}
                                centerValue="58%"
                                centerLabel="Mobile"
                            />
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <Smartphone size={20} className="text-purple-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-secondary">Mobile</p>
                                        <p className="text-xs text-muted">58% of traffic</p>
                                    </div>
                                    <span className="text-lg font-bold text-secondary">58%</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <Monitor size={20} className="text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-secondary">Desktop</p>
                                        <p className="text-xs text-muted">35% of traffic</p>
                                    </div>
                                    <span className="text-lg font-bold text-secondary">35%</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                        <Globe size={20} className="text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-secondary">Tablet</p>
                                        <p className="text-xs text-muted">7% of traffic</p>
                                    </div>
                                    <span className="text-lg font-bold text-secondary">7%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
