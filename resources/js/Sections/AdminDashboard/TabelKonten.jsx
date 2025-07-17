import React, { useState, useMemo } from "react";
import { Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";

const TabelKonten = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [yearFilter, setYearFilter] = useState("Semua Tahun");

    const getColor = (tipe) => {
        switch (tipe) {
            case "Student Work":
                return "bg-purple-100 text-purple-700";
            case "Teacher Work":
                return "bg-orange-100 text-orange-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Extended data to demonstrate pagination
    const allData = [
        {
            judul: "Analisis Sastra: Romeo dan Juliet",
            tipe: "Student Work",
            penulis: "Rebecca Kloper Rodriguez",
            tahun: 2024,
            tayangan: 245,
            typeColor: getColor("Student Work"),
        },
        {
            judul: "Materi Workshop Puisi",
            tipe: "Teacher Work",
            penulis: "Hizkia Ananta",
            tahun: 2025,
            tayangan: 81,
            typeColor: getColor("Teacher Work"),
        },
        {
            judul: "Proyek Pameran Sains: Energi Terbarukan",
            tipe: "Student Work",
            penulis: "Candra Kiyoshi",
            tahun: 2023,
            tayangan: 1011,
            typeColor: getColor("Student Work"),
        },
        {
            judul: "Panduan Kurikulum Sejarah",
            tipe: "Teacher Work",
            penulis: "Rei Thompson",
            tahun: 1980,
            tayangan: 940,
            typeColor: getColor("Teacher Work"),
        },
        {
            judul: "Portofolio Penulisan Kreatif",
            tipe: "Student Work",
            penulis: "Emma Davis",
            tahun: 2020,
            tayangan: 7,
            typeColor: getColor("Student Work"),
        },
        {
            judul: "Laporan Penelitian Biologi",
            tipe: "Student Work",
            penulis: "Sarah Johnson",
            tahun: 2024,
            tayangan: 156,
            typeColor: getColor("Student Work"),
        },
        {
            judul: "Modul Pembelajaran Matematika",
            tipe: "Teacher Work",
            penulis: "David Chen",
            tahun: 2025,
            tayangan: 342,
            typeColor: getColor("Teacher Work"),
        },
        {
            judul: "Eksperimen Fisika: Gelombang",
            tipe: "Student Work",
            penulis: "Michael Brown",
            tahun: 2023,
            tayangan: 89,
            typeColor: getColor("Student Work"),
        },
        {
            judul: "Silabus Bahasa Indonesia",
            tipe: "Teacher Work",
            penulis: "Lisa Wong",
            tahun: 2024,
            tayangan: 234,
            typeColor: getColor("Teacher Work"),
        },
        {
            judul: "Karya Tulis Ilmiah: Ekologi",
            tipe: "Student Work",
            penulis: "Anna Martinez",
            tahun: 2025,
            tayangan: 67,
            typeColor: getColor("Student Work"),
        },
        {
            judul: "Panduan Praktikum Kimia",
            tipe: "Teacher Work",
            penulis: "Robert Lee",
            tahun: 2023,
            tayangan: 445,
            typeColor: getColor("Teacher Work"),
        },
        {
            judul: "Thesis: Perubahan Iklim",
            tipe: "Student Work",
            penulis: "Jessica Taylor",
            tahun: 2024,
            tayangan: 198,
            typeColor: getColor("Student Work"),
        },
        {
            judul: "Rencana Pembelajaran Sejarah",
            tipe: "Teacher Work",
            penulis: "Thomas Wilson",
            tahun: 2025,
            tayangan: 123,
            typeColor: getColor("Teacher Work"),
        },
        {
            judul: "Studi Kasus Ekonomi",
            tipe: "Student Work",
            penulis: "Maria Garcia",
            tahun: 2020,
            tayangan: 87,
            typeColor: getColor("Student Work"),
        },
        {
            judul: "Manual Lab Komputer",
            tipe: "Teacher Work",
            penulis: "Kevin Park",
            tahun: 2024,
            tayangan: 267,
            typeColor: getColor("Teacher Work"),
        },
    ];

    const entriesPerPage = 5; // Changed to 5 for better demonstration

    // Filter data based on year
    const filteredData = useMemo(() => {
        if (yearFilter === "Semua Tahun") {
            return allData;
        }
        return allData.filter((item) => item.tahun === parseInt(yearFilter));
    }, [yearFilter]);

    // Calculate pagination
    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    // Reset to page 1 when filter changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [yearFilter]);

    // Get current page data
    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, entriesPerPage]);

    // Get unique years for filter options
    const availableYears = useMemo(() => {
        const years = [...new Set(allData.map((item) => item.tahun))];
        return years.sort((a, b) => b - a); // Sort descending
    }, []);

    // Calculate showing text
    const startEntry =
        totalEntries === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
    const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

    // Generate pagination numbers
    const getPaginationNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...");
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Konten menurut Tahun Akademik
                </h2>
                <div className="relative flex w-full md:w-auto">
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="text-center md:text-left w-full md:w-auto appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="Semua Tahun">Semua Tahun</option>
                        {availableYears.map((year) => (
                            <option key={year} value={year.toString()}>
                                {year}
                            </option>
                        ))}
                    </select>
                    <ChevronRight className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
                </div>
            </div>

            {/* Table */}
            <div className="relative overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
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
                        {currentData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="py-8 px-4 text-center text-gray-500"
                                >
                                    Tidak ada data untuk tahun {yearFilter}
                                </td>
                            </tr>
                        ) : (
                            currentData.map((item, index) => (
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
                            ))
                        )}
                    </tbody>
                </table>
                {/* Pagination */}
                {totalEntries > 0 && (
                    <div className="flex sticky left-0 items-center justify-between mt-6 px-6 py-3">
                        <p className="text-sm text-gray-700">
                            Data {startEntry} - {endEntry} dari {totalEntries}{" "}
                            data
                            {yearFilter !== "Semua Tahun" && (
                                <span className="text-gray-500">
                                    {" "}
                                    (filter untuk tahun {yearFilter})
                                </span>
                            )}
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

                            {getPaginationNumbers().map((page, index) => (
                                <React.Fragment key={index}>
                                    {page === "..." ? (
                                        <span className="px-3 py-2 text-sm text-gray-400">
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-2 text-sm rounded-md ${
                                                currentPage === page
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    )}
                                </React.Fragment>
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
                )}
            </div>
        </div>
    );
};

export default TabelKonten;
