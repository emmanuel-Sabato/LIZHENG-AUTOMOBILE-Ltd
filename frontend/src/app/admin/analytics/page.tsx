"use client";

import { useState, useEffect } from "react";
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
    Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import API_BASE_URL from "@/config/api";

const trafficSources = [
    { label: "Direct", value: 35, color: "#D4AF37" },
    { label: "WhatsApp", value: 28, color: "#25D366" },
    { label: "Facebook", value: 22, color: "#1877F2" },
    { label: "Google", value: 15, color: "#EA4335" },
];

const monthlyViews = [
    { label: "Jan", value: 1250 },
    { label: "Feb", value: 1480 },
    { label: "Mar", value: 980 },
    { label: "Apr", value: 1890 },
    { label: "May", value: 1650 },
    { label: "Jun", value: 2100 },
    { label: "Jul", value: 1920 },
];

export default function AnalyticsPage() {
    const { token } = useAuth();
    const [period, setPeriod] = useState("30d");
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState<any>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/analytics/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setAnalyticsData(data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchAnalytics();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6">
                <Loader2 className="w-12 h-12 animate-spin text-accent mb-4" />
                <p className="text-secondary font-medium">Loading analytics intelligence...</p>
            </div>
        );
    }

    const topViewedCars = (analyticsData?.topCars || []).map((car: any, idx: number) => ({
        ...car,
        rank: idx + 1,
    }));

    const statsCards = [
        { label: "Total Views", value: analyticsData?.totalViews?.toLocaleString() || "0", change: 12, icon: <Eye size={20} />, color: "text-blue-500" },
        { label: "Unique Visitors", value: analyticsData?.uniqueVisitors?.toLocaleString() || "0", change: 8, icon: <Users size={20} />, color: "text-green-500" },
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
                        <ChartCard title="Page Views" subtitle="Daily traffic trends">
                            <SimpleBarChart
                                data={analyticsData?.viewsPerDay?.map((day: any) => ({
                                    label: day._id.split('-').slice(1).join('/'),
                                    value: day.count
                                })) || monthlyViews}
                                height={240}
                            />
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
                            {topViewedCars.map((car: any) => (
                                <div key={car._id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
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
                                data={[
                                    { label: "Mobile", value: analyticsData?.deviceBreakdown?.Mobile || 0, color: "#8B5CF6" },
                                    { label: "Desktop", value: analyticsData?.deviceBreakdown?.Desktop || 0, color: "#3B82F6" },
                                    { label: "Tablet", value: analyticsData?.deviceBreakdown?.Tablet || 0, color: "#22C55E" },
                                ]}
                                size={140}
                                centerValue={`${Math.round((analyticsData?.deviceBreakdown?.Mobile / analyticsData?.totalViews) * 100) || 0}%`}
                                centerLabel="Mobile"
                            />
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <Smartphone size={20} className="text-purple-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-secondary">Mobile</p>
                                        <p className="text-xs text-muted">{analyticsData?.deviceBreakdown?.Mobile || 0} views</p>
                                    </div>
                                    <span className="text-lg font-bold text-secondary">{Math.round((analyticsData?.deviceBreakdown?.Mobile / analyticsData?.totalViews) * 100) || 0}%</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <Monitor size={20} className="text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-secondary">Desktop</p>
                                        <p className="text-xs text-muted">{analyticsData?.deviceBreakdown?.Desktop || 0} views</p>
                                    </div>
                                    <span className="text-lg font-bold text-secondary">{Math.round((analyticsData?.deviceBreakdown?.Desktop / analyticsData?.totalViews) * 100) || 0}%</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                        <Globe size={20} className="text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-secondary">Tablet</p>
                                        <p className="text-xs text-muted">{analyticsData?.deviceBreakdown?.Tablet || 0} views</p>
                                    </div>
                                    <span className="text-lg font-bold text-secondary">{Math.round((analyticsData?.deviceBreakdown?.Tablet / analyticsData?.totalViews) * 100) || 0}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
