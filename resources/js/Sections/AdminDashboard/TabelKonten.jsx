import React, { useState, useMemo } from "react";
import { Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";

const TabelKonten = ({ books }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [yearFilter, setYearFilter] = useState("Semua Tahun");

    const getColor = (tipe) => {
        switch (tipe) {
            case "Koleksi Perpustakaan":
                return "bg-purple-100 text-purple-500";
            case "Siswa":
                return "bg-blue-100 text-blue-500";
            case "Guru":
                return "bg-yellow-100 text-yellow-500";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const entriesPerPage = 5;

    // Filter data based on year - using tahun_terbit from the model
    const filteredData = useMemo(() => {
        if (yearFilter === "Semua Tahun") {
            return books;
        }
        return books.filter(
            (item) => item.tahun_terbit === parseInt(yearFilter)
        );
    }, [books, yearFilter]);

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

    // Get unique years for filter options - using tahun_terbit
    const availableYears = useMemo(() => {
        const years = [...new Set(books.map((item) => item.tahun_terbit))];
        return years.sort((a, b) => b - a); // Sort descending
    }, [books]);

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

    // Handle view action
    const handleView = (book) => {
        if (book.link) {
            window.open(book.link, "_blank");
        } else {
            // You can implement your own view logic here
            console.log("View book:", book);
        }
    };

    // Handle download action
    const handleDownload = (book) => {
        if (book.link) {
            // Create a temporary anchor element for download
            const link = document.createElement("a");
            link.href = book.link;
            link.download = book.original_filename || `${book.judul}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.log("Download book:", book);
        }
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
                                Tahun Terbit
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                Kategori
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                Status
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
                                    colSpan="7"
                                    className="py-8 px-4 text-center text-gray-500"
                                >
                                    Tidak ada data untuk tahun {yearFilter}
                                </td>
                            </tr>
                        ) : (
                            currentData.map((item, index) => (
                                <tr
                                    key={item.id || index}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="py-4 px-4 text-sm text-gray-900">
                                        <div className="flex items-center space-x-3">
                                            {item.cover_path && (
                                                <img
                                                    src={item.cover_path}
                                                    alt={item.judul}
                                                    className="w-8 h-10 object-cover rounded"
                                                />
                                            )}
                                            <div className="max-w-xs truncate">
                                                {item.judul}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getColor(
                                                item.karya_oleh
                                            )}`}
                                        >
                                            {item.karya_oleh}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {item.penulis}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {item.tahun_terbit}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                                            {item.kategori}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${
                                                item.status === "Tersedia"
                                                    ? "bg-green-100 text-green-500"
                                                    : item.status ===
                                                      "Tidak Tersedia"
                                                    ? "bg-red-100 text-red-500"
                                                    : "bg-yellow-100 text-yellow-500"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleView(item)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Lihat"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDownload(item)
                                                }
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Unduh"
                                            >
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
