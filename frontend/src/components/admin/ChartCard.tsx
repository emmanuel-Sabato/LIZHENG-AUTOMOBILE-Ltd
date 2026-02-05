"use client";

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}

const ChartCard = ({ title, subtitle, children, action }: ChartCardProps) => {
    return (
        <div className="glass-card p-6 h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-secondary">{title}</h3>
                    {subtitle && (
                        <p className="text-sm text-muted mt-0.5">{subtitle}</p>
                    )}
                </div>
                {action && (
                    <div className="flex items-center gap-2">
                        {action}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

// Period Selector Component
interface PeriodSelectorProps {
    periods: string[];
    selected: string;
    onChange: (period: string) => void;
}

export const PeriodSelector = ({ periods, selected, onChange }: PeriodSelectorProps) => {
    return (
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
            {periods.map((period) => (
                <button
                    key={period}
                    onClick={() => onChange(period)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${selected === period
                        ? "bg-accent text-primary"
                        : "text-muted hover:text-secondary"
                        }`}
                >
                    {period}
                </button>
            ))}
        </div>
    );
};

// Simple Bar Chart Component (no external dependencies)
interface BarChartData {
    label: string;
    value: number;
}

interface SimpleBarChartProps {
    data: BarChartData[];
    height?: number;
}

export const SimpleBarChart = ({ data, height = 200 }: SimpleBarChartProps) => {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className="flex items-end justify-between gap-2" style={{ height }}>
            {data.map((item, index) => {
                const barHeight = (item.value / maxValue) * 100;
                return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        {/* Bar */}
                        <div className="w-full relative flex items-end justify-center" style={{ height: height - 30 }}>
                            <div
                                className="w-full max-w-[40px] bg-gradient-to-t from-accent/80 to-accent rounded-t-lg transition-all duration-500 hover:from-accent hover:to-accent/80"
                                style={{ height: `${barHeight}%` }}
                            >
                                {/* Value tooltip on hover */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-semibold text-accent bg-surface px-2 py-1 rounded">
                                        {item.value}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Label */}
                        <span className="text-[10px] text-muted font-medium">{item.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

// Donut Chart Component
interface DonutData {
    label: string;
    value: number;
    color: string;
}

interface SimpleDonutChartProps {
    data: DonutData[];
    size?: number;
    centerLabel?: string;
    centerValue?: string;
}

export const SimpleDonutChart = ({ data, size = 160, centerLabel, centerValue }: SimpleDonutChartProps) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = -90;

    const createArc = (startAngle: number, endAngle: number, color: string) => {
        const start = polarToCartesian(size / 2, size / 2, (size - 20) / 2, endAngle);
        const end = polarToCartesian(size / 2, size / 2, (size - 20) / 2, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

        return (
            <path
                d={`M ${start.x} ${start.y} A ${(size - 20) / 2} ${(size - 20) / 2} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`}
                fill="none"
                stroke={color}
                strokeWidth="16"
                strokeLinecap="round"
                className="transition-all duration-500"
            />
        );
    };

    function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
        const rad = (angle * Math.PI) / 180;
        // Round to 2 decimal places to avoid hydration mismatch from floating-point precision
        return {
            x: Math.round((cx + r * Math.cos(rad)) * 100) / 100,
            y: Math.round((cy + r * Math.sin(rad)) * 100) / 100,
        };
    }

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                {data.map((item, index) => {
                    const angle = (item.value / total) * 360;
                    const arc = createArc(currentAngle, currentAngle + angle, item.color);
                    currentAngle += angle;
                    return <g key={index}>{arc}</g>;
                })}
            </svg>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {centerValue && (
                    <span className="text-2xl font-bold text-secondary">{centerValue}</span>
                )}
                {centerLabel && (
                    <span className="text-xs text-muted">{centerLabel}</span>
                )}
            </div>
        </div>
    );
};

export default ChartCard;
