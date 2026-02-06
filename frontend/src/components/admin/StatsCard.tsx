"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon: React.ReactNode;
    color?: "gold" | "green" | "red" | "blue";
}

const colorStyles = {
    gold: {
        iconBg: "bg-accent/10",
        iconColor: "text-accent",
        glow: "shadow-accent/20",
    },
    green: {
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-500",
        glow: "shadow-emerald-500/20",
    },
    red: {
        iconBg: "bg-red-500/10",
        iconColor: "text-red-500",
        glow: "shadow-red-500/20",
    },
    blue: {
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-500",
        glow: "shadow-blue-500/20",
    },
};

const StatsCard = ({
    title,
    value,
    change = 0,
    changeLabel = "vs last month",
    icon,
    color = "gold",
}: StatsCardProps) => {
    const [displayValue, setDisplayValue] = useState(0);
    const styles = colorStyles[color];

    // Animate number counting only on client side
    useEffect(() => {
        const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value;
        if (isNaN(numericValue)) {
            return;
        }

        const duration = 1500;
        const steps = 60;
        const targetValue = numericValue;
        const increment = targetValue / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                setDisplayValue(numericValue);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    const formatValue = () => {
        // Use a fixed locale 'en-US' to avoid hydration mismatch across different environments
        const localeString = displayValue.toLocaleString("en-US");

        if (typeof value === "string") {
            if (value.startsWith("$")) {
                return `$${localeString}`;
            }
            if (value.endsWith("%")) {
                return `${displayValue}%`;
            }
            return localeString;
        }
        return localeString;
    };

    const getTrendIcon = () => {
        if (change > 0) return <TrendingUp size={14} className="text-emerald-500" />;
        if (change < 0) return <TrendingDown size={14} className="text-red-500" />;
        return <Minus size={14} className="text-muted" />;
    };

    const getTrendColor = () => {
        if (change > 0) return "text-emerald-500";
        if (change < 0) return "text-red-500";
        return "text-muted";
    };

    return (
        <div className="glass-card p-6 hover:border-white/20 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                {/* Icon */}
                <div
                    className={`w-12 h-12 rounded-xl ${styles.iconBg} ${styles.iconColor} flex items-center justify-center shadow-lg ${styles.glow} group-hover:scale-110 transition-transform`}
                >
                    {icon}
                </div>

                {/* Trend */}
                <div className="flex items-center gap-1">
                    {getTrendIcon()}
                    <span className={`text-sm font-semibold ${getTrendColor()}`}>
                        {change > 0 ? "+" : ""}{change}%
                    </span>
                </div>
            </div>

            {/* Value */}
            <div className="mb-1">
                <span className="text-3xl font-bold text-secondary tracking-tight">
                    {formatValue()}
                </span>
            </div>

            {/* Title & Change Label */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{title}</span>
                <span className="text-xs text-muted/60">{changeLabel}</span>
            </div>

            {/* Subtle Bottom Accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-${color === 'gold' ? 'accent' : color}-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
        </div>
    );
};

export default StatsCard;
