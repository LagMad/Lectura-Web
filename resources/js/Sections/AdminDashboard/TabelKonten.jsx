import React, { useState } from "react";
import { Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";

const TabelKonten = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [yearFilter, setYearFilter] = useState("Semua Tahun");

    const data = [
        {
            judul: "Analisis Sastra: Romeo dan Juliet",
            tipe: "Student Work",
            penulis: "Rebecca Kloper Rodriguez",
            tahun: 2024,
            tayangan: 245,
            typeColor: "bg-purple-100 text-purple-700",
        },
        {
            judul: "Materi Workshop Puisi",
            tipe: "Teacher Work",
            penulis: "Hizkia Ananta",
            tahun: 2025,
            tayangan: 81,
            typeColor: "bg-orange-100 text-orange-700",
        },
        {
            judul: "Proyek Pameran Sains: Energi Terbarukan",
            tipe: "Student Work",
            penulis: "Candra Kiyoshi",
            tahun: 2023,
            tayangan: 1011,
            typeColor: "bg-purple-100 text-purple-700",
        },
        {
            judul: "Panduan Kurikulum Sejarah",
            tipe: "Teacher Work",
            penulis: "Rei Thompson",
            tahun: 1980,
            tayangan: 940,
            typeColor: "bg-orange-100 text-orange-700",
        },
        {
            judul: "Portofolio Penulisan Kreatif",
            tipe: "Student Work",
            penulis: "Emma Davis",
            tahun: 2020,
            tayangan: 7,
            typeColor: "bg-purple-100 text-purple-700",
        },
    ];

    const totalEntries = 24;
    const entriesPerPage = 10;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Konten menurut Tahun Akademik
                    </h2>
                    <div className="relative">
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>Semua Tahun</option>
                            <option>2025</option>
                            <option>2024</option>
                            <option>2023</option>
                            <option>2020</option>
                        </select>
                        <ChevronRight className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                    Judul
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                    Tipe
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                    Penulis
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                    Tahun
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                    Tayangan
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-4 px-4 text-sm text-gray-900">
                                        {item.judul}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${item.typeColor}`}
                                        >
                                            {item.tipe}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {item.penulis}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {item.tahun}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {item.tayangan}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center space-x-2">
                                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-700">
                        Showing 1 to 10 of {totalEntries} entries
                    </p>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() =>
                                setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {[1, 2, 3].map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 text-sm rounded-md ${
                                    currentPage === page
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() =>
                                setCurrentPage(
                                    Math.min(totalPages, currentPage + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabelKonten;
