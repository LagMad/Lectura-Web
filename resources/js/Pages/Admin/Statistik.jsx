import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import { Users, Eye, Calendar, TrendingUp } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Statistik({
    monthlyStats = [],
    todayVisitors = 0,
    thisMonthVisitors = 0,
}) {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        monthlyStats: monthlyStats,
        todayVisitors: todayVisitors,
        thisMonthVisitors: thisMonthVisitors,
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const refreshStats = async () => {
        setLoading(true);
        try {
            const response = await fetch("/statistik/api/visitor-stats");
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto refresh setiap 5 menit
    useEffect(() => {
        const interval = setInterval(refreshStats, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, description }) => (
        <div
            className="bg-white rounded-lg shadow-md p-6 border-l-4"
            style={{ borderLeftColor: color }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {value.toLocaleString()}
                    </p>
                    {description && (
                        <p className="text-gray-500 text-xs mt-1">
                            {description}
                        </p>
                    )}
                </div>
                <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: color + "20" }}
                >
                    <Icon size={24} style={{ color: color }} />
                </div>
            </div>
        </div>
    );

    const totalVisitors = stats.monthlyStats.reduce(
        (sum, month) => sum + month.unique_visitors,
        0
    );
    const averageMonthly =
        totalVisitors / Math.max(stats.monthlyStats.length, 1);

    return (
        <AdminLayout
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
        >
            <div className="min-h-screen bg-gray-50 p-6 w-full">
                <div className="w-full">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Statistik Pengunjung Website
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Monitor aktivitas pengunjung website Anda
                                </p>
                            </div>
                            <button
                                onClick={refreshStats}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <TrendingUp size={16} />
                                {loading ? "Memuat..." : "Refresh"}
                            </button>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            title="Pengunjung Hari Ini"
                            value={stats.todayVisitors}
                            icon={Users}
                            color="#3B82F6"
                            description="Pengunjung unik hari ini"
                        />
                        <StatCard
                            title="Pengunjung Bulan Ini"
                            value={stats.thisMonthVisitors}
                            icon={Calendar}
                            color="#10B981"
                            description="Pengunjung unik bulan ini"
                        />
                        <StatCard
                            title="Rata-rata Bulanan"
                            value={Math.round(averageMonthly)}
                            icon={Eye}
                            color="#F59E0B"
                            description="Rata-rata pengunjung per bulan"
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Pengunjung Bulanan (Bar Chart)
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.monthlyStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month_name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                    />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            value.toLocaleString(),
                                            name === "unique_visitors"
                                                ? "Pengunjung Unik"
                                                : "Total Kunjungan",
                                        ]}
                                    />
                                    <Legend
                                        formatter={(value) =>
                                            value === "unique_visitors"
                                                ? "Pengunjung Unik"
                                                : "Total Kunjungan"
                                        }
                                    />
                                    <Bar
                                        dataKey="unique_visitors"
                                        fill="#3B82F6"
                                        name="unique_visitors"
                                    />
                                    <Bar
                                        dataKey="total_visits"
                                        fill="#10B981"
                                        name="total_visits"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Line Chart */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Tren Pengunjung (Line Chart)
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={stats.monthlyStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month_name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                    />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            value.toLocaleString(),
                                            name === "unique_visitors"
                                                ? "Pengunjung Unik"
                                                : "Total Kunjungan",
                                        ]}
                                    />
                                    <Legend
                                        formatter={(value) =>
                                            value === "unique_visitors"
                                                ? "Pengunjung Unik"
                                                : "Total Kunjungan"
                                        }
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="unique_visitors"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        dot={{
                                            fill: "#3B82F6",
                                            strokeWidth: 2,
                                            r: 4,
                                        }}
                                        name="unique_visitors"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total_visits"
                                        stroke="#10B981"
                                        strokeWidth={3}
                                        dot={{
                                            fill: "#10B981",
                                            strokeWidth: 2,
                                            r: 4,
                                        }}
                                        name="total_visits"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Detail Statistik Bulanan
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bulan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Pengunjung Unik
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Kunjungan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rasio Kunjungan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stats.monthlyStats.map((month, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {month.month_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {month.unique_visitors.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {month.total_visits.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {month.unique_visitors > 0
                                                    ? (
                                                          month.total_visits /
                                                          month.unique_visitors
                                                      ).toFixed(1)
                                                    : "0"}{" "}
                                                kunjungan/pengunjung
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
