import React, { useEffect } from "react";
import { Users, BookOpen, FileText, GraduationCap } from "lucide-react";

const Statistik = ({ statistik, users=[], books=[] }) => {
    useEffect(() => {
      console.log("users", users)
    }, [users])

    const stats = [
        {
            title: "Jumlah Pengguna",
            value: users.length,
            change: "+12.5%",
            period: "vs Bulan Terakhir",
            icon: Users,
            iconColor: "text-blue-500",
            bgColor: "bg-blue-50",
            changeColor: "text-green-500",
        },
        {
            title: "Total Buku/Karya",
            value: books.length,
            change: "+8.1%",
            period: "vs Bulan Terakhir",
            icon: BookOpen,
            iconColor: "text-green-500",
            bgColor: "bg-green-50",
            changeColor: "text-green-500",
        },
        {
            title: "Karya Siswa",
            value: statistik.total_karya_siswa,
            change: "+5.7%",
            period: "vs Bulan Terakhir",
            icon: FileText,
            iconColor: "text-orange-500",
            bgColor: "bg-orange-50",
            changeColor: "text-green-500",
        },
        {
            title: "Karya Guru",
            value: statistik.total_karya_guru,
            change: "-3.2%",
            period: "vs Last Month",
            icon: GraduationCap,
            iconColor: "text-red-500",
            bgColor: "bg-red-50",
            changeColor: "text-red-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <IconComponent
                                    className={`w-6 h-6 ${stat.iconColor}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-600">
                                {stat.title}
                            </h3>
                            <p className="text-3xl font-bold text-gray-900">
                                {stat.value}
                            </p>
                            <div className="flex items-center space-x-1">
                                <span
                                    className={`text-sm font-medium ${stat.changeColor}`}
                                >
                                    {stat.change}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {stat.period}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Statistik;
